# CTA Designer

## Overview
A web-based CTA (Call-to-Action) banner designer tool. Users can create beautiful CTA banners with customizable text, colors, fonts, and diagonal stripe patterns, then export them as PNG or JPG images.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI components
- **Backend**: Express.js (minimal, serves frontend)
- **No database needed** - this is a pure client-side design tool

## Key Features
- CTA preview at 2160x619px with responsive scaling
- Two layout styles: Centered (diagonal stripes) and Split Image (image left, text right)
- Split Image layout: upload custom image, rounded cutout, corner geometric accents
- Diagonal stripe background pattern (SVG-based) for centered layout
- Configuration panel with tabs: Content, Colors, Style
- 4 color presets per layout style + custom color pickers
- 12 Google Fonts to choose from
- PNG and JPG export via html-to-image library (scale-corrected for accurate output)
- Adjustable heading/description/button sizes, stripe opacity/angle/width, border radius, button spacing

## Project Structure
- `client/src/pages/cta-designer.tsx` - Main CTA designer page with all functionality
- `client/src/App.tsx` - Router setup
- `client/src/components/ui/` - Shadcn UI components

## Running
- `npm run dev` starts the dev server on port 5000
