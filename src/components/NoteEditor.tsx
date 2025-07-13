"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Code, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Note, ContentBlock, TextBlock, GraphBlock, MarqueeBlock } from '@/lib/interfaces';
import { updateNote } from '@/lib/database';

interface NoteEditorProps {
  note: Note;
  onNoteUpdate: (updatedNote: Note) => void;
  onClose: () => void;
}

export default function NoteEditor({ note, onNoteUpdate, onClose }: NoteEditorProps) {
  const [editingNote, setEditingNote] = useState<Note>(note);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonContent, setJsonContent] = useState('');

  useEffect(() => {
    setJsonContent(JSON.stringify(editingNote.content, null, 2));
  }, [editingNote.content]);

  const handleSave = async () => {
    try {
      const updatedNote = { ...editingNote, updatedAt: new Date() };
      await updateNote(updatedNote);
      onNoteUpdate(updatedNote);
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleJsonSave = () => {
    try {
      const parsedContent = JSON.parse(jsonContent);
      setEditingNote({ ...editingNote, content: parsedContent });
      setShowJsonEditor(false);
      toast.success('JSON updated successfully');
    } catch {
      toast.error('Invalid JSON format');
    }
  };



  const addBlock = (type: 'text' | 'graph' | 'marquee') => {
    const newBlock: ContentBlock = {
      type: type === 'text' ? 'markdown' : type,
      content: []
    };

    if (type === 'text') {
      const textBlock: TextBlock = {
        content: '# New Text Block\n\nAdd your content here...',
        background: 0,
        width: '1/1'
      };
      newBlock.content = [textBlock];
    } else if (type === 'graph') {
      const graphBlock: GraphBlock = {
        chartType: 'bar',
        chartData: [
          { name: 'A', value: 10 },
          { name: 'B', value: 20 },
          { name: 'C', value: 15 }
        ],
        chartConfig: { dataKey: 'value', xAxisKey: 'name' },
        heading: 'Sample Chart',
        background: 0,
        width: '1/1'
      };
      newBlock.content = [graphBlock];
    } else if (type === 'marquee') {
      const marqueeBlock: MarqueeBlock = {
        content: ['New marquee text'],
        background: 0
      };
      newBlock.content = [marqueeBlock];
    }

    setEditingNote({
      ...editingNote,
      content: [...editingNote.content, newBlock]
    });
  };

  const deleteBlock = (index: number) => {
    const newContent = editingNote.content.filter((_, i) => i !== index);
    setEditingNote({ ...editingNote, content: newContent });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newContent = [...editingNote.content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newContent.length) {
      [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
      setEditingNote({ ...editingNote, content: newContent });
    }
  };

  const updateBlockContent = (blockIndex: number, itemIndex: number, updates: Partial<TextBlock | GraphBlock | MarqueeBlock>) => {
    const newContent = [...editingNote.content];
    const block = newContent[blockIndex];
    
    if (block.content[itemIndex]) {
      block.content[itemIndex] = { ...block.content[itemIndex], ...updates } as TextBlock | GraphBlock | MarqueeBlock;
      setEditingNote({ ...editingNote, content: newContent });
    }
  };

  const renderVisualEditor = () => {
    return (
      <div className="space-y-4">
        {editingNote.content.map((block, blockIndex) => (
          <Card key={blockIndex} className="border-2 border-black">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Block {blockIndex + 1} - {block.type}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="neutral"
                    onClick={() => moveBlock(blockIndex, 'up')}
                    disabled={blockIndex === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="neutral"
                    onClick={() => moveBlock(blockIndex, 'down')}
                    disabled={blockIndex === editingNote.content.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="neutral"
                    onClick={() => deleteBlock(blockIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {block.content.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-2 p-3 border border-gray-200 rounded">
                  {block.type === 'markdown' && 'content' in item && typeof item.content === 'string' && (
                    <div className="space-y-2">
                      <Label>Content (Markdown)</Label>
                      <Textarea
                        value={item.content}
                        onChange={(e) => updateBlockContent(blockIndex, itemIndex, { content: e.target.value })}
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Width</Label>
                          <Select
                            value={(item as TextBlock).width || '1/1'}
                            onValueChange={(value) => updateBlockContent(blockIndex, itemIndex, { width: value as "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1/1">Full width</SelectItem>
                              <SelectItem value="1/2">Half width</SelectItem>
                              <SelectItem value="1/3">One third</SelectItem>
                              <SelectItem value="1/4">One quarter</SelectItem>
                              <SelectItem value="2/3">Two thirds</SelectItem>
                              <SelectItem value="3/4">Three quarters</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label>Background</Label>
                          <Select
                            value={String(item.background || 0)}
                            onValueChange={(value) => updateBlockContent(blockIndex, itemIndex, { background: Number(value) as 0 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 9.5 })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">None</SelectItem>
                              <SelectItem value="1">Light</SelectItem>
                              <SelectItem value="3">Level 3</SelectItem>
                              <SelectItem value="4">Level 4</SelectItem>
                              <SelectItem value="5">Level 5</SelectItem>
                              <SelectItem value="6">Level 6</SelectItem>
                              <SelectItem value="7">Level 7</SelectItem>
                              <SelectItem value="8">Level 8</SelectItem>
                              <SelectItem value="9">Level 9</SelectItem>
                              <SelectItem value="9.5">Level 9.5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {block.type === 'graph' && 'chartType' in item && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Chart Type</Label>
                          <Select
                            value={item.chartType}
                            onValueChange={(value) => updateBlockContent(blockIndex, itemIndex, { chartType: value as "area" | "bar" | "line" | "pie" | "scatter" | "composed" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="line">Line</SelectItem>
                              <SelectItem value="pie">Pie</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Width</Label>
                          <Select
                            value={item.width || '1/1'}
                            onValueChange={(value) => updateBlockContent(blockIndex, itemIndex, { width: value as "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1/1">Full width</SelectItem>
                              <SelectItem value="1/2">Half width</SelectItem>
                              <SelectItem value="1/3">One third</SelectItem>
                              <SelectItem value="1/4">One quarter</SelectItem>
                              <SelectItem value="2/3">Two thirds</SelectItem>
                              <SelectItem value="3/4">Three quarters</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={item.heading || ''}
                          onChange={(e) => updateBlockContent(blockIndex, itemIndex, { heading: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label>Subtitle</Label>
                        <Input
                          value={item.subheading || ''}
                          onChange={(e) => updateBlockContent(blockIndex, itemIndex, { subheading: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label>Chart Data (JSON)</Label>
                        <Textarea
                          value={JSON.stringify(item.chartData, null, 2)}
                          onChange={(e) => {
                            try {
                              const data = JSON.parse(e.target.value);
                              updateBlockContent(blockIndex, itemIndex, { chartData: data });
                            } catch {
                              // Invalid JSON, don't update
                            }
                          }}
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}
                  
                  {block.type === 'marquee' && 'content' in item && Array.isArray(item.content) && (
                    <div className="space-y-2">
                      <Label>Marquee Text (one per line)</Label>
                      <Textarea
                        value={item.content.join('\n')}
                        onChange={(e) => updateBlockContent(blockIndex, itemIndex, { content: e.target.value.split('\n').filter(line => line.trim()) })}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        
        <div className="flex gap-2">
          <Button onClick={() => addBlock('text')} variant="neutral">
            <Plus className="h-4 w-4 mr-2" />
            Add Text Block
          </Button>
          <Button onClick={() => addBlock('graph')} variant="neutral">
            <Plus className="h-4 w-4 mr-2" />
            Add Graph Block
          </Button>
          <Button onClick={() => addBlock('marquee')} variant="neutral">
            <Plus className="h-4 w-4 mr-2" />
            Add Marquee Block
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Edit Note: {editingNote.title}</h2>
            <div className="flex items-center gap-2">
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showJsonEditor ? "default" : "neutral"}
                    size="sm"
                    onClick={() => setShowJsonEditor(!showJsonEditor)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle JSON editor</p>
                </TooltipContent>
              </Tooltip>
              
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button onClick={onClose} variant="neutral" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {showJsonEditor ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="json-editor">JSON Content</Label>
                  <Button onClick={handleJsonSave} size="sm">
                    Apply JSON Changes
                  </Button>
                </div>
                <Textarea
                  id="json-editor"
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  className="font-mono text-sm"
                  rows={20}
                />
              </div>
            ) : (
              renderVisualEditor()
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 