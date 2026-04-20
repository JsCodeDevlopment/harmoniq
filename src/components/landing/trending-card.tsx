"use client";

import { motion } from "framer-motion";
import { Music2, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingSong {
  title: string;
  artist: string;
  url: string;
  image: string;
}

interface TrendingCardProps {
  song: TrendingSong;
  index: number;
  onClick: () => void;
}

export function TrendingCard({ song, index, onClick }: TrendingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08, 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      onClick={onClick}
      className="group relative flex items-center gap-5 p-4 rounded-[2rem] bg-zinc-900/30 backdrop-blur-xl border border-white/[0.03] hover:border-yellow-500/20 hover:bg-zinc-900/50 transition-all duration-700 cursor-pointer overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Circular Artist Image */}
      <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:scale-[1.05] transition-all duration-700">
        {song.image ? (
          <img
            src={song.image}
            alt={song.artist}
            className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 opacity-60 group-hover:opacity-100 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <Music2 className="w-6 h-6 text-zinc-800" />
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1 z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="hidden group-hover:block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:text-yellow-500/50 transition-colors">
              Ranking #{ (index + 1).toString().padStart(2, '0') }
            </span>
          </div>
        </div>
        
        <h4 className="text-[17px] font-bold text-zinc-300 group-hover:text-white transition-colors truncate tracking-tight font-outfit leading-tight">
          {song.title}
        </h4>
        <p className="text-[12px] font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors truncate uppercase tracking-[0.15em] font-sans">
          {song.artist}
        </p>
      </div>

      {/* Play Icon on the Right */}
      <div className="relative z-10 p-2.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl shadow-yellow-500/20">
        <Play className="w-4 h-4 text-black fill-current ml-0.5" />
      </div>

      {/* Animated Shine Effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent group-hover:animate-shine" />
    </motion.div>
  );
}
