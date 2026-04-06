"use client";

import { useMemo } from "react";
import { transposeChord } from "@/lib/chords";
import { ChordWithTooltip } from "./chord-with-tooltip";

export function CifraRenderer({
  content,
  transpose,
  performanceMode,
  chordColor = "yellow",
  instrument = "guitar",
  variations = {},
  onVariationChange,
}: {
  content: string;
  transpose: number;
  performanceMode?: boolean;
  chordColor?: string;
  instrument?: string;
  variations?: Record<string, number>;
  onVariationChange?: (chord: string, idx: number) => void;
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
                customColor={chordColor}
                instrument={instrument}
                variationIndex={variations[transposed] || 0}
                onVariationChange={onVariationChange}
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
  }, [content, transpose, performanceMode, variations, onVariationChange, chordColor, instrument]);
}
