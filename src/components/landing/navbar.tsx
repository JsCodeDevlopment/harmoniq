"use client";

import { Button } from "@/components/ui/button";
import { Menu, Music, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth.hook";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-100 bg-black/60 backdrop-blur-xl border-b border-white/3 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <Music className="w-5 h-5 text-black" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight text-white">
            Harmoniq
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Funcionalidades
          </a>
          <a href="#showcase" className="hover:text-white transition-colors">
            Visualizador
          </a>
          {isAuthenticated && (
            <button 
              onClick={() => router.push("/setlists")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Meus Repertórios
            </button>
          )}
          <a href="#about" className="hover:text-white transition-colors">
            Sobre
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm font-medium">Olá, <span className="text-white">{user?.name}</span></span>
              <Button 
                variant="ghost" 
                className="text-zinc-500 hover:text-white font-medium text-sm cursor-pointer"
                onClick={logout}
              >
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 h-10 rounded-lg transition-all cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Entrar
              </Button>
              <Button 
                variant="ghost"
                className="text-white hover:text-zinc-300 font-medium text-sm cursor-pointer"
                onClick={() => router.push("/register")}
              >
                Registrar
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-zinc-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-b border-white/5 p-6 flex flex-col gap-5 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <a
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            className="text-sm font-medium text-zinc-400"
          >
            Funcionalidades
          </a>
          <a
            href="#showcase"
            onClick={() => setIsMenuOpen(false)}
            className="text-sm font-medium text-zinc-400"
          >
            Visualizador
          </a>
          {isAuthenticated && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/setlists");
              }}
              className="text-sm font-medium text-zinc-400 text-left"
            >
              Meus Repertórios
            </button>
          )}
          <a
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="text-sm font-medium text-zinc-400"
          >
            Sobre
          </a>
          <div className="h-px bg-white/5 my-2" />
          {isAuthenticated ? (
            <Button onClick={logout} className="bg-zinc-900 text-white font-semibold w-full">Sair ({user?.name})</Button>
          ) : (
            <>
              <Button onClick={() => router.push("/login")} className="bg-yellow-500 text-black font-semibold w-full">Entrar</Button>
              <Button onClick={() => router.push("/register")} variant="ghost" className="text-white font-semibold w-full">Registrar</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
