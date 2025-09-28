import { memo, useCallback } from "react";
import { Button } from "../ui";
import { useLoginForm } from "../../lib/hooks";

/**
 * Props dla komponentu LoginForm
 */
interface LoginFormProps {
  /** Callback wywoływany po zamknięciu formularza */
  onClose: () => void;
  /** Czy formularz jest wyświetlany na urządzeniu mobilnym */
  isMobile?: boolean;
}

/**
 * Komponent formularza logowania z walidacją i obsługą błędów
 *
 * @param onClose - callback wywoływany po zamknięciu formularza
 * @param isMobile - czy formularz jest wyświetlany na urządzeniu mobilnym
 */
export const LoginForm = memo(function LoginForm({ onClose, isMobile = false }: LoginFormProps) {
  const { formData, isLoading, error, updateField, submitForm } = useLoginForm(onClose);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof typeof formData, value);
    },
    [updateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submitForm();
    },
    [submitForm]
  );

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ${
        isMobile ? "mx-auto max-w-sm max-h-[90vh] overflow-y-auto" : "absolute top-full right-0 mt-2 w-96 min-w-80 z-50"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="p-4 sm:p-6">
        <LoginFormHeader onClose={onClose} />
        <LoginFormFields
          formData={formData}
          isLoading={isLoading}
          error={error}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
        <TestAccountsInfo />
      </div>
    </div>
  );
});

/**
 * Komponent nagłówka formularza logowania
 */
interface LoginFormHeaderProps {
  onClose: () => void;
}

const LoginFormHeader = memo(function LoginFormHeader({ onClose }: LoginFormHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 id="login-title" className="text-lg font-semibold text-gray-900 dark:text-white">
        Zaloguj się
      </h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Zamknij formularz"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

/**
 * Komponent pól formularza logowania
 */
interface LoginFormFieldsProps {
  formData: { username: string; password: string };
  isLoading: boolean;
  error: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const LoginFormFields = memo(function LoginFormFields({
  formData,
  isLoading,
  error,
  onInputChange,
  onSubmit,
  onClose,
}: LoginFormFieldsProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <UsernameField value={formData.username} onChange={onInputChange} />
        <PasswordField value={formData.password} onChange={onInputChange} />
        <ErrorMessage error={error} />
        <FormButtons isLoading={isLoading} onClose={onClose} />
      </form>
    </>
  );
});

/**
 * Komponent pola nazwy użytkownika
 */
interface UsernameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsernameField = memo(function UsernameField({ value, onChange }: UsernameFieldProps) {
  return (
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nazwa użytkownika
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        placeholder="Wprowadź nazwę użytkownika"
      />
    </div>
  );
});

/**
 * Komponent pola hasła
 */
interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = memo(function PasswordField({ value, onChange }: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Hasło
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        placeholder="Wprowadź hasło"
      />
    </div>
  );
});

/**
 * Komponent wyświetlania błędów
 */
interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage = memo(function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    </div>
  );
});

/**
 * Komponent przycisków formularza
 */
interface FormButtonsProps {
  isLoading: boolean;
  onClose: () => void;
}

const FormButtons = memo(function FormButtons({ isLoading, onClose }: FormButtonsProps) {
  return (
    <div className="flex space-x-3">
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
      <Button type="button" variant="outline" onClick={onClose} className="flex-1">
        Anuluj
      </Button>
    </div>
  );
});

/**
 * Komponent informacji o kontach testowych
 */
const TestAccountsInfo = memo(function TestAccountsInfo() {
  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg">
      <h4 className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 sm:mb-3">
        Konta testowe:
      </h4>
      <div className="space-y-1 sm:space-y-2 text-xs text-purple-700 dark:text-purple-300">
        <div className="flex justify-between items-center">
          <span className="font-medium flex-shrink-0">user</span>
          <span className="text-right ml-2">user123</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium flex-shrink-0">moderator</span>
          <span className="text-right ml-2">moderator123</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium flex-shrink-0">administrator</span>
          <span className="text-right ml-2">admin123</span>
        </div>
      </div>
    </div>
  );
});
