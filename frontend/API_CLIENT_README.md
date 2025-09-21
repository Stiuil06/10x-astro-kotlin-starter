# Klient API - Dokumentacja

## Przegląd

Kompletny klient API został zaimplementowany na podstawie kontraktu OpenAPI (`/contracts/openapi.yaml`). Klient obsługuje wszystkie endpointy z automatyczną obsługą autoryzacji JWT.

## Struktura

### Główne komponenty

1. **`/src/lib/api-client.ts`** - Główny klient API z klasą `ApiService`
2. **`/src/components/auth/AuthContext.tsx`** - Kontekst autoryzacji z zarządzaniem tokenem JWT
3. **`/src/components/auth/LoginForm.tsx`** - Formularz logowania
4. **`/src/components/ApiTester.tsx`** - Komponent do testowania endpointów
5. **`/src/components/EndpointsChecker.tsx`** - Komponent do sprawdzania statusu endpointów
6. **`/src/pages/api-test.astro`** - Strona do testowania API

## Endpointy API

### 1. POST /login
- **Opis**: Logowanie użytkownika
- **Autoryzacja**: Nie wymagana
- **Parametry**: `username`, `password`
- **Odpowiedź**: JWT token

```typescript
const response = await apiService.login({ username: "user", password: "user123" });
```

### 2. GET /_status
- **Opis**: Sprawdzenie statusu aplikacji
- **Autoryzacja**: Nie wymagana
- **Odpowiedź**: Status aplikacji z kodem, wiadomością i hashem commita

```typescript
const response = await apiService.getStatus();
```

### 3. GET /user
- **Opis**: Dane użytkownika
- **Autoryzacja**: Wymagana (Bearer token)
- **Odpowiedź**: Dane użytkownika

```typescript
const response = await apiService.getUserData();
```

### 4. GET /moderator
- **Opis**: Dane moderatora
- **Autoryzacja**: Wymagana (Bearer token)
- **Odpowiedź**: Dane moderatora

```typescript
const response = await apiService.getModeratorData();
```

### 5. GET /administrator
- **Opis**: Dane administratora
- **Autoryzacja**: Wymagana (Bearer token)
- **Odpowiedź**: Dane administratora

```typescript
const response = await apiService.getAdministratorData();
```

## Zarządzanie autoryzacją

### Kontekst autoryzacji

```typescript
import { useAuth } from './components/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();
  
  // Sprawdź czy użytkownik jest zalogowany
  if (isAuthenticated) {
    console.log('Użytkownik:', user?.username);
    console.log('Role:', user?.roles);
  }
}
```

### Logowanie

```typescript
try {
  await login('username', 'password');
  // Użytkownik został zalogowany
} catch (error) {
  console.error('Błąd logowania:', error);
}
```

### Wylogowanie

```typescript
logout(); // Usuwa token i wylogowuje użytkownika
```

## Obsługa błędów

### Klasa ApiError

```typescript
import { ApiError } from './lib/api-client';

try {
  const response = await apiService.getUserData();
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Błąd API:', error.message);
    console.error('Status HTTP:', error.status);
    console.error('Odpowiedź serwera:', error.response);
  }
}
```

### Typy błędów

- **401 Unauthorized** - Nieprawidłowy lub brakujący token
- **403 Forbidden** - Brak uprawnień do zasobu
- **404 Not Found** - Endpoint nie istnieje
- **500 Internal Server Error** - Błąd serwera

## Testowanie API

### Strona testowania

Odwiedź `/api-test` aby przetestować wszystkie endpointy:

1. **Test Status** - Sprawdza endpoint `/_status`
2. **Test User** - Sprawdza endpoint `/user` (wymaga logowania)
3. **Test Moderator** - Sprawdza endpoint `/moderator` (wymaga logowania)
4. **Test Administrator** - Sprawdza endpoint `/administrator` (wymaga logowania)

### Programowe testowanie

```typescript
import { apiService } from './lib/api-client';

// Test wszystkich endpointów
const testAllEndpoints = async () => {
  try {
    // Test status (nie wymaga autoryzacji)
    const status = await apiService.getStatus();
    console.log('Status:', status.data);
    
    // Test user (wymaga autoryzacji)
    const user = await apiService.getUserData();
    console.log('User data:', user.data);
    
  } catch (error) {
    console.error('Błąd testowania:', error);
  }
};
```

## Konfiguracja

### URL Backendu

Backend URL jest automatycznie wykrywany na podstawie środowiska:

- **Development**: `http://localhost:8080`
- **Production**: Automatycznie wykrywany na podstawie hosta

Można ustawić własny URL przez:
1. Meta tag: `<meta name="backend-url" content="http://custom-backend:8080">`
2. localStorage: `localStorage.setItem("BACKEND_URL", "http://custom-backend:8080")`

### Timeout i retry

```typescript
// W /src/lib/config.ts
export const config = {
  apiTimeout: 10000, // 10 sekund
  retryAttempts: 3,
};
```

## Przykłady użycia

### Pełny przykład komponentu

```typescript
import React, { useState, useEffect } from 'react';
import { apiService, ApiError } from '../lib/api-client';
import { useAuth } from '../components/auth';

function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserData();
      setUserData(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Nieznany błąd');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Zaloguj się aby zobaczyć dane</div>;
  }

  return (
    <div>
      <h1>Dashboard użytkownika: {user?.username}</h1>
      {loading && <p>Ładowanie...</p>}
      {error && <p style={{color: 'red'}}>Błąd: {error}</p>}
      {userData && <pre>{userData}</pre>}
    </div>
  );
}
```

## Bezpieczeństwo

- Tokeny JWT są przechowywane w `localStorage`
- Tokeny są automatycznie sprawdzane pod kątem ważności
- Wygasłe tokeny są automatycznie usuwane
- Wszystkie żądania wymagające autoryzacji automatycznie dołączają token Bearer

## Debugowanie

### Logi w konsoli

Klient API loguje wszystkie błędy do konsoli przeglądarki. Sprawdź konsolę deweloperską aby zobaczyć szczegóły błędów.

### Sprawdzanie tokenu

```typescript
// Sprawdź czy token jest ważny
const token = localStorage.getItem('authToken');
if (token) {
  console.log('Token:', token);
  // Dekoduj token (tylko do debugowania)
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
}
```

## Rozwój

### Dodawanie nowych endpointów

1. Zaktualizuj kontrakt OpenAPI w `/contracts/openapi.yaml`
2. Wygeneruj nowe typy: `npm run generate:api`
3. Dodaj metodę do klasy `ApiService` w `/src/lib/api-client.ts`
4. Zaktualizuj komponenty testujące

### Przykład dodawania nowego endpointu

```typescript
// W ApiService
async getNewEndpoint(): Promise<ApiResponse<NewResponseType>> {
  try {
    const response = await this.client.getNewEndpoint();
    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
```
