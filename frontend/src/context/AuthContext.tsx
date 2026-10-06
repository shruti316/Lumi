import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  theme?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("lumi_token") || sessionStorage.getItem("lumi_token");
  });

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("lumi_user") || sessionStorage.getItem("lumi_user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("lumi_token");
    localStorage.removeItem("lumi_user");
    sessionStorage.removeItem("lumi_token");
    sessionStorage.removeItem("lumi_user");
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: User, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem("lumi_token", newToken);
      localStorage.setItem("lumi_user", JSON.stringify(newUser));
      sessionStorage.removeItem("lumi_token");
      sessionStorage.removeItem("lumi_user");
    } else {
      sessionStorage.setItem("lumi_token", newToken);
      sessionStorage.setItem("lumi_user", JSON.stringify(newUser));
      localStorage.removeItem("lumi_token");
      localStorage.removeItem("lumi_user");
    }
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (localStorage.getItem("lumi_user")) {
        localStorage.setItem("lumi_user", JSON.stringify(updated));
      }
      if (sessionStorage.getItem("lumi_user")) {
        sessionStorage.setItem("lumi_user", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Restore and verify session on initial application mount
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem("lumi_token") || sessionStorage.getItem("lumi_token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // If token is a legacy bogus session string (not a 3-part JWT), reject it immediately
      if (!storedToken.includes(".") || storedToken.startsWith("lumi_session_")) {
        logout();
        return;
      }

      try {
        const { data, error } = await api.auth.getMe();
        if (error || !data?.user) {
          console.warn("[LUMI Auth] Stored session invalid or expired:", error);
          logout();
        } else {
          setUser(data.user);
          setToken(storedToken);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[LUMI Auth] Session verification error:", err);
        logout();
      }
    }

    verifySession();

    // Listen for auth-expired events from api client
    function handleAuthExpired() {
      logout();
    }
    window.addEventListener("lumi-auth-expired", handleAuthExpired);
    return () => window.removeEventListener("lumi-auth-expired", handleAuthExpired);
  }, [logout]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
