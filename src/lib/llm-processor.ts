import OpenAI from 'openai';
import { Model, ContentBlock } from './interfaces';
import { getModels } from './database';

// Queue item interface
interface QueueItem {
  id: string;
  transcript: string;
  order: number;
  attempts: number;
  maxAttempts: number;
  model: Model;
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
    onError: (error: string) => void
  ): Promise<void> {
    const item: QueueItem = {
      id: Date.now().toString(),
      transcript,
      order: this.currentOrder++,
      attempts: 0,
      maxAttempts: 3,
      model,
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
        const blocks = await this.processTranscript(item.transcript, item.model);
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

  private async processTranscript(transcript: string, model: Model): Promise<ContentBlock[]> {
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
                        heading: { type: "string" },
                        subheading: { type: "string" },
                        description: { type: "string" },
                        background: { type: "number", minimum: 0, maximum: 9.5 },
                        width: { type: "string", enum: ["1/1", "1/2", "1/3", "1/4", "2/3", "3/4"] }
                      },
                      required: ["config", "heading", "width"],
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

    const prompt = `
You are an AI assistant that converts meeting transcripts into structured content blocks for a note-taking application. 

Given the following transcript, create meaningful content blocks that summarize, analyze, or present the information in different formats:

1. **Text blocks** - Use markdown format for summaries, key points, action items, etc.
2. **Graph blocks** - When data, numbers, or trends are mentioned, create chart configurations
3. **Marquee blocks** - For important announcements, key phrases, or highlights

Guidelines:
- Create multiple content blocks to organize information logically
- Use appropriate background colors (0-9.5) to create visual hierarchy
- Vary block widths (1/1, 1/2, 1/3, 1/4, 2/3, 3/4) for better layout
- For graphs, create realistic chart configurations with proper data structure
- Keep marquee content concise and impactful

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
      temperature: 0.7,
      max_tokens: 4000,
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
  onError: (error: string) => void
): Promise<void> {
  const model = await getAvailableModel();
  
  if (!model) {
    onError('No available model with API key configured');
    return;
  }

  await llmQueue.addToQueue(transcript, model, onSuccess, onError);
} 