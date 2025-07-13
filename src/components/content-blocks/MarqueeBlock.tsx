"use client";

import Marquee from '@/components/ui/marquee';
import { MarqueeBlock as MarqueeBlockType } from '@/lib/interfaces';

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
    return `bg-${noteColor}-${weight}`;
  };

  return (
    <div className="w-full p-2">
      <div className={`${getBackgroundColor()} border-2 border-black rounded-lg overflow-hidden`}>
        <Marquee items={block.content} />
      </div>
    </div>
  );
} 