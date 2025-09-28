import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiService, ApiError } from "../../lib/api-client";

// Typy dla danych użytkownika
export interface User {
  username: string;
  roles: string[];
  exp: number; // timestamp wygaśnięcia tokenu
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Funkcja do dekodowania JWT tokenu
function decodeJWT(token: string): User | null {
  try {
    // JWT składa się z trzech części oddzielonych kropkami: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Dekodujemy payload (druga część)
    const payload = parts[1];
    // Dodajemy padding jeśli potrzeba
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);
    const parsedPayload = JSON.parse(decodedPayload);

    return {
      username: parsedPayload.sub || parsedPayload.username || "Unknown",
      roles: parsedPayload.roles || parsedPayload.authorities || [],
      exp: parsedPayload.exp || 0,
    };
  } catch (error) {
    console.error("Błąd dekodowania JWT:", error);
    return null;
  }
}

// Funkcja sprawdzająca czy token jest ważny
function isTokenValid(user: User | null): boolean {
  if (!user) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return user.exp > currentTime;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sprawdź czy użytkownik jest zalogowany przy inicjalizacji
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedUser = decodeJWT(token);
          if (decodedUser && isTokenValid(decodedUser)) {
            setUser(decodedUser);
            // Ustaw token w API service
            apiService.updateToken(token);
          } else {
            // Token jest nieprawidłowy lub wygasł
            localStorage.removeItem("authToken");
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error("Błąd inicjalizacji uwierzytelnienia:", error);
        localStorage.removeItem("authToken");
        apiService.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.login({ username, password });

      if (response.success && response.data.token) {
        const token = response.data.token;
        const decodedUser = decodeJWT(token);

        if (decodedUser && isTokenValid(decodedUser)) {
          setUser(decodedUser);
          localStorage.setItem("authToken", token);
          apiService.updateToken(token);
        } else {
          throw new Error("Nieprawidłowy token otrzymany z serwera");
        }
      } else {
        throw new Error("Błąd logowania - brak tokena w odpowiedzi");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Wystąpił błąd podczas logowania");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("authToken");
    apiService.clearToken();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musi być używany wewnątrz AuthProvider");
  }
  return context;
}
