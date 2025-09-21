import React, { useState, useEffect } from 'react';
import type { paths } from '../lib/api-types';

// Typy wygenerowane z OpenAPI spec
type HelloResponse = paths['/api/hello']['get']['responses']['200']['content']['application/json'];

interface HelloApiProps {
  className?: string;
}

export default function HelloApi({ className = '' }: HelloApiProps) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHelloMessage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hello');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: HelloResponse = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd');
      console.error('Błąd podczas pobierania wiadomości:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatycznie pobierz wiadomość przy montowaniu komponentu
    fetchHelloMessage();
  }, []);

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md border ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Hello API Component
      </h2>
      
      <div className="space-y-4">
        {loading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Ładowanie...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Błąd:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {message && !loading && !error && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Odpowiedź z API:</p>
            <p className="text-green-600">{message}</p>
          </div>
        )}
        
        <button
          onClick={fetchHelloMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Ładowanie...' : 'Odśwież wiadomość'}
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Ten komponent demonstruje integrację z przyszłym backendem.</p>
        <p>Endpoint: <code className="bg-gray-100 px-1 rounded">GET /api/hello</code></p>
        <p>Typy TypeScript są generowane z <code className="bg-gray-100 px-1 rounded">/contracts/openapi.yaml</code></p>
      </div>
    </div>
  );
}
