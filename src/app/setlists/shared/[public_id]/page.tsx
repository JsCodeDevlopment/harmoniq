"use client";

import { motion } from "framer-motion";
import { 
    Loader2, Music, ListMusic, Share2, 
    Check, PlayCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSharedSetlist } from "@/hooks/use-setlists.hook";

function SharedSetlist() {
  const router = useRouter();
  const { public_id } = useParams();
  const { data: setlist, isLoading: loading } = useSharedSetlist(public_id as string);
  
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!setlist) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" strokeWidth={1.5} />
        <p className="text-zinc-600 text-sm font-medium animate-pulse">Carregando repertório compartilhado...</p>
      </div>
    );
  }

  if (!setlist) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center">
            <ListMusic className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-xl font-bold">Repertório não encontrado</h2>
        <p className="text-zinc-500 text-sm max-w-xs">O link pode estar quebrado ou o repertório não é mais público.</p>
        <Button variant="outline" onClick={() => router.push("/")} className="border-white/10 text-zinc-400">Ir para o Início</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-9 h-9 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-black" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">{setlist.title}</h1>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Repertório Compartilhado • {setlist.songs.length} músicas</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-zinc-400 hover:text-white"
                onClick={handleShare}
                title="Copiar Link"
            >
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </Button>
            <Button 
                variant="yellow" 
                size="sm" 
                className="rounded-lg font-bold"
                onClick={() => {
                    if (setlist.songs.length > 0) {
                        router.push(`/song?url=${encodeURIComponent(setlist.songs[0].url)}&sharedId=${public_id}&songIndex=0`);
                    }
                }}
                disabled={setlist.songs.length === 0}
            >
                Abrir Cifras
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Músicas da Lista</p>
          </div>

          <div className="flex flex-col gap-3">
            {setlist.songs.map((song, i) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => router.push(`/song?url=${encodeURIComponent(song.url)}&sharedId=${public_id}&songIndex=${i}`)}
                className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-yellow-500/20 hover:bg-zinc-900/40 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-6 flex-1">
                  <span className="text-zinc-700 font-mono text-sm group-hover:text-yellow-500/50 transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">{song.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{song.artist} • <span className="text-yellow-500">{song.key}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <PlayCircle className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
              </motion.div>
            ))}

            {setlist.songs.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-zinc-500 text-sm">Esta lista está vazia.</p>
                </div>
            )}
          </div>

          <div className="pt-20 text-center">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Criado no</p>
            <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" onClick={() => router.push("/")}>
                <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                    <Music className="w-3 h-3 text-black" strokeWidth={3} />
                </div>
                <span className="text-sm font-bold tracking-tighter">Harmoniq</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharedSetlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SharedSetlist />
    </Suspense>
  );
}
