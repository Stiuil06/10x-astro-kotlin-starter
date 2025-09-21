import {
  DefaultApi,
  Configuration,
  type LoginRequest,
  type LoginResponse,
  type GetStatus200Response,
} from "./generated";
import { config } from "./config";

// Bazowa konfiguracja API client
const baseConfig = {
  basePath: config.backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
};

// Funkcja do tworzenia API client z opcjonalnym tokenem
export const createApiClient = (accessToken?: string) => {
  const apiConfig = new Configuration({
    ...baseConfig,
    accessToken,
  });
  return new DefaultApi(apiConfig);
};

// Domyślna instancja API client (bez tokena)
let apiClient = createApiClient();

// Funkcja pomocnicza do ustawiania tokena autoryzacji
export const setAuthToken = (token: string) => {
  apiClient = createApiClient(token);
  return apiClient;
};

// Funkcja pomocnicza do usuwania tokena autoryzacji
export const clearAuthToken = () => {
  apiClient = createApiClient();
  return apiClient;
};

// Typy dla odpowiedzi API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Klasa do obsługi błędów API
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Funkcja pomocnicza do obsługi błędów API
const handleApiError = (error: unknown): never => {
  if (error && typeof error === "object" && "response" in error) {
    // Serwer odpowiedział z kodem błędu
    const responseError = error as { response: { status: number; data?: { error?: string } }; message?: string };
    const status = responseError.response.status;
    const message = responseError.response.data?.error || responseError.message || "Błąd serwera";
    throw new ApiError(message, status, responseError.response.data);
  } else if (error && typeof error === "object" && "request" in error) {
    // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi
    throw new ApiError("Brak połączenia z serwerem", 0);
  } else {
    // Coś innego się stało
    const errorMessage = error instanceof Error ? error.message : "Nieznany błąd";
    throw new ApiError(errorMessage, 0);
  }
};

// API Service z wszystkimi endpointami
export class ApiService {
  private client: DefaultApi;

  constructor(token?: string) {
    this.client = createApiClient(token);
  }

  // Endpoint: POST /login
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.client.login({ loginRequest: credentials });
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Endpoint: GET /_status
  async getStatus(): Promise<ApiResponse<GetStatus200Response>> {
    try {
      const response = await this.client.getStatus();
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Endpoint: GET /user (wymaga autoryzacji)
  async getUserData(): Promise<ApiResponse<string>> {
    try {
      const response = await this.client.getUserData();
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Endpoint: GET /moderator (wymaga autoryzacji)
  async getModeratorData(): Promise<ApiResponse<string>> {
    try {
      const response = await this.client.getModeratorData();
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Endpoint: GET /administrator (wymaga autoryzacji)
  async getAdministratorData(): Promise<ApiResponse<string>> {
    try {
      const response = await this.client.getAdministratorData();
      return {
        data: response,
        success: true,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  // Metoda do aktualizacji tokena
  updateToken(token: string) {
    this.client = createApiClient(token);
  }

  // Metoda do usunięcia tokena
  clearToken() {
    this.client = createApiClient();
  }
}

// Eksport domyślnej instancji API Service
export const apiService = new ApiService();

export default apiClient;
