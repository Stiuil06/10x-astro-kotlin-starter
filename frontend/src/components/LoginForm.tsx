import { useState } from 'react';
import { DefaultApi } from '../lib/generated/apis';
import { Configuration } from '../lib/generated/runtime';
import type { LoginRequest, LoginResponse } from '../lib/generated/models';
import { decodeJwtRoles, decodeJwtUsername } from '../lib/utils/jwt';
import { type UserRole } from '../types';

interface LoginFormProps {
  onLoginSuccess: (token: string, user: string, roles: UserRole[]) => void;
  onLoginError: (error: string) => void;
}

export default function LoginForm({ onLoginSuccess, onLoginError }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiClient = new DefaultApi(new Configuration({
    basePath: 'http://localhost:8080'
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginRequest: LoginRequest = {
        username,
        password
      };

      const response = await apiClient.login({ loginRequest });
      
      // Dekoduj role z JWT tokena
      const roles = decodeJwtRoles(response.token);
      const decodedUsername = decodeJwtUsername(response.token) || username;
      
      // Przechowaj token i role w localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('username', decodedUsername);
      localStorage.setItem('userRoles', JSON.stringify(roles));
      localStorage.setItem('loginTime', new Date().toISOString());
      
      onLoginSuccess(response.token, decodedUsername, roles);
    } catch (err: any) {
      let errorMessage = 'Błąd podczas logowania';
      
      // Obsługa błędu 401 - nieprawidłowe dane logowania
      if (err?.status === 401 || err?.response?.status === 401) {
        errorMessage = 'Nieprawidłowa nazwa użytkownika lub hasło';
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Logowanie do systemu
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nazwa użytkownika
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wprowadź nazwę użytkownika"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Hasło
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wprowadź hasło"
            required
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Dostępne konta testowe:</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div><strong>mieszkaniec</strong> / mieszkaniec123</div>
          <div><strong>zarzad</strong> / zarzad123</div>
          <div><strong>administrator</strong> / admin123</div>
        </div>
      </div>
    </div>
  );
}
