"use client";

import { cn } from "@/lib/utils";
import { CHORD_SHAPES_MOCK } from "@/mocks/chords.mock";

export function ChordDiagram({ name, dark }: { name: string, dark?: boolean }) {
  const getShape = (n: string) => {
    const base = n.split('/')[0];
    return CHORD_SHAPES_MOCK[base] || { fingers: [[2, 2], [3, 3], [4, 2]], open: [0, 1] };
  };

  const shape = getShape(name);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cn("text-[11px] font-bold font-mono tracking-tighter", dark ? "text-white" : "text-zinc-600")}>
        {name}
      </span>
      <svg width="60" height="75" viewBox="0 0 60 75" className="overflow-visible">
        <rect x="10" y="10" width="40" height="50" fill={dark ? "#18181b" : "#fff"} stroke={dark ? "#27272a" : "#e4e4e7"} strokeWidth="1" />
        {[1, 2, 3, 4, 5].map(f => (
          <line key={f} x1="10" y1={10 + f * 10} x2="50" y2={10 + f * 10} stroke={dark ? "#27272a" : "#e4e4e7"} strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4, 5].map(s => (
          <line key={s} x1={10 + s * 8} y1="10" x2={10 + s * 8} y2="60" stroke={dark ? "#52525b" : "#a1a1aa"} strokeWidth="0.5" />
        ))}
        <line x1="10" y1="10" x2="50" y2="10" stroke={dark ? "#71717a" : "#71717a"} strokeWidth="3" strokeLinecap="round" />
        {shape.fingers.map(([f, s], i) => (
          <circle key={i} cx={10 + (s - 1) * 8} cy={10 + (f - 0.5) * 10} r="3.5" fill={dark ? "#eab308" : "#ca8a04"} />
        ))}
        {shape.barra && (
            <line key="barra" x1="10" y1={10 + (shape.barra - 0.5) * 10} x2="50" y2={10 + (shape.barra - 0.5) * 10} stroke={dark ? "#eab308" : "#ca8a04"} strokeWidth="7" strokeLinecap="round" opacity="0.8" />
        )}
        {[1, 2, 3, 4, 5, 6].map(s => {
            const isMuted = shape.muted?.includes(7-s);
            const isOpen = shape.open?.includes(7-s);
            if (isMuted) return <text key={s} x={10 + (s-1)*8} y="6" textAnchor="middle" fontSize="6" fill="#ef4444" fontFamily="monospace">×</text>;
            if (isOpen) return <circle key={s} cx={10 + (s-1)*8} cy="5" r="2" fill="none" stroke="#a1a1aa" strokeWidth="0.5" />;
            return null;
        })}
      </svg>
    </div>
  );
}
