"use client";

import { motion } from "framer-motion";
import { 
    ChevronLeft, Loader2, Music, ListMusic, Plus, Share2, 
    Trash2, GripVertical, Check, Edit2 
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSetlist } from "@/hooks/use-setlists.hook";
import { toast } from "sonner";

function SetlistDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { setlist, isLoading: loading, removeSong, togglePublic, renameSetlist } = useSetlist(id as string);
  
  const [copied, setCopied] = useState(false);

  // Rename Dialog State
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Remove Song Dialog State
  const [removeSongId, setRemoveSongId] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Share/Public Dialog State
  const [isShareAlertOpen, setIsShareAlertOpen] = useState(false);

  const openRename = () => {
    if (setlist) {
      setNewTitle(setlist.title);
      setIsRenameOpen(true);
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle === setlist?.title) {
        setIsRenameOpen(false);
        return;
    }
    
    setIsRenaming(true);
    try {
      await renameSetlist(newTitle);
      toast.success("Sucesso", { description: "Repertório renomeado!" });
      setIsRenameOpen(false);
    } catch {
      toast.error("Erro", { description: "Não foi possível renomear." });
    } finally {
      setIsRenaming(false);
    }
  };

  const handleShare = () => {
    if (!setlist) return;
    if (!setlist.is_public) {
      setIsShareAlertOpen(true);
      return;
    }
    const url = `${window.location.origin}/setlists/shared/${setlist.public_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!", { description: "Pronto para compartilhar!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const makePublicAndShare = async () => {
    if (!setlist) return;
    try {
        await togglePublic();
        setIsShareAlertOpen(false);
        
        const url = `${window.location.origin}/setlists/shared/${setlist.public_id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Agora é público!", { description: "Link copiado para a área de transferência." });
        setTimeout(() => setCopied(false), 2000);
    } catch {
        toast.error("Erro", { description: "Falha ao alterar privacidade." });
    }
  };

  const execRemoveSong = async () => {
    if (removeSongId === null) return;
    setIsRemoving(true);
    try {
      await removeSong(removeSongId);
      toast.success("Música removida", { description: "A música foi retirada do seu roteiro." });
      setRemoveSongId(null);
    } catch {
      toast.error("Erro", { description: "Não foi possível remover a música." });
    } finally {
      setIsRemoving(false);
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
            <div className="flex flex-col group/title">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">{setlist.title}</h1>
                <button 
                    onClick={openRename}
                    className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-opacity md:opacity-0 group-hover/title:opacity-100"
                    title="Renomear"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setRemoveSongId(song.id);
                    }}
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
                    onClick={() => togglePublic()}
                >
                    {setlist.is_public ? "Público" : "Privado"}
                </Button>
             </div>
          </div>
        </div>
      </main>

      {/* RENAME DIALOG */}
      <Dialog 
        isOpen={isRenameOpen} 
        onClose={() => !isRenaming && setIsRenameOpen(false)} 
        title="Renomear Repertório"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-6">
          <Input 
            placeholder="Novo nome" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={isRenaming}
            autoFocus
          />
          <div className="flex gap-3">
            <Button 
                type="button"
                variant="ghost" 
                className="flex-1 rounded-xl text-zinc-500"
                onClick={() => setIsRenameOpen(false)}
                disabled={isRenaming}
            >
                Cancelar
            </Button>
            <Button 
                type="submit"
                variant="yellow" 
                className="flex-1 rounded-xl font-bold"
                disabled={isRenaming || !newTitle.trim()}
            >
                {isRenaming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Alteração"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* REMOVE SONG DIALOG */}
      <Dialog 
        isOpen={removeSongId !== null} 
        onClose={() => !isRemoving && setRemoveSongId(null)} 
        title="Remover Música"
      >
        <div className="space-y-6">
          <p className="text-zinc-400 text-sm leading-relaxed">Tem certeza que deseja remover esta música do repertório? Você poderá adicioná-la novamente mais tarde.</p>
          <div className="flex gap-3">
            <Button 
                variant="ghost" 
                className="flex-1 rounded-xl text-zinc-500"
                onClick={() => setRemoveSongId(null)}
                disabled={isRemoving}
            >
                Manter
            </Button>
            <Button 
                variant="ghost" 
                className="flex-1 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold"
                onClick={execRemoveSong}
                disabled={isRemoving}
            >
                {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remover Música"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* SHARE ALERT DIALOG */}
      <Dialog 
        isOpen={isShareAlertOpen} 
        onClose={() => setIsShareAlertOpen(false)} 
        title="Repertório Privado"
      >
        <div className="space-y-6">
          <p className="text-zinc-400 text-sm leading-relaxed">Esta setlist é privada. Deseja torná-la pública agora para que você possa compartilhar o link com outras pessoas?</p>
          <div className="flex gap-3">
            <Button 
                variant="ghost" 
                className="flex-1 rounded-xl text-zinc-500 text-xs"
                onClick={() => setIsShareAlertOpen(false)}
            >
                Agora não
            </Button>
            <Button 
                variant="yellow" 
                className="flex-2 rounded-xl font-bold text-xs"
                onClick={makePublicAndShare}
            >
                Tornar Público e Copiar Link
            </Button>
          </div>
        </div>
      </Dialog>
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
