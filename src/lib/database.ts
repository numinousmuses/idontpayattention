import { Dexie, type EntityTable } from 'dexie';
import { Model, Config, Note } from './interfaces';
import { toast } from 'sonner';

// Database declaration
export const db = new Dexie('IDontPayAttentionDB') as Dexie & {
  models: EntityTable<Model, 'name'>;
  config: EntityTable<Config, 'id'>;
  notes: EntityTable<Note, 'id'>;
};

// Schema definition
db.version(1).stores({
  models: 'name, modelString, baseUrl, isOpenai, apiKey, defaultColor',
  config: 'id, models, batchSize, slidingWindowSize',
  notes: 'id, title, color, content, createdAt, updatedAt',
});

// Default config
const defaultConfig: Config = {
  id: 'main',
  models: [],
  batchSize: 20000,
  slidingWindowSize: 5000,
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
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('Database initialization failed', {
      description: 'Please refresh the page and try again'
    });
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
  try {
    await db.notes.put(note);
  } catch (error) {
    console.error('Failed to save note:', error);
    toast.error('Failed to save note', {
      description: 'Your changes may not be saved'
    });
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  await db.notes.delete(id);
};

export const duplicateNote = async (id: string): Promise<Note | null> => {
  try {
    const originalNote = await db.notes.get(id);
    if (!originalNote) return null;
    
    const duplicatedNote: Note = {
      ...originalNote,
      id: crypto.randomUUID(),
      title: `${originalNote.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.notes.put(duplicatedNote);
    return duplicatedNote;
  } catch (error) {
    console.error('Failed to duplicate note:', error);
    toast.error('Failed to duplicate note');
    return null;
  }
};

export const updateNoteTitle = async (id: string, title: string): Promise<void> => {
  try {
    await db.notes.update(id, { title, updatedAt: new Date() });
  } catch (error) {
    console.error('Failed to update note title:', error);
    toast.error('Failed to update note title');
  }
}; 