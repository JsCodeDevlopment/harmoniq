"use client";

import { cn } from "@/lib/utils";
import { getKeyboardNotes } from "@/lib/keyboard";

export function KeyboardDiagram({
  name,
  dark,
  className,
}: {
  name: string;
  dark?: boolean;
  className?: string;
}) {
  const notes = getKeyboardNotes(name);

  // Define keys for a section of the keyboard (usually starting from C)
  // Let's show 14 keys (C to D)
  const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11, 12, 14];
  const BLACK_KEYS = [1, 3, 6, 8, 10, 13, 15];

  const keyWidth = 14;
  const keyHeight = 44;
  const blackKeyWidth = 9;
  const blackKeyHeight = 26;

  const isSelected = (note: number) => notes.includes(note % 12);

  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white rounded-3xl shadow-sm p-4 min-w-[160px]",
        dark && "bg-zinc-900 border border-white/5",
        className,
      )}
    >
      <span
        className={cn(
          "text-sm font-black font-outfit uppercase tracking-tight mb-4",
          dark ? "text-white" : "text-zinc-900",
        )}
      >
        {name}
      </span>

      <div className="relative h-[48px] w-[130px] mx-auto mt-2">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${WHITE_KEYS.length * keyWidth} ${keyHeight}`}
          className="overflow-visible"
        >
          {/* White keys */}
          {WHITE_KEYS.map((note, index) => (
            <rect
              key={note}
              x={index * keyWidth}
              y={0}
              width={keyWidth}
              height={keyHeight}
              fill={isSelected(note) ? "#EAB308" : (dark ? "#27272a" : "#fff")}
              stroke={dark ? "#3f3f46" : "#E2E8F0"}
              rx={2}
            />
          ))}

          {/* Black keys */}
          {BLACK_KEYS.map((note) => {
             // Calculate position
             const octaveBase = Math.floor(note / 12) * 7;
             const relative = note % 12;
             let x = 0;
             if (relative === 1) x = 1;
             else if (relative === 3) x = 2;
             else if (relative === 6) x = 4;
             else if (relative === 8) x = 5;
             else if (relative === 10) x = 6;
             
             const finalX = (octaveBase + x) * keyWidth - blackKeyWidth / 2;

             return (
               <rect
                 key={note}
                 x={finalX}
                 y={0}
                 width={blackKeyWidth}
                 height={blackKeyHeight}
                 fill={isSelected(note) ? "#CA8A04" : (dark ? "#000" : "#1E293B")}
                 stroke={dark ? "#3f3f46" : "#1E293B"}
                 rx={1.5}
               />
             );
          })}
        </svg>
      </div>
    </div>
  );
}
