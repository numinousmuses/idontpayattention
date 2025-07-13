"use client";

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GraphBlock as GraphBlockType } from '@/lib/interfaces';
import { getBackgroundColorClass } from '@/lib/utils';

interface GraphBlockProps {
  block: GraphBlockType;
  noteColor: string;
}

export default function GraphBlock({ block, noteColor }: GraphBlockProps) {
  // Calculate background color based on note color and block background
  const getBackgroundColor = () => {
    if (!block.background) return 'bg-white';
    
    // Map background value to Tailwind color weight
    const weight = Math.round(block.background * 100);
    return getBackgroundColorClass(noteColor, weight);
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

  // Use chart data from the block - should always be provided by LLM
  const chartData = (block as GraphBlockType & { chartData?: Array<Record<string, string | number>> }).chartData;

  // If no chart data provided, this is an error - don't render
  if (!chartData || chartData.length === 0) {
    return (
      <div className={`${getWidthClass()} p-2`}>
        <Card className={`${getBackgroundColor()} border-2 border-black`}>
          <CardContent className="p-4">
            <p className="text-red-600 text-center">Error: No chart data provided</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${getWidthClass()} p-2`}>
      <Card className={`${getBackgroundColor()} border-2 border-black`}>
        <CardHeader>
          <CardTitle className="text-black">{block.heading}</CardTitle>
          {block.subheading && (
            <CardDescription className="text-black">
              {block.subheading}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer config={block.config}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="value"
                  type="natural"
                  fill={`var(--color-${noteColor})`}
                  stroke={`var(--color-${noteColor})`}
                  activeDot={{
                    fill: "var(--chart-active-dot)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          {block.description && (
            <p className="text-sm text-black mt-2">{block.description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 