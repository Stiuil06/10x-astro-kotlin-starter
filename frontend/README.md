# Okrzei 41B — Frontend

Frontend for a housing community (condominium) application. Built with Astro 5 + React 19 + TypeScript 5 + Tailwind CSS 4 and shadcn/ui.

## Technologies

- **Astro 5** — Meta‑framework
- **React 19** — UI library
- **TypeScript 5** — Static type system
- **Tailwind CSS 4** — CSS framework
- **shadcn/ui** — UI components

## Running the application

### Development environment

The frontend app will always start on port 3000 in development.

```bash
cd frontend
npm install
npm run dev
```

The app will be available at: `http://localhost:3000`

Important: If port 3000 is already in use, the app will not fall back to 3001 — it will fail with an error. This keeps the development environment consistent.

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
2. Generates TypeScript types into `src/lib/api-types.ts`
3. Enables type‑safe API calls

## Project structure

```
frontend/
├── src/
│   ├── components/       # React and Astro components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...
│   ├── layouts/          # Astro layouts
│   ├── pages/            # Astro pages
│   ├── lib/              # Services and helpers
│   │   ├── api-types.ts  # Generated API types
│   │   └── generated/    # Generated API files
│   └── styles/           # CSS styles
├── public/               # Public assets
├── astro.config.mjs      # Astro configuration
└── package.json          # Dependencies and scripts
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

The `strictPort: true` setting ensures that if port 3000 is taken, the app will not start on another port (e.g., 3001) and will instead show an error.

## API integration

The app uses generated TypeScript types for type‑safe API calls:

```typescript
import type { paths } from '../lib/api-types';

type HelloResponse = paths['/api/hello']['get']['responses']['200']['content']['application/json'];

const response = await fetch('/api/hello');
const data: HelloResponse = await response.json();
```

## Development workflow

1. Define the API in `/contracts/openapi.yaml`
2. Generate frontend types: `cd frontend && npm run generate:api`
3. Use the generated types in React components
4. Implement the endpoint in the backend using the generated classes
