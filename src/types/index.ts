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

export type ChartType = "bar" | "histogram" | "heatmap" | "pie";
export type ChartSelectionType = ChartType | "none";

export interface ChartRequest {
  file?: string;
  column?: string;
  type?: ChartType;
}

export interface ChartGenerateRequest {
  chartType: ChartType;
  file: string;
  column?: string;
}

export interface ChartResponse {
  chartType: ChartType;
  data: unknown;
  labels?: string[];
  title?: string;
  [key: string]: unknown;
}

/**
 * File & Column Types for Charts
 */

export interface FileInfo {
  name: string;
  size?: number;
}

export interface ColumnInfo {
  name: string;
  type?: string;
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

export interface AnalysisChartData {
  labels?: string[];
  values?: number[];
  binLabels?: string[];
  frequencies?: number[];
}

export interface AnalysisChartOption {
  id: string;
  chartType: "BAR" | "HISTOGRAM" | "HEATMAP" | "PIE";
  title: string;
  reason?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: AnalysisChartData;
}

export interface ParsedAnalysisResult {
  analysisText: string;
  chartOptions: AnalysisChartOption[];
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
