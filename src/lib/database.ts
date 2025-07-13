import { Dexie, type EntityTable } from 'dexie';
import { Model, Config, Note } from './interfaces';

// Database declaration
export const db = new Dexie('IDontPayAttentionDB') as Dexie & {
  models: EntityTable<Model, 'name'>;
  config: EntityTable<Config, 'id'>;
  notes: EntityTable<Note, 'id'>;
};

// Schema definition
db.version(1).stores({
  models: 'name, modelString, baseUrl, isOpenai, apiKey, defaultColor',
  config: 'id, models, batchSize',
  notes: 'id, title, color, content, createdAt, updatedAt',
});

// Default models
const defaultModels: Model[] = [
  {
    name: 'GPT-4o',
    modelString: 'gpt-4o',
    baseUrl: 'https://api.openai.com/v1',
    isOpenai: true,
    apiKey: '',
    defaultColor: 'blue',
  },
  {
    name: 'GPT-4o-mini',
    modelString: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
    isOpenai: true,
    apiKey: '',
    defaultColor: 'green',
  },
];

// Default config
const defaultConfig: Config = {
  id: 'main',
  models: defaultModels,
  batchSize: 10,
};

// Initialize database with defaults
export const initializeDatabase = async () => {
  try {
    await db.open();
    
    // Check if config exists, if not create it
    const configCount = await db.config.count();
    if (configCount === 0) {
      await db.config.add(defaultConfig);
    }
    
    // Check if models exist, if not create them
    const modelCount = await db.models.count();
    if (modelCount === 0) {
      await db.models.bulkAdd(defaultModels);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Helper functions
export const getConfig = async (): Promise<Config> => {
  const config = await db.config.get('main');
  return config || defaultConfig;
};

export const updateConfig = async (newConfig: Partial<Config>): Promise<void> => {
  await db.config.update('main', newConfig);
};

export const getModels = async (): Promise<Model[]> => {
  return await db.models.toArray();
};

export const addModel = async (model: Model): Promise<void> => {
  await db.models.add(model);
};

export const updateModel = async (name: string, changes: Partial<Model>): Promise<void> => {
  await db.models.update(name, changes);
};

export const deleteModel = async (name: string): Promise<void> => {
  await db.models.delete(name);
};

export const getNotes = async (): Promise<Note[]> => {
  return await db.notes.orderBy('updatedAt').reverse().toArray();
};

export const getNote = async (id: string): Promise<Note | undefined> => {
  return await db.notes.get(id);
};

export const saveNote = async (note: Note): Promise<void> => {
  await db.notes.put(note);
};

export const deleteNote = async (id: string): Promise<void> => {
  await db.notes.delete(id);
}; 