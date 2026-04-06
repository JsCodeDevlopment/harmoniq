"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Minus,
  Play,
  Plus,
  Zap,
} from "lucide-react";
import { SongUtilityBarProps } from "./types";

export function SongUtilityBar({
  currentKey,
  originalKey,
  setTranspose,
  autoScroll,
  setAutoScroll,
  setPerformanceMode,
  showDiagrams,
  setShowDiagrams,
  setlist,
  songIndex,
  goToPrev,
  goToNext,
  simplifiedUrl,
  principalUrl,
  currentUrl,
  onVersionChange,
}: SongUtilityBarProps) {
  const isSimplified = currentUrl === simplifiedUrl;
  const hasAlternative =
    !!simplifiedUrl && !!principalUrl && simplifiedUrl !== principalUrl;

  return (
    <div className="sticky top-[64px] md:top-[86px] z-40 mb-8 transform-gpu px-1 md:px-0">
      <div className="bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-row flex-wrap lg:flex-nowrap items-stretch divide-zinc-100 transition-all duration-300">
        {/* Module: Tonalidade */}
        <div className="w-1/2 lg:w-auto lg:flex-[1.2] flex items-center gap-2 md:gap-4 px-2 py-1.5 md:px-6 md:py-5 border-r border-b lg:border-b-0 border-zinc-100">
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 md:mb-2.5 opacity-60">
              Tonalidade
            </span>
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="flex items-center bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-2xl p-0.5 md:p-1 shadow-inner">
                <Button
                  variant="yellow"
                  size="icon-xs"
                  onClick={() => setTranspose((t) => t - 1)}
                  className="rounded-lg md:rounded-xl size-7 md:size-9 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Minus className="size-3 md:size-4" />
                </Button>
                <div className="min-w-[32px] md:min-w-[56px] text-center font-black text-base md:text-xl text-zinc-900 tabular-nums tracking-tighter">
                  {currentKey}
                </div>
                <Button
                  variant="yellow"
                  size="icon-xs"
                  onClick={() => setTranspose((t) => t + 1)}
                  className="rounded-lg md:rounded-xl size-7 md:size-9 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Plus className="size-3 md:size-4" />
                </Button>
              </div>
              <div className="hidden min-[400px]:flex px-2 py-1 rounded-lg bg-zinc-100/50 text-[8px] md:text-[10px] font-bold text-zinc-500 border border-zinc-100/30 whitespace-nowrap">
                TOM: <span className="text-zinc-900 ml-1">{originalKey}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module: Visual & Versão */}
        <div className="w-1/2 lg:w-auto flex items-center gap-1.5 md:gap-4 px-2 py-1.5 md:px-6 md:py-5 border-b lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-50/20 lg:bg-transparent overflow-hidden">
          <div className="flex flex-col w-full">
            <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 md:mb-2.5 opacity-60 truncate">
              Visual & Versão
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setShowDiagrams(!showDiagrams)}
                className={cn(
                  "h-8 md:h-11 px-1.5 md:px-4 rounded-lg md:rounded-2xl transition-all flex items-center justify-center gap-1.5 md:gap-2 font-bold text-[9px] md:text-[11px] uppercase tracking-wider border",
                  showDiagrams
                    ? "bg-yellow-500 text-black border-yellow-600 shadow-sm"
                    : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50",
                )}
                title="Mostrar Diagramas"
              >
                <LayoutGrid className="size-3.5 md:size-4 shrink-0" />
                <span className="hidden sm:inline">Shapes</span>
              </button>

              {hasAlternative && (
                <button
                  onClick={() =>
                    onVersionChange(
                      isSimplified ? principalUrl! : simplifiedUrl!,
                    )
                  }
                  className={cn(
                    "flex-1 h-8 md:h-11 px-1.5 md:px-4 rounded-lg md:rounded-2xl transition-all flex items-center justify-center gap-1 md:gap-2 font-bold text-[9px] md:text-[11px] uppercase tracking-wider border shadow-sm truncate",
                    isSimplified
                      ? "bg-zinc-900 text-white border-zinc-800"
                      : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50",
                  )}
                  title={
                    isSimplified ? "Versão Principal" : "Versão Simplificada"
                  }
                >
                  <Zap
                    className={cn(
                      "size-3 md:size-3.5 shrink-0",
                      isSimplified
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-400",
                    )}
                  />
                  <span>{isSimplified ? "Principal" : "Simples"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Module: Fluxo */}
        <div className="w-full lg:w-auto lg:flex-1 flex items-center gap-2 md:gap-4 px-2 py-1.5 md:px-6 md:py-5 border-b lg:border-b-0 lg:border-r border-zinc-100">
          <div className="flex flex-col w-full">
            <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 md:mb-2.5 opacity-60">
              Fluxo
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={cn(
                  "flex-1 h-9 md:h-11 px-3 md:px-6 rounded-lg md:rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[9px] md:text-[11px] flex items-center justify-center gap-2 md:gap-3 border shadow-sm",
                  autoScroll
                    ? "bg-red-500 text-white border-red-600 shadow-red-500/20"
                    : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50",
                )}
              >
                {autoScroll ? (
                  <>
                    <div className="size-1.5 md:size-2 rounded-full bg-white animate-pulse" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 md:size-4 fill-current text-zinc-400" />
                    Auto Scroll
                  </>
                )}
              </button>
              <button
                onClick={() => setPerformanceMode(true)}
                className="h-9 md:h-11 px-3 md:px-5 rounded-lg md:rounded-2xl bg-zinc-900 text-white hover:bg-black transition-all flex items-center gap-2 font-bold text-[9px] md:text-[11px] uppercase tracking-wider shadow-xl shadow-black/10 group"
              >
                <div className="size-1.5 md:size-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                Live
              </button>
            </div>
          </div>
        </div>

        {/* Module: Navegação */}
        {setlist && (
          <div className="w-full lg:w-auto flex items-center justify-center px-4 md:px-8 py-1.5 md:py-5 bg-zinc-50/60 lg:bg-zinc-50/80">
            <div className="flex items-center gap-4 md:gap-5">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrev}
                disabled={songIndex <= 0}
                className="size-9 md:size-11 rounded-xl md:rounded-2xl border-zinc-200 bg-white"
              >
                <ArrowLeft className="size-4 md:size-5" />
              </Button>
              <div className="flex flex-col items-center min-w-[36px] md:min-w-[40px]">
                <span className="text-base md:text-lg font-black text-zinc-900 tabular-nums leading-none">
                  {songIndex + 1}
                </span>
                <span className="text-[7px] md:text-[9px] font-bold text-zinc-400 tabular-nums mt-1 uppercase tracking-tighter">
                  de {setlist.songs.length}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={songIndex >= setlist.songs.length - 1}
                className="size-9 md:size-11 rounded-xl md:rounded-2xl border-zinc-200 bg-white"
              >
                <ArrowRight className="size-4 md:size-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
