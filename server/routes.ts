import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protected Routes Middleware
  const protectedApi = (path: string) => path; // We'll add isAuthenticated to individual handlers or groups

  // --- NOTES ---
  app.get(api.notes.list.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const notes = await storage.getNotes(userId);
    res.json(notes);
  });

  app.post(api.notes.create.path, isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.user!.claims.sub;
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote({ ...input, userId });
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.put(api.notes.update.path, isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.notes.update.input.parse(req.body);
      const updated = await storage.updateNote(id, input);
      if (!updated) return res.status(404).json({ message: "Note not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.delete(api.notes.delete.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNote(id);
    res.status(204).send();
  });

  // --- MEMORIES ---
  app.get(api.memories.list.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const memories = await storage.getMemories(userId);
    res.json(memories);
  });

  app.post(api.memories.create.path, isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.user!.claims.sub;
      const input = api.memories.create.input.parse(req.body);
      const memory = await storage.createMemory({ ...input, userId });
      res.status(201).json(memory);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  app.delete(api.memories.delete.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMemory(id);
    res.status(204).send();
  });

  // --- PREFERENCES ---
  app.get(api.preferences.get.path, isAuthenticated, async (req, res) => {
    // @ts-ignore
    const userId = req.user!.claims.sub;
    const prefs = await storage.getUserPreferences(userId);
    res.json(prefs || {});
  });

  app.put(api.preferences.update.path, isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore
      const userId = req.user!.claims.sub;
      const input = api.preferences.update.input.parse(req.body);
      const updated = await storage.upsertUserPreferences(userId, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // Seed data if empty
  await seedData();

  return httpServer;
}

async function seedData() {
  // Simple check to see if we have any notes
  // Since we don't have a reliable way to check "all" without a user ID in the current API,
  // we'll skip auto-seeding for now to avoid cluttering the DB with random user IDs.
  // The frontend will handle empty states gracefully.
}
