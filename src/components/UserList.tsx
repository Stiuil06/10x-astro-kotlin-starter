import { useState, useEffect } from 'react';
import { apiService, type User } from '../lib/services/api.service';
import { handleApiError } from '../lib/utils/error-handler';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getUsers();
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setUsers(response.data);
        }
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      <h2 className="text-2xl font-bold text-gray-900">Lista użytkowników</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">Brak użytkowników do wyświetlenia</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-2">
                Utworzono: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

