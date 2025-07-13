"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Calendar, Tag } from 'lucide-react';
import { getSampleNoteSlugs, getSampleNote } from '@/lib/sample-notes';

export default function ExamplesPage() {
  const router = useRouter();
  const sampleSlugs = getSampleNoteSlugs();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-black',
      purple: 'bg-purple-100 text-black',
      green: 'bg-green-100 text-black',
      cyan: 'bg-cyan-100 text-black',
      orange: 'bg-orange-100 text-black',
      red: 'bg-red-100 text-black',
      yellow: 'bg-yellow-100 text-black',
      pink: 'bg-pink-100 text-black',
    };
    return colorMap[color] || 'bg-gray-100 text-black';
  };

  const blueShades = [
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
  ];

  return (
    <div
      className="min-h-screen bg-blue-100"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Header */}
      <div className="bg-white border-b-2 border-black p-4 md:p-6">
        <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="neutral"
              size="icon"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">Example Notes</h1>
              <p className="text-xs md:text-sm text-gray-600">
                Sample notes showcasing different content block types and layouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl p-4 md:p-6">
        {/* <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Available Examples</h2>
          <p className="text-gray-600">
            These example notes demonstrate the rendering capabilities of the note system,
            including text blocks, graphs, and marquee elements. Each example uses the same
            rendering system as real notes.
          </p>
        </div> */}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sampleSlugs.map((slug, index) => {
            const note = getSampleNote(slug);
            if (!note) return null;
            
            const cardColor = blueShades[index % blueShades.length];

            return (
              <Card key={slug} className={`cursor-pointer hover:shadow-lg transition-shadow ${cardColor} border-2 border-black text-black`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base md:text-lg line-clamp-2 flex-1">{note.title}</CardTitle>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getColorClass(note.color)}`}>
                      <Tag className="h-3 w-3 inline mr-1" />
                      {note.color}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-black">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(note.createdAt)}</span>
                    </div>
                    
                    <div className="text-xs md:text-sm text-black">
                      <span className="font-medium">{note.content.length}</span> content blocks
                    </div>

                    <Button
                      className="w-full mt-4 text-sm"
                      onClick={() => router.push(`/examples/${slug}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {sampleSlugs.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 text-base md:text-lg">No example notes available.</p>
          </div>
        )}
      </div>
    </div>
  );
} 