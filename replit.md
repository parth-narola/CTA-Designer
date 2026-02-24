# CTA Designer

## Overview
A web-based CTA (Call-to-Action) banner designer tool. Users can create beautiful CTA banners with customizable text, colors, fonts, and diagonal stripe patterns, then export them as PNG or JPG images.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Express.js (minimal, serves frontend)
- **No database needed** - this is a pure client-side design tool

## Key Features
- CTA preview at 1024x300px with responsive scaling
- Diagonal stripe background pattern (SVG-based)
- Configuration panel with tabs: Content, Colors, Style
- 10 color presets + custom color pickers
- 12 Google Fonts to choose from
- PNG and JPG export via html-to-image library
- Adjustable heading/description/button sizes, stripe opacity/angle/width, border radius

## Project Structure
- `client/src/pages/cta-designer.tsx` - Main CTA designer page with all functionality
- `client/src/App.tsx` - Router setup
- `client/src/components/ui/` - Shadcn UI components

## Running
- `npm run dev` starts the dev server on port 5000
