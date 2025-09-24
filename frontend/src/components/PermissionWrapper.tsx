import { useAuth } from './AuthContext';
import { Role, type UserRole } from '../types';
import type { ReactNode } from 'react';

interface PermissionWrapperProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requireAll?: boolean; // Jeśli true, użytkownik musi mieć wszystkie role, jeśli false - wystarczy jedna
  fallback?: ReactNode; // Element wyświetlany gdy użytkownik nie ma uprawnień
  requireAuth?: boolean; // Czy wymagać zalogowania (domyślnie true)
}

export default function PermissionWrapper({
  children,
  requiredRole,
  requiredRoles,
  requireAll = false,
  fallback = null,
  requireAuth = true
}: PermissionWrapperProps) {
  const { isAuthenticated, hasRole, hasAnyRole } = useAuth();

  // Sprawdź czy użytkownik ma uprawnienia
  const checkPermissions = (): boolean => {
    // Jeśli wymagane jest zalogowanie, ale użytkownik nie jest zalogowany
    if (requireAuth && !isAuthenticated) {
      return false;
    }

    // Jeśli nie wymagane jest zalogowanie, ale użytkownik nie jest zalogowany
    if (!requireAuth && !isAuthenticated) {
      return true;
    }

    // Sprawdź pojedynczą rolę
    if (requiredRole) {
      return hasRole(requiredRole);
    }

    // Sprawdź wiele ról
    if (requiredRoles && requiredRoles.length > 0) {
      return requireAll 
        ? requiredRoles.every(role => hasRole(role))
        : hasAnyRole(requiredRoles);
    }

    // Jeśli nie określono ról, ale wymagane jest zalogowanie
    if (requireAuth) {
      return true;
    }

    // Domyślnie pokaż zawartość
    return true;
  };

  const hasPermissions = checkPermissions();

  // Jeśli użytkownik nie ma uprawnień, pokaż fallback
  if (!hasPermissions) {
    return <>{fallback}</>;
  }

  // Jeśli użytkownik ma uprawnienia, pokaż zawartość
  return <>{children}</>;
}

// Komponenty pomocnicze dla często używanych ról
export function MieszkaniecOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <PermissionWrapper 
      requiredRole={Role.MIESZKANIEC} 
      fallback={fallback}
    >
      {children}
    </PermissionWrapper>
  );
}

export function ZarzadOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <PermissionWrapper 
      requiredRole={Role.ZARZAD} 
      fallback={fallback}
    >
      {children}
    </PermissionWrapper>
  );
}

export function AdministratorOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <PermissionWrapper 
      requiredRole={Role.ADMINISTRATOR} 
      fallback={fallback}
    >
      {children}
    </PermissionWrapper>
  );
}

export function ZarzadOrAdministrator({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <PermissionWrapper 
      requiredRoles={[Role.ZARZAD, Role.ADMINISTRATOR]} 
      fallback={fallback}
    >
      {children}
    </PermissionWrapper>
  );
}
