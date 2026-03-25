"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Music, TrendingUp, History, ListMusic } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    "Bondade de Deus",
    "Ousado Amor",
    "Grande é o Senhor",
    "Lugar Secreto"
  ];

  const handleSearch = (q: string) => {
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6 text-yellow-500">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
              <Music className="w-8 h-8 fill-current" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white font-outfit mb-4">Harmoniq</h1>
          <p className="text-zinc-400 text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            Plataforma de cifras otimizada para músicos de igreja.
            <br />
            <span className="text-zinc-500 text-lg">Cifras limpas, sem anúncios e prontas para o louvor.</span>
          </p>
        </motion.div>

        <motion.div 
          className="relative group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={cn(
            "flex items-center bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl px-6 py-5 transition-all duration-300 shadow-2xl shadow-black",
            isFocused && "border-yellow-500/50 ring-4 ring-yellow-500/10 bg-zinc-900"
          )}>
            <Search className={cn(
              "w-6 h-6 mr-4 transition-colors duration-300",
              isFocused ? "text-yellow-500" : "text-zinc-500"
            )} />
            <input 
              type="text" 
              placeholder="Busque por música, artista ou trecho..."
              className="w-full bg-transparent border-none outline-none text-white text-xl placeholder:text-zinc-600 font-outfit"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </motion.div>

        <motion.div 
          className="mt-14 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {suggestions.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleSearch(item)}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all text-sm font-semibold tracking-wide"
            >
              {item}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-800/20 cursor-pointer transition-colors group">
            <TrendingUp className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 mb-2 transition-colors" />
            <span className="text-zinc-500 group-hover:text-zinc-300 text-xs uppercase tracking-widest font-bold">Mais Tocadas</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-800/20 cursor-pointer transition-colors group">
            <History className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 mb-2 transition-colors" />
            <span className="text-zinc-500 group-hover:text-zinc-300 text-xs uppercase tracking-widest font-bold">Recentes</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-800/20 cursor-pointer transition-colors group">
            <ListMusic className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 mb-2 transition-colors" />
            <span className="text-zinc-500 group-hover:text-zinc-300 text-xs uppercase tracking-widest font-bold">Setlists</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:bg-zinc-800/20 cursor-pointer transition-colors group">
            <Search className="w-5 h-5 text-zinc-500 group-hover:text-yellow-500 mb-2 transition-colors" />
            <span className="text-zinc-500 group-hover:text-zinc-300 text-xs uppercase tracking-widest font-bold">Buscar Tudo</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
