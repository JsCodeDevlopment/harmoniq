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
  MoreHorizontal,
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
  keyboardUrl,
  versions,
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
          <div className="flex-[1.2] md:flex-[0.8] flex items-center justify-center md:justify-start px-3 py-1.5 md:px-6 md:py-1.5 gap-2 md:gap-4">
            <div className="flex flex-col md:w-auto">
              <span className="hidden md:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Tonalidade
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center bg-white border border-zinc-200/80 rounded-lg p-0.5 shadow-sm">
                  <button
                    onClick={() => setTranspose((t) => t - 1)}
                    className="size-6 rounded-md bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition-all flex items-center justify-center border border-zinc-200/50 active:scale-95"
                  >
                    <Minus className="size-2.5" />
                  </button>
                  <div className="min-w-[36px] md:min-w-[40px] text-center font-black text-xs md:text-base text-zinc-900 tabular-nums">
                    {currentKey}
                  </div>
                  <button
                    onClick={() => setTranspose((t) => t + 1)}
                    className="size-6 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black shadow-sm transition-all flex items-center justify-center border border-yellow-600 active:scale-95"
                  >
                    <Plus className="size-2.5" />
                  </button>
                </div>
                {originalKey && (
                  <div className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-lg bg-zinc-100/50 border border-zinc-200/30">
                    <span className="text-[7px] font-bold text-zinc-400 uppercase leading-none mb-0.5">
                      Original
                    </span>
                    <span className="text-[9px] font-black text-zinc-600">
                      {originalKey}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module: Auto Scroll (Mobile Only) */}
          <div className="flex md:hidden flex-1 items-center justify-center px-3 py-2 bg-zinc-900">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn(
                "w-full h-9 rounded-xl font-bold uppercase text-[9px] transition-all border",
                autoScroll
                  ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700",
              )}
            >
              {autoScroll ? "Pausar" : "Auto Scroll"}
            </button>
          </div>

          {/* Module: Visual & Versão (Desktop Only) - Now expanded to fill space */}
          <div className="hidden md:flex flex-[2.8] items-center px-6 py-1.5 gap-6 bg-zinc-50/20">
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Visual & Versão
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                {/* Visual Toggles Group */}
                <div className="flex items-center bg-white p-0.5 rounded-lg border border-zinc-200/80 shadow-sm">
                  <button
                    onClick={() => setShowDiagrams(!showDiagrams)}
                    className={cn(
                      "h-6 px-3 rounded-md transition-all flex items-center gap-1.5 font-bold text-[8.5px] uppercase",
                      showDiagrams
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600",
                    )}
                  >
                    <LayoutGrid className="size-2.5" />
                    <span>Shapes</span>
                  </button>

                  <div className="w-px h-3 bg-zinc-100 mx-0.5" />

                  <button
                    onClick={() => setShowTabs(!showTabs)}
                    className={cn(
                      "h-6 px-3 rounded-md transition-all flex items-center gap-1.5 font-bold text-[8.5px] uppercase",
                      showTabs
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600",
                    )}
                  >
                    <Music className="size-2.5" />
                    <span>{showTabs ? "Tabs" : "Sem Tabs"}</span>
                  </button>
                </div>

                {/* Versions Group */}
                {versions && versions.length > 0 && (
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-zinc-200/80 shadow-sm">
                    {(() => {
                      const principal = versions.find(v => v.name === "Principal");
                      const simplified = versions.find(v => v.name === "Simplificada");
                      const others = versions.filter(v => v.name !== "Principal" && v.name !== "Simplificada");
                      
                      const mainOnes = [];
                      if (principal) mainOnes.push(principal);
                      if (simplified) mainOnes.push(simplified);

                      return (
                        <div className="flex items-center gap-1">
                          {mainOnes.map((v) => {
                            const isSimplified = v.name === "Simplificada";
                            const isActive = currentUrl === v.url;
                            
                            return (
                              <button
                                key={v.url}
                                onClick={() => onVersionChange(v.url)}
                                className={cn(
                                  "h-6 px-3 rounded-md text-[8.5px] font-bold uppercase transition-all flex items-center gap-1.5",
                                  isActive
                                    ? isSimplified ? "bg-yellow-500 text-black shadow-sm" : "bg-zinc-900 text-white shadow-sm"
                                    : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600",
                                )}
                              >
                                {isSimplified && <Zap className="size-2 fill-current" />}
                                {v.name.replace("Simplificada", "Simples")}
                              </button>
                            );
                          })}
                          
                          {others.length > 0 && (
                            <div className="relative h-6 px-3 rounded-md flex items-center gap-1.5 transition-all text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 cursor-pointer">
                              <select
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                onChange={(e) => onVersionChange(e.target.value)}
                                value={others.find(v => v.url === currentUrl) ? currentUrl : ""}
                              >
                                <option value="" disabled>Mais...</option>
                                {others.map(v => (
                                  <option key={v.url} value={v.url}>{v.name}</option>
                                ))}
                              </select>
                              <MoreHorizontal className={cn(
                                "size-3.5",
                                others.some(v => v.url === currentUrl) ? "text-zinc-900" : ""
                              )} />
                              <span className={cn(
                                "text-[8.5px] font-bold uppercase",
                                others.some(v => v.url === currentUrl) ? "text-zinc-900" : ""
                              )}>Mais</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Desktop Preferences (Mobile Hidden) */}
        <div className="hidden md:flex flex-row divide-x divide-zinc-100 border-t border-zinc-100 bg-white/50">
          {/* Module: Instrumento */}
          <div className="flex-1 flex flex-col justify-center px-6 py-1.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
              Escolher Instrumento
            </span>
            <div className="flex bg-zinc-100/50 p-0.5 rounded-lg border border-zinc-200/50 mt-0.5 w-fit shadow-sm">
              <button
                onClick={() => {
                  handleUpdateSettings({ instrument: "guitar" });
                  if (isKeyboardVersion && principalUrl)
                    onVersionChange(principalUrl);
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all",
                  localInstrument === "guitar"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                <Guitar className="size-2.5" />
                <span className="text-[8.5px] font-bold uppercase">
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
                  "px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all",
                  localInstrument === "keyboard"
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-400 hover:text-zinc-600",
                )}
              >
                <LayoutPanelLeft className="size-2.5" />
                <span className="text-[8.5px] font-bold uppercase">
                  Teclado / Piano
                </span>
              </button>
            </div>
          </div>

          {/* Module: Aparência (Stacked) */}
          <div className="flex-1 flex flex-col justify-center px-6 py-1.5 bg-zinc-50/10">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
              Aparência do Texto
            </span>
            <div className="flex flex-col gap-0.5 mt-0.5">
              <div className="flex items-center gap-0.5 bg-zinc-100/50 p-0.5 rounded-lg border border-zinc-200/50 h-[24px] shadow-sm w-fit">
                <Type className="size-3 text-zinc-300 mx-1" />
                {fontSizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateSettings({ font_size: s.id })}
                    className={cn(
                      "min-w-6 h-6 px-1 flex items-center justify-center rounded-lg font-black text-[9px] uppercase transition-all",
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
              <div className="flex items-center gap-3 bg-zinc-100/50 px-1.5 py-0.5 rounded-lg border border-zinc-200/50 h-[24px] shadow-sm w-fit">
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

          {/* Module: Auto Scroll (Moved here for better visibility) */}
          <div className="flex-[0.8] flex flex-col justify-center px-6 py-1.5 bg-zinc-900 text-white">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest opacity-60 mb-1">
              Rolagem Automática
            </span>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn(
                "h-6.5 px-3 rounded-lg font-bold uppercase text-[8.5px] transition-all border w-full",
                autoScroll
                  ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700",
              )}
            >
              {autoScroll ? "Pausar Scroll" : "Ativar Auto Scroll"}
            </button>
          </div>

          {/* Module: Setlist */}
          {setlist && (
            <div className="flex-[0.6] flex flex-col justify-center px-6 py-1.5 bg-zinc-50/30">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                Setlist
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrev}
                  disabled={songIndex <= 0}
                  className="size-6 rounded-md border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm"
                >
                  <ArrowLeft className="size-2.5" />
                </Button>
                <div className="flex-1 text-center font-black text-[10px] text-zinc-900 tabular-nums">
                  {songIndex + 1} / {setlist.songs.length}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  disabled={songIndex >= setlist.songs.length - 1}
                  className="size-6 rounded-md border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm"
                >
                  <ArrowRight className="size-2.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
