"use client";

import { cn } from "@/lib/utils";
import { CHORD_SHAPES_MOCK } from "@/mocks/chords.mock";

export function ChordDiagram({
  name,
  dark,
  className,
}: {
  name: string;
  dark?: boolean;
  className?: string;
}) {
  const getShape = (n: string) => {
    const base = n.split("/")[0];
    return (
      CHORD_SHAPES_MOCK[base] || {
        fingers: [
          [2, 2, "1"],
          [3, 3, "2"],
          [4, 2, "3"],
        ],
        open: [0, 1, 2],
        muted: [5],
      }
    );
  };

  const shape = getShape(name);

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
          "text-sm font-black font-outfit uppercase tracking-tight mb-2",
          dark ? "text-white" : "text-zinc-900",
        )}
      >
        {name}
      </span>

      <svg
        width="112"
        height="140"
        viewBox="0 0 80 100"
        className="overflow-visible"
      >
        {/* Strings (Vertical) */}
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <line
            key={s}
            x1={15 + s * 10}
            y1="10"
            x2={15 + s * 10}
            y2="85"
            stroke={dark ? "#3f3f46" : "#E2E8F0"}
            strokeWidth="1"
          />
        ))}

        {/* Nut (Traste 0) */}
        <line
          x1="15"
          y1="10"
          x2="65"
          y2="10"
          stroke={dark ? "#71717a" : "#334155"}
          strokeWidth="3"
        />

        {/* Frets (Horizontal) */}
        {[1, 2, 3, 4, 5].map((f) => (
          <line
            key={f}
            x1="15"
            y1={10 + f * 15}
            x2="65"
            y2={10 + f * 15}
            stroke={dark ? "#27272a" : "#CBD5E1"}
            strokeWidth="1"
          />
        ))}

        {/* Fingers with numbers */}
        {shape.fingers.map(([f, s, label], i) => (
          <g key={i}>
            <circle
              cx={15 + (Number(s) - 1) * 10}
              cy={10 + (Number(f) - 0.5) * 15}
              r="4.5"
              fill={dark ? "#FFF" : "#1E293B"}
            />
            <text
              x={15 + (Number(s) - 1) * 10}
              y={10 + (Number(f) - 0.5) * 15 + 1.5}
              textAnchor="middle"
              fontSize="4.5"
              fontWeight="900"
              fill={dark ? "#000" : "#FFF"}
              fontFamily="monospace"
            >
              {label || i + 1}
            </text>
          </g>
        ))}

        {/* Markers at bottom */}
        {[1, 2, 3, 4, 5, 6].map((s) => {
          const stringIndex = 7 - s; // 6, 5, 4, 3, 2, 1
          const isMuted = shape.muted?.includes(stringIndex - 1);
          const isOpen = shape.open?.includes(stringIndex - 1);

          if (isMuted)
            return (
              <text
                key={s}
                x={15 + (s - 1) * 10}
                y="95"
                textAnchor="middle"
                fontSize="7"
                fill="#94A3B8"
              >
                ×
              </text>
            );
          if (isOpen)
            return (
              <circle
                key={s}
                cx={15 + (s - 1) * 10}
                cy="94"
                r="2.5"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1"
              />
            );
          return null;
        })}
      </svg>
    </div>
  );
}
