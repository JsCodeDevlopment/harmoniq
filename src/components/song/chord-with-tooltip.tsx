"use client";

import { ChordDiagram } from "@/components/chord-diagram";
import { getChordsForName } from "@/lib/chords";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ChordWithTooltip({
  chord,
  dark,
  variationIndex = 0,
  onVariationChange,
}: {
  chord: string;
  dark?: boolean;
  variationIndex?: number;
  onVariationChange?: (chord: string, idx: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempVariation, setTempVariation] = useState(variationIndex);

  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    align: "center" | "left" | "right";
  }>({ x: 0, y: 0, align: "center" });

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const shapes = getChordsForName(chord);

  useEffect(() => {
    setMounted(true);

    const handleScroll = (e: Event) => {
      if (e.target === window || e.target === document) {
        setIsHovered(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, []);

  // Reset state when tooltip closed
  useEffect(() => {
    if (!isHovered) {
      // Delay reset to avoid flashing during exit animation
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setTempVariation(variationIndex);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isHovered, variationIndex]);

  useEffect(() => {
    setTempVariation(variationIndex);
  }, [variationIndex]);

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const tooltipWidth = 180;

      let align: "center" | "left" | "right" = "center";
      let x = rect.left + rect.width / 2;

      if (x - tooltipWidth / 2 < 16) {
        align = "left";
        x = rect.left;
      } else if (x + tooltipWidth / 2 > screenWidth - 16) {
        align = "right";
        x = rect.right;
      }

      setCoords({
        x,
        y: rect.top - 12,
        align,
      });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDragging = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollVariation = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block cursor-help group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span
          className={cn(
            "transition-all px-1 py-0.5 rounded-md font-bold",
            dark
              ? "text-yellow-500 hover:bg-yellow-500 hover:text-black cursor-pointer"
              : "text-yellow-600 hover:bg-yellow-500 hover:text-white cursor-pointer",
            "active:scale-95",
          )}
        >
          {chord}
        </span>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="fixed z-[9999] pointer-events-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  top: coords.y,
                  left: coords.x,
                  transform:
                    coords.align === "left"
                      ? "translate(0px, -100%)"
                      : coords.align === "right"
                        ? "translate(-100%, -100%)"
                        : "translate(-50%, -100%)",
                }}
              >
                <div className="bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] border border-zinc-200 p-4 overflow-hidden flex transition-all duration-300">
                  <div
                    className="w-full h-8 absolute top-0 left-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(#000 1.5px, transparent 0)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  <div className="flex flex-col items-center">
                    <ChordDiagram
                      name={chord}
                      dark={false}
                      variationIndex={
                        isExpanded ? tempVariation : variationIndex
                      }
                      className="shadow-none border-none bg-transparent pt-3 pb-2 min-w-[120px]"
                    />

                    {!isExpanded && shapes.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTempVariation(variationIndex);
                          setIsExpanded(true);
                        }}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs px-5 py-2.5 rounded-full transition-all shadow-md active:scale-95"
                      >
                        variar acorde
                      </button>
                    )}
                    {isExpanded && (
                      <button
                        disabled
                        className="mt-2 bg-zinc-100 text-zinc-400 font-bold text-xs px-5 py-2.5 rounded-full cursor-not-allowed"
                      >
                        Variar Acorde
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: "auto", opacity: 1, marginLeft: 24 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex flex-col border-l border-zinc-100 pl-6 overflow-hidden whitespace-nowrap"
                      >
                        <div className="relative group/scroll">
                          {/* Navigation Arrows - Always Visible with Primary Background */}
                          <div className="absolute top-1/2 -left-3 -translate-y-1/2 z-20">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollVariation("left");
                              }}
                              className="bg-yellow-500 shadow-lg border border-yellow-600/20 rounded-full p-2 hover:bg-yellow-400 transition-all active:scale-90"
                            >
                              <ChevronLeft className="w-4 h-4 text-black" strokeWidth={3} />
                            </button>
                          </div>
                          
                          <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollVariation("right");
                              }}
                              className="bg-yellow-500 shadow-lg border border-yellow-600/20 rounded-full p-2 hover:bg-yellow-400 transition-all active:scale-90"
                            >
                              <ChevronRight className="w-4 h-4 text-black" strokeWidth={3} />
                            </button>
                          </div>

                          <div
                            ref={scrollRef}
                            onMouseDown={startDragging}
                            onMouseLeave={stopDragging}
                            onMouseUp={stopDragging}
                            onMouseMove={onDragging}
                            className={cn(
                              "flex gap-6 overflow-x-auto overflow-y-hidden pb-4 snap-x max-w-[320px] md:max-w-[450px] items-start pt-3 no-scrollbar scroll-smooth",
                              isDragging ? "cursor-grabbing" : "cursor-grab",
                            )}
                          >
                            {shapes.map((_, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  !isDragging && setTempVariation(i)
                                }
                                onMouseDown={(e) => e.stopPropagation()} // Let the parent handle the drag
                                className="group flex flex-col items-center flex-shrink-0 snap-center focus:outline-none"
                              >
                                <div
                                  className={cn(
                                    "transition-all duration-300 pointer-events-none",
                                    tempVariation === i
                                      ? "opacity-100 scale-100 drop-shadow-sm"
                                      : "opacity-30 scale-90 hover:opacity-60",
                                  )}
                                >
                                  <ChordDiagram
                                    name={chord}
                                    dark={false}
                                    variationIndex={i}
                                    className="shadow-none border-none bg-transparent p-0 min-w-[100px]"
                                  />
                                </div>
                                <div
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full mt-3 transition-all duration-500",
                                    tempVariation === i
                                      ? "bg-yellow-500 scale-100"
                                      : "bg-zinc-200 scale-50",
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-100 pt-5 mt-auto w-full">
                          <label className="flex items-center gap-3 text-sm font-bold text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                defaultChecked
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-300 transition-all checked:border-zinc-900 checked:bg-zinc-900"
                              />
                              <svg
                                className="absolute h-3.5 w-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 stroke-white mt-0.5 ml-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="4"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                            </div>
                            Mudar todos{" "}
                            <b className="font-black text-black">{chord}</b>
                          </label>

                          <div className="flex items-center gap-4 pl-8">
                            <button
                              onClick={() => {
                                setTempVariation(variationIndex);
                                setIsExpanded(false);
                              }}
                              className="text-sm font-bold text-zinc-400 hover:text-zinc-600 px-3 py-2 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => {
                                onVariationChange?.(chord, tempVariation);
                                setIsExpanded(false);
                              }}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(234,179,8,0.39)] active:scale-95 hover:shadow-[0_6px_20px_rgba(234,179,8,0.23)]"
                            >
                              Ok
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
