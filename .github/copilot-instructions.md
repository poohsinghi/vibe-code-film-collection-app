# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a film collection mobile application built with:
- **Frontend**: Expo React Native with TypeScript and NativeWind (Tailwind CSS)
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL
- **State Management**: Zustand for local state, React Query for server state
- **APIs**: OMDB API and TMDB API for film data

## Code Style Guidelines
- Always use functional React components with TypeScript
- Use React Query for all API calls and server state management
- Use Zustand for local application state
- For styling, prefer StyleSheet for now until NativeWind is properly configured
- Follow React Native best practices for performance and accessibility
- Use proper error handling and loading states
- Implement proper TypeScript types for all functions and components

## Architecture
- **Mobile App** (`/mobile`): Expo React Native application
- **Backend** (`/backend`): Express.js API server
- **Database**: PostgreSQL with connection pooling

## State Management
- **Authentication**: Zustand store with AsyncStorage persistence
- **Films & Watchlist**: React Query for server state, Zustand for UI state
- **Navigation**: React Navigation with typed routes

## API Integration
- Use React Query hooks for all API calls
- Implement proper error handling and retry logic
- Use TypeScript interfaces for all API responses
- Handle authentication tokens automatically via Axios interceptors

## Development Guidelines
- Always implement loading and error states
- Use proper TypeScript types
- Follow React Native performance best practices
- Implement proper form validation
- Use secure storage for sensitive data
- Test on both iOS and Android platforms
