# 10x Project - Monorepo

To jest monorepo zawierające frontend (Astro + React + TypeScript) i przyszły backend (Kotlin + Spring Boot).

## Struktura repozytorium

```
/
├── frontend/          # Frontend aplikacji (Astro + React + TypeScript)
├── backend/           # Backend aplikacji (Kotlin + Spring Boot) - puste na razie
├── contracts/         # Specyfikacje API (OpenAPI)
├── docker-compose.yml # Konfiguracja Docker dla całego środowiska
└── README.md         # Ten plik
```

## Frontend

### Technologie
- **Astro 5** - Framework meta-framework
- **React 19** - Biblioteka UI
- **TypeScript 5** - Typowanie statyczne
- **Tailwind CSS 4** - Framework CSS
- **Shadcn/ui** - Komponenty UI

### Uruchamianie frontend

#### Lokalnie
```bash
cd frontend
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:4321`

#### Z Docker
```bash
# Uruchom tylko frontend
docker-compose up frontend

# Lub uruchom wszystko (gdy backend będzie gotowy)
docker-compose up
```

### Generowanie typów API

Typy TypeScript są automatycznie generowane z specyfikacji OpenAPI:

```bash
cd frontend
npm run generate:api
```

To polecenie:
1. Czyta specyfikację z `../contracts/openapi.yaml`
2. Generuje typy TypeScript w `src/lib/api-types.ts`
3. Umożliwia type-safe wywołania API

### Struktura frontend

```
frontend/
├── src/
│   ├── components/     # Komponenty React i Astro
│   │   ├── ui/        # Komponenty Shadcn/ui
│   │   ├── HelloApi.tsx # Przykład integracji z API
│   │   └── ...
│   ├── layouts/       # Layouty Astro
│   ├── pages/         # Strony Astro
│   ├── lib/           # Serwisy i helpery
│   │   └── api-types.ts # Wygenerowane typy API
│   └── styles/        # Style CSS
├── public/            # Zasoby publiczne
└── package.json       # Zależności i skrypty
```

## Backend

Folder `/backend` jest obecnie pusty. W przyszłości będzie zawierał:
- Aplikację Kotlin + Spring Boot
- Implementację endpointów z `/contracts/openapi.yaml`
- Konfigurację bazy danych
- Testy jednostkowe i integracyjne

## Kontrakty API

Folder `/contracts` zawiera specyfikacje API w formacie OpenAPI 3.0:

- `openapi.yaml` - Główna specyfikacja API
- Definiuje wszystkie endpointy, schematy danych i odpowiedzi
- Jest źródłem prawdy dla typów TypeScript w frontend
- Backend musi implementować wszystkie zdefiniowane endpointy

### Przykład użycia

1. Zdefiniuj endpoint w `/contracts/openapi.yaml`
2. Wygeneruj typy: `cd frontend && npm run generate:api`
3. Użyj typów w komponentach React:

```typescript
import type { paths } from '../lib/api-types';

type HelloResponse = paths['/api/hello']['get']['responses']['200']['content']['application/json'];

const response = await fetch('/api/hello');
const data: HelloResponse = await response.json();
```

## Rozwój

### Workflow
1. Zdefiniuj API w `/contracts/openapi.yaml`
2. Wygeneruj typy frontend: `npm run generate:api`
3. Zaimplementuj endpoint w backend
4. Zintegruj z frontend używając wygenerowanych typów

### Docker

```bash
# Uruchom tylko frontend
docker-compose up frontend

# Uruchom wszystko (gdy backend będzie gotowy)
docker-compose up

# Uruchom w tle
docker-compose up -d
```

## Konfiguracja Cursor

Repozytorium zawiera plik `.cursor/rules` z regułami dla Cursor AI:
- Traktuj `/frontend` jako projekt Astro + React + TypeScript
- Nie modyfikuj `/backend` (pusty na razie)
- Używaj `/contracts` jako źródła prawdy dla API
- Zawsze generuj typy z OpenAPI spec przed modyfikacją wywołań API

## Wkrótce

- [ ] Implementacja backend w Kotlin + Spring Boot
- [ ] Konfiguracja bazy danych
- [ ] Testy end-to-end
- [ ] CI/CD pipeline
- [ ] Monitoring i logowanie