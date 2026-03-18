import type { AnalysisApiResponse, AnalysisRequest } from "../types";
import { httpClient } from "./httpClient";

const ANALYSIS_START_ENDPOINT = "http://localhost:8080/api/analysis";
const ANALYSIS_RESULT_ENDPOINT = "http://localhost:8080/api/analysis/result";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 300;

async function parseAnalysisResponse(response: Response): Promise<AnalysisApiResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
}

async function parseAnalysisStartResponse(response: Response): Promise<{ jobId: string } | null> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    if (typeof data === "object" && data !== null && "jobId" in data) {
      return data as { jobId: string };
    }

    return data;
  }

  return null;
}

function getErrorMessage(responseData: AnalysisApiResponse): string {
  if (typeof responseData === "string" && responseData) {
    return responseData;
  }

  if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
    return String((responseData as { message?: unknown }).message || "Analyse fehlgeschlagen");
  }

  return "Analyse fehlgeschlagen";
}

function getAnalysisText(responseData: AnalysisApiResponse): string {
  console.log("[Analysis Service] Response Data:", responseData);

  if (typeof responseData === "string" && responseData.trim()) {
    console.log("[Analysis Service] Gefundene Textantwort (direkter String)");
    return responseData;
  }

  if (typeof responseData === "object" && responseData !== null) {
    const obj = responseData as Record<string, unknown>;
    const keys = Object.keys(obj);
    console.log("[Analysis Service] Response-Objekt mit Keys:", keys);

    if ("analysis" in responseData && typeof responseData.analysis === "string" && responseData.analysis.trim()) {
      console.log("[Analysis Service] Gefunden: analysis");
      return responseData.analysis;
    }

    if ("data" in responseData && typeof responseData.data === "string" && responseData.data.trim()) {
      console.log("[Analysis Service] Gefunden: data");
      return responseData.data;
    }

    if ("content" in responseData && typeof responseData.content === "string" && responseData.content.trim()) {
      console.log("[Analysis Service] Gefunden: content");
      return responseData.content;
    }

    if ("text" in responseData && typeof responseData.text === "string" && responseData.text.trim()) {
      console.log("[Analysis Service] Gefunden: text");
      return responseData.text;
    }

    if ("result" in responseData && typeof responseData.result === "string" && responseData.result.trim()) {
      console.log("[Analysis Service] Gefunden: result");
      return responseData.result;
    }

    if ("message" in responseData && typeof responseData.message === "string" && responseData.message.trim()) {
      console.log("[Analysis Service] Gefunden: message");
      return responseData.message;
    }

    if ("output" in responseData && typeof responseData.output === "string" && responseData.output.trim()) {
      console.log("[Analysis Service] Gefunden: output");
      return responseData.output;
    }

    const firstStringValue = Object.values(obj).find(
      (val) => typeof val === "string" && (val as string).trim().length > 10,
    );
    if (typeof firstStringValue === "string") {
      console.log("[Analysis Service] Gefunden: erster String-Wert mit Länge > 10");
      return firstStringValue;
    }
  }

  console.error("[Analysis Service] Keine Analyse gefunden. Response Data:", JSON.stringify(responseData));
  return "Keine Analyse vom Backend erhalten.";
}

interface RequestAnalysisOptions {
  fileNames?: string[];
  model?: string;
  maxRows?: number;
}

export async function requestAnalysis(query: string, options?: RequestAnalysisOptions): Promise<string> {
  const normalizedFileNames = (options?.fileNames || []).filter((name) => typeof name === "string" && name.trim());

  const payload: AnalysisRequest = {
    query,
    frage: query,
    fileNames: normalizedFileNames,
    dateien: normalizedFileNames,
    model: options?.model,
    modell: options?.model,
    maxRows: options?.maxRows,
  };

  console.log("[Analysis Service] Starte Analyse-Anfrage mit Payload:", payload);

  const startResponse = await httpClient(ANALYSIS_START_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    timeout: 30000,
  });

  if (!startResponse.ok) {
    console.error("[Analysis Service] Fehler beim Start der Analyse:", startResponse.status);
    throw new Error(`Analyse konnte nicht gestartet werden: ${startResponse.status}`);
  }

  const startData = await parseAnalysisStartResponse(startResponse);

  if (!startData || !startData.jobId) {
    console.error("[Analysis Service] Keine jobId in Start-Response erhalten:", startData);
    throw new Error("Keine jobId von Backend erhalten");
  }

  console.log("[Analysis Service] Analyse gestartet mit jobId:", startData.jobId);

  const resultUrl = `${ANALYSIS_RESULT_ENDPOINT}/${startData.jobId}`;
  let pollAttempt = 0;

  while (pollAttempt < MAX_POLL_ATTEMPTS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    pollAttempt++;

    console.log(`[Analysis Service] Poll Versuch ${pollAttempt}/${MAX_POLL_ATTEMPTS}`);

    try {
      const pollResponse = await httpClient(resultUrl, {
        method: "GET",
        timeout: 30000,
      });

      if (pollResponse.status === 200) {
        console.log("[Analysis Service] Analyse fertig (Status 200)");
        const responseData = await parseAnalysisResponse(pollResponse);
        return getAnalysisText(responseData);
      }

      if (pollResponse.status === 202) {
        console.log("[Analysis Service] Analyse läuft noch (Status 202), warte...");
        continue;
      }

      if (!pollResponse.ok) {
        console.error("[Analysis Service] Fehler beim Polling:", pollResponse.status);
        throw new Error(`Polling fehlgeschlagen: Status ${pollResponse.status}`);
      }
    } catch (err) {
      console.error("[Analysis Service] Polling-Fehler bei Versuch", pollAttempt, ":", err);

      if (pollAttempt < MAX_POLL_ATTEMPTS) {
        continue;
      }

      throw err;
    }
  }

  throw new Error(`Analyse-Timeout nach ${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 1000} Sekunden`);
}

