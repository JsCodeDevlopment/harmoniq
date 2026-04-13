"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Guitar,
  LayoutGrid,
  LayoutPanelLeft,
  Minus,
  Music,
  Palette,
  Plus,
  Type,
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
  keyboardUrl,
  currentUrl,
  onVersionChange,
  localFontSize,
  localChordColor,
  localInstrument,
  handleUpdateSettings,
  showTabs,
  setShowTabs,
}: SongUtilityBarProps) {
  const isSimplified = currentUrl === simplifiedUrl;
  const isKeyboardVersion = currentUrl === keyboardUrl;
  const hasAlternative =
    (!!simplifiedUrl && !!principalUrl && simplifiedUrl !== principalUrl) ||
    (!!keyboardUrl && !!principalUrl && keyboardUrl !== principalUrl);

  const fontSizes = [
    { id: "xxsmall", label: "PPP" },
    { id: "xsmall", label: "PP" },
    { id: "small", label: "P" },
    { id: "medium", label: "M" },
    { id: "large", label: "G" },
    { id: "extra-large", label: "XG" },
  ];

  return (
    <div className="sticky top-[100px] md:top-[86px] z-40 mb-10 px-2 md:px-0">
      <div className="bg-white/90 backdrop-blur-2xl border border-zinc-200/60 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col transition-all duration-500">
        {/* Row 1: Core Controls (Mobile High Density) */}
        <div className="flex flex-row md:flex-row items-center divide-x divide-zinc-100">
          {/* Module: Tonalidade (Always Visible) */}
          <div className="flex-[1.2] md:flex-[0.8] flex items-center justify-center md:justify-start px-3 py-3 md:px-6 md:py-4 gap-2 md:gap-4">
            <div className="flex flex-col md:w-auto">
              <span className="hidden md:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Tonalidade
              </span>
              <div className="flex items-center gap-2 md:gap-3 md:mt-1.5 overflow-hidden">
                <div className="flex items-center bg-zinc-50 border border-zinc-200/50 rounded-xl p-0.5 shadow-sm">
                  <Button
                    variant="yellow"
                    size="icon"
                    onClick={() => setTranspose((t) => t - 1)}
                    className="size-7 md:size-8 rounded-lg"
                  >
                    <Minus className="size-3 md:size-4" />
                  </Button>
                  <div className="min-w-[32px] md:min-w-[40px] text-center font-black text-sm md:text-lg text-zinc-900 tabular-nums">
                    {currentKey}
                  </div>
                  <Button
                    variant="yellow"
                    size="icon"
                    onClick={() => setTranspose((t) => t + 1)}
                    className="size-7 md:size-8 rounded-lg"
                  >
                    <Plus className="size-3 md:size-4" />
                  </Button>
                </div>
                {originalKey && (
                  <div className="flex flex-col items-center justify-center h-full px-1.5 py-1 rounded-lg bg-zinc-100/50 border border-zinc-200/30">
                    <span className="text-[7px] font-bold text-zinc-400 uppercase leading-none mb-0.5 whitespace-nowrap">
                      Original
                    </span>
                    <span className="text-[10px] md:text-xs font-black text-zinc-600 leading-none">
                      {originalKey}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module: Versões & Visual (Desktop Only) */}
          <div className="hidden md:flex flex-1 items-center px-6 py-4 gap-6 bg-zinc-50/20">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Visual & Versão
              </span>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => setShowDiagrams(!showDiagrams)}
                  className={cn(
                    "h-9 px-3.5 rounded-xl transition-all flex items-center gap-2 font-bold text-[10px] uppercase border",
                    showDiagrams
                      ? "bg-yellow-500 border-yellow-600 text-black shadow-md shadow-yellow-500/20"
                      : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50",
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                  <span>Shapes</span>
                </button>

                <button
                  onClick={() => setShowTabs(!showTabs)}
                  className={cn(
                    "h-9 px-3.5 rounded-xl transition-all flex items-center gap-2 font-bold text-[10px] uppercase border",
                    showTabs
                      ? "bg-yellow-500 border-yellow-600 text-black shadow-md shadow-yellow-500/20"
                      : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50",
                  )}
                >
                  <Music className="size-3.5" />
                  <span>{showTabs ? "Ocultar Tabs" : "Exibir Tabs"}</span>
                </button>

                {hasAlternative && (
                  <div className="flex items-center bg-white p-0.5 rounded-xl border border-zinc-200/80 shadow-sm">
                    <button
                      onClick={() => onVersionChange(principalUrl!)}
                      className={cn(
                        "h-7.5 px-3 rounded-lg text-[9px] font-bold uppercase transition-all",
                        !isSimplified && !isKeyboardVersion
                          ? "bg-zinc-900 text-white shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-50",
                      )}
                    >
                      Principal
                    </button>
                    {simplifiedUrl && (
                      <button
                        onClick={() => onVersionChange(simplifiedUrl)}
                        className={cn(
                          "h-7.5 px-3 rounded-lg text-[9px] font-bold uppercase transition-all",
                          isSimplified
                            ? "bg-yellow-500 text-black shadow-sm"
                            : "text-zinc-400 hover:bg-zinc-50",
                        )}
                      >
                        Simples
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module: Performance (Always Visible) */}
          <div className="flex-1 md:flex-[0.8] flex items-center px-3 py-3 md:px-6 md:py-4 bg-zinc-900 text-white border-l border-zinc-800 shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col w-full">
              <span className="hidden md:block text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-2">
                Performance
              </span>
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={cn(
                    "flex-1 h-8 md:h-9 rounded-xl font-bold uppercase text-[9px] md:text-[10px] transition-all border",
                    autoScroll
                      ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700",
                  )}
                >
                  {autoScroll ? "Pausar" : "Auto Scroll"}
                </button>
                {/* <button
                  onClick={() => setPerformanceMode(true)}
                  className="h-8 md:h-9 px-3 md:px-4 rounded-xl bg-white text-zinc-900 font-bold uppercase text-[9px] md:text-[10px] whitespace-nowrap hover:bg-zinc-100 shadow-md transition-all active:scale-95"
                >
                  Live
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Desktop Preferences (Mobile Hidden) */}
        <div className="hidden md:flex flex-row divide-x divide-zinc-100 border-t border-zinc-100 bg-white/50">
          {/* Module: Instrumento */}
          <div className="flex-1 flex flex-col justify-center px-6 py-4">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
              Escolher Instrumento
            </span>
            <div className="flex bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50 mt-1.5 w-fit shadow-sm">
              <button
                onClick={() => {
                  handleUpdateSettings({ instrument: "guitar" });
                  if (isKeyboardVersion && principalUrl)
                    onVersionChange(principalUrl);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all",
                  localInstrument === "guitar"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                <Guitar className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">
                  Guitarra / Violão
                </span>
              </button>
              <button
                onClick={() => {
                  handleUpdateSettings({ instrument: "keyboard" });
                  if (keyboardUrl && currentUrl !== keyboardUrl)
                    onVersionChange(keyboardUrl);
                }}
                className={cn(
                  "px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all",
                  localInstrument === "keyboard"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                <LayoutPanelLeft className="size-3.5" />
                <span className="text-[10px] font-bold uppercase">
                  Teclado / Piano
                </span>
              </button>
            </div>
          </div>

          {/* Module: Aparência (Fonte Expandida) */}
          <div className="flex-1 flex flex-col justify-center px-6 py-4 bg-zinc-50/10">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
              Aparência do Texto
            </span>
            <div className="flex items-center gap-6 mt-1.5">
              <div className="flex items-center gap-0.5 bg-zinc-100/50 p-1 rounded-xl border border-zinc-200/50 h-[38px] shadow-sm">
                <Type className="size-3 text-zinc-300 mx-1" />
                {fontSizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateSettings({ font_size: s.id })}
                    className={cn(
                      "min-w-6 h-7 px-1 flex items-center justify-center rounded-lg font-black text-[9px] uppercase transition-all",
                      localFontSize === s.id
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                        : "text-zinc-400 hover:text-zinc-500",
                    )}
                    title={s.id}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 bg-zinc-100/50 px-3 py-1.5 rounded-xl border border-zinc-200/50 h-[38px] shadow-sm">
                <Palette className="size-3.5 text-zinc-300" />
                {[
                  { id: "yellow", color: "bg-yellow-400" },
                  { id: "blue", color: "bg-blue-400" },
                  { id: "green", color: "bg-green-400" },
                  { id: "white", color: "bg-zinc-200" },
                  { id: "orange", color: "bg-orange-400" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleUpdateSettings({ chord_color: c.id })}
                    className={cn(
                      "size-4 rounded-full border-2 transition-all shadow-sm active:scale-90",
                      c.color,
                      localChordColor === c.id
                        ? "scale-125 border-white ring-1 ring-zinc-400"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Module: Setlist */}
          {setlist && (
            <div className="flex-[0.6] flex flex-col justify-center px-6 py-4 bg-zinc-50/30">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Setlist
              </span>
              <div className="flex items-center gap-4 mt-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  disabled={songIndex <= 0}
                  className="size-8 rounded-lg border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm"
                >
                  <ArrowLeft className="size-3.5" />
                </Button>
                <div className="flex-1 text-center font-black text-sm text-zinc-900 tabular-nums">
                  {songIndex + 1} / {setlist.songs.length}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  disabled={songIndex >= setlist.songs.length - 1}
                  className="size-8 rounded-lg border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm"
                >
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
