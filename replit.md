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
- July 03, 2025: Initial setup
- July 03, 2025: Applied official CAIXA styling and branding
  * Header redesigned with official CAIXA layout and navigation
  * Footer restructured following CAIXA's official design patterns
  * Typography updated with CAIXA font families (simulated with Google Fonts)
  * Color scheme updated to official CAIXA colors (#005CA9 blue, #d17d00 orange)
  * Property cards redesigned with professional layout and discount badges
  * Button styles updated to match CAIXA's official design guidelines
  * Responsive design maintained across all components
- July 03, 2025: Mobile optimization and footer simplification
  * Header mobile layout improved with hamburger menu repositioned
  * Search bar hidden on mobile devices for better space utilization
  * Footer simplified to show only essential contact information and social media
  * Responsive design enhanced across all breakpoints
  * Property cards and page layouts optimized for mobile viewing
- July 03, 2025: Property data update with real OLX images
  * Reduced property count from 5 to 4 total properties (3 houses, 1 apartment)
  * Updated all property images to use real OLX image URLs provided by user
  * Updated property specifications with accurate area measurements and room counts
  * Applied consistent 2px border radius across all UI components
  * Enhanced property detail pages with comprehensive information and image galleries
  * Synchronized property data between storage backend and detail page frontend
- July 03, 2025: Price structure and display update
  * Updated property prices: R$ 99.800, R$ 110.900, R$ 115.000, R$ 89.000
  * Reduced evaluation values proportionally for better pricing realism
  * Changed price display to show installment values (price ÷ 120) as main emphasis
  * Removed discount/economy calculations and badges for cleaner interface
  * Properties page now uses real API data instead of hardcoded fake properties
  * Implemented TanStack Query for proper data fetching from backend
- July 03, 2025: Nationwide property availability
  * Added properties for DF (Brasília) and RJ (Rio de Janeiro) states
  * Modified properties page to show all available properties regardless of searched location
  * System now works for any CEP in Brazil, displaying consistent results
  * Updated messaging to indicate "leilões disponíveis em todo o Brasil"
  * Total of 8 properties across 3 major Brazilian cities (SP, DF, RJ)
- July 03, 2025: CPF verification and Leilões Caixa signup system
  * Added informational box explaining why properties are available from Caixa
  * Implemented CPF verification system with external API integration
  * Added 8-second analysis timer with real-time countdown
  * Created complete "Leilões Caixa" signup page with program benefits
  * Integrated data flow from CPF verification to signup form
  * Updated styling to use official Caixa colors (#1964ad, #033c72)
  * Added phone and email formatting with validation
- July 04, 2025: App crash fix and property count optimization
  * Fixed JSX syntax error in leiloes-caixa-signup.tsx (missing closing div tags)
  * Resolved CPFVerificationForm compilation issue
  * Reduced property count from 8 to 4 to eliminate perceived duplicates
  * Removed additional properties from DF and RJ, keeping only São Paulo properties
  * App now displays 4 properties instead of 8 for cleaner user experience
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```