# Overview

This is a full-stack AI prompt gallery application called "Gemini Nano Banana" built with React (frontend) and Express.js (backend). The application allows users to browse, search, and manage AI image generation prompts. Users can view prompts organized by categories, copy them for use in AI image generation tools, and administrators can upload new prompts with images. The application features a modern, responsive design with a masonry-style gallery layout.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod schema validation

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with endpoints for CRUD operations on prompts
- **File Handling**: Multer middleware for image upload processing with 10MB size limits
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development**: Hot reload with Vite integration in development mode

## Data Storage
- **Database**: PostgreSQL with Neon serverless database hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Single prompts table with fields for title, prompt text, image URL, category, tags array, likes count, and timestamps
- **Migrations**: Drizzle Kit for database schema migrations

## File Storage
- **Strategy**: Local file system storage in uploads directory for development
- **File Types**: Image files only (validated by mimetype)
- **Upload Limits**: 10MB maximum file size with proper error handling

## Key Features
- **Search & Filtering**: Text search across prompts and category-based filtering
- **Gallery Display**: Masonry grid layout optimized for varying image dimensions
- **Admin Panel**: Modal-based interface for uploading new prompts with image preview
- **User Interactions**: Like/unlike functionality and one-click prompt copying to clipboard
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Authentication & Authorization
- Currently implements a simple admin panel without authentication
- All endpoints are publicly accessible
- Session management infrastructure is present but not actively used

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Connection**: Uses `@neondatabase/serverless` driver for database connectivity

## UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library providing consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

## Development Tools
- **Vite**: Modern build tool with HMR and optimized bundling
- **TypeScript**: Static typing for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## File Upload & Processing
- **Multer**: Express.js middleware for handling multipart/form-data file uploads
- **File System**: Node.js built-in modules for local file operations

## State Management & API
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **Wouter**: Lightweight routing library as an alternative to React Router