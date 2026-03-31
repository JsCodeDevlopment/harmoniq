"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ListMusic,
  Loader2,
  PlayCircle,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth.hook";
import { useSetlists } from "@/hooks/use-setlists.hook";

function SetlistDashboard() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const {
    setlists = [],
    isLoading: loading,
    createSetlist,
    deleteSetlist,
  } = useSetlists();

  // Create Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated && !isInitializing) {
    // ... (Login required view remains same)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const newList = await createSetlist(newTitle);
      setIsCreateOpen(false);
      setNewTitle("");
      router.push(`/setlists/${newList.id}`);
    } catch (error) {
      console.error("Failed to create setlist:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    setIsDeleting(true);
    try {
      await deleteSetlist(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete setlist:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-white/5 rounded-xl transition-all group"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              Meus Repertórios
            </h1>
          </div>

          <Button
            variant="yellow"
            size="sm"
            className="rounded-lg font-bold gap-2"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* ... (Main content remains similar, just update the delete handler) */}
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
              Suas listas de músicas
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Setlists</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader2
                className="w-10 h-10 text-yellow-500 animate-spin"
                strokeWidth={1.5}
              />
              <p className="text-zinc-600 text-sm font-medium animate-pulse">
                Organizando suas setlists...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {setlists.length > 0 ? (
                setlists.map((list, i) => (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => router.push(`/setlists/${list.id}`)}
                    className="group relative h-48 rounded-2xl p-6 bg-zinc-900/20 border border-white/5 hover:border-yellow-500/20 hover:bg-zinc-900/40 cursor-pointer overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4 z-20">
                      <button
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(list.id);
                        }}
                        title="Excluir Setlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="h-full flex flex-col justify-between relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
                        <ListMusic className="w-6 h-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                          {list.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                            {list.songs?.length} músicas
                          </span>
                          {list.is_public && (
                            <div className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-full font-bold uppercase">
                              <Share2 className="w-2.5 h-2.5" />
                              Público
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                        <PlayCircle className="w-6 h-6 text-black fill-current" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-zinc-500 mb-4">
                    Você ainda não criou nenhuma setlist.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(true)}
                    className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    Criar minha primeira lista
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* CREATE DIALOG */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => !isCreating && setIsCreateOpen(false)}
        title="Novo Repertório"
        description="Dê um nome para sua nova lista de músicas."
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <Input
            placeholder="Ex: Culto de Domingo, Acampamento..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={isCreating}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl text-zinc-500"
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="yellow"
              className="flex-1 rounded-xl font-bold"
              disabled={isCreating || !newTitle.trim()}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Criar Lista"
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        isOpen={deleteId !== null}
        onClose={() => !isDeleting && setDeleteId(null)}
        title="Excluir Repertório"
      >
        <div className="space-y-6">
          <p className="text-zinc-400">
            Tem certeza que deseja excluir permanentemente esta setlist? Esta
            ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl text-zinc-500"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Excluir Agora"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default function SetlistsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SetlistDashboard />
    </Suspense>
  );
}
