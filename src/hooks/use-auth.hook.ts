"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Cookies from "js-cookie";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  font_size?: string;
  chord_color?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = Cookies.get("harmoniq_auth_token");
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (err) {
      console.error("Failed to load user:", err);
      Cookies.remove("harmoniq_auth_token");
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
      Cookies.set("harmoniq_auth_token", accessToken, { expires: 7 }); // Persist for 7 days
      await loadUser();
      router.push("/");
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Credenciais inválidas";
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
      Cookies.set("harmoniq_auth_token", accessToken, { expires: 7 });
      await loadUser();
      router.push("/");
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Não foi possível criar a conta";
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = useCallback(() => {
    Cookies.remove("harmoniq_auth_token");
    setUser(null);
    router.push("/");
  }, [router]);

  const updateProfile = async (data: Partial<User>) => {
    try {
      await api.put("/users/me", data);
      await loadUser();
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Erro ao atualizar perfil";
      return { success: false, message };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await api.put("/users/me/password", { old_password: oldPassword, new_password: newPassword });
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Erro ao alterar senha";
      return { success: false, message };
    }
  };

  return { 
    user, 
    isInitializing, 
    login, 
    register, 
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user 
  };
}
