# TaskFlow - Project Management Tool

## Overview

TaskFlow is a full-stack project management application designed for teams to schedule, track, and manage tasks across multiple projects. The application features a modern React frontend with Material Design principles (via shadcn/ui components), an Express.js backend, and PostgreSQL database integration through Neon serverless. Users can organize work by projects, assign tasks with priorities, track status changes, and view tasks in both grid/list and calendar formats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Design System:**
- Material Design principles adapted through shadcn/ui
- Custom theme system supporting light/dark modes via CSS variables
- Responsive layouts with mobile-first approach
- Spacing system using Tailwind units (2, 4, 6, 8, 12, 16)
- Typography hierarchy using Roboto/Inter font families

**State Management:**
- Server state: TanStack Query with infinite stale time (cache-first strategy)
- Local UI state: React hooks (useState, useEffect)
- Form state: React Hook Form with Zod validation
- No global state management library (Redux/Zustand) - server state handled by React Query

**Component Structure:**
- Shared UI components in `client/src/components/ui/` (shadcn/ui)
- Feature components in `client/src/components/` (TaskCard, ProjectCard, FilterBar, etc.)
- Page components in `client/src/pages/` (Dashboard, Projects, Tasks, CalendarView)
- Path aliases configured for clean imports (@/, @shared/, @assets/)

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Drizzle ORM for database operations
- Neon serverless PostgreSQL
- Zod for request validation
- Worker threads for background notification processing

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routing (projects, tasks)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Consistent error responses with appropriate status codes
- Request validation using Zod schemas derived from database schema

**Storage Abstraction:**
- `IStorage` interface defines contract for data operations
- `DbStorage` implementation for PostgreSQL via Drizzle
- `MemStorage` implementation for in-memory testing/development
- Singleton pattern for database connection management

**Background Processing:**
- Notification service using Node.js worker threads
- Worker pool pattern (4 workers) for parallel processing
- Email notifications simulated via console logging
- Event-driven architecture for task creation/updates

**Database Schema:**
- Projects table: id, name, description, color
- Tasks table: id, projectId, name, description, priority (1-5), dueDate, assignee, status (PENDING/IN_PROGRESS/COMPLETED), timestamps
- UUID primary keys generated via PostgreSQL `gen_random_uuid()`
- Foreign key relationship from tasks to projects (not enforced in schema but handled in application logic)

### Build and Development

**Development Setup:**
- Vite dev server with HMR for frontend
- Express middleware mode integration with Vite
- TSX for running TypeScript server code in development
- Source maps for debugging

**Production Build:**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js`
- ESM module format throughout
- Static file serving from built public directory

**TypeScript Configuration:**
- Strict mode enabled for type safety
- Path mapping for clean imports
- Incremental compilation for faster rebuilds
- Separate tsconfig for client/server/shared code

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL database
- **Drizzle ORM**: TypeScript ORM for database queries and migrations
- Connection via `@neondatabase/serverless` driver
- Database URL provided via `DATABASE_URL` environment variable

### UI Component Libraries
- **Radix UI**: Headless component primitives (40+ components including dialogs, dropdowns, popovers, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting utility
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider component

### Form Handling
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for forms and API requests
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **clsx + tailwind-merge**: Conditional className composition

### Development Tools
- **Replit plugins**: Runtime error modal, cartographer, dev banner for Replit environment
- **Vite plugins**: React, runtime error overlay
- **PostCSS**: CSS processing with autoprefixer

### Runtime
- Node.js worker threads for background processing
- Express session management (connect-pg-simple for PostgreSQL session store)
- HTTP server creation via Node.js built-in http module