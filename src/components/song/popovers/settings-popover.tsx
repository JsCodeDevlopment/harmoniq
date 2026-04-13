"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Guitar,
  LayoutGrid,
  LayoutPanelLeft,
  Music,
  Palette,
  Type,
} from "lucide-react";
import { RefObject } from "react";

interface SettingsPopoverProps {
  isOpen: boolean;
  localFontSize: string;
  localChordColor: string;
  localInstrument?: string; // "guitar" | "keyboard"
  onUpdate: (updates: {
    font_size?: string;
    chord_color?: string;
    instrument?: string;
  }) => void;
  popoverRef: RefObject<HTMLDivElement | null>;
  showTabs: boolean;
  onToggleTabs: (val: boolean) => void;
  showDiagrams: boolean;
  onToggleDiagrams: (val: boolean) => void;
}

export function SettingsPopover({
  isOpen,
  localFontSize,
  localChordColor,
  localInstrument = "guitar",
  onUpdate,
  popoverRef,
  showTabs,
  onToggleTabs,
  showDiagrams,
  onToggleDiagrams,
}: SettingsPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-4 md:right-6 top-16 w-72 bg-white border border-zinc-200 shadow-2xl rounded-3xl p-5 z-50"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Type className="w-3 h-3" /> Tamanho da Letra
              </div>
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                {[
                  { id: "xxsmall", label: "PPP" },
                  { id: "xsmall", label: "PP" },
                  { id: "small", label: "P" },
                  { id: "medium", label: "M" },
                  { id: "large", label: "G" },
                  { id: "xlarge", label: "XG" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdate({ font_size: s.id })}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all",
                      localFontSize === s.id
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-600",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Palette className="w-3 h-3" /> Cor dos Acordes
              </div>

              <div className="flex flex-wrap gap-2 justify-between">
                {[
                  { id: "yellow", color: "bg-yellow-500" },
                  { id: "blue", color: "bg-blue-500" },
                  { id: "green", color: "bg-green-500" },
                  { id: "white", color: "bg-zinc-200" },
                  { id: "orange", color: "bg-orange-500" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onUpdate({ chord_color: c.id })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                      localChordColor === c.id
                        ? "border-zinc-900 scale-110"
                        : "border-transparent",
                    )}
                  >
                    <div
                      className={cn("w-full h-full rounded-full", c.color)}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pb-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Music className="w-3 h-3" /> Visualização
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onToggleTabs(!showTabs)}
                  className={cn(
                    "w-full py-3 px-4 flex items-center justify-between rounded-xl transition-all border",
                    showTabs
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                      : "bg-zinc-50 border-zinc-100 text-zinc-500",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        showTabs
                          ? "bg-yellow-500 text-white"
                          : "bg-zinc-200 text-zinc-400",
                      )}
                    >
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-tight">
                        Exibir Tablaturas
                      </p>
                      <p className="text-[9px] opacity-70">
                        {showTabs ? "Habilitado" : "Desabilitado"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors p-1",
                      showTabs ? "bg-yellow-500" : "bg-zinc-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 bg-white rounded-full transition-all",
                        showTabs ? "ml-5" : "ml-0",
                      )}
                    />
                  </div>
                </button>

                <button
                  onClick={() => onToggleDiagrams(!showDiagrams)}
                  className={cn(
                    "w-full py-3 px-4 flex items-center justify-between rounded-xl transition-all border",
                    showDiagrams
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                      : "bg-zinc-50 border-zinc-100 text-zinc-500",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        showDiagrams
                          ? "bg-yellow-500 text-white"
                          : "bg-zinc-200 text-zinc-400",
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-tight">
                        Exibir Shapes
                      </p>
                      <p className="text-[9px] opacity-70">
                        {showDiagrams ? "Habilitado" : "Desabilitado"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors p-1",
                      showDiagrams ? "bg-yellow-500" : "bg-zinc-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 bg-white rounded-full transition-all",
                        showDiagrams ? "ml-5" : "ml-0",
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3 pb-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Guitar className="w-3 h-3" /> Instrumento
              </div>
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  onClick={() => onUpdate({ instrument: "guitar" })}
                  className={cn(
                    "flex-1 py-3 px-2 flex flex-col items-center gap-1.5 rounded-lg transition-all",
                    localInstrument === "guitar"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  <Guitar
                    className={cn(
                      "w-4 h-4",
                      localInstrument === "guitar"
                        ? "text-yellow-600"
                        : "text-zinc-400",
                    )}
                  />
                  <span className="text-[10px] font-bold">Violão/Guitarra</span>
                </button>
                <button
                  onClick={() => onUpdate({ instrument: "keyboard" })}
                  className={cn(
                    "flex-1 py-3 px-2 flex flex-col items-center gap-1.5 rounded-lg transition-all",
                    localInstrument === "keyboard"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700",
                  )}
                >
                  <LayoutPanelLeft
                    className={cn(
                      "w-4 h-4",
                      localInstrument === "keyboard"
                        ? "text-yellow-600"
                        : "text-zinc-400",
                    )}
                  />
                  <span className="text-[10px] font-bold">Teclado/Piano</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
