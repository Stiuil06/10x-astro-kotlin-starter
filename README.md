# 10x Astro Starter

A modern, opinionated starter template for building fast, accessible, and AI-friendly static web applications with universal backend API support.

## Tech Stack

- [Astro](https://astro.build/) v5.5.5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) v19.0.0 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) v5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework
- Universal API Client - Connect to any backend API

## Prerequisites

- Node.js v18.20.8+ (required for Astro 5)
- npm (comes with Node.js)

**Note**: This project requires Node.js 18.20.8 or higher. If you're using an older version, please upgrade using [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n).

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/przeprogramowani/10x-astro-starter.git
cd 10x-astro-starter
```

2. Install dependencies:

```bash
npm install
```

3. Configure your backend API:

```bash
# Copy the example environment file
cp src/env.example .env

# Edit .env and set your backend URL
BACKEND_URL=http://localhost:3001/api
```

4. Run the development server:

```bash
npm run dev
```

5. Build for production (generates static files):

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```md
.
├── src/
│   ├── layouts/    # Astro layouts
│   ├── pages/      # Astro pages
│   ├── components/ # UI components (Astro & React)
│   ├── lib/        # Services and utilities
│   │   ├── api-client.ts    # Universal API client
│   │   ├── services/        # API service layer
│   │   └── utils/           # Utility functions
│   ├── types.ts    # Shared TypeScript types
│   └── styles/     # Global styles
├── public/         # Public assets
└── dist/           # Generated static files (after build)
```

## Backend API Integration

This template includes a universal API client that can connect to any backend API:

- **API Client**: `src/lib/api-client.ts` - Universal HTTP client
- **Service Layer**: `src/lib/services/api.service.ts` - Typed API methods
- **Error Handling**: `src/lib/utils/error-handler.ts` - Consistent error handling
- **Types**: `src/types.ts` - Shared TypeScript interfaces

### Configuration

Set your backend URL in the `.env` file:

```env
BACKEND_URL=https://your-backend-api.com/api
```

### Usage Example

```typescript
import { apiService } from '../lib/services/api.service';

// In a React component
const { data, error } = await apiService.getUsers();
```

## AI Development Support

This project is configured with AI development tools to enhance the development experience, providing guidelines for:

- Project structure
- Coding practices
- Frontend development
- Styling with Tailwind
- Accessibility best practices
- Astro and React guidelines

### Cursor IDE

The project includes AI rules in `.cursor/rules/` directory that help Cursor IDE understand the project structure and provide better code suggestions.

### GitHub Copilot

AI instructions for GitHub Copilot are available in `.github/copilot-instructions.md`

### Windsurf

The `.windsurfrules` file contains AI configuration for Windsurf.

## Contributing

Please follow the AI guidelines and coding practices defined in the AI configuration files when contributing to this project.

## License

MIT
