"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Music2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TrendingSong {
  title: string;
  artist: string;
  url: string;
  image: string;
}

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
        // Ensure we always have an array and filter out invalid entries
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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden bg-black">
      {/* Absolute Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Subtle Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/2 text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 backdrop-blur-sm">
            <Music2 className="w-3 h-3 text-yellow-500" />
            Designed for Worship
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter text-white leading-[1.05] mb-8 font-outfit">
            A essência da cifra.
            <br />
            <span className="text-zinc-500 italic font-medium">
              Sem ruídos.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            A plataforma definitiva para músicos que buscam fidelidade harmônica
            e clareza visual no altar.
          </p>
        </motion.div>

        {/* Search Input UX */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={cn(
              "group relative flex items-center bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-full p-2 transition-all duration-700",
              isFocused
                ? "border-yellow-500/30 bg-zinc-900/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(250,204,21,0.05)] scale-[1.01]"
                : "hover:border-white/10 hover:bg-zinc-900/60",
            )}
          >
            <div className="pl-6 pr-4">
              <Search
                className={cn(
                  "w-5 h-5 transition-all duration-500",
                  isFocused ? "text-yellow-500 scale-110" : "text-zinc-600",
                )}
              />
            </div>

            <input
              type="text"
              placeholder="Qual deseja tocar hoje?"
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-700 font-light h-14"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            <button
              onClick={() => handleSearch(query)}
              className={cn(
                "h-14 px-8 rounded-full font-bold text-sm transition-all duration-500 flex items-center gap-2",
                query.trim()
                  ? "bg-yellow-500 text-black shadow-xl shadow-yellow-500/20 translate-x-0 scale-105 opacity-100"
                  : "bg-yellow-500 text-black translate-x-0 opacity-50 cursor-not-allowed",
              )}
            >
              Buscar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Trending Minimal Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 w-full max-w-5xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-white text-xl font-bold font-outfit mb-2 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                Em Alta
              </h2>
              <p className="text-zinc-600 text-sm font-medium uppercase tracking-widest">
                Gospel / Religioso
              </p>
            </div>

            {!isLoadingTrending && trendingSongs.length > 0 && (
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                  Live Updates
                </span>
              </div>
            )}
          </div>

          {isLoadingTrending ? (
            <div className="flex items-center justify-center py-20 grayscale opacity-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <AnimatePresence mode="popLayout">
                {trendingSongs.length > 0 ? (
                  trendingSongs.slice(0, 6).map((song, i) => (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      key={song.url + i}
                      onClick={() =>
                        router.push(`/song?id=${typeof btoa !== "undefined" ? btoa(encodeURIComponent(song.url)) : ""}`)
                      }
                      className="group flex flex-col text-left focus:outline-none"
                    >
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-yellow-500/20 shadow-2xl">
                        <img
                          src={
                            song.image ||
                            "https://images.unsplash.com/photo-1514525253344-f814d074e015?w=400&h=400&fit=crop"
                          }
                          alt={song.artist}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                        <div className="absolute bottom-2 left-2 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 transition-colors group-hover:text-yellow-500">
                        {song.title}
                      </h3>
                      <p className="text-[11px] font-medium text-zinc-600 line-clamp-1 uppercase tracking-tight">
                        {song.artist}
                      </p>
                    </motion.button>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-3xl">
                    <p className="text-zinc-700 text-sm italic">
                      Nenhuma música em alta encontrada no momento.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-40 mb-10 flex items-center gap-4 opacity-10">
        <div className="h-px w-20 bg-white" />
        <span className="text-white text-xs font-bold tracking-[0.5em] uppercase">
          Harmoniq Absolute
        </span>
        <div className="h-px w-20 bg-white" />
      </div>
    </section>
  );
}
