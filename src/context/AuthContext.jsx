import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("velora_token");
    if (token) {
      api.auth.me()
        .then((u) => setUser(u))
        .catch(() => localStorage.removeItem("velora_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api.auth.login(email, password);
    localStorage.setItem("velora_token", token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (name, email, password, phone, securityQuestion, securityAnswer) => {
    const { token, user } = await api.auth.register(name, email, password, phone, securityQuestion, securityAnswer);
    localStorage.setItem("velora_token", token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("velora_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isAdmin: !!user && (user.is_admin === 1 || user.is_admin === true), loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
