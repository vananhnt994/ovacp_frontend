/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ANALYSIS_API_URL?: string;
  readonly VITE_CHART_API_URL?: string;
  readonly VITE_FILE_API_URL?: string;
  readonly VITE_USER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

