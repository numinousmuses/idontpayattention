"use client";

import { 
  Area, AreaChart, 
  Bar, BarChart, 
  Line, LineChart, 
  Pie, PieChart, Cell,
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer, 
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        return 'w-full md:w-1/2';
      case '1/3':
        return 'w-full md:w-1/2 lg:w-1/3';
      case '1/4':
        return 'w-full md:w-1/2 lg:w-1/4';
      case '2/3':
        return 'w-full md:w-full lg:w-2/3';
      case '3/4':
        return 'w-full md:w-full lg:w-3/4';
      default:
        return 'w-full';
    }
  };

  // If no chart data provided, this is an error - don't render
  if (!block.chartData || block.chartData.length === 0) {
    return (
      <div className={`${getWidthClass()} p-1 md:p-2 flex`}>
        <Card className={`${getBackgroundColor()} border-2 border-black flex-1`}>
          <CardContent className="p-3 md:p-4">
            <p className="text-red-600 text-center">Error: No chart data provided</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default chart colors
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // Helper to get string config value
  const getConfigString = (key: string, defaultValue: string): string => {
    const value = block.chartConfig?.[key];
    return typeof value === 'string' ? value : defaultValue;
  };

  // Render chart based on type
  const renderChart = () => {
    const firstDataPoint = block.chartData[0] || {};
    
    switch (block.chartType) {
      case 'area':
        const areaXKey = getConfigString('xAxisKey', 'name');
        const areaDataKeys = Object.keys(firstDataPoint).filter(key => key !== areaXKey);
        
        return (
          <AreaChart data={block.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={areaXKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {areaDataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );
      
      case 'bar':
        const barXKey = getConfigString('xAxisKey', 'name');
        const barDataKeys = Object.keys(firstDataPoint).filter(key => key !== barXKey);
        
        return (
          <BarChart data={block.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={barXKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {barDataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      
      case 'line':
        const lineXKey = getConfigString('xAxisKey', 'name');
        const lineDataKeys = Object.keys(firstDataPoint).filter(key => key !== lineXKey);
        
        return (
          <LineChart data={block.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={lineXKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineDataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
      
      case 'pie':
        const pieDataKey = getConfigString('dataKey', 'value');
        const pieNameKey = getConfigString('nameKey', 'name');
        
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={block.chartData}
              dataKey={pieDataKey}
              nameKey={pieNameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {block.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      
      default:
        return <div className="text-red-600">Unsupported chart type: {block.chartType}</div>;
    }
  };

  return (
    <div className={`${getWidthClass()} p-1 md:p-2 flex`}>
      <Card className={`${getBackgroundColor()} border-2 border-black flex-1`}>
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-black text-base md:text-lg">{block.heading}</CardTitle>
          {block.subheading && (
            <CardDescription className="text-black text-sm">
              {block.subheading}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          {block.description && (
            <p className="text-xs md:text-sm text-black mt-2">{block.description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 