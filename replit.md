# TaskFlow - Project Management Tool

## Overview

TaskFlow is a full-stack project management application designed for teams to schedule, track, and manage tasks across multiple projects. The application features a modern React frontend with Material Design using **Material-UI (MUI)** components, a **Spring Boot backend (Java)**, and environment-aware database configuration (PostgreSQL on Replit, H2 in-memory locally). Users can organize work by projects, assign tasks with optional due dates, set priorities (1-5), track status changes, and view tasks in both grid/list and calendar formats.

**Recent Migrations:** 
- Backend migrated from Node.js/Express to Java Spring Boot with Maven for improved enterprise-grade architecture, type safety, and performance.
- Database configuration now environment-aware: auto-detects Replit (PostgreSQL) vs local (H2 in-memory) using Spring profiles.
- **UI library COMPLETED migration from Radix UI/shadcn to Material-UI** (November 2025): All 14 major components migrated, all Radix UI dependencies removed (27 packages), all shadcn/ui files deleted. Application now uses 100% Material-UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- **Material-UI (MUI)** component library for Material Design components
- Tailwind CSS for styling with custom design tokens (works alongside MUI)

**Design System:**
- Material Design principles implemented via Material-UI (MUI)
- MUI ThemeProvider with custom light/dark themes synchronized with Tailwind
- Theme state managed in App.tsx with localStorage persistence
- Document class (`dark`) synced between MUI and Tailwind for consistent theming
- Responsive layouts with mobile-first approach
- Spacing system using Tailwind units (2, 4, 6, 8, 12, 16) and MUI spacing tokens
- Typography hierarchy using Roboto font family (MUI default)

**State Management:**
- Server state: TanStack Query with infinite stale time (cache-first strategy)
- Local UI state: React hooks (useState, useEffect)
- Form state: React Hook Form with Zod validation
- No global state management library (Redux/Zustand) - server state handled by React Query

**Component Structure:**
- MUI components imported directly from `@mui/material` and `@mui/icons-material`
- Feature components in `client/src/components/` (TaskCard, ProjectCard, FilterBar, AppSidebar, TaskCalendar, etc.)
- Page components in `client/src/pages/` (Dashboard, Projects, Tasks, CalendarView)
- Theme configuration in `client/src/theme.ts` (light/dark MUI themes)
- Path aliases configured for clean imports (@/, @shared/, @assets/)
- Responsive sidebar using MUI Drawer (permanent on desktop md+, temporary on mobile)
- TaskCalendar uses MUI DateCalendar with date-fns for date operations

### Backend Architecture

**Technology Stack:**
- **Spring Boot 3.2.0** (Java 21) REST API framework
- **Spring Data JPA** with Hibernate for ORM
- **Spring Web** for RESTful controllers
- **Neon serverless PostgreSQL** via JDBC
- **Jakarta Validation** for request validation
- **ExecutorService** for background notification processing
- **HikariCP** for database connection pooling
- **Lombok** for reducing boilerplate code
- **SLF4J** for logging

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routing (projects, tasks)
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Consistent JSON responses with appropriate HTTP status codes
- Request validation using `@Valid` annotations with Jakarta Validation
- Two DTO patterns:
  - `CreateTaskRequest`: For POST (required fields validated)
  - `UpdateTaskRequest`: For PATCH (all fields optional for partial updates)

**Service Layer:**
- `TaskService`: Business logic for CRUD operations, filtering, sorting
- `NotificationService`: Async email notifications via bounded thread pool
- `ProjectService`: Project management operations
- Service methods annotated with `@Transactional` for data consistency
- In-memory filtering and sorting (moved from JPQL to avoid PostgreSQL type inference issues)

**Background Processing:**
- NotificationService uses `ExecutorService` with fixed thread pool (4 workers)
- Non-blocking notification sending (requests return immediately)
- Graceful shutdown with 10-second timeout via `@PreDestroy`
- Email notifications simulated via console logging (SLF4J)
- Null-safe date formatting ("No due date" for tasks without due dates)

**Database Configuration:**
- **Environment-Aware Setup**: Automatically selects database based on environment
  - **Replit Profile**: Uses PostgreSQL (Neon serverless) when `DATABASE_URL` env var exists
  - **Local Profile**: Uses H2 in-memory database when `DATABASE_URL` is absent
- **Spring Profiles**: Configured in `application.yml` with auto-detection logic in `TaskFlowApplication.java`
- **No Manual Configuration**: Profile selection is fully automatic based on environment

**Database Schema:**
- **Projects table**: id (varchar UUID), name, description, color
- **Tasks table**: id (varchar UUID), projectId, name, description, priority (1-5), dueDate (nullable), assignee, status (PENDING/IN_PROGRESS/COMPLETED), createdAt, updatedAt
- UUID primary keys generated via PostgreSQL `gen_random_uuid()` (Replit) or H2 `random_uuid()` (local)
- Timestamps auto-managed via JPA `@PrePersist` and `@PreUpdate`
- **Optional Due Dates**: Tasks can be created with or without due dates (nullable column)

**Key Design Decisions:**
- Date filtering moved from JPQL to service layer (avoids PostgreSQL timestamp type inference issues)
- Empty string ("") used as marker to clear due dates in PATCH requests (Java can't distinguish JSON null vs missing field)
- UpdateTaskRequest separates partial update concerns from CreateTaskRequest validation
- Separate DTOs prevent validation conflicts between POST (required fields) and PATCH (optional fields)

### Build and Development

**Development Setup:**
- Vite dev server with HMR for frontend on port 5000
- Spring Boot runs on port 8080 with hot reload via Maven
- Node.js orchestrator (`server/index.ts`) manages both processes:
  - Starts Spring Boot backend (`mvn spring-boot:run`)
  - Starts Vite frontend dev server
  - Provides unified development workflow
- Source maps for frontend debugging
- SLF4J logging for backend debugging

**Production Build & Deployment:**
- Frontend: Vite builds client to `dist/public`
- Backend: Maven packages Spring Boot executable JAR with static files bundled in
- Spring Boot serves static frontend assets from classpath via `WebConfig.java`
- Single deployable JAR contains both frontend and backend
- **Replit Deployment**: 
  - `npm run build` builds the frontend; `npm run start` runs the Node.js orchestrator
  - Production orchestrator (`dist/index.js`) auto-builds Spring Boot JAR if missing
  - Spring Boot runs with `production` profile on port 5000 (Replit's external port)
  - SPA routing handled by WebConfig fallback to `index.html` for non-API routes

**Maven Configuration (pom.xml):**
- Spring Boot 3.2.0 with Java 21+ (compatible with Java 21, 22, 23, 24)
- Dependencies: Spring Web, Spring Data JPA, PostgreSQL driver, H2 database, Lombok 1.18.38, validation
- Maven plugins: 
  - `maven-compiler-plugin` 3.13.0: Configured with Java 21 and Lombok annotation processor paths for local development compatibility
  - `spring-boot-maven-plugin`: Packages executable JAR
- Build produces executable JAR with embedded Tomcat
- **H2 Dependency**: Added for local in-memory database support (scope: runtime)
- **Lombok 1.18.38**: Explicitly versioned for Java 24 compatibility (use 1.18.30+ for Java 21, 1.18.36+ for Java 23, 1.18.38+ for Java 24)

## Local Development Setup (Windows)

### Prerequisites
- **Java 21+**: JDK 21, 22, 23, or 24 (tested with Java 24)
- **Maven**: Apache Maven 3.9+ (or use included Maven wrapper `./mvnw`)
- **Node.js**: Node.js 18+ with npm

### Running Locally on Windows

1. **Clone the repository** and open a terminal in the project root

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```
   This command uses `cross-env` for Windows compatibility and starts:
   - **Vite frontend dev server** on `http://localhost:5000`
   - **Spring Boot backend** on `http://localhost:8080` with `local` profile (H2 database)

4. **Access the application** at `http://localhost:5000`

### Profile Auto-Detection
- **Replit environment**: Automatically uses `replit` profile with PostgreSQL when `DATABASE_URL` exists
- **Local environment**: Automatically uses `local` profile with H2 in-memory database when `DATABASE_URL` is absent
- No manual profile configuration needed - the application auto-detects the environment

### H2 Console (Local Development Only)
When running locally, the H2 database console is available at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:taskflowdb`
- Username: `sa`
- Password: (empty)

### Troubleshooting Windows

**If `npm run dev` fails with NODE_ENV errors:**
- Ensure `cross-env` is installed: `npm install`
- The `package.json` scripts use `cross-env` for Windows compatibility

**If Spring Boot fails to start with Lombok errors:**
- Ensure Lombok version in `pom.xml` matches your Java version:
  - Java 21: Lombok 1.18.30+
  - Java 23: Lombok 1.18.36+
  - Java 24: Lombok 1.18.38+

**If Maven can't find Java:**
- Ensure `JAVA_HOME` environment variable is set correctly
- Ensure Java is in your PATH

**TypeScript Configuration:**
- Frontend: Strict mode enabled for type safety
- Path mapping for clean imports (@/, @shared/, @assets/)
- Incremental compilation for faster rebuilds
- Separate tsconfig for client/shared code

## External Dependencies

### Backend (Spring Boot)
- **Spring Boot 3.2.0**: Enterprise Java framework for building REST APIs
- **Spring Data JPA**: Data access layer with Hibernate ORM
- **PostgreSQL JDBC Driver**: Database connectivity for Replit environment
- **H2 Database**: In-memory database for local development
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL database (Replit only)
- **HikariCP**: High-performance JDBC connection pooling
- **Lombok**: Annotation-based code generation (getters, setters, constructors)
- **Jakarta Validation**: Bean validation for request DTOs
- **SLF4J**: Logging facade

### Database
- **Replit Environment**: Neon Serverless PostgreSQL via `DATABASE_URL` environment variable
- **Local Environment**: H2 in-memory database (no configuration needed)
- **Automatic Detection**: Spring profiles activate based on `DATABASE_URL` presence
- Connection via JDBC (`org.postgresql:postgresql` for Replit, H2 driver for local)
- Database schema managed via JPA entity annotations
- **No Data Persistence Locally**: H2 runs in-memory, data clears on restart

### UI Component Libraries
- **Material-UI (MUI)**: React component library implementing Material Design
  - `@mui/material`: Core UI components (Button, Card, Dialog, TextField, etc.)
  - `@mui/icons-material`: Material Design icon components
  - `@mui/x-date-pickers`: Date and time picker components (DateCalendar, PickersDay, LocalizationProvider)
  - `@emotion/react` & `@emotion/styled`: CSS-in-JS styling (MUI dependency)
- **Lucide React**: Icon library for custom icons (used alongside MUI icons)
- **date-fns**: Date manipulation and formatting utility (used with MUI DatePickers)

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
- **Backend**: Spring Boot with embedded Tomcat server (Java 21)
- **Frontend Dev**: Vite dev server (Node.js)
- **Orchestrator**: Node.js script manages both Spring Boot and Vite processes
- **Background Processing**: Java ExecutorService with fixed thread pool (4 workers)
- **Database Pooling**: HikariCP for connection management