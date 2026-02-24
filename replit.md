# CTA Designer

## Overview

CTA Designer is a web application for creating customizable Call-to-Action banners. Users can design CTA banners with configurable colors, fonts, stripe patterns, and text content, then export them as PNG or JPG images. The app is a single-page tool built with a React frontend and an Express backend, using a full-stack TypeScript monorepo structure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure

The project uses a three-directory monorepo pattern:
- **`client/`** — React SPA frontend
- **`server/`** — Express API backend
- **`shared/`** — Shared types and schemas used by both client and server

### Frontend (`client/`)

- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **UI Components**: Shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with HMR support
- **Image Export**: `html-to-image` library for converting banner previews to PNG/JPG
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

The main feature page is `client/src/pages/cta-designer.tsx`, which contains the banner configuration interface (text, colors, fonts, stripe patterns, border radius) and a live preview with export functionality.

### Backend (`server/`)

- **Framework**: Express 5 on Node.js
- **Language**: TypeScript, run via `tsx`
- **API Pattern**: All API routes are prefixed with `/api` and registered in `server/routes.ts`
- **Storage**: Abstracted via `IStorage` interface in `server/storage.ts`, currently using in-memory (`MemStorage`). Designed to be swapped to a database-backed implementation.
- **Dev Server**: Vite middleware is used in development for HMR; in production, static files are served from `dist/public`

### Database

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with `id`, `username`, `password`
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Connection**: Requires `DATABASE_URL` environment variable pointing to a PostgreSQL instance
- **Note**: The current runtime uses in-memory storage (`MemStorage`), but the schema and Drizzle config are ready for PostgreSQL. When adding database support, implement `IStorage` with Drizzle queries.

### Build Process

- **Client**: Built with Vite, output to `dist/public`
- **Server**: Bundled with esbuild into `dist/index.cjs`, with commonly-used dependencies inlined to reduce cold start times
- **Scripts**:
  - `npm run dev` — Development with hot reload
  - `npm run build` — Production build (client + server)
  - `npm start` — Run production build
  - `npm run db:push` — Push schema changes to database

## External Dependencies

- **PostgreSQL** — Required database (connection via `DATABASE_URL` env var)
- **Google Fonts** — Multiple font families loaded in `index.html` (DM Sans, Fira Code, Geist Mono, Architects Daughter, etc.)
- **html-to-image** — Client-side library for exporting designed banners as image files
- **Radix UI** — Full suite of accessible, unstyled UI primitives used by Shadcn components
- **Replit Plugins** — Development-only Vite plugins for error overlay, cartographer, and dev banner (conditionally loaded when running on Replit)