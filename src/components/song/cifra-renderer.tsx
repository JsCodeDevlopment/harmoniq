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
  showTabs = true,
}: {
  content: string;
  transpose: number;
  performanceMode?: boolean;
  chordColor?: string;
  instrument?: string;
  variations?: Record<string, number>;
  onVariationChange?: (chord: string, idx: number) => void;
  showTabs?: boolean;
}) {
  return useMemo(() => {
    if (!content) return null;

    // Use a temp div with dangerouslySetInnerHTML to parse the string into DOM, then convert to React
    const div = document.createElement("div");
    div.innerHTML = content;

    const convertToReact = (nodes: NodeList): React.ReactNode => {
      return Array.from(nodes).map((node, i) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          
          // If hiding tabs, we also want to hide text lines that look like tabs if they aren't in a span
          // and also avoid extra empty lines created by hidden tabs
          if (!showTabs) {
             const isTabLine = text.includes("|--") || text.includes("|-") || text.includes("|  ");
             if (isTabLine) return null;
          }
          
          return text;
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
            const isTab = el.className.includes("tablatura") || 
                         el.textContent?.includes("|--") || 
                         el.textContent?.includes("|-") ||
                         el.textContent?.includes("|  ");
            
            if (!showTabs && isTab) {
              return null;
            }

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
  }, [content, transpose, performanceMode, variations, onVariationChange, chordColor, instrument, showTabs]);
}
