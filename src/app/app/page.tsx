"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ConfirmationPopover from "@/components/ui/confirmation-popover";
import { 
  Mic, 
  History, 
  Settings, 
  Edit2, 
  Trash2, 
  Copy, 
  Check, 
  X,
  ChevronDown,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import SettingsModal from "@/components/SettingsModal";
import { Note } from "@/lib/interfaces";
import { 
  getNotes, 
  deleteNote, 
  duplicateNote, 
  updateNoteTitle,
  initializeDatabase 
} from "@/lib/database";

export default function AppPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isAlias, setIsAlias] = useState(false);

  // Load notes on component mount
  useEffect(() => {
    setIsMounted(true);
    
    const loadNotes = async () => {
      try {
        await initializeDatabase();
        const allNotes = await getNotes();
        setNotes(allNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
        toast.error('Failed to load notes');
      }
    };

    loadNotes();
  }, []);

  // Check if we're on the alias domain
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAlias(window.location.hostname.includes("idontpayattention"));
    }
  }, []);

  const handleStartListener = () => {
    const noteId = uuidv4();
    router.push(`/app/${noteId}`);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleDuplicateNote = async (noteId: string) => {
    try {
      const duplicatedNote = await duplicateNote(noteId);
      if (duplicatedNote) {
        setNotes([duplicatedNote, ...notes]);
        toast.success('Note duplicated successfully');
      }
    } catch (error) {
      console.error('Failed to duplicate note:', error);
      toast.error('Failed to duplicate note');
    }
  };

  const handleStartEditTitle = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title ?? '');
  };

  const handleSaveTitle = async (noteId: string) => {
    if (editingTitle.trim()) {
      try {
        await updateNoteTitle(noteId, editingTitle.trim());
        setNotes(notes.map(note => 
          note.id === noteId 
            ? { ...note, title: editingTitle.trim(), updatedAt: new Date() }
            : note
        ));
        setEditingNoteId(null);
        setEditingTitle('');
        toast.success('Note title updated');
      } catch (error) {
        console.error('Failed to update title:', error);
        toast.error('Failed to update title');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingTitle('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

    // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <section className="relative flex-grow w-full flex flex-col items-center justify-center overflow-hidden p-4 h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <TooltipProvider>
    <section className="relative flex-grow w-full flex flex-col items-center justify-center overflow-hidden p-4 h-screen">
      {/* Settings icon in top right */}
      <div className="absolute top-4 right-4 z-20">
        <SettingsModal>
          <Button variant="neutral" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </SettingsModal>
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-8">
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-6xl xl:text-8xl font-bold text-black tracking-tight">
                {isAlias ? "i'm not paying attention" : "i'm not f!cking paying attention"}
            </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button onClick={handleStartListener} className="bg-blue-500 text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
              start listener
              <Mic className="h-5 w-5 xl:h-6 xl:w-6" />
            </Button>
              
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button className="bg-white text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
                past notes
                <History className="h-5 w-5 xl:h-6 xl:w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[80vh] md:h-[60vh]">
                  <DrawerHeader className="flex flex-row items-center justify-between">
                    <DrawerTitle>Your Notes ({notes.length})</DrawerTitle>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="neutral"
                            onClick={handleStartListener}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Create new note</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DrawerClose asChild>
                            <Button size="icon" variant="neutral">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DrawerClose>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close drawer</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </DrawerHeader>
                  
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {notes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <History className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No notes yet</h3>
                        <p className="text-gray-500 mb-4">Start your first listening session to create a note</p>
                        <Button onClick={handleStartListener} className="bg-blue-500 text-black border-2 border-black">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Note
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl">
                          {notes.map((note) => (
                            <Card key={note.id} className={`group w-full max-w-sm bg-${note.color}-300`}>
                              <CardContent className="p-4">
                                <div className="flex flex-col h-full">
                                  {editingNoteId === note.id ? (
                                    <div className="flex items-center gap-2 mb-3">
                                      <Input
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className="flex-1 text-sm"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveTitle(note.id);
                                          if (e.key === 'Escape') handleCancelEdit();
                                        }}
                                        autoFocus
                                      />
                                      <Button
                                        size="icon"
                                        variant="neutral"
                                        onClick={() => handleSaveTitle(note.id)}
                                        className="h-7 w-7"
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="neutral"
                                        onClick={handleCancelEdit}
                                        className="h-7 w-7"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div 
                                      className="cursor-pointer flex-1"
                                      onClick={() => router.push(`/app/${note.id}`)}
                                    >
                                      <h3 className="font-semibold text-base mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                        {note.title}
                                      </h3>
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-col gap-2 text-xs text-gray-500 mb-3">
                                    <span>{formatDate(note.updatedAt)}</span>
                                    <div className="flex items-center justify-between">
                                      <span>{note.content.length} blocks</span>
                                      <span className={`px-2 py-1 rounded text-xs bg-${note.color}-100 text-${note.color}-800`}>
                                        {note.color}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="neutral"
                                          onClick={() => handleStartEditTitle(note)}
                                          className="h-7 w-7"
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Rename note</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="icon"
                                          variant="neutral"
                                          onClick={() => handleDuplicateNote(note.id)}
                                          className="h-7 w-7"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Duplicate note</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    
                                    <ConfirmationPopover
                                      title="Delete Note"
                                      description="Are you sure you want to delete this note? This action cannot be undone."
                                      onConfirm={() => handleDeleteNote(note.id)}
                                    >
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="neutral"
                                            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                                          >
                                            <Trash2 className="h-3 w-3" />
            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete note</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </ConfirmationPopover>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
        </div>
      </div>
    </section>
    </TooltipProvider>
  );
}
