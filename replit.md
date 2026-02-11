# Replit Agent Guide

## Overview

"Across the Universe" (also called "Synced Souls") is a private digital sanctuary web app designed for long-distance couples. It provides features like dual timezone clocks, a relationship duration timer, a virtual "fridge" for sticky notes, a photo memories gallery, and user preference settings. The app has a space/starry night theme with glassmorphism UI elements.

The project follows a monorepo structure with a React frontend (Vite), an Express backend, PostgreSQL database with Drizzle ORM, and Replit Auth for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Directory Structure
- `client/` — React frontend (Vite-powered SPA)
- `server/` — Express.js backend API server
- `shared/` — Shared code between client and server (schemas, routes, types)
- `migrations/` — Drizzle ORM migration files
- `script/` — Build scripts

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled with Tailwind CSS
- **Animations**: Framer Motion for page transitions and interactive elements
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Theme**: Dark "deep space" theme with CSS custom properties, glassmorphism effects, and animated star background
- **Fonts**: Playfair Display (headings), Inter (body text)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js running on Node with `tsx` for TypeScript execution
- **API pattern**: RESTful JSON API under `/api/` prefix. Route contracts are defined in `shared/routes.ts` using Zod schemas, providing type-safe request/response validation shared between client and server
- **Authentication**: Replit Auth (OpenID Connect) via Passport.js with session-based auth stored in PostgreSQL (`connect-pg-simple`). Auth code lives in `server/replit_integrations/auth/`
- **Protected routes**: Middleware `isAuthenticated` guards all API endpoints
- **Dev server**: Vite dev server runs as middleware in development; static files served in production from `dist/public`

### Database
- **Database**: PostgreSQL (required, provisioned via Replit)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema location**: `shared/schema.ts` and `shared/models/auth.ts`
- **Schema push**: Use `npm run db:push` (drizzle-kit push) to sync schema to database — no migration files needed for development
- **Tables**:
  - `users` — User accounts (managed by Replit Auth)
  - `sessions` — Session storage for authentication
  - `notes` — Sticky notes for the "Fridge" feature (content, color, position, rotation)
  - `memories` — Photo gallery entries (image URLs with captions)
  - `user_preferences` — Relationship settings (partner name, timezone, start date, theme)

### Build & Deploy
- **Dev**: `npm run dev` — runs Express + Vite HMR via `tsx`
- **Build**: `npm run build` — Vite builds the client to `dist/public`, esbuild bundles the server to `dist/index.cjs`
- **Production**: `npm start` — runs the built `dist/index.cjs` which serves static files

### Key Design Decisions
1. **Shared route contracts**: API paths, methods, input schemas, and response schemas are defined once in `shared/routes.ts` and used by both client hooks and server handlers, ensuring type safety across the stack.
2. **All notes visible to all users**: The current storage implementation returns ALL notes regardless of user, treating the database as a shared space for one couple. This is intentional for the couple-app use case.
3. **Session-based auth over JWT**: Uses server-side sessions stored in PostgreSQL for simplicity and security with Replit Auth.
4. **No file upload**: Memories use image URLs rather than file uploads — users paste URLs to images hosted elsewhere.

## External Dependencies

- **PostgreSQL**: Required. Connection via `DATABASE_URL` environment variable. Used for all data storage and session management.
- **Replit Auth (OpenID Connect)**: Authentication provider. Requires `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables.
- **Google Fonts**: Loads Inter and Playfair Display font families from `fonts.googleapis.com`.
- **No other external APIs**: The app is self-contained — no email services, payment processors, or third-party APIs are actively used (though dependencies like `nodemailer`, `stripe`, `openai` exist in package.json, they are not currently integrated).