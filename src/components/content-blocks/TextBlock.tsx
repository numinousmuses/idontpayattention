"use client";

import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { TextBlock as TextBlockType } from '@/lib/interfaces';

interface TextBlockProps {
  block: TextBlockType;
  noteColor: string;
}

export default function TextBlock({ block, noteColor }: TextBlockProps) {
  // Calculate background color based on note color and block background
  const getBackgroundColor = () => {
    if (!block.background) return 'bg-white';
    
    // Map background value to Tailwind color weight
    const weight = Math.round(block.background * 100);
    return `bg-${noteColor}-${weight}`;
  };

  // Calculate width classes
  const getWidthClass = () => {
    switch (block.width) {
      case '1/2':
        return 'w-1/2';
      case '1/3':
        return 'w-1/3';
      case '1/4':
        return 'w-1/4';
      case '2/3':
        return 'w-2/3';
      case '3/4':
        return 'w-3/4';
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`${getWidthClass()} p-2`}>
      <Card className={`${getBackgroundColor()} border-2 border-black`}>
        <CardContent className="p-4">
          <div className="prose prose-sm max-w-none text-black">
            <ReactMarkdown
              components={{
              // Custom components for better styling
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-4 text-black">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mb-3 text-black">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mb-2 text-black">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 text-black leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-3 text-black">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-3 text-black">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 text-black">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-400 pl-4 italic text-black mb-3">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-black">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm text-black mb-3">
                  {children}
                </pre>
              ),
            }}
                        >
                {block.content}
              </ReactMarkdown>
            </div>
          </CardContent>
      </Card>
    </div>
  );
} 