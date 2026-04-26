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
  Music,
  MoreHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingsPopover } from "./popovers/settings-popover";
import { SetlistSelectorPopover } from "./popovers/setlist-selector-popover";

import { SongHeaderProps } from "./types";

export function SongHeader({
  title,
  artist,
  artistImage,
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
  versions,
  currentUrl,
  onVersionChange,
  showTabs,
  setShowTabs,
  showDiagrams,
  setShowDiagrams,
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
        
        <div className="flex-1 flex items-center justify-center gap-3 px-2 md:px-4 overflow-hidden">
          {artistImage && (
            <div className="relative flex-shrink-0">
              <img 
                src={artistImage} 
                alt={artist} 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
            </div>
          )}
          <div className="text-center md:text-left overflow-hidden">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="font-semibold text-sm md:text-lg text-zinc-950 truncate tracking-tight leading-tight">{title}</h1>
              {isSaved && <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={3} />}
            </div>
            <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5 truncate">{artist}</p>
          </div>
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
      {versions && versions.length > 1 && (
        <div className="md:hidden flex items-center gap-2 pb-3 px-4 overflow-x-auto no-scrollbar">
           {(() => {
             const principal = versions.find(v => v.name === "Principal");
             const simplified = versions.find(v => v.name === "Simplificada");
             const others = versions.filter(v => v.name !== "Principal" && v.name !== "Simplificada");
             
             const mainOnes = [];
             if (principal) mainOnes.push(principal);
             if (simplified) mainOnes.push(simplified);

             return (
               <>
                 {mainOnes.map((v) => {
                   const isSimplified = v.name === "Simplificada";
                   const isActive = currentUrl === v.url;
                   
                   return (
                     <button
                       key={v.url}
                       onClick={() => onVersionChange?.(v.url)}
                       className={cn(
                         "flex-1 min-w-[80px] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all flex items-center justify-center gap-1",
                         isActive 
                          ? isSimplified ? "bg-yellow-500 text-black border-yellow-500" : "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-400 border-zinc-100"
                       )}
                     >
                       {isSimplified && <Zap className="size-3 fill-current" />}
                       {v.name.replace("Simplificada", "Simples")}
                     </button>
                   );
                 })}
                 
                 {others.length > 0 && (
                   <div className="relative flex-1 min-w-[80px]">
                     <select
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       onChange={(e) => onVersionChange?.(e.target.value)}
                       value={others.find(v => v.url === currentUrl) ? currentUrl : ""}
                     >
                       <option value="" disabled>Mais...</option>
                       {others.map(v => (
                         <option key={v.url} value={v.url}>{v.name}</option>
                       ))}
                     </select>
                     <div className={cn(
                       "py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight border transition-all flex items-center justify-center gap-1",
                       others.some(v => v.url === currentUrl) ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-400 border-zinc-100"
                     )}>
                       <MoreHorizontal className="size-3" />
                       Mais
                     </div>
                   </div>
                 )}
               </>
             );
           })()}
        </div>
      )}

      <SettingsPopover 
        isOpen={showSettings}
        localFontSize={localFontSize}
        localChordColor={localChordColor}
        localInstrument={localInstrument}
        onUpdate={handleUpdateSettings}
        popoverRef={settingsRef}
        showTabs={showTabs}
        onToggleTabs={setShowTabs}
        showDiagrams={showDiagrams}
        onToggleDiagrams={setShowDiagrams}
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
