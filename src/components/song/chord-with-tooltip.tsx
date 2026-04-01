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
  customColor = "yellow",
  variationIndex = 0,
  onVariationChange,
}: {
  chord: string;
  dark?: boolean;
  customColor?: string;
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

  const colorClasses: Record<string, string> = {
    yellow: dark
      ? "text-yellow-500 hover:bg-yellow-500 hover:text-black"
      : "text-yellow-600 hover:bg-yellow-500 hover:text-white",
    blue: "text-blue-500 hover:bg-blue-500 hover:text-white",
    green: "text-green-500 hover:bg-green-500 hover:text-white",
    white: "text-white hover:bg-white hover:text-black",
    orange: "text-orange-500 hover:bg-orange-500 hover:text-white",
  };

  const selectedColorClass = colorClasses[customColor] || colorClasses.yellow;

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block cursor-help group"
        onMouseEnter={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 768) handleMouseEnter();
        }}
        onMouseLeave={() => {
          if (typeof window !== 'undefined' && window.innerWidth >= 768) handleMouseLeave();
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            // On mobile, explicit toggle or open
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              if (isHovered) {
                // If already open, clicking again can close it if not expanded
                if (!isExpanded) setIsHovered(false);
              } else {
                handleMouseEnter();
              }
            } else {
              handleMouseEnter();
            }
          }}
          className={cn(
            "transition-all px-1 py-0.5 rounded-md font-bold cursor-pointer active:scale-95",
            selectedColorClass,
          )}
        >
          {chord}
        </span>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Backdrop for mobile to focus on the modal */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsHovered(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    ...(typeof window !== "undefined" && window.innerWidth < 768
                      ? {
                          top: "50%",
                          left: "50%",
                          x: "-50%",
                          y: "-50%",
                        }
                      : {}),
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={cn(
                    "fixed z-[9999] pointer-events-auto",
                    isExpanded ? "w-[92%] max-w-[500px] md:w-auto" : "w-auto", // Fix for the white space: fit content when not expanded
                  )}
                  onMouseEnter={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.innerWidth >= 768
                    )
                      handleMouseEnter();
                  }}
                  onMouseLeave={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.innerWidth >= 768
                    )
                      handleMouseLeave();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={
                    typeof window !== "undefined" && window.innerWidth >= 768
                      ? {
                          top: coords.y,
                          left: coords.x,
                          transform:
                            coords.align === "left"
                              ? "translate(0px, -100%)"
                              : coords.align === "right"
                                ? "translate(-100%, -100%)"
                                : "translate(-50%, -100%)",
                        }
                      : {}
                  }
                >
                  <div
                    className={cn(
                      "bg-white rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] border border-zinc-200 p-5 md:p-4 overflow-hidden flex transition-all duration-300",
                      isExpanded ? "flex-col md:flex-row" : "flex-row", // Stack on mobile when expanded
                    )}
                  >
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
                        className="shadow-none border-none bg-transparent pt-3 pb-2 min-w-[120px] md:min-w-[140px]"
                      />

                      {!isExpanded && shapes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTempVariation(variationIndex);
                            setIsExpanded(true);
                          }}
                          className="mt-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[13px] px-6 py-3 rounded-full transition-all shadow-lg active:scale-95"
                        >
                          Variar Acorde
                        </button>
                      )}

                      {isExpanded && (
                        <div className="md:hidden w-full h-px bg-zinc-100 my-4" />
                      )}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            ...(typeof window !== "undefined" &&
                            window.innerWidth >= 768
                              ? { width: "auto", marginLeft: 24 }
                              : {}),
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex flex-col md:border-l border-zinc-100 md:pl-6 overflow-hidden"
                        >
                          <div className="relative group/scroll">
                            {/* Navigation Arrows - Smaller on mobile */}
                            <div className="absolute top-1/2 -left-2 md:-left-3 -translate-y-1/2 z-20">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  scrollVariation("left");
                                }}
                                className="bg-yellow-500 shadow-xl border border-yellow-600/20 rounded-full p-2.5 md:p-2 hover:bg-yellow-400 transition-all active:scale-90"
                              >
                                <ChevronLeft
                                  className="w-5 h-5 md:w-4 md:h-4 text-black"
                                  strokeWidth={3}
                                />
                              </button>
                            </div>

                            <div className="absolute top-1/2 -right-2 md:-right-3 -translate-y-1/2 z-20">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  scrollVariation("right");
                                }}
                                className="bg-yellow-500 shadow-xl border border-yellow-600/20 rounded-full p-2.5 md:p-2 hover:bg-yellow-400 transition-all active:scale-90"
                              >
                                <ChevronRight
                                  className="w-5 h-5 md:w-4 md:h-4 text-black"
                                  strokeWidth={3}
                                />
                              </button>
                            </div>

                            <div
                              ref={scrollRef}
                              onMouseDown={startDragging}
                              onMouseLeave={stopDragging}
                              onMouseUp={stopDragging}
                              onMouseMove={onDragging}
                              className={cn(
                                "flex gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-6 md:pb-4 snap-x max-w-[300px] md:max-w-[450px] items-start pt-3 no-scrollbar scroll-smooth",
                                isDragging ? "cursor-grabbing" : "cursor-grab",
                              )}
                            >
                              {shapes.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isDragging) setTempVariation(i);
                                  }}
                                  className="group flex flex-col items-center flex-shrink-0 snap-center focus:outline-none"
                                >
                                  <div
                                    className={cn(
                                      "transition-all duration-300 pointer-events-none",
                                      tempVariation === i
                                        ? "opacity-100 scale-110 drop-shadow-md"
                                        : "opacity-25 scale-90 hover:opacity-50",
                                    )}
                                  >
                                    <ChordDiagram
                                      name={chord}
                                      dark={false}
                                      variationIndex={i}
                                      className="shadow-none border-none bg-transparent p-0 min-w-[110px]"
                                    />
                                  </div>
                                  <div
                                    className={cn(
                                      "h-2 w-2 rounded-full mt-4 transition-all duration-500",
                                      tempVariation === i
                                        ? "bg-yellow-500 scale-100 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                        : "bg-zinc-200 scale-50",
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center justify-between border-t border-zinc-100 pt-6 mt-auto w-full gap-5 md:gap-0">
                            <label className="flex items-center gap-3 text-[13px] md:text-sm font-bold text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors">
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="peer h-6 w-6 md:h-5 md:w-5 cursor-pointer appearance-none rounded-lg border border-zinc-300 transition-all checked:border-zinc-900 checked:bg-zinc-900"
                                />
                                <svg
                                  className="absolute h-4 w-4 md:h-3.5 md:w-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 stroke-white mt-0.5 ml-1"
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
                              <b className="font-black text-black ml-1">
                                {chord}
                              </b>
                            </label>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <button
                                onClick={() => {
                                  setTempVariation(variationIndex);
                                  setIsExpanded(false);
                                }}
                                className="flex-1 md:flex-none text-sm font-bold text-zinc-400 hover:text-zinc-600 px-4 py-3 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  onVariationChange?.(chord, tempVariation);
                                  setIsExpanded(false);
                                  setIsHovered(false);
                                }}
                                className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm px-10 py-3.5 rounded-2xl transition-all shadow-xl active:scale-95"
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
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
