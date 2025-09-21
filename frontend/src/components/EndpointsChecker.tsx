import { useState } from "react";
import { apiService, ApiError } from "../lib/api-client";
import { useAuth } from "./auth";
import type { GetStatus200Response } from "../lib/generated/models";

interface EndpointResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

interface HealthCheck {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  result: EndpointResult | null;
  isLoading: boolean;
}

export function EndpointsChecker() {
  const { isAuthenticated, user } = useAuth();
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      id: "status",
      name: "Status Backendu",
      endpoint: "/_status",
      method: "GET",
      result: null,
      isLoading: false,
    },
    {
      id: "user",
      name: "Endpoint User",
      endpoint: "/user",
      method: "GET",
      result: null,
      isLoading: false,
    },
    {
      id: "moderator",
      name: "Endpoint Moderator",
      endpoint: "/moderator",
      method: "GET",
      result: null,
      isLoading: false,
    },
    {
      id: "administrator",
      name: "Endpoint Administrator",
      endpoint: "/administrator",
      method: "GET",
      result: null,
      isLoading: false,
    },
  ]);

  const handleEndpointCheck = async (checkId: string) => {
    setHealthChecks((prev) =>
      prev.map((check) => (check.id === checkId ? { ...check, isLoading: true, result: null } : check))
    );

    try {
      let data: any;
      
      switch (checkId) {
        case "status":
          const statusResponse = await apiService.getStatus();
          data = statusResponse.data;
          break;
        case "user":
          const userResponse = await apiService.getUserData();
          data = userResponse.data;
          break;
        case "moderator":
          const moderatorResponse = await apiService.getModeratorData();
          data = moderatorResponse.data;
          break;
        case "administrator":
          const adminResponse = await apiService.getAdministratorData();
          data = adminResponse.data;
          break;
        default:
          throw new Error("Nieznany endpoint");
      }

      setHealthChecks((prev) =>
        prev.map((hc) =>
          hc.id === checkId
            ? {
                ...hc,
                result: {
                  success: true,
                  data: data,
                  timestamp: new Date().toLocaleString("pl-PL"),
                },
                isLoading: false,
              }
            : hc
        )
      );
    } catch (error) {
      console.error(`Błąd testowania ${checkId}:`, error);
      setHealthChecks((prev) =>
        prev.map((hc) =>
          hc.id === checkId
            ? {
                ...hc,
                result: {
                  success: false,
                  error: error instanceof ApiError ? error.message : "Nieznany błąd",
                  timestamp: new Date().toLocaleString("pl-PL"),
                },
                isLoading: false,
              }
            : hc
        )
      );
    }
  };

  return (
    <div className="relative w-full mx-auto min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 sm:p-8">
      <div className="relative max-w-6xl mx-auto backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 rounded-2xl shadow-2xl p-8 text-white border border-white/10">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-transparent bg-clip-text drop-shadow-lg">
              Health Check Backendu
            </h1>
            <p className="text-xl text-blue-100/90 drop-shadow-md">
              Sprawdź status aplikacji backendowej poprzez różne endpointy
            </p>
            
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-blue-100">
                  Status: {isAuthenticated ? 'Zalogowany' : 'Nie zalogowany'}
                </span>
              </div>
              {user && (
                <div className="text-sm text-blue-100/70">
                  Użytkownik: {user.username} | Role: {user.roles.join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {healthChecks.map((check) => (
                <div
                  key={check.id}
                  className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                    {check.name}
                  </h3>

                  <div className="space-y-3">
                    {/* Przycisk */}
                    <button
                      onClick={() => handleEndpointCheck(check.id)}
                      disabled={check.isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:scale-100 text-sm"
                    >
                      {check.isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sprawdzanie...</span>
                        </div>
                      ) : (
                        `${check.method} ${check.endpoint.split("/").pop()}`
                      )}
                    </button>
                    
                    <p className="text-xs text-blue-100/70 text-center">Endpoint: {check.endpoint}</p>

                    {/* Wynik */}
                    <div className="min-h-[80px]">
                      {check.result ? (
                        <div
                          className={`p-3 rounded-lg border backdrop-blur-sm ${
                            check.result.success
                              ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/50"
                              : "bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-400/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-xs font-medium ${check.result.success ? "text-green-200" : "text-red-200"}`}
                            >
                              {check.result.success ? "✅ Sukces" : "❌ Błąd"}
                            </span>
                            <span className="text-xs text-gray-300">{check.result.timestamp}</span>
                          </div>
                          <pre
                            className={`font-mono text-xs overflow-auto max-h-20 ${check.result.success ? "text-green-200" : "text-red-200"}`}
                          >
                            {check.result.success
                              ? JSON.stringify(check.result.data, null, 2)
                              : JSON.stringify({ error: check.result.error }, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 border border-dashed border-gray-500/30 rounded-lg p-2">
                          <p className="text-center text-xs">
                            Kliknij przycisk powyżej,
                            <br />
                            aby sprawdzić endpoint
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-center text-blue-100/90 mt-8 leading-relaxed">
            Sprawdź różne endpointy backendu <br className="hidden sm:block" />
            <span className="font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
              i monitoruj ich status!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
