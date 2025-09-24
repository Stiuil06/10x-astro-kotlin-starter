import { useState, useEffect } from 'react';
import { DefaultApi } from '../lib/generated/apis';
import { Configuration } from '../lib/generated/runtime';
import { useAuth } from './AuthContext';

interface User {
  id: string;
  username: string;
  roles: string[];
}

export default function UserList() {
  const { isAuthenticated, token, username } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiClient] = useState(() => {
    const config = new Configuration({
      basePath: 'http://localhost:8080',
      accessToken: token || undefined
    });
    return new DefaultApi(config);
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Przykładowi użytkownicy systemu
        const mockUsers: User[] = [
          { id: '1', username: 'mieszkaniec', roles: ['MIESZKANIEC'] },
          { id: '2', username: 'zarzad', roles: ['MIESZKANIEC', 'ZARZAD'] },
          { id: '3', username: 'administrator', roles: ['MIESZKANIEC', 'ZARZAD', 'ADMINISTRATOR'] }
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania danych');
        console.error('Błąd podczas pobierania użytkowników:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, apiClient]);

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800 text-center">
          Zaloguj się, aby zobaczyć listę użytkowników
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Ładowanie użytkowników...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Błąd podczas ładowania danych
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Lista użytkowników systemu</h2>
      <p className="text-sm text-gray-600">
        Zalogowany jako: <strong>{username}</strong> | 
        Demonstracja nowych endpointów z autoryzacją JWT
      </p>
      {users.length === 0 ? (
        <p className="text-gray-500">Brak użytkowników do wyświetlenia</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">{user.username}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Role:</p>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

