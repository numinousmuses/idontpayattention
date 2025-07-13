"use client";

import { Note } from '@/lib/interfaces';
import ContentBlockRenderer from './content-blocks/ContentBlockRenderer';
import { getBackgroundColorClass } from '@/lib/utils';

interface NoteRendererProps {
  note: Note;
}

export default function NoteRenderer({ note }: NoteRendererProps) {
  // Calculate background color based on note color
  const getBackgroundColor = () => {
    return getBackgroundColorClass(note.color, 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div 
      className={`min-h-screen ${getBackgroundColor()} p-4 md:p-6 lg:p-8`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        {/* Note Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">{note.title}</h1>
          <div className="text-xs md:text-sm text-gray-600 space-x-2 md:space-x-4">
            <span>Created: {formatDate(note.createdAt)}</span>
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-2 md:space-y-4">
          {note.content.map((block, index) => (
            <ContentBlockRenderer
              key={index}
              block={block}
              noteColor={note.color}
            />
          ))}
        </div>

        {/* Empty state */}
        {note.content.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 text-base md:text-lg">No content blocks yet...</p>
            <p className="text-gray-400 text-sm mt-2">
              Content will appear here as your transcription is processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 