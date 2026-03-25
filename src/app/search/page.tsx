"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, Music, Loader2, PlayCircle } from "lucide-react";
import { searchSongs } from "@/lib/api";
import { motion } from "framer-motion";

interface SongResult {
  title: string;
  artist: string;
  url: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [songs, setSongs] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  async function handleSearch(q: string) {
    if (!q) return;
    setLoading(true);
    try {
      const results = await searchSongs(q);
      setSongs(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/")} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <input 
            type="text" 
            placeholder="Buscar..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-10 py-2.5 focus:border-yellow-500/50 outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
           />
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
             {songs.length > 0 ? (
               songs.map((song, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/song?url=${encodeURIComponent(song.url)}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-800/40 hover:border-zinc-700 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                        <Music className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="font-bold text-white group-hover:text-yellow-500 transition-colors line-clamp-1">{song.title}</h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">CifraClub Results</p>
                     </div>
                  </div>
                  <PlayCircle className="w-6 h-6 text-zinc-700 group-hover:text-yellow-500 transition-colors" />
                </motion.div>
               ))
             ) : (
               <div className="text-center py-20">
                  <Music className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500">Nenhum resultado encontrado para &quot;{query}&quot;</p>
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
