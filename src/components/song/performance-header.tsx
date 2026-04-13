"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  Home, 
  LayoutGrid, 
  Minus, 
  Music,
  Plus, 
  ArrowLeft, 
  ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NOTES } from "@/lib/chords";
import { PerformanceHeaderProps } from "./types";

export function PerformanceHeader({
  onExit,
  showDiagrams,
  setShowDiagrams,
  currentKey,
  setTranspose,
  handleKeyChange,
  setlist,
  songIndex,
  goToPrev,
  goToNext,
  showTabs,
  setShowTabs,
}: PerformanceHeaderProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showHeader = useCallback(() => {
    setIsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(f => false);
    }, 3000);
  }, []);

  useEffect(() => {
    showHeader();
    window.addEventListener('mousemove', showHeader);
    window.addEventListener('touchstart', showHeader);
    window.addEventListener('mousedown', showHeader);
    return () => {
      window.removeEventListener('mousemove', showHeader);
      window.removeEventListener('touchstart', showHeader);
      window.removeEventListener('mousedown', showHeader);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showHeader]);

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onExit} 
          className="text-zinc-500 hover:text-white flex items-center gap-2 font-semibold text-[10px] md:text-xs uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Sair
        </button>
        <button 
          onClick={() => router.push("/")} 
          className="text-zinc-500 hover:text-white flex items-center gap-2 font-semibold text-[10px] md:text-xs uppercase tracking-wider transition-colors"
        >
          <Home className="w-4 h-4" /> Início
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => setShowDiagrams(!showDiagrams)} 
          className={cn(
            "p-2 rounded-lg transition-all", 
            showDiagrams ? "text-yellow-500 bg-white/5" : "text-zinc-500 hover:text-white"
          )} 
          title={showDiagrams ? "Esconder Diagramas" : "Mostrar Diagramas"}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setShowTabs(!showTabs)} 
          className={cn(
            "p-2 rounded-lg transition-all", 
            showTabs ? "text-yellow-500 bg-white/5" : "text-zinc-500 hover:text-white"
          )} 
          title={showTabs ? "Esconder Tablatura" : "Mostrar Tablatura"}
        >
          <Music className="w-5 h-5" />
        </button>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shadow-2xl backdrop-blur-md">
          <Button 
            variant="yellow" 
            size="icon-xs" 
            onClick={() => setTranspose((t) => t - 1)} 
            className="rounded-lg size-8 md:size-9 shadow-lg shadow-yellow-500/20 active:scale-90 transition-transform"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="flex flex-col items-center px-4 md:px-6 min-w-[60px] md:min-w-[80px]">
            <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 opacity-60">Tom</span>
            <Select value={currentKey} onValueChange={handleKeyChange}>
              <SelectTrigger className="h-6 md:h-7 border-none bg-transparent hover:bg-white/5 font-bold text-yellow-500 text-lg md:text-xl p-0 pr-4 shadow-none focus:ring-0">
                <SelectValue>{currentKey}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10 text-white">
                {NOTES.map((note) => (
                  <SelectItem key={note} value={note} className="focus:bg-yellow-500/10 focus:text-yellow-500 cursor-pointer">
                    {note}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="yellow" 
            size="icon-xs" 
            onClick={() => setTranspose((t) => t + 1)} 
            className="rounded-lg size-8 md:size-9 shadow-lg shadow-yellow-500/20 active:scale-90 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {setlist && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={goToPrev} 
              disabled={songIndex <= 0} 
              className="text-zinc-500 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center justify-center min-w-[32px]">
              <span className="text-[10px] font-bold text-yellow-500 tabular-nums leading-none">{songIndex + 1}</span>
              <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-tighter leading-none mt-0.5">de {setlist.songs.length}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={goToNext} 
              disabled={songIndex >= setlist.songs.length - 1} 
              className="text-zinc-500 hover:text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
