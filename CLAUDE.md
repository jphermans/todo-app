# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
React-based todo application built with Vite, featuring dark/light mode theming, local storage persistence, due date tracking, subtasks, tags, recurrence, and PWA capabilities.

## Development Commands
- `npm run dev` - Start development server with HMR (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages
- `npm run predeploy` - Build before deployment

## Architecture
- **Frontend**: React 19 with hooks (useState, useEffect)
- **Build Tool**: Vite with React plugin
- **Styling**: CSS custom properties for theme switching + 8 color schemes
- **Storage**: Browser localStorage for per-user todo persistence (`todos_{username}`)
- **PWA**: Service worker for offline functionality
- **Linting**: ESLint with React hooks and refresh plugins

## Key Components & Features

### App.jsx: Main Application Shell
- Theme system: system/light/dark modes with CSS variables
- Online/offline status detection and banner
- Mouse trail animation component
- Theme toggle with cycle: system → light → dark

### TodoList.jsx: Core Todo Management
- **Todo Features**: CRUD operations, due dates, tags, recurrence (daily/weekly/monthly)
- **Subtasks**: Nested todo items with completion tracking
- **User System**: Simple username-based storage isolation
- **Filtering**: All/Active/Completed with creation/due date sorting
- **Notifications**: Browser notifications for due tasks (30-second intervals)
- **Progress Tracking**: Visual progress bar and completion percentage
- **Color Schemes**: 8 selectable accent colors (blue, green, purple, orange, pink, red, teal, indigo)
- **Alerts**: Custom modal dialogs for confirmations
- **Edit Mode**: Inline editing for todos

### MouseTrail.jsx: Visual Enhancement
- Cursor-following animation with fade effect
- Pure CSS-driven particle system

### Storage Schema
```javascript
// Todo structure
{
  id: string (crypto.randomUUID),
  text: string,
  completed: boolean,
  dueDate: string|null,
  createdAt: string (ISO),
  subtasks: Array<Subtask>,
  tag: string,
  recurrence: 'none'|'daily'|'weekly'|'monthly',
  notified: boolean
}

// Subtask structure
{
  id: string,
  text: string,
  completed: boolean,
  createdAt: string (ISO)
}
```

## Theme System
- **CSS Variables**: Comprehensive theming with `--bg-color`, `--text-color`, etc.
- **Dynamic Attributes**: `data-theme` and `data-color-scheme` on document root
- **Responsive Design**: Mobile-first with consistent styling across devices

## PWA Features
- Service worker caches app shell for offline use
- Offline banner shows when connection is lost
- All data stored locally - no backend dependency

## Development Notes
- Uses ES6+ features (optional chaining, destructuring)
- No TypeScript - plain JavaScript/JSX
- All state managed locally with React hooks
- No external state management libraries
- CSS-in-CSS approach with CSS custom properties