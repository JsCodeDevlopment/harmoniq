"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface TrendingSong {
  title: string;
  artist: string;
  url: string;
  image: string;
}

import { TrendingCard } from "./trending-card";
 
 export function Hero() {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [isFocused, setIsFocused] = useState(false);
   const [trendingSongs, setTrendingSongs] = useState<TrendingSong[]>([]);
   const [isLoadingTrending, setIsLoadingTrending] = useState(true);
 
   useEffect(() => {
     const fetchTrending = async () => {
       try {
         const response = await api.get("/songs/trending");
         const data = Array.isArray(response.data) ? response.data : [];
         setTrendingSongs(data);
       } catch (error) {
         console.error("Failed to fetch trending songs:", error);
       } finally {
         setIsLoadingTrending(false);
       }
     };
     fetchTrending();
   }, []);
 
   const handleSearch = (q: string) => {
     if (!q.trim()) return;
     router.push(`/search?q=${encodeURIComponent(q)}`);
   };
 
   return (
     <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 overflow-hidden bg-[#020202]">
       <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-20" fill="white" />
       <BackgroundBeams />
 
       <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="text-center"
         >
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md">
             <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
             Harmonia Digital
           </div>
 
           <h1 className="text-[clamp(2.5rem,8.5vw,7.5rem)] font-bold tracking-[ -0.04em] text-white leading-[0.9] mb-8 font-outfit">
             <span className="text-gradient">Cifras Puras.</span>
             <br />
             <span className="text-zinc-800 font-light italic">Sem ruídos.</span>
           </h1>
 
           <p className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
             Foque no que importa. O visualizador de cifras definitivo para músicos de alta performance.
           </p>
         </motion.div>
 
         <motion.div
           className="w-full max-w-2xl relative z-20 mb-32"
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           <div className="relative group p-[1px] rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-zinc-800 to-yellow-500/30 group-hover:scale-x-110 transition-transform duration-1000" />
              <div
                 className={cn(
                   "relative flex items-center bg-zinc-950/90 backdrop-blur-3xl rounded-full p-2 transition-all duration-700",
                   isFocused ? "bg-black shadow-[0_0_80px_-15px_rgba(234,179,8,0.25)]" : "",
                 )}
              >
                 <div className="pl-7 pr-4">
                   <Search className={cn("w-5 h-5 transition-all duration-500", isFocused ? "text-yellow-500 scale-110" : "text-zinc-800")} />
                 </div>
 
                 <input
                   type="text"
                   placeholder="Qual deseja tocar hoje?"
                   className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-800 font-medium h-14"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(false)}
                 />
 
                 <button
                   onClick={() => handleSearch(query)}
                   className={cn(
                     "h-14 px-10 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2",
                     query.trim()
                       ? "bg-yellow-500 text-black shadow-2xl"
                       : "bg-white/[0.03] text-zinc-700",
                   )}
                 >
                   Buscar
                   <ArrowRight className="w-4 h-4 ml-1" />
                 </button>
              </div>
           </div>
         </motion.div>
 
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.6 }}
           className="w-full max-w-5xl"
         >
           <div className="flex items-center gap-5 mb-12">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-yellow-500/60" />
                <h3 className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.5em]">Tendências</h3>
              </div>
              <div className="h-px flex-1 bg-white/[0.03]" />
           </div>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {isLoadingTrending ? (
                 Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="h-24 rounded-3xl bg-white/[0.01] border border-white/[0.03] animate-pulse" />
                 ))
               ) : (
                 trendingSongs.slice(0, 6).map((song, i) => (
                   <TrendingCard 
                     key={i} 
                     song={song} 
                     index={i} 
                     onClick={() => router.push(`/song?id=${typeof btoa !== "undefined" ? btoa(encodeURIComponent(song.url)) : ""}`)} 
                   />
                 ))
               )}
           </div>
         </motion.div>
       </div>
     </section>
   );
 }
