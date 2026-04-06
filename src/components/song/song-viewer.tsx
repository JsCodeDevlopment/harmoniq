"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Music } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useSetlist,
  useSetlists,
  useSharedSetlist,
} from "@/hooks/use-setlists.hook";
import { useGetSong } from "@/hooks/use-songs.hook";
import { useAuth } from "@/hooks/use-auth.hook";
import { NOTES, transposeChord } from "@/lib/chords";
import { ChordDiagram } from "@/components/chord-diagram";
import { CifraRenderer } from "./cifra-renderer";
import { Button } from "@/components/ui/button";

// Sub-components
import { SongHeader } from "./song-header";
import { SongUtilityBar } from "./song-utility-bar";
import { PerformanceHeader } from "./performance-header";
import { Setlist } from "./types";

export function SongViewer() {
  const { user, updateProfile } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawUrl = searchParams.get("url");
  const encodedId = searchParams.get("id");

  const url = useMemo(() => {
    if (rawUrl) return rawUrl;
    if (encodedId) {
      try {
        return decodeURIComponent(atob(encodedId));
      } catch {
        return "";
      }
    }
    return "";
  }, [rawUrl, encodedId]);
  
  const setlistId = searchParams.get("setlistId");
  const sharedId = searchParams.get("sharedId");
  const songIndexStr = searchParams.get("songIndex");
  const songIndex = songIndexStr ? parseInt(songIndexStr) : -1;

  const { setlist: privateSetlist, updateSong } = useSetlist(
    !sharedId && setlistId ? setlistId : "",
  );
  const { data: sharedSetlist } = useSharedSetlist(sharedId || "");
  const setlist = (sharedId ? sharedSetlist : privateSetlist) as Setlist | null;

  const { setlists = [], addSongToSetlist } = useSetlists();
  const { data: song, isLoading: loading, isError } = useGetSong(url);

  const [transpose, setTranspose] = useState(0);
  const [isKeyInitialized, setIsKeyInitialized] = useState(false);

  useEffect(() => {
    if (song && setlist && songIndex !== -1 && !isKeyInitialized) {
      const predefinedKey = setlist.songs[songIndex]?.key;
      if (predefinedKey && predefinedKey !== song.key) {
        const normalize = (k: string) => {
          const n = k.replace("m", "");
          if (n === "Db") return "C#";
          if (n === "Eb") return "D#";
          if (n === "Gb") return "F#";
          if (n === "Ab") return "G#";
          if (n === "Bb") return "A#";
          return n;
        };

        const targetIndex = NOTES.indexOf(normalize(predefinedKey));
        const originalIndex = NOTES.indexOf(normalize(song.key || "C"));

        if (targetIndex !== -1 && originalIndex !== -1) {
          const diff = targetIndex - originalIndex;
          setTranspose(diff);
          setIsKeyInitialized(true);
        }
      }
    }
  }, [song, setlist, songIndex, isKeyInitialized]);

  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed] = useState(1);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [showDiagrams, setShowDiagrams] = useState(false);
  const [showSetlistSelector, setShowSetlistSelector] = useState(false);
  const [variationsMap, setVariationsMap] = useState<Record<string, number>>({});
  const [showSettings, setShowSettings] = useState(false);

  // Refs for click outside
  const settingsRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const selectorBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showSettings && settingsRef.current && !settingsRef.current.contains(target) && 
          settingsBtnRef.current && !settingsBtnRef.current.contains(target)) {
        setShowSettings(false);
      }
      if (showSetlistSelector && selectorRef.current && !selectorRef.current.contains(target) && 
          selectorBtnRef.current && !selectorBtnRef.current.contains(target)) {
        setShowSetlistSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings, showSetlistSelector]);

  const [localFontSize, setLocalFontSize] = useState<string>("medium");
  const [localChordColor, setLocalChordColor] = useState<string>("yellow");

  useEffect(() => {
    if (user && !showSettings) {
      setLocalFontSize(user.font_size || "medium");
      setLocalChordColor(user.chord_color || "yellow");
    } 
    else if (!user && typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem("h_font_size");
      const savedChordColor = localStorage.getItem("h_chord_color");
      if (savedFontSize) setLocalFontSize(savedFontSize);
      if (savedChordColor) setLocalChordColor(savedChordColor);
    }
  }, [user, showSettings]);

  const handleUpdateSettings = async (updates: { font_size?: string; chord_color?: string }) => {
    if (updates.font_size) {
      setLocalFontSize(updates.font_size);
      if (typeof window !== 'undefined') localStorage.setItem("h_font_size", updates.font_size);
    }
    if (updates.chord_color) {
      setLocalChordColor(updates.chord_color);
      if (typeof window !== 'undefined') localStorage.setItem("h_chord_color", updates.chord_color);
    }
    if (user) {
      await updateProfile(updates);
    }
  };

  useEffect(() => {
    if (setlist && songIndex !== -1) {
      const predefinedVariations = setlist.songs[songIndex]?.chord_variations;
      if (predefinedVariations) {
        try {
          setVariationsMap(JSON.parse(predefinedVariations));
        } catch { }
      }
    }
  }, [setlist, songIndex]);

  const currentKey = transposeChord(song?.key || "C", transpose);

  const handleVariationChange = useCallback(
    (chord: string, index: number) => {
      setVariationsMap((prev) => {
        const newMap = { ...prev, [chord]: index };
        if (!sharedId && setlistId && setlist?.songs[songIndex]) {
          const targetSongId = setlist.songs[songIndex].id;
          updateSong({
            songId: targetSongId,
            key: currentKey,
            chord_variations: JSON.stringify(newMap),
          }).catch((err) => console.error("Could not save variation", err));
        }
        return newMap;
      });
    },
    [sharedId, setlistId, setlist, songIndex, currentKey, updateSong],
  );

  const handleVersionChange = useCallback((newUrl: string) => {
    if (!newUrl) return;
    
    // Encode the new URL to ID format if needed, or just update the raw URL
    const encoded = typeof btoa !== "undefined" ? btoa(encodeURIComponent(newUrl)) : "";
    
    // Construct new search params while preserving setlist context
    const params = new URLSearchParams(searchParams.toString());
    
    if (encodedId) {
      params.set("id", encoded);
    } else {
      params.set("url", newUrl);
    }
    
    // If it's in a setlist, update the setlist entry
    if (!sharedId && setlistId && setlist?.songs[songIndex]) {
      const targetSongId = setlist.songs[songIndex].id;
      updateSong({
        songId: targetSongId,
        url: newUrl, // Saving the new version's URL
      }).catch((err) => console.error("Could not update version in setlist", err));
    }

    router.replace(`/song?${params.toString()}`);
    toast.success("Trocando versão...", { duration: 1000 });
  }, [searchParams, encodedId, sharedId, setlistId, setlist, songIndex, updateSong, router]);

  const handleAddToSetlist = useCallback(
    async (targetSetlistId: number) => {
      if (!song) return;
      try {
        await addSongToSetlist({
          setlistId: targetSetlistId,
          song: {
            title: song.title,
            artist: song.artist,
            url: url, // This will be the current version's URL (original or simplified)
            key: currentKey,
          },
        });
        toast.success("Música adicionada!", {
          description: `"${song.title}" foi salva no seu repertório.`,
        });
        setShowSetlistSelector(false);
      } catch (err: unknown) {
        const msg = (err as any).response?.data?.message || "Não foi possível adicionar a música";
        toast.error("Erro ao adicionar", { description: msg });
      }
    },
    [song, url, addSongToSetlist, currentKey],
  );

  const goToNext = () => {
    if (setlist && songIndex < setlist.songs.length - 1) {
      const next = setlist.songs[songIndex + 1];
      const encodedUrl = typeof btoa !== "undefined" ? btoa(encodeURIComponent(next.url)) : "";
      const baseUrl = `/song?id=${encodedUrl}&songIndex=${songIndex + 1}`;
      const finalUrl = sharedId ? `${baseUrl}&sharedId=${sharedId}` : `${baseUrl}&setlistId=${setlistId}`;
      router.push(finalUrl);
    }
  };

  const goToPrev = () => {
    if (setlist && songIndex > 0) {
      const prev = setlist.songs[songIndex - 1];
      const encodedUrl = typeof btoa !== "undefined" ? btoa(encodeURIComponent(prev.url)) : "";
      const baseUrl = `/song?id=${encodedUrl}&songIndex=${songIndex - 1}`;
      const finalUrl = sharedId ? `${baseUrl}&sharedId=${sharedId}` : `${baseUrl}&setlistId=${setlistId}`;
      router.push(finalUrl);
    }
  };

  const error = isError ? "Não foi possível carregar a cifra." : null;

  useEffect(() => {
    if (!autoScroll) return;
    let rafId: number;
    let lastTime = performance.now();
    const scroll = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= 50) {
        window.scrollBy({ top: scrollSpeed, behavior: "auto" });
        lastTime = currentTime;
      }
      rafId = requestAnimationFrame(scroll);
    };
    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [autoScroll, scrollSpeed]);

  const handleKeyChange = (newKey: string | null) => {
    if (!newKey) return;
    const original = song?.key || "C";
    let baseNote = original;
    if (baseNote === "Db") baseNote = "C#";
    if (baseNote === "Eb") baseNote = "D#";
    if (baseNote === "Gb") baseNote = "F#";
    if (baseNote === "Ab") baseNote = "G#";
    if (baseNote === "Bb") baseNote = "A#";
    const targetIndex = NOTES.indexOf(newKey);
    const originalIndex = NOTES.indexOf(baseNote);
    if (targetIndex !== -1 && originalIndex !== -1) {
      const diff = targetIndex - originalIndex;
      setTranspose(diff);
    }
  };

  const songContent = song?.content;
  const uniqueChords = useMemo(() => {
    if (!songContent) return [];
    const matches = songContent.match(/<b>(.*?)<\/b>/g) || [];
    const chords = matches.map((m) => {
      const chordName = m.replace(/<\/?b>/g, "");
      return transposeChord(chordName, transpose);
    });
    return Array.from(new Set(chords));
  }, [songContent, transpose]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" strokeWidth={1.5} />
        <p className="text-zinc-400 font-medium text-sm tracking-wide animate-pulse">Preparando sua cifra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-200 flex items-center justify-center">
          <Music className="w-8 h-8 text-zinc-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-zinc-900 text-xl font-semibold">Falha ao carregar</h2>
          <p className="text-zinc-500 text-sm max-w-xs">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-lg border-zinc-200 text-zinc-600">Voltar</Button>
          <Button variant="yellow" onClick={() => router.push("/")} className="rounded-lg font-bold">Ir para o Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-500 selection:bg-yellow-500/30", performanceMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900")}>
      {!performanceMode && (
        <SongHeader 
          title={song?.title}
          artist={song?.artist}
          url={url}
          setlistId={setlistId}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          showSetlistSelector={showSetlistSelector}
          setShowSetlistSelector={setShowSetlistSelector}
          setPerformanceMode={setPerformanceMode}
          localFontSize={localFontSize}
          localChordColor={localChordColor}
          handleUpdateSettings={handleUpdateSettings}
          setlists={setlists}
          handleAddToSetlist={handleAddToSetlist}
          settingsRef={settingsRef}
          selectorRef={selectorRef}
          settingsBtnRef={settingsBtnRef}
          selectorBtnRef={selectorBtnRef}
        />
      )}

      <main className={cn("max-w-4xl mx-auto transition-all duration-500", performanceMode ? "mt-0 px-4 md:px-8" : "mt-6 md:mt-12 px-4 md:px-6")}>
        {performanceMode && (
          <PerformanceHeader 
            onExit={() => setPerformanceMode(false)}
            showDiagrams={showDiagrams}
            setShowDiagrams={setShowDiagrams}
            currentKey={currentKey}
            setTranspose={setTranspose}
            handleKeyChange={handleKeyChange}
            setlist={setlist}
            songIndex={songIndex}
            goToPrev={goToPrev}
            goToNext={goToNext}
          />
        )}

        {!performanceMode && (
          <SongUtilityBar 
            currentKey={currentKey}
            originalKey={song?.key}
            transpose={transpose}
            setTranspose={setTranspose}
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
            performanceMode={performanceMode}
            setPerformanceMode={setPerformanceMode}
            showDiagrams={showDiagrams}
            setShowDiagrams={setShowDiagrams}
            setlist={setlist}
            songIndex={songIndex}
            goToPrev={goToPrev}
            goToNext={goToNext}
            simplifiedUrl={song?.simplified_url}
            principalUrl={song?.principal_url}
            currentUrl={url}
            onVersionChange={handleVersionChange}
          />
        )}

        <div className={cn("transition-all duration-700", performanceMode ? "pt-24" : "mt-0")}>
          <AnimatePresence>
            {showDiagrams && uniqueChords.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                <div className={cn("p-4 md:p-6 rounded-2xl border transition-colors", performanceMode ? "bg-zinc-900 border-white/5" : "bg-white border-zinc-200 shadow-sm")}>
                  <h3 className={cn("text-[10px] font-bold uppercase tracking-widest mb-6 block", performanceMode ? "text-zinc-500" : "text-zinc-400")}>Diagramas da Música</h3>
                  <div className="flex flex-wrap gap-6 md:gap-8">
                    {uniqueChords.map((chord) => (<ChordDiagram key={chord} name={chord} dark={performanceMode} variationIndex={variationsMap[chord] || 0} />))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className={cn("cifra-content transition-all duration-300 overflow-x-auto pb-8 relative", performanceMode ? "tracking-wide font-medium" : "text-zinc-900 font-medium")} style={{ whiteSpace: "pre", fontFamily: "monospace", fontSize: performanceMode ? (localFontSize === 'xxsmall' ? '12px' : localFontSize === 'xsmall' ? '14px' : localFontSize === 'small' ? '18px' : localFontSize === 'medium' ? '24px' : localFontSize === 'large' ? '36px' : '48px') : (localFontSize === 'xxsmall' ? '9px' : localFontSize === 'xsmall' ? '10px' : localFontSize === 'small' ? '11px' : localFontSize === 'medium' ? '14px' : localFontSize === 'large' ? '18px' : '22px'), lineHeight: performanceMode ? '2.1' : '1.9' }}>
            <CifraRenderer content={song?.content || ""} transpose={transpose} performanceMode={performanceMode} chordColor={localChordColor} variations={variationsMap} onVariationChange={handleVariationChange} />
          </motion.div>
          <div className="h-48" />
        </div>
      </main>
    </div>
  );
}
