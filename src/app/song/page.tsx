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
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  LayoutGrid,
  ListMusic,
  Loader2,
  Maximize2,
  Minus,
  Music,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
// import { useSetlistMock, useSetlistsMock } from "@/hooks/use-setlists-mock.hook";
import {
  useSetlist,
  useSetlists,
  useSharedSetlist,
} from "@/hooks/use-setlists.hook";
import { useGetSong } from "@/hooks/use-songs.hook";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function transposeChord(chord: string, amount: number) {
  return chord.replace(/[A-G][#b]?/g, (match) => {
    let note = match;
    if (note === "Db") note = "C#";
    if (note === "Eb") note = "D#";
    if (note === "Gb") note = "F#";
    if (note === "Ab") note = "G#";
    if (note === "Bb") note = "A#";

    const index = NOTES.indexOf(note);
    if (index === -1) return match;

    let newIndex = (index + amount) % 12;
    if (newIndex < 0) newIndex += 12;
    return NOTES[newIndex];
  });
}

import { ChordDiagram } from "@/components/chord-diagram";

function SongViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawUrl = searchParams.get("url");
  const encodedId = searchParams.get("id");
  
  const url = useMemo(() => {
    if (rawUrl) return rawUrl;
    if (encodedId) {
       try {
         return decodeURIComponent(atob(encodedId));
       } catch (e) {
         return "";
       }
    }
    return "";
  }, [rawUrl, encodedId]);
  const setlistId = searchParams.get("setlistId");
  const sharedId = searchParams.get("sharedId");
  const songIndexStr = searchParams.get("songIndex");
  const songIndex = songIndexStr ? parseInt(songIndexStr) : -1;

  // Real API hooks
  const { setlist: privateSetlist } = useSetlist(
    !sharedId && setlistId ? setlistId : "",
  );
  const { data: sharedSetlist } = useSharedSetlist(sharedId || "");
  const setlist = sharedId ? sharedSetlist : privateSetlist;

  const { setlists = [], addSongToSetlist } = useSetlists();
  const { data: song, isLoading: loading, isError } = useGetSong(url);

  const [transpose, setTranspose] = useState(0);

  const [isKeyInitialized, setIsKeyInitialized] = useState(false);

  // Auto-transpose logic
  useEffect(() => {
    if (song && setlist && songIndex !== -1 && !isKeyInitialized) {
      const predefinedKey = setlist.songs[songIndex]?.key;
      if (predefinedKey && predefinedKey !== song.key) {
        const notes = [
          "C",
          "C#",
          "D",
          "D#",
          "E",
          "F",
          "F#",
          "G",
          "G#",
          "A",
          "A#",
          "B",
        ];
        const normalize = (k: string) => {
          const n = k.replace("m", "");
          if (n === "Db") return "C#";
          if (n === "Eb") return "D#";
          if (n === "Gb") return "F#";
          if (n === "Ab") return "G#";
          if (n === "Bb") return "A#";
          return n;
        };

        const targetIndex = notes.indexOf(normalize(predefinedKey));
        const originalIndex = notes.indexOf(normalize(song.key || "C"));

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

  const currentKey = transposeChord(song?.key || "C", transpose);

  const handleAddToSetlist = useCallback(
    async (targetSetlistId: number) => {
      if (!song) return;

      try {
        await addSongToSetlist({
          setlistId: targetSetlistId,
          song: {
            title: song.title,
            artist: song.artist,
            url: url,
            key: currentKey, // Use the current transposed key
          },
        });
        toast.success("Música adicionada!", {
          description: `"${song.title}" foi salva no seu repertório.`,
        });
        setShowSetlistSelector(false);
      } catch (err: unknown) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        const msg =
          axiosError.response?.data?.message ||
          "Não foi possível adicionar a música";
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
      const finalUrl = sharedId
        ? `${baseUrl}&sharedId=${sharedId}`
        : `${baseUrl}&setlistId=${setlistId}`;
      router.push(finalUrl);
    }
  };

  const goToPrev = () => {
    if (setlist && songIndex > 0) {
      const prev = setlist.songs[songIndex - 1];
      const encodedUrl = typeof btoa !== "undefined" ? btoa(encodeURIComponent(prev.url)) : "";
      const baseUrl = `/song?id=${encodedUrl}&songIndex=${songIndex - 1}`;
      const finalUrl = sharedId
        ? `${baseUrl}&sharedId=${sharedId}`
        : `${baseUrl}&setlistId=${setlistId}`;
      router.push(finalUrl);
    }
  };

  const error = isError ? "Não foi possível carregar a cifra." : null;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoScroll) {
      interval = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 50);
    }
    return () => clearInterval(interval);
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
        <Loader2
          className="w-10 h-10 text-yellow-500 animate-spin"
          strokeWidth={1.5}
        />
        <p className="text-zinc-400 font-medium text-sm tracking-wide animate-pulse">
          Preparando sua cifra...
        </p>
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
          <h2 className="text-zinc-900 text-xl font-semibold">
            Falha ao carregar
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="rounded-lg border-zinc-200 text-zinc-600"
        >
          Voltar para a busca
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500 selection:bg-yellow-500/30",
        performanceMode
          ? "bg-black text-white"
          : "bg-zinc-50 text-zinc-900 pb-32",
      )}
    >
      {!performanceMode && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-all text-zinc-400 hover:text-zinc-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1 px-2 md:px-4 overflow-hidden">
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-semibold text-base md:text-xl text-zinc-950 truncate tracking-tight">
                  {song?.title}
                </h1>
                {localStorage.getItem(`song:${url}`) && (
                  <Check
                    className="w-3.5 h-3.5 text-green-500"
                    strokeWidth={3}
                  />
                )}
              </div>
              <p className="text-[9px] md:text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5 truncate">
                {song?.artist}
              </p>
            </div>
            <div className="flex items-center gap-2 px-1">
              {!setlistId && (
                <button
                  onClick={() => setShowSetlistSelector(!showSetlistSelector)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    showSetlistSelector
                      ? "bg-yellow-100 text-yellow-600"
                      : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900",
                  )}
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

          <AnimatePresence>
            {showSetlistSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-6 top-16 w-64 bg-white border border-zinc-200 shadow-2xl rounded-2xl p-4 z-50"
              >
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-1">
                  Escolha um repertório
                </h4>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                  {setlists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => handleAddToSetlist(list.id)}
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
                      <p className="text-xs text-zinc-400 mb-3">
                        Nenhum repertório criado
                      </p>
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
        </header>
      )}

      <main
        className={cn(
          "max-w-4xl mx-auto transition-all duration-500",
          performanceMode ? "mt-0 px-4 md:px-8" : "mt-6 md:mt-12 px-4 md:px-6",
        )}
      >
        {performanceMode && (
          <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setPerformanceMode(false)}
              className="text-zinc-500 hover:text-white flex items-center gap-2 font-semibold text-[10px] md:text-xs uppercase tracking-wider transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Sair
            </button>
            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setShowDiagrams(!showDiagrams)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  showDiagrams
                    ? "text-yellow-500 bg-white/5"
                    : "text-zinc-500 hover:text-white",
                )}
                title={
                  showDiagrams ? "Esconder Diagramas" : "Mostrar Diagramas"
                }
              >
                <LayoutGrid className="w-5 h-5" />
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
                  <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 opacity-60">
                    Tom
                  </span>
                  <Select value={currentKey} onValueChange={handleKeyChange}>
                    <SelectTrigger className="h-6 md:h-7 border-none bg-transparent hover:bg-white/5 font-bold text-yellow-500 text-lg md:text-xl p-0 pr-4 shadow-none focus:ring-0">
                      <SelectValue>{currentKey}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {NOTES.map((note) => (
                        <SelectItem
                          key={note}
                          value={note}
                          className="focus:bg-yellow-500/10 focus:text-yellow-500 cursor-pointer"
                        >
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
                    <span className="text-[10px] font-bold text-yellow-500 tabular-nums leading-none">
                      {songIndex + 1}
                    </span>
                    <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-tighter leading-none mt-0.5">
                      de {setlist.songs.length}
                    </span>
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
        )}

        <div
          className={cn(
            "mb-12 transition-all duration-700",
            performanceMode ? "pt-24" : "block",
          )}
        >
          {!performanceMode && (
            <div className="bg-white border border-zinc-200 rounded-4xl shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
              {/* Module: Tonalidade */}
              <div className="flex-[1.2] flex items-center gap-4 px-6 py-5">
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2.5 opacity-60">
                    Tonalidade
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-zinc-50 border border-zinc-100 rounded-2xl p-1 shadow-inner">
                      <Button
                        variant="yellow"
                        size="icon-xs"
                        onClick={() => setTranspose((t) => t - 1)}
                        className="rounded-xl size-9 hover:scale-105 active:scale-95 transition-all shadow-md"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <div className="min-w-[56px] text-center font-black text-xl text-zinc-900 tabular-nums tracking-tighter">
                        {currentKey}
                      </div>
                      <Button
                        variant="yellow"
                        size="icon-xs"
                        onClick={() => setTranspose((t) => t + 1)}
                        className="rounded-xl size-9 hover:scale-105 active:scale-95 transition-all shadow-md"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-zinc-100/50 text-[10px] font-bold text-zinc-500 border border-zinc-100/30">
                      TOM ORIGINAL:{" "}
                      <span className="text-zinc-900 ml-1">{song?.key}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module: Execução */}
              <div className="flex-1 flex items-center gap-4 px-6 py-5">
                <div className="flex flex-col w-full">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2.5 opacity-60">
                    Controles de Fluxo
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAutoScroll(!autoScroll)}
                      className={cn(
                        "flex-1 h-11 px-6 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 border shadow-sm",
                        autoScroll
                          ? "bg-red-500 text-white border-red-600 shadow-red-500/20"
                          : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
                      )}
                    >
                      {autoScroll ? (
                        <>
                          <div className="size-2 rounded-full bg-white animate-pulse" />
                          Pausar Rolagem
                        </>
                      ) : (
                        <>
                          <Play className="size-4 fill-current text-zinc-400" />
                          Auto Scroll
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setPerformanceMode(true)}
                      className="h-11 px-5 rounded-2xl bg-zinc-900 text-white hover:bg-black transition-all flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider shadow-xl shadow-black/10 group"
                    >
                      <div className="size-2 rounded-full bg-green-500 group-hover:scale-125 transition-transform" />
                      Live
                    </button>
                  </div>
                </div>
              </div>

              {/* Module: Ferramentas (Futuras Opções) */}
              <div className="flex items-center gap-4 px-6 py-5 bg-zinc-50/30">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2.5 opacity-60">
                    Visual
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDiagrams(!showDiagrams)}
                      className={cn(
                        "h-11 px-4 rounded-2xl transition-all flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider border",
                        showDiagrams
                          ? "bg-yellow-500 text-black border-yellow-600 shadow-lg shadow-yellow-500/20"
                          : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900",
                      )}
                    >
                      <LayoutGrid className="size-4" />
                      Shapes
                    </button>
                  </div>
                </div>
              </div>

              {/* Module: Navegação */}
              {setlist && (
                <div className="flex items-center justify-center px-8 py-5 bg-zinc-50/80">
                  <div className="flex items-center gap-5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPrev}
                      disabled={songIndex <= 0}
                      className="size-11 rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50 transition-all active:scale-90"
                    >
                      <ArrowLeft className="size-5" />
                    </Button>
                    <div className="flex flex-col items-center min-w-[40px]">
                      <span className="text-lg font-black text-zinc-900 tabular-nums leading-none">
                        {songIndex + 1}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 tabular-nums mt-1 uppercase tracking-tighter">
                        de {setlist.songs.length}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNext}
                      disabled={songIndex >= setlist.songs.length - 1}
                      className="size-11 rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50 transition-all active:scale-90"
                    >
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showDiagrams && uniqueChords.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div
                className={cn(
                  "p-4 md:p-6 rounded-2xl border transition-colors",
                  performanceMode
                    ? "bg-zinc-900 border-white/5"
                    : "bg-white border-zinc-200 shadow-sm",
                )}
              >
                <h3
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-6 block",
                    performanceMode ? "text-zinc-500" : "text-zinc-400",
                  )}
                >
                  Diagramas da Música
                </h3>
                <div className="flex flex-wrap gap-6 md:gap-8">
                  {uniqueChords.map((chord) => (
                    <ChordDiagram
                      key={chord}
                      name={chord}
                      dark={performanceMode}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "cifra-content transition-all duration-500 overflow-x-auto pb-8 relative",
            performanceMode
              ? "text-[20px] sm:text-2xl md:text-4xl leading-[2.2] md:leading-[2.5] tracking-wide font-medium"
              : "text-[13px] sm:text-base md:text-lg leading-[2.2] text-zinc-900 font-medium",
          )}
          style={{ whiteSpace: "pre", fontFamily: "monospace" }}
        >
          <CifraRenderer
            content={song?.content || ""}
            transpose={transpose}
            performanceMode={performanceMode}
          />
        </motion.div>

        <div className="h-48" />
      </main>

      {!performanceMode && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-xl px-6 py-3 flex items-center gap-6 shadow-2xl border border-zinc-200 z-50 w-[90%] justify-evenly">
          <button
            className="group flex flex-col items-center gap-1 transition-all active:scale-95 text-zinc-400 hover:text-zinc-900"
            onClick={() => setAutoScroll(!autoScroll)}
          >
            <div
              className={cn(
                "w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300",
                autoScroll
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                  : "bg-zinc-100 group-hover:bg-zinc-200",
              )}
            >
              {autoScroll || false ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              )}
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider">
              Scroll
            </span>
          </button>

          <div className="w-px h-8 md:h-10 bg-zinc-100" />

          <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-1 shadow-inner ring-1 ring-zinc-900/5">
            <Button
              variant="yellow"
              size="icon-xs"
              onClick={() => setTranspose((t) => t - 1)}
              className="rounded-xl size-8 md:size-10 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex flex-col items-center px-4 md:px-6 min-w-[65px] md:min-w-[85px]">
              <Select value={currentKey} onValueChange={handleKeyChange}>
                <SelectTrigger className="h-6 md:h-8 border-none bg-transparent font-bold text-zinc-950 dark:text-yellow-500 text-sm md:text-lg p-0 pr-4 shadow-none">
                  <SelectValue>{currentKey}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10">
                  {NOTES.map((note) => (
                    <SelectItem
                      key={note}
                      value={note}
                      className="cursor-pointer focus:bg-yellow-500/10 focus:text-yellow-600 dark:focus:text-yellow-500"
                    >
                      {note}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-[7px] md:text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-0.5 opacity-60">
                Tom Atual
              </span>
            </div>
            <Button
              variant="yellow"
              size="icon-xs"
              onClick={() => setTranspose((t) => t + 1)}
              className="rounded-xl size-8 md:size-10 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-px h-8 md:h-10 bg-zinc-100" />

          <button
            className={cn(
              "group flex flex-col items-center gap-1 transition-all active:scale-95",
              showDiagrams
                ? "text-yellow-600"
                : "text-zinc-400 hover:text-zinc-900",
            )}
            onClick={() => setShowDiagrams(!showDiagrams)}
          >
            <div
              className={cn(
                "w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300",
                showDiagrams
                  ? "bg-yellow-500/10"
                  : "bg-zinc-100 group-hover:bg-zinc-200",
              )}
            >
              <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider">
              Shapes
            </span>
          </button>

          <div className="w-px h-8 md:h-10 bg-zinc-100" />

          <button
            className="group flex flex-col items-center gap-1 transition-all active:scale-95 text-zinc-400 hover:text-zinc-900"
            onClick={() => setPerformanceMode(true)}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition-all">
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider">
              Live
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function SongPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      }
    >
      <SongViewer />
    </Suspense>
  );
}

function ChordWithTooltip({ chord, dark }: { chord: string; dark?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    align: "center" | "left" | "right";
  }>({ x: 0, y: 0, align: "center" });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsHovered(false);
    };

    // Close tooltip if user scrolls to prevent detached floating
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true }); // Catch nested scrolls

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, []);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const tooltipWidth = 180; // Estimated max width

      let align: "center" | "left" | "right" = "center";
      let x = rect.left + rect.width / 2;

      if (x - tooltipWidth / 2 < 16) {
        align = "left";
        x = rect.left;
      } else if (x + tooltipWidth / 2 > screenWidth - 16) {
        align = "right";
        x = rect.right;
      }

      setCoords({
        x,
        y: rect.top - 12, // 12px gap
        align,
      });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block cursor-help group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className={cn(
            "transition-all px-1 py-0.5 rounded-md font-bold",
            dark
              ? "text-yellow-500 hover:bg-yellow-500 hover:text-black cursor-pointer"
              : "text-yellow-600 hover:bg-yellow-500 hover:text-white cursor-pointer",
            "active:scale-95",
          )}
        >
          {chord}
        </span>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[9999] pointer-events-none"
                style={{
                  top: coords.y,
                  left: coords.x,
                  transform:
                    coords.align === "left"
                      ? "translate(0px, -100%)"
                      : coords.align === "right"
                        ? "translate(-100%, -100%)"
                        : "translate(-50%, -100%)",
                }}
              >
                <div className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-200 p-2 overflow-hidden flex flex-col items-center">
                  {/* Reference style header dot pattern */}
                  <div
                    className="w-full h-8 absolute top-0 left-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(#000 1.5px, transparent 0)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  <ChordDiagram
                    name={chord}
                    dark={false}
                    className="shadow-none border-none bg-transparent pt-4 pb-2"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function CifraRenderer({
  content,
  transpose,
  performanceMode,
}: {
  content: string;
  transpose: number;
  performanceMode?: boolean;
}) {
  return useMemo(() => {
    if (!content) return null;

    // Use a temp div with dangerouslySetInnerHTML to parse the string into DOM, then convert to React
    const div = document.createElement("div");
    div.innerHTML = content;

    const convertToReact = (nodes: NodeList): React.ReactNode => {
      return Array.from(nodes).map((node, i) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;

          if (el.tagName === "B") {
            const chord = el.textContent || "";
            const transposed = transposeChord(chord, transpose);
            return (
              <ChordWithTooltip
                key={i}
                chord={transposed}
                dark={performanceMode}
              />
            );
          }

          // Handle spans (like tabs or labels)
          if (el.tagName === "SPAN") {
            return (
              <span key={i} className={el.className}>
                {convertToReact(el.childNodes)}
              </span>
            );
          }

          // Fallback for other elements
          return (
            <span key={i} className={el.className}>
              {convertToReact(el.childNodes)}
            </span>
          );
        }

        return null;
      });
    };

    return convertToReact(div.childNodes);
  }, [content, transpose, performanceMode]);
}
