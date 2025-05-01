/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTES_API_URL: string
  readonly VITE_QUOTES_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 