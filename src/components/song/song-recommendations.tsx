"use client";

import { motion } from "framer-motion";
import { Music, Play } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const encoded =
      typeof btoa !== "undefined" ? btoa(encodeURIComponent(url)) : "";
    router.replace(`/song?id=${encoded}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="mt-24 mb-40 max-w-2xl px-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          <h3 className="text-[26px] font-black tracking-tight text-zinc-900 font-outfit uppercase">
            Toque <span className="text-yellow-600/80">também</span>
          </h3>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 ml-4.5">
          Curadoria baseada no seu estilo
        </p>
      </div>

      <div className="space-y-1">
        {recommendations.slice(0, 8).map((song, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.04,
              duration: 0.5,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            onClick={() => navigateToSong(song.url)}
            className="group relative flex items-center gap-5 p-3 rounded-2xl cursor-pointer hover:bg-zinc-100/60 transition-all duration-300 active:scale-[0.98]"
          >
            {/* Index Number - Minimalist detail */}
            <span className="hidden md:block w-4 text-[10px] font-bold text-zinc-300 group-hover:text-yellow-500/50 transition-colors">
              {(i + 1).toString().padStart(2, "0")}
            </span>

            {/* Circular Artist Image */}
            <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-zinc-100 ring-1 ring-zinc-200/50 group-hover:ring-yellow-500/40 transition-all duration-500">
              {song.image ? (
                <img
                  src={song.image}
                  alt={song.artist}
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://www.cifraclub.com.br/static/img/artist-placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <Music className="w-6 h-6" strokeWidth={1.5} />
                </div>
              )}

              <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Song Text */}
            <div className="flex flex-col min-w-0 pr-10">
              <h4 className="font-bold text-[17px] text-zinc-900 group-hover:text-yellow-700 transition-colors truncate tracking-tight leading-snug">
                {song.title}
              </h4>
              <p className="text-[13px] font-medium text-zinc-500 group-hover:text-zinc-600 transition-colors truncate">
                {song.artist}
              </p>
            </div>

            {/* Minimalist Play Icon */}
            <div className="ml-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Play
                  className="w-5 h-5 text-black ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decorative Minimalist Element */}
      <div className="mt-12 w-full h-px bg-gradient-to-r from-zinc-200/50 via-zinc-100 to-transparent" />
    </section>
  );
}
