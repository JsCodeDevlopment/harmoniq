"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Maximize2, 
  Plus, 
  Minus,
  Loader2
} from "lucide-react";
import { getSong } from "@/lib/api";

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeChord(chord: string, amount: number) {
  return chord.replace(/[A-G][#b]?/g, (match) => {
    let note = match;
    if (note === 'Db') note = 'C#';
    if (note === 'Eb') note = 'D#';
    if (note === 'Gb') note = 'F#';
    if (note === 'Ab') note = 'G#';
    if (note === 'Bb') note = 'A#';
    
    const index = NOTES.indexOf(note);
    if (index === -1) return match;
    
    let newIndex = (index + amount) % 12;
    if (newIndex < 0) newIndex += 12;
    return NOTES[newIndex];
  });
}

interface SongData {
  title: string;
  artist: string;
  key: string;
  content: string;
  chords: string[];
}

function SongViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");

  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transpose, setTranspose] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed] = useState(1);
  const [performanceMode, setPerformanceMode] = useState(false);
  
  useEffect(() => {
    if (url) {
      loadSong(url);
    }
  }, [url]);

  useEffect(() => {
    let interval: any;
    if (autoScroll) {
      interval = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [autoScroll, scrollSpeed]);

  async function loadSong(url: string) {
    try {
      setLoading(true);
      const data = await getSong(url);
      setSong(data);
    } catch (err) {
      setError("Não foi possível carregar a cifra.");
    } finally {
      setLoading(false);
    }
  }

  const processedContent = song?.content ? song.content.replace(/<b>(.*?)<\/b>/g, (match: string, chord: string) => {
    return `<span class="chord">${transposeChord(chord, transpose)}</span>`;
  }) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">{error}</p>
        <button onClick={() => router.back()} className="text-yellow-500 underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all ${performanceMode ? 'bg-black px-4 py-8' : 'bg-zinc-950 pb-24'}`}>
      
      {!performanceMode && (
        <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center flex-1">
            <h1 className="font-bold text-lg truncate px-4">{song?.title}</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">{song?.artist}</p>
          </div>
          <button onClick={() => setPerformanceMode(true)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <Maximize2 className="w-6 h-6 text-zinc-400" />
          </button>
        </header>
      )}

      <main className={`max-w-3xl mx-auto ${performanceMode ? 'mt-0' : 'mt-8 px-6'}`}>
        {performanceMode && (
          <div className="flex items-center justify-between mb-8 opacity-20 hover:opacity-100 transition-opacity">
             <button onClick={() => setPerformanceMode(false)} className="text-zinc-500 flex items-center gap-2">
               <ChevronLeft className="w-4 h-4" /> Sair do modo performance
             </button>
             <div className="flex items-center gap-4">
               <span className="text-yellow-500 font-bold">{transpose !== 0 && (transpose > 0 ? `+${transpose}` : transpose)}</span>
               <div className="flex gap-2">
                 <button onClick={() => setTranspose(t => t - 1)} className="p-1 border border-zinc-800 rounded"><Minus className="w-3 h-3"/></button>
                 <button onClick={() => setTranspose(t => t + 1)} className="p-1 border border-zinc-800 rounded"><Plus className="w-3 h-3"/></button>
               </div>
             </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
           {!performanceMode && (
             <div className="flex gap-2">
               <div className="bg-zinc-900 rounded-xl flex items-center border border-zinc-800">
                  <button onClick={() => setTranspose(t => t - 1)} className="p-3 text-zinc-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                  <span className="px-4 font-bold min-w-[3rem] text-center border-x border-zinc-800">Tom: {transpose === 0 ? song?.key : transposeChord(song?.key || 'C', transpose)}</span>
                  <button onClick={() => setTranspose(t => t + 1)} className="p-3 text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
               </div>
               
               <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`flex items-center gap-2 px-5 rounded-xl border transition-all ${autoScroll ? 'bg-yellow-500 border-yellow-500 text-black font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
               >
                 {autoScroll ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                 {autoScroll ? 'Pausar' : 'Auto Scroll'}
               </button>
             </div>
           )}
        </div>

        <div 
          className={`cifra-content ${performanceMode ? 'text-2xl leading-relaxed' : 'text-lg'}`}
          dangerouslySetInnerHTML={{ __html: processedContent }} 
        />
        
        <div className="h-40" />
      </main>

      {!performanceMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 rounded-2xl px-6 py-4 flex items-center gap-8 shadow-2xl">
           <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setAutoScroll(!autoScroll)}>
              {autoScroll ? <Pause className="text-yellow-500" /> : <Play className="text-zinc-500" />}
              <span className="text-[10px] uppercase font-bold text-zinc-500">Scroll</span>
           </div>
           <div className="w-px h-8 bg-zinc-800" />
           <div className="flex flex-col items-center gap-1">
              <span className="text-yellow-500 font-bold text-lg">{transpose > 0 ? `+${transpose}` : (transpose < 0 ? transpose : '0')}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Transpose</span>
           </div>
           <div className="w-px h-8 bg-zinc-800" />
           <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setPerformanceMode(true)}>
              <Maximize2 className="text-zinc-500 hover:text-white" />
              <span className="text-[10px] uppercase font-bold text-zinc-500">Live</span>
           </div>
        </div>
      )}
    </div>
  );
}

export default function SongPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-10 h-10 text-yellow-500 animate-spin" /></div>}>
      <SongViewer />
    </Suspense>
  );
}
