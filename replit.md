# Real Estate Auction Platform

## Overview

This is a full-stack web application for browsing real estate auction properties, specifically designed for Caixa Econômica Federal's property auctions in Brazil. The platform allows users to browse properties by state, view detailed property information, and explore auction opportunities.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM (currently using in-memory storage for development)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Library**: Built on Radix UI primitives with shadcn/ui styling
- **Styling System**: Tailwind CSS with custom Caixa branding colors (blue and orange)
- **Type Safety**: Full TypeScript integration across the stack
- **Responsive Design**: Mobile-first approach with responsive components

### Backend Architecture
- **API Design**: RESTful endpoints for property management
- **Data Layer**: Drizzle ORM with PostgreSQL schema definitions
- **Storage**: Currently using in-memory storage (MemStorage) with plans for PostgreSQL integration
- **Middleware**: Express middleware for logging and error handling

### Database Schema
The application defines two main entities:
- **Users**: Basic user management with username/password authentication
- **Properties**: Comprehensive property data including location, pricing, auction details, and images

### UI Components
The application uses a comprehensive set of UI components from shadcn/ui including:
- Form controls (inputs, selects, buttons)
- Layout components (cards, dialogs, sheets)
- Data display (tables, pagination, tooltips)
- Navigation (breadcrumbs, menus)

## Data Flow

1. **Property Browsing**: Users start at the home page and navigate to state selection
2. **State Filtering**: Users select a Brazilian state to filter properties
3. **Property Listing**: System fetches and displays properties for the selected state
4. **Property Details**: Users can view detailed information about individual properties
5. **API Integration**: All data flows through REST endpoints with proper error handling

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, TypeScript
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight routing
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date utilities

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, PostgreSQL (Neon serverless)
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Build System**: Vite with React plugin and Replit integrations
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint configuration through Vite
- **Development Server**: Hot module replacement with Vite

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Dev Server**: Uses tsx to run the TypeScript server directly
- **Client Build**: Vite dev server with HMR
- **Database**: In-memory storage for rapid development

### Production Build
- **Server**: esbuild bundles the server code for Node.js
- **Client**: Vite builds optimized static assets
- **Database**: PostgreSQL with Drizzle migrations
- **Static Serving**: Express serves built client assets

### Environment Configuration
- **Database URL**: Configured via environment variables
- **Build Output**: Separate directories for server and client builds
- **Asset Handling**: Vite handles asset optimization and bundling

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```