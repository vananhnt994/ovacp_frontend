import { useState, useCallback } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string; name: string };
}

const SIGNUP_ENDPOINT = "http://localhost:8081/api/users/signup";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const login = useCallback((email: string, password: string) => {
    // Implementiere hier echte Authentifizierungslogik mit einem Backend
    console.log("Login-Anfrage:", { email, password });
    setAuthState({
      isAuthenticated: true,
      user: { email, name: email.split("@")[0] },
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const userData = { name, email, password };

    const response = await fetch(SIGNUP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseData: unknown = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      const errorMessage =
        typeof responseData === "string" && responseData
          ? responseData
          : typeof responseData === "object" && responseData !== null && "message" in responseData
            ? String((responseData as { message?: unknown }).message || "Registrierung fehlgeschlagen")
            : "Registrierung fehlgeschlagen";

      throw new Error(errorMessage);
    }

    setAuthState({
      isAuthenticated: true,
      user: { email, name },
    });

    return responseData;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
