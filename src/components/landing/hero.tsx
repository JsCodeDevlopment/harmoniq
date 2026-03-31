"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const suggestions = [
  "Bondade de Deus",
  "Ousado Amor",
  "Grande é o Senhor",
  "Lugar Secreto",
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (q: string) => {
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative pt-48 pb-32 px-6 overflow-hidden">
      {/* Subtle light effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-yellow-500/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 text-[12px] font-medium mb-10 cursor-default">
            <span className="flex w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            A maior plataforma de cifras para músicos de louvor
          </div>
          <h1 className="text-5xl md:text-8xl font-semibold font-outfit mb-8 tracking-tight text-white leading-tight">
            Cifras limpas para<br /> 
            <span className="text-zinc-500">músicos de excelência.</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            Elimine distrações e foque no que importa. O Harmoniq oferece a plataforma mais estável e profissional para o seu louvor.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={cn(
            "flex items-center bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 transition-all duration-300",
            isFocused ? "border-yellow-500/30 bg-zinc-900 shadow-2xl shadow-yellow-500/5 ring-1 ring-yellow-500/10" : "hover:border-white/10"
          )}>
            <Search className={cn(
              "w-5 h-5 mr-4 transition-colors duration-300",
              isFocused ? "text-yellow-500" : "text-zinc-600"
            )} />
            <input 
              type="text" 
              placeholder="Pesquisar música ou artista..."
              className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-700 font-sans"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {query && (
              <button 
                onClick={() => handleSearch(query)}
                className="ml-3 p-2 bg-white rounded-lg text-black hover:bg-zinc-200 transition-all font-semibold text-sm cursor-pointer"
              >
                Buscar
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
             {suggestions.map((item, i) => (
               <button 
                key={i} 
                onClick={() => handleSearch(item)}
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all border border-transparent cursor-pointer"
               >
                 {item}
               </button>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
