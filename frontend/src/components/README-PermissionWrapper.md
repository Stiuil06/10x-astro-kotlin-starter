# PermissionWrapper - Komponent kontroli dostępu

`PermissionWrapper` to komponent React służący do kontroli dostępu na podstawie ról użytkowników w aplikacji.

## Podstawowe użycie

```tsx
import PermissionWrapper from './PermissionWrapper';
import { Role } from '../types';

// Sprawdź pojedynczą rolę
<PermissionWrapper requiredRole={Role.MIESZKANIEC}>
  <div>Tylko dla mieszkańców</div>
</PermissionWrapper>

// Sprawdź wiele ról (wystarczy jedna)
<PermissionWrapper requiredRoles={[Role.ZARZAD, Role.ADMINISTRATOR]}>
  <div>Dla zarządu lub administratora</div>
</PermissionWrapper>

// Sprawdź wiele ról (wymagane wszystkie)
<PermissionWrapper 
  requiredRoles={[Role.ZARZAD, Role.ADMINISTRATOR]} 
  requireAll={true}
>
  <div>Dla użytkowników z obiema rolami</div>
</PermissionWrapper>
```

## Komponenty pomocnicze

Dla często używanych kombinacji ról dostępne są gotowe komponenty:

```tsx
import { MieszkaniecOnly, ZarzadOnly, AdministratorOnly, ZarzadOrAdministrator } from './PermissionWrapper';

// Tylko dla mieszkańców
<MieszkaniecOnly>
  <div>Treść dla mieszkańców</div>
</MieszkaniecOnly>

// Tylko dla zarządu
<ZarzadOnly>
  <div>Treść dla zarządu</div>
</ZarzadOnly>

// Tylko dla administratorów
<AdministratorOnly>
  <div>Treść dla administratorów</div>
</AdministratorOnly>

// Dla zarządu lub administratora
<ZarzadOrAdministrator>
  <div>Treść dla zarządu lub administratora</div>
</ZarzadOrAdministrator>
```

## Własne komunikaty błędów

Możesz dostosować komunikat wyświetlany gdy użytkownik nie ma uprawnień:

```tsx
<PermissionWrapper 
  requiredRole={Role.MIESZKANIEC}
  fallback={
    <div className="text-red-600">
      Nie masz uprawnień do tej sekcji
    </div>
  }
>
  <div>Treść dla mieszkańców</div>
</PermissionWrapper>
```

## Opcje konfiguracji

- `requiredRole` - pojedyncza rola wymagana
- `requiredRoles` - tablica ról wymaganych
- `requireAll` - czy wymagać wszystkich ról (domyślnie false)
- `fallback` - element wyświetlany gdy brak uprawnień
- `requireAuth` - czy wymagać zalogowania (domyślnie true)

## Przykład użycia w nawigacji

```tsx
import { MieszkaniecOnly } from './PermissionWrapper';

<MieszkaniecOnly>
  <a href="/decisions">Log decyzji</a>
</MieszkaniecOnly>
```

## Dostępne role

- `Role.MIESZKANIEC` - Mieszkaniec
- `Role.ZARZAD` - Zarząd  
- `Role.ADMINISTRATOR` - Administrator
