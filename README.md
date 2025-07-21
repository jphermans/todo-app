# Todo App

A React-based todo application built with Vite, featuring dark/light mode theming, local storage persistence, and due date tracking.

## Features

- **Theme System**: Automatic dark/light mode switching with manual override
- **Todo Management**: Add, complete, and delete todos with due dates
- **Visual Indicators**: Overdue and due-today highlighting
- **Persistent Storage**: Browser localStorage for data persistence
- **Responsive Design**: Clean, modern UI that works on all devices

## Development Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Tech Stack

- **Frontend**: React 19 with modern hooks
- **Build Tool**: Vite with React plugin
- **Styling**: CSS variables for theme switching
- **Storage**: Browser localStorage
- **Linting**: ESLint with React hooks and refresh plugins

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open http://localhost:5173 in your browser

## Architecture

- `App.jsx` - Main app component with theme toggle
- `TodoList.jsx` - Core todo functionality (CRUD operations)
- `index.css` - Theme-aware CSS with CSS custom properties