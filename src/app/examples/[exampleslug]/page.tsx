"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronUp, ChevronDown, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Note } from '@/lib/interfaces';
import { getSampleNote } from '@/lib/sample-notes';
import NoteRenderer from '@/components/NoteRenderer';

export default function ExampleNotePage() {
  const params = useParams();
  const router = useRouter();
  const exampleSlug = params.exampleslug as string;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadSampleNote = () => {
      setIsLoading(true);
      const sampleNote = getSampleNote(exampleSlug);
      setNote(sampleNote);
      setIsLoading(false);
    };

    loadSampleNote();
  }, [exampleSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading example...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Example Not Found</h2>
            <p className="text-gray-600 mb-4">
              The example note &quot;{exampleSlug}&quot; was not found.
            </p>
            <Button onClick={() => router.push('/examples')}>
              Back to Examples
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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
                          onClick={() => router.push('/examples')}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Back to examples</p>
                      </TooltipContent>
                    </Tooltip>
                    <div>
                      <h1 className="text-base font-bold truncate max-w-[180px]">{note.title}</h1>
                      <p className="text-xs text-gray-600">Example Note</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                    <div className="flex justify-center">
                      <p className="text-sm text-gray-600">No additional controls</p>
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
                        onClick={() => router.push('/examples')}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Back to examples</p>
                    </TooltipContent>
                  </Tooltip>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">{note.title}</h1>
                    <p className="text-sm text-gray-600">Example Note</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  
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

        {/* Content */}
        <NoteRenderer note={note} />
      </div>
    </TooltipProvider>
  );
} 