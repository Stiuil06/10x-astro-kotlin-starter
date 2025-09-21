# <myAppName> — Frontend

Frontend built with Astro 5 + React 19 + TypeScript 5 + Tailwind CSS 4 and shadcn/ui, following modern component architecture patterns.

## Technologies

- **Astro 5** — Meta‑framework for static site generation
- **React 19** — UI library for interactive components
- **TypeScript 5** — Static type system
- **Tailwind CSS 4** — CSS framework
- **shadcn/ui** — UI component library

## Running the application

### Development environment

The frontend app will always start on port 3000 in development.

```bash
cd frontend
npm install
npm run dev
```

The app will be available at: `http://localhost:3000`

### Docker

```bash
# Run the frontend only
docker-compose up frontend

# Run the whole stack (when the backend is ready)
docker-compose up
```

## API type generation

TypeScript types are generated automatically from the OpenAPI specification:

```bash
cd frontend
npm run generate:api
```

This command:
1. Reads the spec from `../contracts/openapi.yaml`
2. Generates TypeScript types into `src/lib/generated/`
3. Creates API client with type-safe methods
4. Enables type‑safe API calls

### Generated Files

The generation creates the following structure:
```
src/lib/
├── generated/           # Auto-generated API types and client
│   ├── apis/           # API endpoints
│   ├── models/         # Data models
│   └── runtime.ts      # Runtime utilities
├── api-client.ts       # Configured API client
├── api-types.ts        # Re-exported types for easy imports
└── api-example.ts      # Usage examples
```

### Usage Example

```typescript
import { createApiClient, type LoginRequest } from './lib/api-types';

// Create API client with authentication
const apiClient = createApiClient(token);

// Type-safe API calls
const loginRequest: LoginRequest = {
  username: 'user',
  password: 'password123'
};

const response = await apiClient.login({ loginRequest });
```

## Project structure

The project follows a modern, scalable component architecture with clear separation of concerns:

```
frontend/
├── src/
│   ├── components/           # Component library
│   │   ├── ui/              # Basic UI components
│   │   │   ├── Button.tsx   # Button component with variants
│   │   │   ├── Card.tsx     # Card component with padding options
│   │   │   └── index.ts     # UI components exports
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm.tsx    # Login form component
│   │   │   ├── WelcomeMessage.tsx # Welcome message component
│   │   │   ├── AuthContext.tsx   # Authentication context
│   │   │   ├── useAuth.ts        # Authentication hook
│   │   │   └── index.ts          # Auth components exports
│   │   ├── layout/          # Layout components
│   │   │   ├── Navigation.tsx    # Navigation component
│   │   │   ├── AppWrapper.tsx   # Main app wrapper
│   │   │   └── index.ts         # Layout components exports
│   │   └── index.ts         # All components exports
│   ├── lib/                 # Utilities and services
│   │   ├── api/             # API client and configuration
│   │   │   ├── client.ts    # Configured API client
│   │   │   ├── types.ts     # API-specific types
│   │   │   └── index.ts     # API exports
│   │   ├── constants/       # Application constants
│   │   │   ├── api.ts       # API and storage constants
│   │   │   └── index.ts     # Constants exports
│   │   ├── utils/           # Utility functions
│   │   │   ├── jwt.ts       # JWT utilities
│   │   │   ├── validation.ts # Validation utilities
│   │   │   └── index.ts     # Utils exports
│   │   ├── hooks/           # Global hooks
│   │   │   └── index.ts     # Hooks exports
│   │   └── generated/       # Generated API types
│   ├── types/               # Global type definitions
│   │   ├── auth.ts          # Authentication types
│   │   ├── api.ts           # API types
│   │   └── index.ts         # All types exports
│   ├── layouts/             # Astro layouts
│   ├── pages/               # Astro pages
│   └── styles/              # Global CSS styles
├── public/                  # Public assets
├── astro.config.mjs         # Astro configuration
└── package.json             # Dependencies and scripts
```

## Available scripts

- `npm run dev` — Start the dev server on port 3000
- `npm run build` — Build the production app
- `npm run preview` — Preview the built app
- `npm run lint` — Run linter
- `npm run lint:fix` — Fix linter issues automatically
- `npm run format` — Format code
- `npm run generate:api` — Generate API types from OpenAPI

## Port configuration

The app is configured to always start on port 3000. See `astro.config.mjs`:

```javascript
  server: { port: 3000 }
```

## Component Architecture

### Design Principles

- **Separation of Concerns**: Each folder has a clear, single responsibility
- **Feature-Based Organization**: Components are grouped by business functionality
- **Reusability**: Common components are shared across features
- **Type Safety**: Full TypeScript coverage with generated API types
- **Clean Imports**: Index files provide clean import paths

### Component Categories

#### UI Components (`src/components/ui/`)
Basic reusable UI components that can be used across the entire application:
- `Button` - Button component with variants (primary, secondary, danger)
- `Card` - Card component with configurable padding

#### Authentication Components (`src/components/auth/`)
Authentication-related components and logic:
- `LoginForm` - Login form component
- `WelcomeMessage` - Welcome message for authenticated users
- `AuthContext` - Authentication context provider
- `useAuth` - Authentication hook

#### Layout Components (`src/components/layout/`)
Main application layout components:
- `Navigation` - Navigation bar component
- `AppWrapper` - Root application wrapper with providers

### Import Patterns

Use clean imports through index files:

```typescript
// ✅ Good - Clean imports
import { Button, Card } from '../components/ui';
import { LoginForm, useAuth } from '../components/auth';
import { Navigation } from '../components/layout';

// ❌ Avoid - Direct file imports
import { Button } from '../components/ui/Button';
```

## API Integration

The app uses a configured API client with generated TypeScript types:

```typescript
import { apiClient } from '../lib/api';
import type { LoginRequest } from '../lib/generated/models';

// Use the configured client
const response = await apiClient.login({ loginRequest });
```

## Development Workflow

1. **API Changes**: Update `/contracts/openapi.yaml` first
2. **Generate Types**: Run `cd frontend && npm run generate:api`
3. **Component Development**: Create components in appropriate feature folders
4. **Type Safety**: Use generated types for API calls
5. **Testing**: Test components in isolation and integration
