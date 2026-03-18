/**
 * Chart Service - Requests für alle Chart-Endpoints
 */

import type { ChartType, ChartResponse, ColumnInfo, FileInfo } from "../types";
import { httpClient } from "./httpClient";

const CHART_API_BASE = "http://localhost:8080/api/charts";

function toBackendChartType(chartType: ChartType): "BAR" | "HISTOGRAM" | "HEATMAP" | "PIE" {
  return chartType.toUpperCase() as "BAR" | "HISTOGRAM" | "HEATMAP" | "PIE";
}

// ============ Helper Functions ============

async function parseChartResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
}

function getChartErrorMessage(responseData: unknown): string {
  if (typeof responseData === "string" && responseData) {
    return responseData;
  }

  if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
    return String((responseData as { message?: unknown }).message || "Chart-Fehler");
  }

  return "Chart konnte nicht generiert werden";
}

// ============ GET Requests ============

/**
 * Verfügbare Chart-Typen abrufen
 * GET /api/charts/types
 */
export async function getChartTypes(): Promise<ChartType[]> {
  const response = await httpClient(`${CHART_API_BASE}/types`, {
    method: "GET",
    timeout: 10000,
  });

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Chart-Typen");
  }

  const data = await parseChartResponse(response);
  return Array.isArray(data) ? data : [];
}

/**
 * Verfügbare Dateien abrufen
 * GET /api/charts/files
 */
export async function getAvailableFiles(): Promise<FileInfo[]> {
  const response = await httpClient(`${CHART_API_BASE}/files`, {
    method: "GET",
    timeout: 10000,
  });

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der Dateien");
  }

  const data = await parseChartResponse(response);
  return Array.isArray(data) ? data : [];
}

/**
 * Spalten einer Datei abrufen
 * GET /api/charts/columns?file=...
 */
export async function getFileColumns(fileName: string): Promise<ColumnInfo[]> {
  const params = new URLSearchParams({ file: fileName });
  const response = await httpClient(`${CHART_API_BASE}/columns?${params.toString()}`, {
    method: "GET",
    timeout: 10000,
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen der Spalten für ${fileName}`);
  }

  const data = await parseChartResponse(response);
  return Array.isArray(data) ? data : [];
}

// ============ POST Request ============

/**
 * Chart generieren (allgemein)
 * POST /api/charts/generate
 */
export async function generateChart(
  chartType: ChartType,
  column?: string,
): Promise<ChartResponse> {
  const payload = {
    chartType: toBackendChartType(chartType),
    ...(column && { column }),
  };

  const response = await httpClient(`${CHART_API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    timeout: 30000,
  });

  const responseData = await parseChartResponse(response);

  if (!response.ok) {
    throw new Error(getChartErrorMessage(responseData));
  }

  return responseData as ChartResponse;
}

// ============ Quick Chart APIs ============

/**
 * Balkendiagramm (Quick-API)
 * GET /api/charts/bar?file=...&column=...
 */
export async function getBarChart(file: string, column?: string): Promise<ChartResponse> {
  const params = new URLSearchParams({ file });
  if (column) params.append("column", column);

  const response = await httpClient(`${CHART_API_BASE}/bar?${params.toString()}`, {
    method: "GET",
    timeout: 30000,
  });

  const responseData = await parseChartResponse(response);

  if (!response.ok) {
    throw new Error(getChartErrorMessage(responseData));
  }

  return responseData as ChartResponse;
}

/**
 * Histogramm (Quick-API)
 * GET /api/charts/histogram?file=...
 */
export async function getHistogram(file: string): Promise<ChartResponse> {
  const params = new URLSearchParams({ file });

  const response = await httpClient(`${CHART_API_BASE}/histogram?${params.toString()}`, {
    method: "GET",
    timeout: 30000,
  });

  const responseData = await parseChartResponse(response);

  if (!response.ok) {
    throw new Error(getChartErrorMessage(responseData));
  }

  return responseData as ChartResponse;
}

/**
 * Heatmap (Quick-API)
 * GET /api/charts/heatmap?file=...
 */
export async function getHeatmap(file: string): Promise<ChartResponse> {
  const params = new URLSearchParams({ file });

  const response = await httpClient(`${CHART_API_BASE}/heatmap?${params.toString()}`, {
    method: "GET",
    timeout: 30000,
  });

  const responseData = await parseChartResponse(response);

  if (!response.ok) {
    throw new Error(getChartErrorMessage(responseData));
  }

  return responseData as ChartResponse;
}

/**
 * Tortendiagramm (Quick-API)
 * GET /api/charts/pie?file=...
 */
export async function getPieChart(file: string): Promise<ChartResponse> {
  const params = new URLSearchParams({ file });

  const response = await httpClient(`${CHART_API_BASE}/pie?${params.toString()}`, {
    method: "GET",
    timeout: 30000,
  });

  const responseData = await parseChartResponse(response);

  if (!response.ok) {
    throw new Error(getChartErrorMessage(responseData));
  }

  return responseData as ChartResponse;
}

/**
 * Chart via Type-spezifischer Quick-API generieren
 * Automatische Auswahl des richtigen Endpoints basierend auf Chart-Typ
 */
export async function generateChartByType(
  chartType: ChartType,
  column?: string,
): Promise<ChartResponse> {
  try {
    return await generateChart(chartType, column);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Fehler beim Generieren des Charts");
  }
}

