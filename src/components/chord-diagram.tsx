"use client";

import { cn } from "@/lib/utils";
import { getChordsForName } from "@/lib/chords";

export function ChordDiagram({
  name,
  dark,
  className,
  variationIndex = 0,
}: {
  name: string;
  dark?: boolean;
  className?: string;
  variationIndex?: number;
}) {
  const shapes = getChordsForName(name);
  const shape = shapes[variationIndex] || shapes[0];

  if (!shape) return null;

  // Transformar frets em dedos, open e muted para renderização
  // frets: [E, A, D, G, B, e]
  const renderData = {
    fingers: [] as { f: number; s: number; label?: string }[],
    open: [] as number[],
    muted: [] as number[],
    baseFret: shape.baseFret,
    isBarre: shape.isBarre,
  };

  // A janela de visualização sempre mostra 5 trastes.
  // Se estivermos nas casas iniciais (0-4), começamos na 1.
  // Se estivermos mais à frente, centralizamos ou começamos na baseFret.
  const displayStartFret = shape.baseFret === 0 ? 1 : Math.max(1, shape.baseFret);

  shape.frets.forEach((fret, i) => {
    const visualString = i + 1; // 1 to 6 (E to e)

    if (fret === null) {
      renderData.muted.push(visualString);
    } else if (fret === 0) {
      renderData.open.push(visualString);
    } else {
      // Calcular a casa relativa para exibição (1 a 5 no diagrama)
      const relativeFret = fret - displayStartFret + 1;
      const fingerIndex = renderData.fingers.length;
      const fingerLabel = shape.fingers && shape.fingers[fingerIndex] !== undefined 
        ? String(shape.fingers[fingerIndex]) 
        : undefined;

      renderData.fingers.push({
        f: relativeFret,
        s: visualString,
        label: fingerLabel
      });
    }
  });

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

        {/* Nut (Traste 0) - Só visível se displayStartFret for 1 e baseFret for 0 */}
        <line
          x1="15"
          y1="10"
          x2="65"
          y2="10"
          stroke={dark ? "#71717a" : "#334155"}
          strokeWidth={renderData.baseFret === 0 ? "3" : "1"}
          className={renderData.baseFret === 0 ? "opacity-100" : "opacity-30"}
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

        {/* Base Fret Marker e.g. "3fr" if baseFret > 0 */}
        {renderData.baseFret > 0 && (
          <text
            x="5"
            y="22"
            fontSize="7"
            fontWeight="bold"
            fill={dark ? "#94A3B8" : "#64748B"}
          >
            {renderData.baseFret}fr
          </text>
        )}

        {/* Barra (Barre modifier) */}
        {renderData.isBarre && renderData.fingers.length > 0 && (
          <rect
            x="13"
            y={10 + (renderData.fingers[0].f - 0.5) * 15 - 5}
            width="54"
            height="10"
            rx="5"
            fill={dark ? "#FFF" : "#1E293B"}
            className="opacity-90"
          />
        )}

        {/* Fingers */}
        {renderData.fingers.map((finger, i) => (
          <g key={i}>
            <circle
              cx={15 + (Number(finger.s) - 1) * 10}
              cy={10 + (Number(finger.f) - 0.5) * 15}
              r="4.5"
              fill={dark ? "#FFF" : "#1E293B"}
            />
            <text
              x={15 + (Number(finger.s) - 1) * 10}
              y={10 + (Number(finger.f) - 0.5) * 15 + 1.5}
              textAnchor="middle"
              fontSize="4.5"
              fontWeight="900"
              fill={dark ? "#000" : "#FFF"}
              fontFamily="monospace"
            >
              {finger.label || ""}
            </text>
          </g>
        ))}

        {/* Markers at bottom (Muted/Open) */}
        {[1, 2, 3, 4, 5, 6].map((s) => {
          const isMuted = renderData.muted.includes(s);
          const isOpen = renderData.open.includes(s);

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

