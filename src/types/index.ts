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

export interface RegisterFormData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

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

/**
 * CSV Upload Types
 */

export interface CsvUploadResult {
  fileName: string;
  rowCount: number;
  success: boolean;
}

