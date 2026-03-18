import type { AuthCredentials, AuthResponse, RegisterPayload } from "../types";
import { httpClient } from "./httpClient";

const LOGIN_ENDPOINT = "http://localhost:8080/api/users/login";
const SIGNUP_ENDPOINT = "http://localhost:8080/api/users/signup";

async function parseResponse(response: Response): Promise<AuthResponse> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => "");
}

function getErrorMessage(responseData: AuthResponse, fallbackMessage: string): string {
  if (typeof responseData === "string" && responseData) {
    return responseData;
  }

  if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
    return String((responseData as { message?: unknown }).message || fallbackMessage);
  }

  return fallbackMessage;
}

async function postAuthData<TPayload>(url: string, payload: TPayload, fallbackMessage: string): Promise<AuthResponse> {
  const response = await httpClient(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
    timeout: 15000,
  });

  const responseData = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, fallbackMessage));
  }

  return responseData;
}

export function loginUser(credentials: AuthCredentials) {
  return postAuthData(LOGIN_ENDPOINT, credentials, "Anmeldung fehlgeschlagen");
}

export function registerUser(payload: RegisterPayload) {
  return postAuthData(SIGNUP_ENDPOINT, payload, "Registrierung fehlgeschlagen");
}
