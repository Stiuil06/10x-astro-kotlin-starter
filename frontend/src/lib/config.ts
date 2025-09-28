// Konfiguracja aplikacji
export const config = {
  // URL backendu - można ustawić przez zmienną środowiskową
  backendUrl: (() => {
    // W Astro zmienne środowiskowe są dostępne przez import.meta.env
    // ale tylko w plikach .astro lub w czasie build
    if (typeof window !== "undefined") {
      // W przeglądarce sprawdź czy jest ustawiona zmienna w localStorage lub w meta tag
      const metaTag = document.querySelector('meta[name="backend-url"]');
      if (metaTag) {
        return metaTag.getAttribute("content") || "http://localhost:8080";
      }

      // Sprawdź localStorage
      const storedUrl = localStorage.getItem("BACKEND_URL");
      if (storedUrl) {
        return storedUrl;
      }

      // W development użyj localhost
      const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isDevelopment) {
        return "http://localhost:8080";
      }

      // W production użyj tego samego hosta co frontend
      return `${window.location.protocol}//${window.location.hostname}:8080`;
    }

    // Fallback dla środowiska Node.js (SSR)
    if (typeof process !== "undefined" && process.env) {
      return process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || "http://localhost:8080";
    }

    // Domyślny URL
    return "http://localhost:8080";
  })(),

  // Inne konfiguracje
  apiTimeout: 10000, // 10 sekund
  retryAttempts: 3,
} as const;

export default config;
