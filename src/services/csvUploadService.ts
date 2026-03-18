import type { CsvUploadResponse } from "../types";
import { httpClient } from "./httpClient";

const CSV_UPLOAD_ENDPOINT = "http://localhost:8080/api/files/upload";

async function parseUploadResponse(response: Response): Promise<CsvUploadResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
}

function getUploadErrorMessage(responseData: CsvUploadResponse, fallbackMessage: string) {
  if (typeof responseData === "string" && responseData) {
    return responseData;
  }

  if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
    return String((responseData as { message?: unknown }).message || fallbackMessage);
  }

  return fallbackMessage;
}

export async function uploadCsvFiles(files: File[]): Promise<CsvUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await httpClient(CSV_UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
    timeout: 60000,
  });

  const responseData = await parseUploadResponse(response);

  if (!response.ok) {
    throw new Error(getUploadErrorMessage(responseData, "CSV-Upload fehlgeschlagen"));
  }

  return responseData;
}
