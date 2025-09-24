import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Role, type UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  roles: UserRole[];
  login: (token: string, username: string, roles: UserRole[]) => void;
  logout: () => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik jest już zalogowany przy ładowaniu strony
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedRoles = localStorage.getItem('userRoles');
    const loginTime = localStorage.getItem('loginTime');

    if (storedToken && storedUsername && storedRoles && loginTime) {
      // Sprawdź czy sesja nie wygasła (24 godziny)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setToken(storedToken);
        setUsername(storedUsername);
        setRoles(JSON.parse(storedRoles));
        setIsAuthenticated(true);
      } else {
        // Sesja wygasła, wyczyść localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('loginTime');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUsername: string, newRoles: UserRole[]) => {
    setToken(newToken);
    setUsername(newUsername);
    setRoles(newRoles);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Wylogowanie jest tylko lokalne - backend jest bezstanowy
    setToken(null);
    setUsername(null);
    setRoles([]);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('loginTime');
    
    // Przekieruj na stronę główną po wylogowaniu
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      username,
      roles,
      login,
      logout,
      isLoading,
      hasRole,
      hasAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
