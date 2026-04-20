"use client";

import { useAuth } from "@/hooks/use-auth.hook";
import { LogOut, Menu, Music, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 ${
        scrolled
          ? "py-4 bg-black/80 backdrop-blur-2xl border-b border-white/[0.03]"
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(234,179,8,0.2)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Music className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black font-outfit tracking-[-0.05em] text-white">
            Harmoniq
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <a
              href="#features"
              className="hover:text-yellow-500 transition-all flex items-center gap-2 group"
            >
              Funcionalidades
              <div className="w-1 h-1 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#showcase"
              className="hover:text-yellow-500 transition-all flex items-center gap-2 group"
            >
              Visualizador
              <div className="w-1 h-1 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#about"
              className="hover:text-yellow-500 transition-all flex items-center gap-2 group"
            >
              Sobre
              <div className="w-1 h-1 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="w-px h-4 bg-zinc-800 mx-2" />

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-3 py-2 px-5 rounded-full bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Meus Repertórios
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 transition-all"
                  onClick={() => router.push("/register")}
                >
                  Registrar
                </button>
                <button
                  className="relative group/btn h-11 px-8 rounded-full bg-yellow-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_15px_30px_rgba(234,179,8,0.3)] transition-all overflow-hidden"
                  onClick={() => router.push("/login")}
                >
                  <span className="relative z-10">Entrar</span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-shine" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[73px] bg-black/95 backdrop-blur-3xl border-b border-white/[0.03] p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              Funcionalidades
            </a>
            <a href="#showcase" onClick={() => setIsMenuOpen(false)}>
              Visualizador
            </a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              Sobre
            </a>
          </div>

          <div className="h-px bg-white/[0.03]" />

          {isAuthenticated ? (
            <div className="flex flex-col gap-6">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/profile");
                }}
                className="flex items-center gap-4 h-14 px-8 rounded-2xl bg-white/[0.03] border border-white/5"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Meus Repertórios
                </span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="px-8 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 text-left"
              >
                Sair ({user?.name})
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => router.push("/login")}
                className="h-14 rounded-2xl bg-yellow-500 text-black font-black text-xs uppercase tracking-[0.2em]"
              >
                Entrar
              </button>
              <button
                onClick={() => router.push("/register")}
                className="h-14 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em]"
              >
                Registrar
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
