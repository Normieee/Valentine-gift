import { z } from 'zod';
import { insertNoteSchema, insertMemorySchema, insertUserPreferenceSchema, notes, memories, userPreferences } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  // --- NOTES (The Fridge) ---
  notes: {
    list: {
      method: 'GET' as const,
      path: '/api/notes' as const,
      responses: {
        200: z.array(z.custom<typeof notes.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/notes' as const,
      input: insertNoteSchema.omit({ userId: true }), // UserId comes from session
      responses: {
        201: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/notes/:id' as const,
      input: insertNoteSchema.partial().omit({ userId: true }),
      responses: {
        200: z.custom<typeof notes.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/notes/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },

  // --- MEMORIES (Gallery) ---
  memories: {
    list: {
      method: 'GET' as const,
      path: '/api/memories' as const,
      responses: {
        200: z.array(z.custom<typeof memories.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/memories' as const,
      input: insertMemorySchema.omit({ userId: true }),
      responses: {
        201: z.custom<typeof memories.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/memories/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },

  // --- USER PREFERENCES (Settings) ---
  preferences: {
    get: {
      method: 'GET' as const,
      path: '/api/preferences' as const,
      responses: {
        200: z.custom<typeof userPreferences.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/preferences' as const,
      input: insertUserPreferenceSchema.partial().omit({ userId: true }),
      responses: {
        200: z.custom<typeof userPreferences.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export type NoteResponse = Note;
export type CreateNoteRequest = z.infer<typeof api.notes.create.input>;
export type UpdateNoteRequest = z.infer<typeof api.notes.update.input>;

export type MemoryResponse = Memory;
export type CreateMemoryRequest = z.infer<typeof api.memories.create.input>;

export type UserPreferenceResponse = UserPreference;
export type UpdateUserPreferenceRequest = z.infer<typeof api.preferences.update.input>;

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
