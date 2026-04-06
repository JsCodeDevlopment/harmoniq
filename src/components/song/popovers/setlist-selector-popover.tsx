"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RefObject } from "react";
import { Setlist } from "../types";

interface SetlistSelectorPopoverProps {
  isOpen: boolean;
  setlists: Setlist[];
  onAdd: (setlistId: number) => void;
  popoverRef: RefObject<HTMLDivElement | null>;
}

export function SetlistSelectorPopover({
  isOpen,
  setlists,
  onAdd,
  popoverRef,
}: SetlistSelectorPopoverProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={popoverRef}
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }} 
          className="absolute right-6 top-16 w-64 bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 z-50"
        >
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-1">Escolha um repertório</h4>
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
            {setlists.map((list) => (
              <button 
                key={list.id} 
                onClick={() => onAdd(list.id)} 
                className="flex flex-col text-left p-2.5 hover:bg-zinc-50 rounded-xl transition-colors group"
              >
                <span className="font-bold text-sm text-zinc-900 group-hover:text-yellow-600 transition-colors">
                  {list.title}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {list.songs?.length} músicas
                </span>
              </button>
            ))}
            
            {setlists.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-xs text-zinc-400 mb-3">Nenhum repertório criado</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px]" 
                  onClick={() => router.push("/setlists")}
                >
                  Criar Novo
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
