"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Music, PlayCircle, Search, ListMusic } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useSearchSongsMock } from "@/hooks/use-songs-mock.hook";
import { useSetlistsMock } from "@/hooks/use-setlists-mock.hook";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const { songs = [], isLoading: loading } = useSearchSongsMock(initialQuery);
  const { setlists = [] } = useSetlistsMock();
  const [activeSetlistSelector, setActiveSetlistSelector] = useState<number | null>(null);

  async function handleSearch(q: string) {
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const handleAddToSetlist = useCallback((song: { title: string; artist: string; url: string }, targetSetlistId: number) => {
    const stored = localStorage.getItem("harmoniq_mock_setlists");
    if (stored) {
        const lists = JSON.parse(stored);
        const idx = lists.findIndex((l: { id: number }) => l.id === targetSetlistId);
        if (idx !== -1) {
            const exists = lists[idx].songs.some((s: { url: string }) => s.url === song.url);
            if (exists) {
                alert("Esta música já está neste repertório.");
                setActiveSetlistSelector(null);
                return;
            }

            lists[idx].songs.push({
                id: Math.floor(Math.random() * 1000000),
                setlist_id: targetSetlistId,
                title: song.title,
                artist: song.artist,
                url: song.url,
                key: "C", // Default key for search results
                order: lists[idx].songs.length
            });
            localStorage.setItem("harmoniq_mock_setlists", JSON.stringify(lists));
            alert(`Música adicionada em "${lists[idx].title}"`);
            setActiveSetlistSelector(null);
        }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-white/5 rounded-xl transition-all group"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full bg-zinc-900/40 border border-white/5 rounded-xl px-10 py-3 focus:border-yellow-500/30 focus:bg-zinc-900/60 outline-none transition-all text-base placeholder:text-zinc-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            />
          </div>
          
          <div className="md:flex items-center gap-2.5 cursor-pointer hidden" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold font-outfit tracking-tight">Harmoniq</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-zinc-500 text-[12px] font-semibold uppercase tracking-wider">
            {loading ? "Buscando..." : `${songs.length} resultados encontrados`}
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" strokeWidth={1.5} />
            <p className="text-zinc-600 text-sm font-medium animate-pulse">Sincronizando com a nuvem...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {songs.length > 0 ? (
              songs.map((song, i) => (
                <div key={i} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    onClick={() =>
                      router.push(`/song?url=${encodeURIComponent(song.url)}`)
                    }
                    className="group flex items-center justify-between p-5 rounded-xl bg-zinc-900/20 border border-white/2 hover:border-yellow-500/20 hover:bg-zinc-900/40 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                        <Music className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-200 group-hover:text-white transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide group-hover:text-yellow-500/60 transition-colors mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveSetlistSelector(activeSetlistSelector === i ? null : i);
                         }}
                         className={cn(
                           "p-2.5 rounded-lg transition-all",
                           activeSetlistSelector === i ? "bg-yellow-500 text-black" : "text-zinc-500 hover:text-white hover:bg-white/5"
                         )}
                       >
                         <ListMusic className="w-5 h-5" />
                       </button>
                       <div className="md:flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all hidden ml-2">
                         <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Toque</span>
                         <PlayCircle className="w-6 h-6 text-yellow-500" strokeWidth={2} />
                       </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {activeSetlistSelector === i && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-white/10 shadow-2xl rounded-2xl p-4 z-50"
                        >
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 px-1">Escolha um repertório</h4>
                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                                {setlists.map(list => (
                                    <button
                                        key={list.id}
                                        onClick={() => handleAddToSetlist(song, list.id)}
                                        className="flex flex-col text-left p-2.5 hover:bg-white/5 rounded-xl transition-colors group"
                                    >
                                        <span className="font-bold text-sm text-zinc-100 group-hover:text-yellow-500 transition-colors">{list.title}</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">{list.songs.length} músicas</span>
                                    </button>
                                ))}
                                {setlists.length === 0 && (
                                    <div className="py-6 text-center">
                                        <p className="text-xs text-zinc-400 mb-3">Nenhum repertório criado</p>
                                        <Button size="sm" variant="outline" className="h-7 text-[10px] border-white/10" onClick={() => router.push("/setlists")}>Criar Novo</Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="text-center py-40 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-2">
                  <Music className="w-8 h-8 text-zinc-800" strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-400 text-lg font-semibold">Nenhum resultado</p>
                  <p className="text-zinc-600 text-sm">Tente buscar por termos diferentes.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="mt-4 rounded-lg border-white/5 text-zinc-500 hover:text-white"
                >
                  Voltar ao início
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SearchResults />
    </Suspense>
  );
}
