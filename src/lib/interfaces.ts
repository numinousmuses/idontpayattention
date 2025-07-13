export interface Model {
    name: string;
    modelString: string;
    baseUrl: string;
    isOpenai: boolean;
    apiKey: string;
    defaultColor: string;
}

export interface Config {
    id: string;
    models: Model[];
    batchSize: number;
    slidingWindowSize: number;
}

export interface GraphBlock {
    chartType: "area" | "bar" | "line" | "pie" | "scatter" | "composed";
    chartData: Array<Record<string, string | number>>;
    chartConfig: Record<string, string | number | boolean | object>; // Full Recharts component configuration
    heading: string;
    subheading?: string;
    description?: string;
    background?: 0 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 9.5;
    width: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4" ;
}

export interface MarqueeBlock {
    content: string[];
    background?: 0 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 9.5;
}

export interface TextBlock {
    content: string;
    background?: 0 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 9.5;
    width: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4" ;
}

export interface ContentBlock {
    type: "markdown" | "graph" | "marquee";
    content: Array<TextBlock | GraphBlock | MarqueeBlock>; // represents a row in a note
}

export interface Note {
    id: string;
    title: string;
    color: "neutral" | "stone" | "zinc" | "slate" | "gray" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
    content: ContentBlock[]; // represents a list of blocks that are displayed in a note
    createdAt: Date;
    updatedAt: Date;
}