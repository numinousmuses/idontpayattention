"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, ArrowLeft } from 'lucide-react';
import { Note, ContentBlock } from '@/lib/interfaces';
import { getNote, saveNote, initializeDatabase, getConfig } from '@/lib/database';
import { processTranscriptBatch } from '@/lib/llm-processor';
import NoteRenderer from '@/components/NoteRenderer';
import SettingsModal from '@/components/SettingsModal';


export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.noteId as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [batchSize, setBatchSize] = useState(10);
  const [processedWords, setProcessedWords] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  
  const wordCountRef = useRef(0);
  const lastProcessedTranscriptRef = useRef('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Initialize database and load/create note
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeDatabase();
        const config = await getConfig();
        setBatchSize(config.batchSize);
        
        // Try to load existing note
        const existingNote = await getNote(noteId);
        
        if (existingNote) {
          setNote(existingNote);
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
  }, [noteId]);

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
  }, [transcript, batchSize, isInitialized]);

  const processBatch = async (transcriptBatch: string) => {
    if (!note || isProcessing) return;

    setIsProcessing(true);
    setProcessingStatus('Processing transcript...');

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
          
          setProcessedWords(prev => prev + transcriptBatch.split(/\s+/).length);
          setIsProcessing(false);
          setProcessingStatus('');
        },
        (error: string) => {
          // Error callback
          console.error('LLM processing error:', error);
          setProcessingStatus(`Error: ${error}`);
          setIsProcessing(false);
          
          // Retry after a delay
          setTimeout(() => {
            setProcessingStatus('');
          }, 3000);
        }
      );
    } catch (error) {
      console.error('Failed to process batch:', error);
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleStartListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    if (!isMicrophoneAvailable) {
      alert('Microphone access is required for speech recognition.');
      return;
    }

    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    
    // Process any remaining transcript
    if (transcript && transcript.length > lastProcessedTranscriptRef.current.length) {
      const remainingTranscript = transcript.slice(lastProcessedTranscriptRef.current.length);
      if (remainingTranscript.trim()) {
        processBatch(remainingTranscript.trim());
      }
    }
  };

  const handleReset = () => {
    resetTranscript();
    setProcessedWords(0);
    wordCountRef.current = 0;
    lastProcessedTranscriptRef.current = '';
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              size="icon"
              onClick={() => router.push('/app')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{note.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status indicators */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <span>Microphone: {listening ? 'Recording' : 'Off'}</span>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
            
            <SettingsModal />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleStartListening}
                disabled={listening}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
              
              <Button
                onClick={handleStopListening}
                disabled={!listening}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
              
              <Button
                onClick={handleReset}
                variant="neutral"
              >
                Reset
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              Words processed: {processedWords} | Batch size: {batchSize}
            </div>
          </div>
          
          {/* Current transcript */}
          {transcript && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Current Transcript:</h3>
                <p className="text-sm text-gray-700">{transcript}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Processing status */}
          {processingStatus && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-blue-600">{processingStatus}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Note Content */}
      <NoteRenderer note={note} />
    </div>
  );
} 