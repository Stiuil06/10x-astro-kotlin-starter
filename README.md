# 10x Project — Monorepo

Monorepo for a full‑stack app with a modern frontend (Astro + React + TypeScript) and a Kotlin + Spring Boot backend. API contracts live in /contracts and are the source of truth for both sides.

## Repository structure
```
/
├── frontend/          # Astro + React + TypeScript + Tailwind CSS
├── backend/           # Kotlin + Spring Boot (modular)
├── contracts/         # OpenAPI specification
├── docker-compose.yml # Docker for local stack
└── README.md          # This file
```

## Technologies
- Frontend: Astro 5, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui
- Backend: Kotlin 1.9.22, Spring Boot 3.5.6, Java 21, Gradle
- Contracts: OpenAPI 3.0

## Quick start
- Frontend (dev):
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- Backend (dev):
  ```bash
  cd backend/codebase
  ./gradlew :modules:deployment:bootRun --args='--spring.profiles.active=<profile>'
  ```
>  Available profiles: default, intellij, agent

- Docker:
  ```bash
  # Only frontend
  docker-compose up frontend
  # Whole stack (when backend is ready)
  docker-compose up
  ```

## API contracts
The /contracts directory contains the OpenAPI 3.0 spec used to generate types/classes on both sides. Treat it as the single source of truth.

## More details
- Frontend docs: ./frontend/README.md
- Backend docs: ./backend/README.md
