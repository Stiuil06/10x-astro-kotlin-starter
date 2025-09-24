import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function UserProfile() {
  const { username, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Witaj, {username}!
      </h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            ✅ Jesteś zalogowany do systemu
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => {
              setIsLoggingOut(true);
              logout();
              // Resetuj stan po krótkim opóźnieniu dla UX
              setTimeout(() => setIsLoggingOut(false), 500);
            }}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingOut ? 'Wylogowywanie...' : 'Wyloguj się'}
          </button>
        </div>
      </div>
    </div>
  );
}
