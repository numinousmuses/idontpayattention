"use client";

import Marquee from '@/components/ui/marquee';
import { MarqueeBlock as MarqueeBlockType } from '@/lib/interfaces';
import { getBackgroundColorClass } from '@/lib/utils';

interface MarqueeBlockProps {
  block: MarqueeBlockType;
  noteColor: string;
}

export default function MarqueeBlock({ block, noteColor }: MarqueeBlockProps) {
  // Calculate background color based on note color and block background
  const getBackgroundColor = () => {
    if (!block.background) return 'bg-white';
    
    // Map background value to Tailwind color weight
    const weight = Math.round(block.background * 100);
    return getBackgroundColorClass(noteColor, weight);
  };

  return (
    <div className="w-full p-2 flex">
      <div className={`${getBackgroundColor()} border-2 border-black overflow-hidden flex-1`}>
        <Marquee items={block.content} />
      </div>
    </div>
  );
} 