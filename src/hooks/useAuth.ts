import { useState, useCallback } from "react";
import { loginUser, registerUser } from "@/services/authService";
import type { AuthResponse } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string; name: string };
}

function getUserNameFromResponse(responseData: AuthResponse, fallbackEmail: string, fallbackName?: string) {
  if (typeof responseData === "object" && responseData !== null) {
    if ("name" in responseData && typeof responseData.name === "string" && responseData.name.trim()) {
      return responseData.name;
    }

    if ("user" in responseData && typeof responseData.user === "object" && responseData.user !== null) {
      const nestedUser = responseData.user as { name?: unknown };

      if (typeof nestedUser.name === "string" && nestedUser.name.trim()) {
        return nestedUser.name;
      }
    }
  }

  return fallbackName || fallbackEmail.split("@")[0];
}

function getUserEmailFromResponse(responseData: AuthResponse, fallbackEmail: string) {
  if (typeof responseData === "object" && responseData !== null) {
    if ("email" in responseData && typeof responseData.email === "string" && responseData.email.trim()) {
      return responseData.email;
    }

    if ("user" in responseData && typeof responseData.user === "object" && responseData.user !== null) {
      const nestedUser = responseData.user as { email?: unknown };

      if (typeof nestedUser.email === "string" && nestedUser.email.trim()) {
        return nestedUser.email;
      }
    }
  }

  return fallbackEmail;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    const responseData = await loginUser({ email, password });
    const resolvedEmail = getUserEmailFromResponse(responseData, email);

    setAuthState({
      isAuthenticated: true,
      user: {
        email: resolvedEmail,
        name: getUserNameFromResponse(responseData, resolvedEmail),
      },
    });

    return responseData;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const responseData = await registerUser({ name, email, password });
    const resolvedEmail = getUserEmailFromResponse(responseData, email);

    setAuthState({
      isAuthenticated: true,
      user: {
        email: resolvedEmail,
        name: getUserNameFromResponse(responseData, resolvedEmail, name),
      },
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
