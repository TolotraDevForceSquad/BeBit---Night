# NightConnect Architecture

## 1. Overview

NightConnect is a full-stack web application inspired by TikTok that connects artists, clubs, and users within the nightlife ecosystem. The platform supports four distinct user roles (standard users, artists, clubs, and administrators) with tailored experiences for each. The application features a responsive design that works across mobile and desktop devices, with special emphasis on a mobile-first, swipe-based interface for event discovery.

## 2. System Architecture

NightConnect follows a client-server architecture with clearly separated frontend and backend components:

```
├── client/            # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── layouts/    # Page layout components
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Application pages organized by user role
├── server/            # Express.js backend
├── db/                # Database configuration and migrations
├── shared/            # Shared code (schema definitions, types)
```

### Key Architectural Patterns

1. **Monorepo Structure**: All code (frontend, backend, database, shared types) exists in a single repository, facilitating coordinated development and deployment.

2. **Type-Sharing**: TypeScript types and database schemas are defined in a shared location, ensuring consistency between the frontend and backend.

3. **Role-Based Architecture**: The application is organized around user roles (user, artist, club, admin), with dedicated dashboards and functionality for each.

4. **API-First Design**: The backend exposes RESTful APIs that the frontend consumes, maintaining a clean separation of concerns.

## 3. Key Components

### 3.1. Frontend Architecture

The frontend is built with React and TypeScript, organized into a feature-based structure:

- **Component Library**: Uses the Shadcn UI component system (built on Radix UI) with a custom design system.
- **State Management**: Combines React Query for server state and React Context for application state.
- **Routing**: Uses Wouter for lightweight client-side routing.
- **Animation**: Employs Framer Motion for the TikTok-like swipe experience.
- **Authentication**: Custom auth hooks and protected routes ensure role-based access control.

Key frontend patterns:

- **Responsive Layouts**: Dedicated components for mobile and desktop experiences
- **Custom Hooks**: Encapsulates complex logic (e.g., `useAuth`, `useGeolocation`, `useMobile`)
- **Page Organization**: Pages are organized by user role (/admin, /artist, /club, /user)

### 3.2. Backend Architecture

The backend is built with Express.js and TypeScript:

- **API Routes**: RESTful endpoint organization in `server/routes.ts`
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Management**: Express-session with PostgreSQL session store
- **QR Code Generation**: For ticket validation and entry

### 3.3. Database Architecture

The application uses PostgreSQL with Drizzle ORM:

- **Schema Definition**: Database schema defined in TypeScript with Drizzle ORM in `shared/schema.ts`
- **Type Generation**: Zod schemas generated from Drizzle tables for validation
- **Migrations**: Managed by Drizzle Kit
- **Connection**: Uses Neon serverless Postgres driver

Key database tables:
- `users`: Core user information and authentication
- `artists`: Artist-specific profile data
- `clubs`: Club and venue information 
- `events`: Event details
- Additional tables for tickets, transactions, invitations, etc.

### 3.4. Authentication System

The application uses a session-based authentication system:

- **Password Storage**: Secure password hashing with scrypt
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Role-Based Access Control**: Four distinct user roles with different permissions

## 4. Data Flow

### 4.1. Authentication Flow

1. User logs in with username/password
2. Backend validates credentials and creates a session
3. Session ID is stored in a cookie
4. Frontend uses the session cookie for authenticated requests
5. React Query handles authenticated data fetching
6. Protected routes check user role for proper access control

### 4.2. Event Discovery Flow

1. User opens the explorer page
2. Frontend fetches nearby events based on geolocation
3. Events are displayed in a TikTok-like swipeable interface
4. User can filter events by category, location, etc.
5. Users can like events, purchase tickets, or view details

### 4.3. Ticket Purchase and Verification Flow

1. User purchases a ticket for an event
2. Backend generates a QR code with encoded ticket information
3. QR code is displayed in the user's tickets page
4. At the event, the QR code is scanned for verification
5. Backend validates the ticket and updates the ticket status

## 5. External Dependencies

### 5.1. Frontend Dependencies

- **UI Components**: Radix UI primitives with Shadcn UI styling
- **Data Fetching**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Date Formatting**: date-fns

### 5.2. Backend Dependencies

- **Authentication**: Passport.js
- **Session Management**: express-session with connect-pg-simple
- **QR Code Generation**: qrcode
- **Database**: Neon PostgreSQL with Drizzle ORM

### 5.3. Payment Processing

- **Stripe Integration**: For ticket purchases and artist payments

## 6. Deployment Strategy

The application is configured for deployment on Replit:

- **Build Process**: Vite for frontend, esbuild for backend
- **Development Mode**: Vite dev server with Express backend
- **Production Mode**: Static frontend files served by Express
- **Database**: Neon serverless PostgreSQL
- **Environment Variables**: For database connection, session secrets, etc.

Key deployment considerations:
- Frontend and backend are built and deployed together
- Static assets are served by the Express server
- Database is provisioned separately
- Session secrets should be securely managed in production

## 7. Development Workflow

- **Package Management**: npm
- **TypeScript**: Used throughout the codebase
- **Database Schema Changes**: Managed with Drizzle Kit
- **Seed Data**: Test data can be generated with the seed script

## 8. Security Considerations

- **Password Security**: Passwords are hashed using scrypt with unique salts
- **Session Management**: Secure, HTTP-only cookies
- **Input Validation**: Zod schemas for request validation
- **HTTPS**: Enforced in production
- **Error Handling**: Structured error responses without exposing internal details