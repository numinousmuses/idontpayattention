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
                        background: { type: "number", minimum: 0, maximum: 9.5, not: { const: 2 } },
                        width: { type: "string", enum: ["1/1", "1/2", "1/3", "1/4", "2/3", "3/4"] }
                      },
                      required: ["content", "width"],
                      additionalProperties: false
                    },
                    {
                      type: "object",
                      properties: {
                        chartType: { type: "string", enum: ["area", "bar", "line", "pie"] },
                        chartData: { type: "array", items: { type: "object" } },
                        chartConfig: { type: "object" },
                        heading: { type: "string" },
                        subheading: { type: "string" },
                        description: { type: "string" },
                        background: { type: "number", minimum: 0, maximum: 9.5, not: { const: 2 } },
                        width: { type: "string", enum: ["1/1", "1/2", "1/3", "1/4", "2/3", "3/4"] }
                      },
                      required: ["chartType", "chartData", "chartConfig", "heading", "width"],
                      additionalProperties: false
                    },
                    {
                      type: "object",
                      properties: {
                        content: { type: "array", items: { type: "string" } },
                        background: { type: "number", minimum: 0, maximum: 9.5, not: { const: 2 } }
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
2. **Graph blocks** - When data, numbers, or trends are mentioned, create charts using Recharts
3. **Marquee blocks** - For important announcements, key phrases, or highlights

Guidelines:
- Create multiple content blocks to organize information logically
- Use appropriate background colors (0, 1, 3-9.5) to create visual hierarchy - NEVER use background level 2 as it conflicts with the page grid background
- Vary block widths (1/1, 1/2, 1/3, 1/4, 2/3, 3/4) for better layout
- Keep marquee content concise and impactful

## Graph Block Configuration

For graph blocks, you have full freedom with Recharts configuration. Each graph block needs:

1. **chartType**: Choose from "area", "bar", "line", or "pie"
2. **chartData**: Array of objects with your data
3. **chartConfig**: Object with configuration options
4. **heading**: Chart title
5. **subheading**: Optional subtitle
6. **description**: Optional description
7. **background**: Optional background color (0-9.5)
8. **width**: Block width (1/1, 1/2, 1/3, 1/4, 2/3, 3/4)

### Chart Types and Examples:

**Area Charts** (chartType: "area"):
- Good for showing trends over time
- Data example: [{"month": "Jan", "revenue": 1200, "expenses": 800}, {"month": "Feb", "revenue": 1400, "expenses": 900}]
- Config example: {"xAxisKey": "month"}

**Bar Charts** (chartType: "bar"):
- Good for comparing categories
- Data example: [{"category": "Q1", "sales": 1200, "profit": 400}, {"category": "Q2", "sales": 1500, "profit": 600}]
- Config example: {"xAxisKey": "category"}

**Line Charts** (chartType: "line"):
- Good for showing trends and changes
- Data example: [{"date": "2024-01", "users": 1000, "sessions": 1500}, {"date": "2024-02", "users": 1200, "sessions": 1800}]
- Config example: {"xAxisKey": "date"}

**Pie Charts** (chartType: "pie"):
- Good for showing proportions
- Data example: [{"name": "Mobile", "value": 45}, {"name": "Desktop", "value": 35}, {"name": "Tablet", "value": 20}]
- Config example: {"dataKey": "value", "nameKey": "name"}

### Configuration Options:
- **xAxisKey**: For area/bar/line charts, specifies which data key to use for X-axis (defaults to "name")
- **dataKey**: For pie charts, specifies which data key contains values (defaults to "value")
- **nameKey**: For pie charts, specifies which data key contains labels (defaults to "name")

### Important Notes:
- ALWAYS include chartType, chartData, chartConfig, and heading - no exceptions
- NEVER leave any required fields empty or missing - all content must be complete
- NEVER use background level 2 - this color is reserved for the page grid pattern
- Use realistic data that relates to the transcript content
- Choose appropriate chart types based on the data being presented
- Ensure data structure matches the chart type requirements
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