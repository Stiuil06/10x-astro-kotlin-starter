/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BACKEND_URL: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
