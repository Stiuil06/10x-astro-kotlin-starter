# Migracja z Supabase do Universal Backend API

Ten template został przerobiony z Supabase na uniwersalny klient API, który może łączyć się z dowolnym backendem.

## Główne zmiany

### 1. Konfiguracja Astro
- Zmieniono `output: "server"` na `output: "static"` dla generowania statycznych plików
- Usunięto adapter Node.js (`@astrojs/node`)
- Usunięto middleware związany z Supabase

### 2. Nowe pliki API
- `src/lib/api-client.ts` - Uniwersalny klient HTTP
- `src/lib/services/api.service.ts` - Warstwa serwisów z typowanymi metodami
- `src/lib/utils/error-handler.ts` - Obsługa błędów
- `src/types.ts` - Wspólne typy TypeScript

### 3. Konfiguracja środowiska
- Zastąpiono `SUPABASE_URL` i `SUPABASE_KEY` na `BACKEND_URL`
- Utworzono `src/env.example` z przykładową konfiguracją

### 4. Usunięte zależności
- `@astrojs/node` - niepotrzebne dla statycznych plików
- Wszystkie zależności związane z Supabase

## Jak używać

### 1. Skonfiguruj backend URL
```bash
cp src/env.example .env
# Edytuj .env i ustaw BACKEND_URL
```

### 2. Użyj API clienta w komponentach React
```tsx
import { apiService } from '../lib/services/api.service';

// W komponencie React
const { data, error } = await apiService.getUsers();
```

### 3. Dodaj nowe endpointy
Edytuj `src/lib/services/api.service.ts` i dodaj nowe metody dla swoich endpointów.

### 4. Zdefiniuj typy
Dodaj nowe interfejsy do `src/types.ts` dla swoich danych.

## Przykład użycia

Sprawdź `src/components/UserList.tsx` dla pełnego przykładu użycia API clienta w komponencie React.

## Budowanie

```bash
npm run build
```

To wygeneruje statyczne pliki HTML, CSS i JS w katalogu `dist/`, które możesz wdrożyć na dowolny hosting statyczny.

