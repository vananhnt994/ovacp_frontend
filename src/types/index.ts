/**
 * Chart Types
 */

export interface ChartDataPoint {
  monat: string;
  [key: string]: string | number;
}

export interface ChartDisplayProps {
  query?: string;
}

/**
 * Auth Types
 */

export interface User {
  id?: string;
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
}

export interface RegisterFormData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export type AuthResponse = Record<string, unknown> | string | null;

/**
 * Query Types
 */

export interface QueryInputProps {
  onSubmit: (query: string) => void;
}

/**
 * Analysis Types
 */

export interface AnalysisResult {
  query: string;
  analysis: string;
  timestamp?: Date;
}

export interface AnalysisRequest {
  query: string;
  frage?: string;
  fileNames?: string[];
  dateien?: string[];
  model?: string;
  modell?: string;
  maxRows?: number;
}

export type AnalysisApiResponse = Record<string, unknown> | string | null;

/**
 * CSV Upload Types
 */

export type CsvUploadResponse = Record<string, unknown> | string | null;

export interface CsvUploadResult {
  fileName: string;
  rowCount: number;
  success: boolean;
}

