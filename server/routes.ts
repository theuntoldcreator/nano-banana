import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import { insertPromptSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { supabase } from "../src/integrations/supabase/client";
import { randomUUID } from "crypto";

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all prompts
  app.get("/api/prompts", async (req, res) => {
    try {
      const { category, search } = req.query;
      console.log("GET /api/prompts query:", { category, search });
      
      let prompts;
      if (search) {
        console.log("Searching for:", search);
        prompts = await dbStorage.searchPrompts(search as string);
      } else if (category && category !== "all") {
        console.log("Filtering by category:", category);
        prompts = await dbStorage.getPromptsByCategory(category as string);
      } else {
        console.log("Getting all prompts");
        prompts = await dbStorage.getPrompts();
      }
      
      console.log("Returning", prompts.length, "prompts");
      res.json(prompts);
    } catch (error) {
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
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  // Create new prompt
  app.post("/api/prompts", upload.single("image"), async (req, res) => {
    try {
      const { title, prompt, category, tags } = req.body;
      
      let imageUrl = "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

      if (req.file) {
        const file = req.file;
        const fileName = `${randomUUID()}-${file.originalname}`;
        
        const { data, error } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw new Error(`Supabase upload error: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(data.path);
        
        imageUrl = publicUrl;
      }
      
      let parsedTags = tags;
      if (typeof tags === "string") {
        parsedTags = tags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
      }

      const promptData = {
        title,
        prompt,
        imageUrl,
        category,
        tags: parsedTags,
      };

      const validatedData = insertPromptSchema.parse(promptData);
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
      const updateData = req.body;
      
      const updatedPrompt = await dbStorage.updatePrompt(id, updateData);
      
      if (!updatedPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json(updatedPrompt);
    } catch (error) {
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
      res.status(500).json({ message: "Failed to update likes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}