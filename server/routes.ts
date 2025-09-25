import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
const upload = multer({
  dest: uploadDir,
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
        prompts = await storage.searchPrompts(search as string);
      } else if (category && category !== "all") {
        console.log("Filtering by category:", category);
        prompts = await storage.getPromptsByCategory(category as string);
      } else {
        console.log("Getting all prompts");
        prompts = await storage.getPrompts();
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
      const prompt = await storage.getPrompt(id);
      
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
      
      // Parse tags if they're a string
      let parsedTags = tags;
      if (typeof tags === "string") {
        parsedTags = tags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
      }

      // For demo purposes, we'll use a placeholder image URL if no file is uploaded
      const imageUrl = req.file 
        ? `/uploads/${req.file.filename}`
        : "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

      const promptData = {
        title,
        prompt,
        imageUrl,
        category,
        tags: parsedTags,
      };

      const validatedData = insertPromptSchema.parse(promptData);
      const newPrompt = await storage.createPrompt(validatedData);
      
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
      
      const updatedPrompt = await storage.updatePrompt(id, updateData);
      
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
      const deleted = await storage.deletePrompt(id);
      
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
      const updatedPrompt = await storage.incrementLikes(id);
      
      if (!updatedPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      
      res.json(updatedPrompt);
    } catch (error) {
      res.status(500).json({ message: "Failed to update likes" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
