import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import { insertPromptSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all prompts
  app.get("/api/prompts", async (req, res) => {
    try {
      const { category, search } = req.query;
      let prompts;
      if (search) {
        prompts = await dbStorage.searchPrompts(search as string);
      } else if (category && category !== "all") {
        prompts = await dbStorage.getPromptsByCategory(category as string);
      } else {
        prompts = await dbStorage.getPrompts();
      }
      res.json(prompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // Get single prompt
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await dbStorage.getPrompt(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      console.error(`Failed to fetch prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  // Create new prompt
  app.post("/api/prompts", async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const newPrompt = await dbStorage.createPrompt(validatedData);
      res.status(201).json(newPrompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(400).json({ message: "Failed to create prompt", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update prompt
  app.patch("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPrompt = await dbStorage.updatePrompt(id, req.body);
      if (!updatedPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(updatedPrompt);
    } catch (error) {
      console.error(`Error updating prompt ${req.params.id}:`, error);
      res.status(400).json({ message: "Failed to update prompt" });
    }
  });

  // Delete prompt
  app.delete("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await dbStorage.deletePrompt(id);
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json({ message: "Prompt deleted successfully" });
    } catch (error) {
      console.error(`Error deleting prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  // Increment likes
  app.post("/api/prompts/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPrompt = await dbStorage.incrementLikes(id);
      if (!updatedPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(updatedPrompt);
    } catch (error) {
      console.error(`Error liking prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update likes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}