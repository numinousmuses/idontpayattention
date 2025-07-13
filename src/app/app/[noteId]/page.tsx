"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, Square, ArrowLeft, RotateCcw, Settings, Edit2, Check, X, ChevronUp, ChevronDown, Menu, FileEdit, Wand2, Loader2 } from 'lucide-react';
import { Note, ContentBlock } from '@/lib/interfaces';
import { getNote, saveNote, initializeDatabase, getConfig, updateNote } from '@/lib/database';
import { processTranscriptBatch, getAvailableModel } from '@/lib/llm-processor';
import NoteRenderer from '@/components/NoteRenderer';
import SettingsModal from '@/components/SettingsModal';
import NoteEditor from '@/components/NoteEditor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import OpenAI from 'openai';


export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [batchSize, setBatchSize] = useState(20000);
  const [slidingWindowSize, setSlidingWindowSize] = useState(5000);
  const [processedWords, setProcessedWords] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const wordCountRef = useRef(0);
  const lastProcessedTranscriptRef = useRef('');
  const transcriptHistoryRef = useRef<string[]>([]);
  const noteContentHistoryRef = useRef<string>('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Helper function to update note content history
  const updateNoteContentHistory = useCallback((contentBlocks: ContentBlock[]) => {
    // Extract text content from blocks for context
    const textContent = contentBlocks.map(block => {
      return block.content.map(item => {
        if ('content' in item) {
          if (typeof item.content === 'string') {
            return item.content;
          } else if (Array.isArray(item.content)) {
            return item.content.join(' ');
          }
        }
        return '';
      }).join(' ');
    }).join(' ');
    
    noteContentHistoryRef.current = (noteContentHistoryRef.current + ' ' + textContent).trim();
    
    // Trim to sliding window size
    const words = noteContentHistoryRef.current.split(/\s+/);
    if (words.length > slidingWindowSize) {
      noteContentHistoryRef.current = words.slice(-slidingWindowSize).join(' ');
    }
  }, [slidingWindowSize]);

  // Helper function to manage sliding window for transcript history
  const updateTranscriptHistory = useCallback((newTranscript: string) => {
    transcriptHistoryRef.current.push(newTranscript);
    
    // Calculate total words in history
    const totalWords = transcriptHistoryRef.current.join(' ').split(/\s+/).length;
    
    // Remove old entries if we exceed the sliding window size
    while (totalWords > slidingWindowSize && transcriptHistoryRef.current.length > 1) {
      transcriptHistoryRef.current.shift();
    }
  }, [slidingWindowSize]);

  // Helper function to get transcript context
  const getTranscriptContext = useCallback((): string => {
    if (transcriptHistoryRef.current.length <= 1) return '';
    
    // Return all but the last entry (which is the current batch)
    return transcriptHistoryRef.current.slice(0, -1).join(' ');
  }, []);

  // Helper function to get note context
  const getNoteContext = useCallback((): string => {
    return noteContentHistoryRef.current;
  }, []);

  const processBatch = useCallback(async (transcriptBatch: string) => {
    if (!note || isProcessing) return;

    setIsProcessing(true);
    setProcessingStatus('Processing transcript...');

    // Update transcript history and get context
    updateTranscriptHistory(transcriptBatch);
    const transcriptContext = getTranscriptContext();
    const noteContext = getNoteContext();

    try {
      await processTranscriptBatch(
        transcriptBatch,
        (blocks: ContentBlock[]) => {
          // Success callback
          setNote(prevNote => {
            if (!prevNote) return null;
            
            const updatedNote = {
              ...prevNote,
              content: [...prevNote.content, ...blocks],
              updatedAt: new Date(),
            };
            
            // Save to database
            saveNote(updatedNote);
            return updatedNote;
          });
          
          // Update note content history with new blocks
          updateNoteContentHistory(blocks);
          
          setProcessedWords(prev => prev + transcriptBatch.split(/\s+/).length);
          setIsProcessing(false);
          setProcessingStatus('');
          
          toast.success('Transcript processed', {
            description: `${blocks.length} content block${blocks.length === 1 ? '' : 's'} added`
          });
        },
        (error: string) => {
          // Error callback
          console.error('LLM processing error:', error);
          setProcessingStatus(`Error: ${error}`);
          setIsProcessing(false);
          
          toast.error('Processing failed', {
            description: error,
            action: {
              label: 'Retry',
              onClick: () => processBatch(transcriptBatch)
            }
          });
          
          // Retry after a delay
          setTimeout(() => {
            setProcessingStatus('');
          }, 3000);
        },
        transcriptContext,
        noteContext
      );
    } catch (error) {
      console.error('Failed to process batch:', error);
      setIsProcessing(false);
      setProcessingStatus('');
    }
  }, [note, isProcessing, updateTranscriptHistory, getTranscriptContext, getNoteContext, updateNoteContentHistory]);

  // Initialize database and load/create note
  useEffect(() => {
    setIsMounted(true);
    
    const initializeApp = async () => {
      try {
        await initializeDatabase();
        const config = await getConfig();
        setBatchSize(config.batchSize);
        setSlidingWindowSize(config.slidingWindowSize);
        
        // Try to load existing note
        const existingNote = await getNote(noteId);
        
        if (existingNote) {
          setNote(existingNote);
          // Initialize note content history with existing content
          updateNoteContentHistory(existingNote.content);
        } else {
          // Create new note
          const newNote: Note = {
            id: noteId,
            title: `Meeting Note - ${new Date().toLocaleString()}`,
            color: 'blue',
            content: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          await saveNote(newNote);
          setNote(newNote);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [noteId, updateNoteContentHistory]);

  // Process transcript in batches
  useEffect(() => {
    if (!transcript || !isInitialized) return;

    const words = transcript.trim().split(/\s+/);
    const currentWordCount = words.length;
    
    // Check if we've accumulated enough words for processing
    if (currentWordCount >= wordCountRef.current + batchSize) {
      const newWords = words.slice(wordCountRef.current);
      const newTranscript = newWords.join(' ');
      
      if (newTranscript.trim()) {
        wordCountRef.current = currentWordCount;
        
        // Process the batch
        processBatch(newTranscript.trim());
      }
    }
  }, [transcript, batchSize, isInitialized, processBatch]);

  const handleStartListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Browser not supported', {
        description: 'Your browser does not support speech recognition'
      });
      return;
    }

    if (!isMicrophoneAvailable) {
      toast.error('Microphone access required', {
        description: 'Please allow microphone access to start recording'
      });
      return;
    }

    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
    
    toast.success('Recording started', {
      description: 'Listening for speech...'
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    
    // Process any remaining transcript
    if (transcript && transcript.length > lastProcessedTranscriptRef.current.length) {
      const remainingTranscript = transcript.slice(lastProcessedTranscriptRef.current.length);
      if (remainingTranscript.trim()) {
        processBatch(remainingTranscript.trim());
        toast.info('Processing final transcript', {
          description: 'Processing remaining speech...'
        });
      }
    }
    
    toast.success('Recording stopped', {
      description: 'Speech recognition has been stopped'
    });
  };

  const handleReset = () => {
    resetTranscript();
    setProcessedWords(0);
    wordCountRef.current = 0;
    lastProcessedTranscriptRef.current = '';
    
    toast.info('Transcript reset', {
      description: 'Current transcript cleared'
    });
  };

  const handleEditTitle = () => {
    setTempTitle(note?.title ?? '');
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (note && tempTitle.trim()) {
      const updatedNote = {
        ...note,
        title: tempTitle.trim(),
        updatedAt: new Date(),
      };
      
      setNote(updatedNote);
      saveNote(updatedNote);
      setIsEditingTitle(false);
      
      toast.success('Title updated');
    }
  };

  const handleCancelTitleEdit = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    setNote(updatedNote);
    setIsEditorOpen(false);
  };

  const handleAiEdit = async () => {
    if (!note || !aiPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsAiProcessing(true);
    try {
      const model = await getAvailableModel();
      if (!model) {
        toast.error('No AI model configured');
        return;
      }

      const openai = new OpenAI({
        apiKey: model.apiKey,
        baseURL: model.baseUrl,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `
You are an AI assistant that helps edit note content based on user prompts. 

Current note content (JSON format):
${JSON.stringify(note.content, null, 2)}

User prompt: ${aiPrompt}

Please modify the note content according to the user's request. You can:
1. Add new content blocks
2. Modify existing content blocks
3. Reorder content blocks
4. Delete content blocks
5. Change styling (background colors, widths, etc.)

Return the modified content in the same JSON format. Ensure all required fields are present and valid.

Guidelines:
- Keep the same structure (ContentBlock array with type and content)
- For text blocks: ensure content is markdown string with proper width
- For graph blocks: ensure chartType, chartData, chartConfig, and heading are present
- For marquee blocks: ensure content is array of strings
- Use background colors 0, 1, 3-9.5 (never 2)
- Use valid width values: "1/1", "1/2", "1/3", "1/4", "2/3", "3/4"
`;

      const completion = await openai.chat.completions.create({
        model: model.modelString,
        messages: [
          {
            role: "system",
            content: "You are an expert at editing structured note content. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0].message.content;
      if (!responseText) {
        throw new Error('No response from AI');
      }

      const newContent = JSON.parse(responseText);
      const updatedNote = { ...note, content: newContent, updatedAt: new Date() };
      
      await updateNote(updatedNote);
      setNote(updatedNote);
      setAiPrompt('');
      toast.success('Note updated with AI');
    } catch (error) {
      console.error('AI edit failed:', error);
      toast.error('Failed to process AI edit');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Browser Not Supported</h2>
            <p className="text-gray-600 mb-4">
              Your browser does not support speech recognition. Please use a supported browser like Chrome.
            </p>
            <Button onClick={() => router.push('/app')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInitialized || !note) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gray-50">
        {/* Consolidated Header */}
        {!isHeaderCollapsed && (
          <div className="bg-white border-b-2 border-black p-4 md:p-6 transition-all duration-300">
            <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
              {/* Mobile Header */}
              <div className="md:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
            <Button
              variant="neutral"
              size="icon"
              onClick={() => router.push('/app')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Back to notes</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <div className="flex items-center gap-2">
                      {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                                                  <Input
                          value={tempTitle ?? ''}
                          onChange={(e) => setTempTitle(e.target.value ?? '')}
                          className="text-sm font-bold"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') handleCancelTitleEdit();
                          }}
                          autoFocus
                        />
                          <Button
                            size="icon"
                            variant="neutral"
                            onClick={handleSaveTitle}
                            className="h-8 w-8"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="neutral"
                            onClick={handleCancelTitleEdit}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h1 className="text-sm font-bold truncate max-w-[150px]">{note.title}</h1>
                          <Button
                            size="icon"
                            variant="neutral"
                            onClick={handleEditTitle}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
          </div>
          
                  <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              {isProcessing && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      )}
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="neutral"
                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Menu</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="neutral"
                          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Collapse header</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={handleStartListening}
                            disabled={listening}
                            className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Start recording</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={handleStopListening}
                            disabled={!listening}
                            className="bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300"
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Stop recording</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={handleReset}
                            variant="neutral"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset transcript</p>
                        </TooltipContent>
                      </Tooltip>
                      
                                        <SettingsModal>
                    <Button
                      size="icon"
                      variant="neutral"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SettingsModal>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="neutral"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <h4 className="font-medium">AI Edit</h4>
                            <Textarea
                              placeholder="Describe how you want to modify the note..."
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              rows={3}
                            />
                            <Button 
                              onClick={handleAiEdit} 
                              disabled={isAiProcessing}
                              className="w-full"
                            >
                              {isAiProcessing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-4 w-4 mr-2" />
                                  Apply AI Edit
                                </>
                              )}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit with AI</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="neutral"
                        onClick={() => setIsEditorOpen(true)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit note content</p>
                    </TooltipContent>
                  </Tooltip>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Mic: {listening ? 'On' : 'Off'}</span>
                        {isProcessing && <span>Processing...</span>}
                        <span>Words: {processedWords}</span>
                      </div>
                    </div>
                </div>
              )}
            </div>
            
              {/* Desktop Header */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="neutral"
                        size="icon"
                        onClick={() => router.push('/app')}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to notes</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={tempTitle ?? ''}
                          onChange={(e) => setTempTitle(e.target.value ?? '')}
                          className="text-lg md:text-xl font-bold"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') handleCancelTitleEdit();
                          }}
                          autoFocus
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="neutral"
                              onClick={handleSaveTitle}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save title</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="neutral"
                              onClick={handleCancelTitleEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel editing</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg md:text-2xl font-bold">{note.title}</h1>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="neutral"
                              onClick={handleEditTitle}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit title</p>
                          </TooltipContent>
                        </Tooltip>
          </div>
                    )}
        </div>
      </div>

                <div className="flex items-center gap-2">
                  {/* Recording controls */}
                  <Tooltip>
                    <TooltipTrigger asChild>
              <Button
                        size="icon"
                onClick={handleStartListening}
                disabled={listening}
                        className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
              >
                        <Mic className="h-4 w-4" />
              </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start recording</p>
                    </TooltipContent>
                  </Tooltip>
              
                  <Tooltip>
                    <TooltipTrigger asChild>
              <Button
                        size="icon"
                onClick={handleStopListening}
                disabled={!listening}
                        className="bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300"
              >
                        <Square className="h-4 w-4" />
              </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Stop recording</p>
                    </TooltipContent>
                  </Tooltip>
              
                  <Tooltip>
                    <TooltipTrigger asChild>
              <Button
                        size="icon"
                onClick={handleReset}
                variant="neutral"
              >
                        <RotateCcw className="h-4 w-4" />
              </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset transcript</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Status indicators */}
                  <div className="flex items-center gap-2 text-sm mx-4">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                      <span>Mic: {listening ? 'On' : 'Off'}</span>
                    </div>
                    {isProcessing && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span>Processing...</span>
                      </div>
                    )}
                    <span className="text-gray-500">Words: {processedWords}</span>
            </div>
            
                                                              <SettingsModal>
                        <Button
                          size="icon"
                          variant="neutral"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </SettingsModal>
                      
                                        <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="neutral"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <h4 className="font-medium">AI Edit</h4>
                            <Textarea
                              placeholder="Describe how you want to modify the note..."
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              rows={3}
                            />
                            <Button 
                              onClick={handleAiEdit} 
                              disabled={isAiProcessing}
                              className="w-full"
                            >
                              {isAiProcessing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-4 w-4 mr-2" />
                                  Apply AI Edit
                                </>
                              )}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit with AI</p>
                    </TooltipContent>
                  </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="neutral"
                            onClick={() => setIsEditorOpen(true)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit note content</p>
                        </TooltipContent>
                      </Tooltip>
                  
                  {/* Collapse Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="neutral"
                        onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Collapse header</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        )}
          
        {/* Floating Expand Button */}
        {isHeaderCollapsed && (
          <div className="fixed top-4 right-4 z-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="neutral"
                  onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                  className="shadow-lg"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expand header</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Current transcript and processing status */}
        {(transcript || processingStatus) && (
          <div className="bg-white border-b-2 border-black p-4 md:p-6">
            <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
          {transcript && (
            <Card className="mb-4">
              <CardContent className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold mb-2">Current Transcript:</h3>
                <p className="text-xs md:text-sm text-gray-700">{transcript}</p>
              </CardContent>
            </Card>
          )}
          
          {processingStatus && (
                <Card>
              <CardContent className="p-3 md:p-4">
                <p className="text-xs md:text-sm font-medium text-blue-600">{processingStatus}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
        )}

      {/* Note Content */}
      <NoteRenderer note={note} />
      
      {/* Note Editor */}
      {isEditorOpen && (
        <NoteEditor
          note={note}
          onNoteUpdate={handleNoteUpdate}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
    </TooltipProvider>
  );
} 