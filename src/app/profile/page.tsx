"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  Edit2,
  Key,
  ListMusic,
  Loader2,
  LogOut,
  Mail,
  Palette,
  Save,
  ShieldCheck,
  Type,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth.hook";
import { cn } from "@/lib/utils";

function ProfileDashboard() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isInitializing,
    updateProfile,
    changePassword,
    logout,
  } = useAuth();

  const [name, setName] = useState("");
  const [fontSize, setFontSize] = useState("medium");
  const [chordColor, setChordColor] = useState("yellow");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setFontSize(user.font_size || "medium");
      setChordColor(user.chord_color || "yellow");
    }
  }, [user]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2
          className="w-10 h-10 text-yellow-500 animate-spin"
          strokeWidth={1.5}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setMessage(null);

    const res = await updateProfile({ 
      name, 
      font_size: fontSize, 
      chord_color: chordColor 
    });
    if (res.success) {
      setMessage({ text: "Perfil e preferências atualizados!", type: "success" });
    } else {
      setMessage({
        text: res.message || "Erro ao atualizar perfil",
        type: "error",
      });
    }
    setIsUpdatingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "As senhas não coincidem", type: "error" });
      return;
    }

    setIsChangingPassword(true);
    setMessage(null);

    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setMessage({ text: "Senha alterada com sucesso!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({
        text: res.message || "Erro ao alterar senha",
        type: "error",
      });
    }
    setIsChangingPassword(false);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-white/5 rounded-xl transition-all group"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Meu Perfil</h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 font-bold gap-2"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center text-black mb-4 shadow-xl shadow-yellow-500/10">
                <User className="w-12 h-12" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
              <div className="mt-6 flex flex-col w-full gap-2">
                <Button
                  variant="yellow"
                  className="w-full justify-start gap-3 h-12 rounded-2xl"
                  onClick={() => router.push("/setlists")}
                >
                  <ListMusic className="w-5 h-5" />
                  Meus Repertórios
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/10 border border-white/2">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 mb-2">
                Conta
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 p-3 text-sm text-zinc-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Membro desde 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-2xl text-sm font-medium",
                  message.type === "success"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20",
                )}
              >
                {message.text}
              </motion.div>
            )}

            {/* Basic Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold">Informações Básicas</h3>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="space-y-4 bg-zinc-900/10 p-6 rounded-3xl border border-white/5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                    <input
                      type="email"
                      disabled
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-12 py-3 text-zinc-500 outline-none cursor-not-allowed"
                      value={user?.email || ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                    Nome completo
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-yellow-500" />
                    <input
                      type="text"
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-xl px-12 py-3 focus:border-yellow-500/30 outline-none transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Preferências de Exibição */}
                <div className="pt-6 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                      <Palette className="w-4 h-4 text-zinc-500" />
                    </div>
                    <h3 className="text-md font-bold">Personalização da Cifra</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Font Size */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                        <Type className="w-3 h-3" /> Tamanho da Fonte
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "small", label: "P", size: "text-xs" },
                          { id: "medium", label: "M", size: "text-sm" },
                          { id: "large", label: "G", size: "text-base" },
                          { id: "xlarge", label: "XG", size: "text-lg" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setFontSize(s.id)}
                            className={cn(
                              "h-10 px-4 rounded-xl border font-bold transition-all",
                              fontSize === s.id
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10",
                            )}
                          >
                            <span className={s.size}>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chord Color */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                        <Palette className="w-3 h-3" /> Cor da Cifra
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "yellow", color: "bg-yellow-500" },
                          { id: "blue", color: "bg-blue-500" },
                          { id: "green", color: "bg-green-500" },
                          { id: "white", color: "bg-white" },
                          { id: "orange", color: "bg-orange-500" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setChordColor(c.id)}
                            className={cn(
                              "w-10 h-10 rounded-xl border-2 transition-all p-1",
                              chordColor === c.id
                                ? "border-yellow-500 scale-110"
                                : "border-transparent",
                            )}
                          >
                            <div className={cn("w-full h-full rounded-lg shadow-inner", c.color)} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    variant="yellow"
                    className="w-full sm:w-auto px-10 rounded-xl h-12 font-bold gap-2"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Salvar Tudo
                  </Button>
                </div>
              </form>
            </section>

            {/* Password Change */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <Key className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold">Segurança</h3>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="space-y-5 bg-zinc-900/10 p-6 rounded-3xl border border-white/5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    className="w-full bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 focus:border-yellow-500/30 outline-none transition-all"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 focus:border-yellow-500/30 outline-none transition-all"
                      placeholder="Min. 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 focus:border-yellow-500/30 outline-none transition-all"
                      placeholder="Confirme a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="yellow"
                    className="w-full sm:w-auto px-10 rounded-xl h-12 font-bold gap-2"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    Atualizar Senha
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ProfileDashboard />
    </Suspense>
  );
}
