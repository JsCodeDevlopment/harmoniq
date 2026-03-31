"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Music, ListMusic, Plus, Share2, Trash2, GripVertical, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSetlistMock } from "@/hooks/use-setlists-mock.hook";

function SetlistDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { setlist, isLoading: loading, removeSong, togglePublic } = useSetlistMock(id as string);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!setlist) return;
    if (!setlist.is_public) {
      if (confirm("Esta setlist é privada. Deseja torná-la pública para compartilhar?")) {
        togglePublic();
      } else {
        return;
      }
    }
    const url = `${window.location.origin}/setlists/shared/${setlist.public_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveSong = (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    if (confirm("Remover esta música do repertório?")) {
      removeSong(songId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" strokeWidth={1.5} />
        <p className="text-zinc-600 text-sm font-medium animate-pulse">Buscando seu repertório...</p>
      </div>
    );
  }

  if (!setlist) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center">
            <ListMusic className="w-8 h-8 text-zinc-600" />
        </div>
        <h2 className="text-xl font-bold">Setlist não encontrada</h2>
        <Button variant="outline" onClick={() => router.push("/setlists")}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/setlists")}
              className="p-2 hover:bg-white/5 rounded-xl transition-all group"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight">{setlist.title}</h1>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{setlist.songs.length} músicas</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className={setlist.is_public ? "text-yellow-500 hover:text-yellow-400" : "text-zinc-400 hover:text-white"}
                onClick={handleShare}
                title="Compartilhar"
            >
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </Button>
            <Button 
                variant="yellow" 
                size="sm" 
                className="rounded-lg font-bold"
                onClick={() => {
                    if (setlist.songs.length > 0) {
                        router.push(`/song?url=${encodeURIComponent(setlist.songs[0].url)}&setlistId=${setlist.id}&songIndex=0`);
                    }
                }}
                disabled={setlist.songs.length === 0}
            >
                Tocar Agora
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Ordem de execução</p>
            <button 
                onClick={() => router.push("/")}
                className="text-yellow-500 text-[11px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
            >
               <Plus className="w-3.5 h-3.5" /> Adicionar música
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {setlist.songs.map((song, i) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => router.push(`/song?url=${encodeURIComponent(song.url)}&setlistId=${setlist.id}&songIndex=${i}`)}
                className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/20 border border-white/5 hover:border-yellow-500/20 hover:bg-zinc-900/40 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-zinc-600 font-mono text-sm group-hover:text-yellow-500/50 transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{song.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{song.artist} • <span className="text-yellow-500/80">{song.key}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button 
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    onClick={(e) => handleRemoveSong(e, song.id)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}

            {setlist.songs.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-500 text-sm">Nenhuma música adicionada ainda.</p>
                </div>
            )}
          </div>

          <div className="pt-8 border-t border-white/5">
             <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-white/5">
                <div>
                    <h4 className="font-bold text-sm">Configurações da Lista</h4>
                    <p className="text-xs text-zinc-500 mt-1">Defina se outros músicos podem ver este repertório.</p>
                </div>
                <Button 
                    variant={setlist.is_public ? "yellow" : "outline"} 
                    className={setlist.is_public ? "rounded-full h-8 text-[10px]" : "rounded-full h-8 text-[10px] border-white/10 text-zinc-400"}
                    onClick={togglePublic}
                >
                    {setlist.is_public ? "Público" : "Privado"}
                </Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SetlistDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SetlistDetails />
    </Suspense>
  );
}
