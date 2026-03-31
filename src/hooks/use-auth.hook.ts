"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("harmoniq_auth_token");
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("harmoniq_auth_token");
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken } = response.data;
      localStorage.setItem("harmoniq_auth_token", accessToken);
      await loadUser();
      router.push("/");
      return { success: true };
    } catch (err: unknown) {
      const message = (err as any).response?.data?.message || "Credenciais inválidas";
      return { 
        success: false, 
        message 
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { accessToken } = response.data;
      localStorage.setItem("harmoniq_auth_token", accessToken);
      await loadUser();
      router.push("/");
      return { success: true };
    } catch (err: unknown) {
      const message = (err as any).response?.data?.message || "Não foi possível criar a conta";
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("harmoniq_auth_token");
    setUser(null);
    router.push("/");
  }, [router]);

  return { 
    user, 
    isInitializing, 
    login, 
    register, 
    logout,
    isAuthenticated: !!user 
  };
}
