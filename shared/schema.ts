import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// === TABLE DEFINITIONS ===

// User preferences (relationship details)
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  partnerName: text("partner_name"),
  partnerTimezone: text("partner_timezone").default("Asia/Tokyo"), // Default to Japan
  relationshipStartDate: timestamp("relationship_start_date"),
  backgroundImageUrl: text("background_image_url"),
  themeColor: text("theme_color").default("blue"),
});

// Sticky notes for the "Fridge"
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  color: text("color").default("yellow"), // yellow, pink, blue, green
  rotation: integer("rotation").default(0),
  x: integer("x").default(0),
  y: integer("y").default(0),
  isDraft: boolean("is_draft").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Memories/Photos for the Gallery
export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  author: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  author: one(users, {
    fields: [memories.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({ id: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;

// Request types
export type CreateNoteRequest = InsertNote;
export type UpdateNoteRequest = Partial<InsertNote>;

export type CreateMemoryRequest = InsertMemory;
export type UpdateMemoryRequest = Partial<InsertMemory>;

export type UpdateUserPreferenceRequest = Partial<InsertUserPreference>;

// Response types
export type NoteResponse = Note;
export type MemoryResponse = Memory;
export type UserPreferenceResponse = UserPreference;

