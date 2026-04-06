"use client";

import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  Home, 
  Type, 
  Settings, 
  ListMusic, 
  Maximize2,
  Check,
  Zap,
  Music
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingsPopover } from "./popovers/settings-popover";
import { SetlistSelectorPopover } from "./popovers/setlist-selector-popover";

import { SongHeaderProps } from "./types";

export function SongHeader({
  title,
  artist,
  url,
  setlistId,
  showSettings,
  setShowSettings,
  showSetlistSelector,
  setShowSetlistSelector,
  setPerformanceMode,
  localFontSize,
  localChordColor,
  localInstrument,
  handleUpdateSettings,
  setlists,
  handleAddToSetlist,
  settingsRef,
  selectorRef,
  settingsBtnRef,
  selectorBtnRef,
  simplifiedUrl,
  principalUrl,
  keyboardUrl,
  currentUrl,
  onVersionChange,
}: SongHeaderProps) {
  const router = useRouter();
  const isSaved = typeof window !== 'undefined' ? localStorage.getItem(`song:${url}`) : false;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-zinc-100 rounded-lg transition-all text-zinc-400 hover:text-zinc-900" 
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push("/")} 
            className="p-2 hover:bg-zinc-100 rounded-lg transition-all text-zinc-400 hover:text-zinc-900" 
            title="Ir para o Início"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center flex-1 px-2 md:px-4 overflow-hidden">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-semibold text-base md:text-xl text-zinc-950 truncate tracking-tight">{title}</h1>
            {isSaved && <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={3} />}
          </div>
          <p className="text-[9px] md:text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5 truncate">{artist}</p>
        </div>

        <div className="flex items-center gap-2 px-1">
          <button 
            ref={settingsBtnRef}
            onClick={() => setShowSettings(!showSettings)} 
            className={cn("p-2 rounded-lg transition-all md:hidden", showSettings ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900")} 
            title="Configurações de Exibição"
          >
            <div className="relative">
              <Type className="w-5 h-5" />
              <Settings className="w-2.5 h-2.5 absolute -right-0.5 -bottom-0.5 bg-white rounded-full p-0.5 text-zinc-900" strokeWidth={3} />
            </div>
          </button>
          
          {!setlistId && (
            <button 
              ref={selectorBtnRef}
              onClick={() => setShowSetlistSelector(!showSetlistSelector)} 
              className={cn("p-2 rounded-lg transition-all", showSetlistSelector ? "bg-yellow-100 text-yellow-600" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900")} 
              title="Adicionar ao Repertório"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={() => setPerformanceMode(true)} 
            className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-all text-zinc-600"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile-only Version Selector */}
      {(simplifiedUrl || keyboardUrl) && (
        <div className="md:hidden flex items-center justify-center gap-2 pb-3 px-4">
           {principalUrl && (
             <button
               onClick={() => onVersionChange?.(principalUrl)}
               className={cn(
                 "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all",
                 currentUrl !== simplifiedUrl && currentUrl !== keyboardUrl ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-400 border-zinc-100"
               )}
             >
               Principal
             </button>
           )}
           {simplifiedUrl && (
             <button
               onClick={() => onVersionChange?.(simplifiedUrl)}
               className={cn(
                 "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all flex items-center justify-center gap-1",
                 currentUrl === simplifiedUrl ? "bg-yellow-500 text-black border-yellow-500" : "bg-white text-zinc-400 border-zinc-100"
               )}
             >
               <Zap className="size-3 fill-current" />
               Simples
             </button>
           )}
           {keyboardUrl && (
             <button
               onClick={() => onVersionChange?.(keyboardUrl)}
               className={cn(
                 "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all flex items-center justify-center gap-1",
                 currentUrl === keyboardUrl ? "bg-blue-500 text-white border-blue-500" : "bg-white text-zinc-400 border-zinc-100"
               )}
             >
               <Music className="size-3 fill-current" />
               Teclado
             </button>
           )}
        </div>
      )}

      <SettingsPopover 
        isOpen={showSettings}
        localFontSize={localFontSize}
        localChordColor={localChordColor}
        localInstrument={localInstrument}
        onUpdate={handleUpdateSettings}
        popoverRef={settingsRef}
      />

      <SetlistSelectorPopover 
        isOpen={showSetlistSelector}
        setlists={setlists}
        onAdd={handleAddToSetlist}
        popoverRef={selectorRef}
      />
    </header>
  );
}
