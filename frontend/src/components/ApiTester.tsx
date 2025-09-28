import { useState } from "react";
import { Button } from "./ui";
import { apiService, ApiError } from "../lib/api-client";
import { useAuth } from "./auth";

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

export function ApiTester() {
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: ApiTestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testEndpoint = async (endpoint: string, testFunction: () => Promise<any>) => {
    try {
      const data = await testFunction();
      addResult({
        endpoint,
        success: true,
        data,
      });
    } catch (error) {
      console.error(`Błąd testowania ${endpoint}:`, error);
      addResult({
        endpoint,
        success: false,
        error: error instanceof ApiError ? error.message : "Nieznany błąd",
        status: error instanceof ApiError ? error.status : undefined,
      });
    }
  };

  const testAllEndpoints = async () => {
    setIsLoading(true);
    clearResults();

    // Test status endpoint (nie wymaga autoryzacji)
    await testEndpoint("GET /_status", () => apiService.getStatus());

    if (isAuthenticated) {
      // Test user endpoint
      await testEndpoint("GET /user", () => apiService.getUserData());

      // Test moderator endpoint
      await testEndpoint("GET /moderator", () => apiService.getModeratorData());

      // Test administrator endpoint
      await testEndpoint("GET /administrator", () => apiService.getAdministratorData());
    }

    setIsLoading(false);
  };

  const testSingleEndpoint = async (endpoint: string) => {
    setIsLoading(true);

    switch (endpoint) {
      case "status":
        await testEndpoint("GET /_status", () => apiService.getStatus());
        break;
      case "user":
        await testEndpoint("GET /user", () => apiService.getUserData());
        break;
      case "moderator":
        await testEndpoint("GET /moderator", () => apiService.getModeratorData());
        break;
      case "administrator":
        await testEndpoint("GET /administrator", () => apiService.getAdministratorData());
        break;
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tester API Endpointów</h2>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isAuthenticated ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status: {isAuthenticated ? "Zalogowany" : "Nie zalogowany"}
                </span>
              </div>
              {user && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Użytkownik: {user.username} | Role: {user.roles.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Button
              onClick={testAllEndpoints}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isLoading ? "Testowanie..." : "Testuj wszystkie"}
            </Button>

            <Button onClick={() => testSingleEndpoint("status")} disabled={isLoading} variant="outline">
              Test Status
            </Button>

            <Button
              onClick={() => testSingleEndpoint("user")}
              disabled={isLoading || !isAuthenticated}
              variant="outline"
            >
              Test User
            </Button>

            <Button
              onClick={() => testSingleEndpoint("moderator")}
              disabled={isLoading || !isAuthenticated}
              variant="outline"
            >
              Test Moderator
            </Button>

            <Button
              onClick={() => testSingleEndpoint("administrator")}
              disabled={isLoading || !isAuthenticated}
              variant="outline"
            >
              Test Administrator
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wyniki testów ({results.length})</h3>
            <Button onClick={clearResults} variant="outline" size="sm" disabled={results.length === 0}>
              Wyczyść wyniki
            </Button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Brak wyników testów. Kliknij przycisk aby rozpocząć testowanie.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{result.endpoint}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${result.success ? "bg-green-500" : "bg-red-500"}`}></div>
                      <span className="text-sm font-medium">{result.success ? "Sukces" : "Błąd"}</span>
                    </div>
                  </div>

                  {result.success ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      <p className="font-medium">Błąd: {result.error}</p>
                      {result.status && <p className="text-xs">Status HTTP: {result.status}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
