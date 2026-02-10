import { db } from "./db";
import {
  notes,
  memories,
  userPreferences,
  type InsertNote,
  type InsertMemory,
  type InsertUserPreference,
  type UpdateNoteRequest,
  type UpdateUserPreferenceRequest,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Notes
  getNotes(userId: string): Promise<typeof notes.$inferSelect[]>;
  createNote(note: InsertNote): Promise<typeof notes.$inferSelect>;
  updateNote(id: number, updates: UpdateNoteRequest): Promise<typeof notes.$inferSelect | undefined>;
  deleteNote(id: number): Promise<void>;

  // Memories
  getMemories(userId: string): Promise<typeof memories.$inferSelect[]>;
  createMemory(memory: InsertMemory): Promise<typeof memories.$inferSelect>;
  deleteMemory(id: number): Promise<void>;

  // Preferences
  getUserPreferences(userId: string): Promise<typeof userPreferences.$inferSelect | undefined>;
  upsertUserPreferences(userId: string, prefs: UpdateUserPreferenceRequest): Promise<typeof userPreferences.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  // --- Notes ---
  async getNotes(userId: string) {
    // For a shared app, we might want to see ALL notes, or just the user's?
    // For a couple app, typically you want to see notes from BOTH partners.
    // However, simple filtering by userId shows only your own.
    // Ideally, we'd have a 'coupleId'. For this MVP, we'll show ALL notes
    // if we treat the whole DB as "one couple".
    // BUT, since this is multi-tenant capable, we should filter by userId.
    // Since the user asked for "Me and my gurly", they are two users.
    // We need a way to link them.
    // FOR MVP: We will just show notes created by the current user to keep it simple,
    // OR we assume they share a login? No, they have separate accounts.
    // Let's just return ALL notes for now as a "shared space" hack (not secure for SaaS, but fine for a single deployment for one couple).
    // Actually, let's just filter by userId for now to be safe,
    // and maybe in V2 add "Friend/Partner" linking.
    // WAIT, the prompt implies they are separate people.
    // Let's return ALL notes in the system for this demo so they can see each other's notes if they both log in to the same instance.
    return await db.select().from(notes).orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote) {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: number, updates: UpdateNoteRequest) {
    const [updated] = await db
      .update(notes)
      .set(updates)
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: number) {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // --- Memories ---
  async getMemories(userId: string) {
    // Same logic as notes - return all for the "shared" feel in this single-deployment MVP
    return await db.select().from(memories).orderBy(desc(memories.date));
  }

  async createMemory(memory: InsertMemory) {
    const [newMemory] = await db.insert(memories).values(memory).returning();
    return newMemory;
  }

  async deleteMemory(id: number) {
    await db.delete(memories).where(eq(memories.id, id));
  }

  // --- Preferences ---
  async getUserPreferences(userId: string) {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return prefs;
  }

  async upsertUserPreferences(userId: string, prefs: UpdateUserPreferenceRequest) {
    const existing = await this.getUserPreferences(userId);
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set(prefs)
        .where(eq(userPreferences.id, existing.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(userPreferences)
        .values({ ...prefs, userId } as InsertUserPreference)
        .returning();
      return inserted;
    }
  }
}

export const storage = new DatabaseStorage();
