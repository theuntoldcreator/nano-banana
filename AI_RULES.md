# AI Development Rules for Gemini Nano Banana

This document outlines the technical stack and provides clear rules for using various libraries and frameworks within this project. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen technologies.

## Tech Stack Overview

This is a full-stack TypeScript application with a modern, type-safe architecture.

-   **Frontend Framework**: React 18 with TypeScript, built and served using Vite.
-   **UI Components**: A comprehensive set of pre-built, accessible components from `shadcn/ui`.
-   **Styling**: Utility-first styling with Tailwind CSS.
-   **Client-Side Routing**: Lightweight and hook-based routing handled by `wouter`.
-   **Server State Management**: `TanStack Query` (React Query) for all data fetching, caching, and mutations.
-   **Forms**: `React Hook Form` for performant form handling, paired with `Zod` for schema validation.
-   **Backend Framework**: A RESTful API built with Express.js and TypeScript.
-   **Database & ORM**: PostgreSQL (hosted on Neon) is accessed via the type-safe `Drizzle ORM`.
-   **Icons**: `lucide-react` is the exclusive icon library for the project.

## Library Usage Rules

To maintain code quality and consistency, please follow these guidelines strictly.

### 1. UI and Components
-   **Component Library**: **ALWAYS** use components from `shadcn/ui` (`@/components/ui/...`) whenever possible. Do not build custom components for common UI elements like buttons, inputs, dialogs, etc.
-   **Styling**: **ALWAYS** use Tailwind CSS utility classes for styling. Avoid writing custom CSS files. Use the `cn` utility from `@/lib/utils` to conditionally apply classes.
-   **Icons**: **ONLY** use icons from the `lucide-react` package.

### 2. Routing
-   **Library**: Use `wouter` for all client-side navigation.
-   **Implementation**: Define all page routes within the `<Switch>` component in `client/src/App.tsx`.

### 3. Data Fetching & State Management
-   **Server State**: **ALWAYS** use `TanStack Query` for interacting with the backend API.
    -   Use `useQuery` for fetching data.
    -   Use `useMutation` for creating, updating, or deleting data.
-   **Client State**: For simple component-level state, use React's built-in `useState` hook. Avoid complex client-side state management libraries unless absolutely necessary.

### 4. Forms
-   **Form Handling**: **ALWAYS** use `React Hook Form` (`useForm`) to manage form state and submissions.
-   **Validation**: **ALWAYS** define a `Zod` schema for form validation and connect it using `@hookform/resolvers/zod`. If the schema is relevant to both the client and server, place it in the `shared/` directory.

### 5. Backend & Database
-   **API Endpoints**: All new API endpoints must be defined in `server/routes.ts` and follow the existing RESTful pattern.
-   **Database Queries**: **ALL** database operations must be performed using the `Drizzle ORM` client available in `server/storage.ts`. Do not write raw SQL queries.

### 6. User Feedback
-   **Notifications**: Use the custom `useToast` hook (`@/hooks/use-toast.ts`) to display non-blocking notifications (toasts) for events like successful form submissions or errors.