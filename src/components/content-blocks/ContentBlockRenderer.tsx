"use client";

import { ContentBlock, TextBlock as TextBlockType, GraphBlock as GraphBlockType, MarqueeBlock as MarqueeBlockType } from '@/lib/interfaces';
import TextBlock from './TextBlock';
import GraphBlock from './GraphBlock';
import MarqueeBlock from './MarqueeBlock';

interface ContentBlockRendererProps {
  block: ContentBlock;
  noteColor: string;
}

export default function ContentBlockRenderer({ block, noteColor }: ContentBlockRendererProps) {
  // Render a single row of content blocks
  const renderRow = () => {
    return (
      <div className="flex flex-wrap w-full items-stretch">
        {block.content.map((item, index) => {
          // Determine block type and render accordingly
          if ('content' in item && typeof item.content === 'string' && 'width' in item) {
            // This is a TextBlock
            return (
              <TextBlock
                key={index}
                block={item as TextBlockType}
                noteColor={noteColor}
              />
            );
          } else if ('chartType' in item && 'chartData' in item && 'heading' in item) {
            // This is a GraphBlock
            return (
              <GraphBlock
                key={index}
                block={item as GraphBlockType}
                noteColor={noteColor}
              />
            );
          } else if ('content' in item && Array.isArray(item.content)) {
            // This is a MarqueeBlock
            return (
              <MarqueeBlock
                key={index}
                block={item as MarqueeBlockType}
                noteColor={noteColor}
              />
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="mb-4">
      {renderRow()}
    </div>
  );
} 