# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
React-based todo application built with Vite, featuring dark/light mode theming, local storage persistence, and due date tracking.

## Development Commands
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Architecture
- **Frontend**: React 19 with modern hooks (useState, useEffect)
- **Build Tool**: Vite with React plugin
- **Styling**: CSS variables for theme switching
- **Storage**: Browser localStorage for todo persistence
- **Linting**: ESLint with React hooks and refresh plugins

## Key Components
- `App.jsx` - Main app component with theme toggle functionality
- `TodoList.jsx` - Core todo functionality (CRUD operations, due dates)
- `index.css` - Theme-aware CSS with CSS custom properties

## Theme System
- Three theme states: system, light, dark
- CSS custom properties for consistent theming across components
- Automatic system theme detection via media queries
- Theme preference persisted in localStorage

## Todo Features
- Add todos with optional due dates
- Mark todos as complete/incomplete
- Delete todos
- Visual indicators for overdue and due-today items
- Persistent storage using browser localStorage