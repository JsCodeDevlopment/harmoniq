"use client";

import { motion } from "framer-motion";
import { 
    ChevronLeft, Loader2, ListMusic, Plus, Share2, PlayCircle, Trash2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { useSetlistsMock } from "@/hooks/use-setlists-mock.hook";
import { useAuth } from "@/hooks/use-auth.hook";

function SetlistDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isInitializing } = useAuth();
  const { setlists = [], isLoading: loading, createSetlist, deleteSetlist } = useSetlistsMock();

  if (!isAuthenticated && !isInitializing) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
          <ListMusic className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold font-outfit text-white mb-3 tracking-tight">Acesso restrito</h2>
        <p className="text-zinc-500 max-w-sm mb-10 font-medium">Você precisa estar logado para salvar e gerenciar seus repertórios musicais.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button 
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 rounded-xl transition-all"
            onClick={() => router.push("/login")}
          >
            Entrar agora
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 text-white hover:bg-white/5 font-medium h-12 rounded-xl transition-all"
            onClick={() => router.push("/register")}
          >
            Criar conta
          </Button>
        </div>
        <button 
          onClick={() => router.push("/")}
          className="mt-12 text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  const handleCreate = () => {
    const title = prompt("Digite o nome da sua nova setlist:");
    if (title) {
      const newList = createSetlist(title);
      router.push(`/setlists/${newList.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esta setlist?")) {
      deleteSetlist(id);
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
            <h1 className="text-xl font-bold tracking-tight">Meus Repertórios</h1>
          </div>
          
          <Button 
            variant="yellow" 
            size="sm" 
            className="rounded-lg font-bold gap-2"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Suas listas de músicas</p>
            <h2 className="text-2xl font-bold tracking-tight">Setlists</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" strokeWidth={1.5} />
              <p className="text-zinc-600 text-sm font-medium animate-pulse">Organizando suas setlists...</p>
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
                            onClick={(e) => handleDelete(e, list.id)}
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
                            {list.songs.length} músicas
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
                   <p className="text-zinc-500 mb-4">Você ainda não criou nenhuma setlist.</p>
                   <Button variant="outline" onClick={handleCreate} className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                      Criar minha primeira lista
                   </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
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
