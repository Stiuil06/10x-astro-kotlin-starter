// Przykład użycia wygenerowanego API client
import { createApiClient, type LoginRequest, type LoginResponse } from "./api-types";

// Przykład logowania użytkownika
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const apiClient = createApiClient();

  const loginRequest: LoginRequest = {
    username,
    password,
  };

  try {
    const response = await apiClient.login({ loginRequest });
    return response;
  } catch (error) {
    console.error("Błąd logowania:", error);
    throw error;
  }
};

// Przykład pobierania danych użytkownika z tokenem
export const getUserData = async (token: string): Promise<string> => {
  const apiClient = createApiClient(token);

  try {
    const response = await apiClient.getUserData();
    return response;
  } catch (error) {
    console.error("Błąd pobierania danych użytkownika:", error);
    throw error;
  }
};

// Przykład pobierania danych moderatora
export const getModeratorData = async (token: string): Promise<string> => {
  const apiClient = createApiClient(token);

  try {
    const response = await apiClient.getModeratorData();
    return response;
  } catch (error) {
    console.error("Błąd pobierania danych moderatora:", error);
    throw error;
  }
};

// Przykład pobierania danych administratora
export const getAdministratorData = async (token: string): Promise<string> => {
  const apiClient = createApiClient(token);

  try {
    const response = await apiClient.getAdministratorData();
    return response;
  } catch (error) {
    console.error("Błąd pobierania danych administratora:", error);
    throw error;
  }
};

// Przykład sprawdzania statusu aplikacji
export const getStatus = async () => {
  const apiClient = createApiClient();

  try {
    const response = await apiClient.getStatus();
    return response;
  } catch (error) {
    console.error("Błąd sprawdzania statusu:", error);
    throw error;
  }
};
