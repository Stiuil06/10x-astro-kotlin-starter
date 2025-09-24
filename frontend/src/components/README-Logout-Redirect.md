# Przekierowanie po wylogowaniu

## Problem
Po wylogowaniu użytkownik nadal miał dostęp do strony `/decisions` jeśli był na niej w momencie wylogowania.

## Rozwiązanie

### 1. Przekierowanie w AuthContext
Dodano automatyczne przekierowanie na stronę główną po wylogowaniu:

```tsx
const logout = () => {
  // ... czyszczenie stanu i localStorage ...
  
  // Przekieruj na stronę główną po wylogowaniu
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};
```

### 2. Dodatkowa ochrona w DecisionsLog
Dodano sprawdzenie uprawnień w komponencie DecisionsLog:

```tsx
// Sprawdź uprawnienia - jeśli użytkownik nie ma roli MIESZKANIEC, przekieruj na stronę główną
useEffect(() => {
  if (isAuthenticated && !hasRole(Role.MIESZKANIEC)) {
    window.location.href = '/';
  }
}, [isAuthenticated, hasRole]);

// Jeśli użytkownik nie ma uprawnień, nie renderuj komponentu
if (isAuthenticated && !hasRole(Role.MIESZKANIEC)) {
  return null;
}
```

## Rezultat
- Po wylogowaniu użytkownik jest automatycznie przekierowywany na stronę główną
- Nawet jeśli użytkownik bezpośrednio wejdzie na URL `/decisions` bez uprawnień, zostanie przekierowany
- Podwójna ochrona: na poziomie nawigacji (PermissionWrapper) i na poziomie komponentu (DecisionsLog)
