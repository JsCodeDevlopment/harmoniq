"use client";

import { motion } from "framer-motion";
import { Music, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Recommendation {
  title: string;
  artist: string;
  url: string;
  image?: string;
}

interface SongRecommendationsProps {
  recommendations: Recommendation[];
}

export function SongRecommendations({
  recommendations,
}: SongRecommendationsProps) {

  const router = useRouter();

  if (!recommendations || recommendations.length === 0) return null;

  const navigateToSong = (url: string) => {
    const encoded = typeof btoa !== "undefined" ? btoa(encodeURIComponent(url)) : "";
    router.replace(`/song?id=${encoded}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="mt-20 mb-32 relative">
      <div className="flex flex-col gap-1 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
          <h3 className="text-2xl font-black tracking-tight text-zinc-900 font-outfit uppercase">
            Toque <span className="text-yellow-600">também</span>
          </h3>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 ml-4.5">
          Sugestões recomendadas para você
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendations.slice(0, 9).map((song, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: i * 0.04, 
              duration: 0.6, 
              ease: [0.21, 0.47, 0.32, 0.98] 
            }}
            onClick={() => navigateToSong(song.url)}
            className="group relative"
          >
            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 blur-2xl rounded-[28px] transition-all duration-500" />
            
            <div className="relative flex flex-col gap-4 p-5 rounded-[28px] bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-yellow-500/20 cursor-pointer transition-all duration-500 group-hover:-translate-y-1">
              <div className="relative aspect-[16/10] w-full rounded-[20px] overflow-hidden bg-zinc-50">
                {song.image ? (
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-200">
                    <Music className="w-10 h-10" strokeWidth={1} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-xl">
                    <PlayCircle className="w-5 h-5 text-black" />
                  </div>
                </div>

                <div className="absolute top-3 right-3 py-1 px-2.5 rounded-full bg-white/90 backdrop-blur-md border border-white/20 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-800">
                    Sugestão
                  </p>
                </div>
              </div>

              <div className="px-1">
                <h4 className="font-bold text-[16px] text-zinc-900 group-hover:text-yellow-700 transition-colors truncate">
                  {song.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-600 transition-colors">
                    {song.artist}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

