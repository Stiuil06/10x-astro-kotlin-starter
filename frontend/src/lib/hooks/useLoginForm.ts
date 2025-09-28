import { useState, useCallback } from "react";
import { useAuth } from "../../components/auth/AuthContext";
import type { LoginRequest } from "../generated";

/**
 * Stan formularza logowania
 */
interface LoginFormState {
  formData: LoginRequest;
  isLoading: boolean;
  error: string | null;
}

/**
 * Typy dla pól formularza logowania
 */
type LoginFormField = keyof LoginRequest;

/**
 * Custom hook do obsługi formularza logowania
 *
 * @param onSuccess - callback wywoływany po udanym logowaniu
 * @returns obiekt z stanem i metodami do zarządzania formularzem
 */
export function useLoginForm(onSuccess: () => void) {
  const { login } = useAuth();
  const [state, setState] = useState<LoginFormState>({
    formData: {
      username: "",
      password: "",
    },
    isLoading: false,
    error: null,
  });

  const updateField = useCallback((field: LoginFormField, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
      error: null, // Wyczyść błąd przy zmianie danych
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const submitForm = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      await login(state.formData.username, state.formData.password);
      onSuccess();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Wystąpił błąd podczas logowania. Sprawdź dane i spróbuj ponownie.";

      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [state.formData, login, onSuccess]);

  return {
    ...state,
    updateField,
    clearError,
    submitForm,
  };
}
