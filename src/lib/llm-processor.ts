import OpenAI from 'openai';
import { Model, ContentBlock } from './interfaces';
import { getModels } from './database';
import { toast } from 'sonner';

// Queue item interface
interface QueueItem {
  id: string;
  transcript: string;
  order: number;
  attempts: number;
  maxAttempts: number;
  model: Model;
  transcriptContext?: string;
  noteContext?: string;
  onSuccess: (blocks: ContentBlock[]) => void;
  onError: (error: string) => void;
}

// Processing queue
class LLMProcessingQueue {
  private queue: QueueItem[] = [];
  private processing: boolean = false;
  private currentOrder: number = 0;

  async addToQueue(
    transcript: string,
    model: Model,
    onSuccess: (blocks: ContentBlock[]) => void,
    onError: (error: string) => void,
    transcriptContext?: string,
    noteContext?: string
  ): Promise<void> {
    const item: QueueItem = {
      id: Date.now().toString(),
      transcript,
      order: this.currentOrder++,
      attempts: 0,
      maxAttempts: 3,
      model,
      transcriptContext,
      noteContext,
      onSuccess,
      onError,
    };

    this.queue.push(item);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Sort queue by order to maintain processing order
      this.queue.sort((a, b) => a.order - b.order);
      
      const item = this.queue.shift()!;
      
      try {
        const blocks = await this.processTranscript(item.transcript, item.model, item.transcriptContext, item.noteContext);
        item.onSuccess(blocks);
      } catch (error) {
        item.attempts++;
        
        if (item.attempts < item.maxAttempts) {
          // Re-queue for retry
          this.queue.push(item);
          console.warn(`Retrying LLM processing for item ${item.id}, attempt ${item.attempts + 1}`);
        } else {
          item.onError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    this.processing = false;
  }

  private async processTranscript(transcript: string, model: Model, transcriptContext?: string, noteContext?: string): Promise<ContentBlock[]> {
    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: model.apiKey,
      baseURL: model.baseUrl,
      dangerouslyAllowBrowser: true, // Note: In production, this should be handled server-side
    });

    // Define the schema for content blocks
    const contentBlockSchema = {
      type: "object",
      properties: {
        contentBlocks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["markdown", "graph", "marquee"]
              },
              content: {
                type: "array",
                items: {
                  oneOf: [
                    {
                      type: "object",
                      properties: {
                        content: { type: "string" },
                        background: { type: "number", minimum: 0, maximum: 9.5 },
                        width: { type: "string", enum: ["1/1", "1/2", "1/3", "1/4", "2/3", "3/4"] }
                      },
                      required: ["content", "width"],
                      additionalProperties: false
                    },
                    {
                      type: "object",
                      properties: {
                        config: { type: "object" },
                        chartData: { type: "array", items: { type: "object" } },
                        heading: { type: "string" },
                        subheading: { type: "string" },
                        description: { type: "string" },
                        background: { type: "number", minimum: 0, maximum: 9.5 },
                        width: { type: "string", enum: ["1/1", "1/2", "1/3", "1/4", "2/3", "3/4"] }
                      },
                      required: ["config", "chartData", "heading", "width"],
                      additionalProperties: false
                    },
                    {
                      type: "object",
                      properties: {
                        content: { type: "array", items: { type: "string" } },
                        background: { type: "number", minimum: 0, maximum: 9.5 }
                      },
                      required: ["content"],
                      additionalProperties: false
                    }
                  ]
                }
              }
            },
            required: ["type", "content"]
          }
        }
      },
      required: ["contentBlocks"]
    };

    const contextSection = transcriptContext || noteContext ? `
## Context Information

${transcriptContext ? `### Previous Transcript Context:
${transcriptContext}` : ''}

${noteContext ? `### Existing Note Content:
${noteContext}` : ''}

Please use this context to maintain continuity and avoid repeating information that's already been covered.

---

` : '';

    const prompt = `
You are an AI assistant that converts meeting transcripts into structured content blocks for a note-taking application. 

${contextSection}Given the following transcript, create meaningful content blocks that summarize, analyze, or present the information in different formats:

1. **Text blocks** - Use markdown format for summaries, key points, action items, etc.
2. **Graph blocks** - When data, numbers, or trends are mentioned, create chart configurations using Recharts
3. **Marquee blocks** - For important announcements, key phrases, or highlights

Guidelines:
- Create multiple content blocks to organize information logically
- Use appropriate background colors (0-9.5) to create visual hierarchy
- Vary block widths (1/1, 1/2, 1/3, 1/4, 2/3, 3/4) for better layout
- Keep marquee content concise and impactful

## Graph Block Chart Configuration

For graph blocks, the "config" should be a ChartConfig object that maps data keys to labels and colors. Use these predefined color variables:
- "var(--chart-1)" for the first data series
- "var(--chart-2)" for the second data series  
- "var(--chart-3)" for the third data series
- "var(--chart-4)" for the fourth data series
- "var(--chart-5)" for the fifth data series

### Example Chart Types and Data Structures. It all uses ReCharts under the hood, so anything you can do with ReCharts you can do here:

**Area Charts:**
- Data: Array of objects with date/time keys and numeric values
- Config example: {"desktop": {"label": "Desktop", "color": "var(--chart-1)"}, "mobile": {"label": "Mobile", "color": "var(--chart-2)"}}
- Data example: [{"month": "January", "desktop": 186, "mobile": 80}, {"month": "February", "desktop": 305, "mobile": 200}]

**Bar Charts:**
- Data: Array of objects with category keys and numeric values
- Config example: {"running": {"label": "Running", "color": "var(--chart-1)"}, "swimming": {"label": "Swimming", "color": "var(--chart-2)"}}
- Data example: [{"date": "2024-07-15", "running": 450, "swimming": 300}, {"date": "2024-07-16", "running": 380, "swimming": 420}]

**Line Charts:**
- Data: Array of objects with date/time keys and numeric values
- Config example: {"visitors": {"label": "Visitors"}, "desktop": {"label": "Desktop", "color": "var(--chart-1)"}, "mobile": {"label": "Mobile", "color": "var(--chart-2)"}}
- Data example: [{"date": "2024-04-01", "desktop": 222, "mobile": 150}, {"date": "2024-04-02", "desktop": 97, "mobile": 180}]

**Pie Charts:**
- Data: Array of objects with category, value, and fill properties
- Config example: {"visitors": {"label": "Visitors"}, "chrome": {"label": "Chrome", "color": "var(--chart-1)"}, "safari": {"label": "Safari", "color": "var(--chart-2)"}}
- Data example: [{"browser": "chrome", "visitors": 275, "fill": "var(--color-chrome)"}, {"browser": "safari", "visitors": 200, "fill": "var(--color-safari)"}]

### Important Notes:
- ALWAYS include both "config" and "chartData" properties in every graph block - no exceptions
- NEVER leave any required fields empty or missing - all content must be complete
- Use realistic data that relates to the transcript content
- Choose appropriate chart types based on the data being presented
- Ensure data keys in chartData match the keys defined in config
- Use meaningful labels for better understanding
- If there isn't enough data for a chart, create a text block instead
- All content blocks must have valid, complete data - no placeholders or empty values

Transcript:
${transcript}

Please return the content blocks in the specified JSON format.
`;

    const completion = await openai.chat.completions.create({
      model: model.modelString,
      messages: [
        {
          role: "system",
          content: "You are an expert AI assistant that converts meeting transcripts into structured content blocks for a note-taking application. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "content_blocks",
          schema: contentBlockSchema
        }
      },
    //   temperature: 0.7,
      max_tokens: 10000,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error('No response from LLM');
    }

    try {
      const parsed = JSON.parse(responseText);
      return parsed.contentBlocks || [];
    } catch {
      console.error('Failed to parse LLM response:', responseText);
      throw new Error('Invalid JSON response from LLM');
    }
  }
}

// Export singleton instance
export const llmQueue = new LLMProcessingQueue();

// Helper function to get the first available model with API key
export async function getAvailableModel(): Promise<Model | null> {
  try {
    const models = await getModels();
    return models.find(model => model.apiKey && model.apiKey.trim() !== '') || null;
  } catch (error) {
    console.error('Failed to get available model:', error);
    return null;
  }
}

// Main processing function
export async function processTranscriptBatch(
  transcript: string,
  onSuccess: (blocks: ContentBlock[]) => void,
  onError: (error: string) => void,
  transcriptContext?: string,
  noteContext?: string
): Promise<void> {
  const model = await getAvailableModel();
  
  if (!model) {
    const errorMsg = 'No available model with API key configured';
    onError(errorMsg);
    toast.error('No AI model configured', {
      description: 'Please add an API key in Settings',
      action: {
        label: 'Open Settings',
        onClick: () => {
          // This will be handled by the UI since we can't directly open the modal from here
        }
      }
    });
    return;
  }

  await llmQueue.addToQueue(transcript, model, onSuccess, onError, transcriptContext, noteContext);
} 