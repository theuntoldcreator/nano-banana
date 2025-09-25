import { type Prompt, type InsertPrompt, prompts } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, ilike, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: string): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  deletePrompt(id: string): Promise<boolean>;
  getPromptsByCategory(category: string): Promise<Prompt[]>;
  searchPrompts(query: string): Promise<Prompt[]>;
  incrementLikes(id: string): Promise<Prompt | undefined>;
}

export class MemStorage implements IStorage {
  private prompts: Map<string, Prompt>;

  constructor() {
    this.prompts = new Map();
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    const samplePrompts: Prompt[] = [
      {
        id: randomUUID(),
        title: "Cyberpunk Cityscape",
        prompt: "A futuristic cyberpunk cityscape with towering neon-lit skyscrapers, flying cars streaming through the air, and vibrant purple and blue lighting reflecting off wet streets",
        imageUrl: "https://pixabay.com/get/g52c38fb54143a8d1a18e4b76fb9546db022cef6d56a21f6295577f03c515be20224076e2d4faa533d42788b263e58564e9f053a593d6b753829bf0818680f405_1280.jpg",
        category: "Digital Art",
        tags: ["cyberpunk", "neon", "futuristic", "cityscape"],
        likes: 342,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Serene Forest",
        prompt: "Peaceful forest scene with soft morning light filtering through tall pine trees, creating gentle shadows and a mystical atmosphere with morning mist",
        imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "Nature",
        tags: ["forest", "morning", "mist", "peaceful"],
        likes: 128,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Abstract Geometry",
        prompt: "Vibrant abstract composition with geometric shapes and flowing forms in bright colors",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
        category: "Abstract",
        tags: ["abstract", "geometric", "vibrant", "colorful"],
        likes: 256,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Portrait Study",
        prompt: "Professional portrait with dramatic studio lighting and minimalist composition",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        category: "Portrait",
        tags: ["portrait", "dramatic", "studio", "lighting"],
        likes: 189,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Vintage Car",
        prompt: "Vintage-style illustration of a classic car with warm sunset tones and nostalgic atmosphere",
        imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        category: "Vintage",
        tags: ["vintage", "car", "sunset", "nostalgic"],
        likes: 93,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Surreal Space",
        prompt: "Surreal digital artwork with floating geometric objects in space with ethereal lighting",
        imageUrl: "https://pixabay.com/get/g961969ecaab7137d5b1e63bcb73213839c5518b5b5362e5ba22e1e6459c3ab056337c1edcf5c69ff5d076b54c05fcf06_1280.jpg",
        category: "Surreal",
        tags: ["surreal", "space", "geometric", "ethereal"],
        likes: 201,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Macro Droplets",
        prompt: "Detailed macro photography of water droplets on flower petals with soft bokeh background",
        imageUrl: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        category: "Macro",
        tags: ["macro", "water", "droplets", "bokeh"],
        likes: 167,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Modern Architecture",
        prompt: "Modern architectural photography featuring clean geometric lines and minimalist design with dramatic shadows and natural lighting",
        imageUrl: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Architecture",
        tags: ["architecture", "modern", "geometric", "minimalist"],
        likes: 298,
        createdAt: new Date(),
      },
    ];

    samplePrompts.forEach(prompt => {
      this.prompts.set(prompt.id, prompt);
    });
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      tags: insertPrompt.tags || null,
      likes: insertPrompt.likes || 0,
      createdAt: new Date(),
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async updatePrompt(id: string, updateData: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const existing = this.prompts.get(id);
    if (!existing) return undefined;

    const updated: Prompt = { ...existing, ...updateData };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.prompts.delete(id);
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).filter(prompt => 
      prompt.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.prompts.values()).filter(prompt =>
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.prompt.toLowerCase().includes(searchTerm) ||
      prompt.category.toLowerCase().includes(searchTerm) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async incrementLikes(id: string): Promise<Prompt | undefined> {
    const prompt = this.prompts.get(id);
    if (!prompt) return undefined;

    const updated = { ...prompt, likes: (prompt.likes || 0) + 1 };
    this.prompts.set(id, updated);
    return updated;
  }
}

class PostgresStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getPrompts(): Promise<Prompt[]> {
    return await this.db.select().from(prompts).orderBy(desc(prompts.createdAt));
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    const result = await this.db.select().from(prompts).where(eq(prompts.id, id));
    return result[0];
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const result = await this.db.insert(prompts).values({
      ...insertPrompt,
      tags: insertPrompt.tags || null,
      likes: insertPrompt.likes || 0,
    }).returning();
    return result[0];
  }

  async updatePrompt(id: string, updateData: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const result = await this.db.update(prompts)
      .set(updateData)
      .where(eq(prompts.id, id))
      .returning();
    return result[0];
  }

  async deletePrompt(id: string): Promise<boolean> {
    const result = await this.db.delete(prompts).where(eq(prompts.id, id));
    return result.rowCount > 0;
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return await this.db.select().from(prompts)
      .where(eq(prompts.category, category))
      .orderBy(desc(prompts.createdAt));
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const searchPattern = `%${query}%`;
    return await this.db.select().from(prompts)
      .where(
        or(
          ilike(prompts.title, searchPattern),
          ilike(prompts.prompt, searchPattern),
          ilike(prompts.category, searchPattern)
        )
      )
      .orderBy(desc(prompts.createdAt));
  }

  async incrementLikes(id: string): Promise<Prompt | undefined> {
    const result = await this.db.update(prompts)
      .set({ likes: sql`${prompts.likes} + 1` })
      .where(eq(prompts.id, id))
      .returning();
    return result[0];
  }
}

let storage: IStorage;

if (process.env.DATABASE_URL) {
  console.log("Using PostgresStorage");
  storage = new PostgresStorage();
} else {
  console.log("DATABASE_URL not found, using MemStorage for local development.");
  storage = new MemStorage();
}

export { storage };