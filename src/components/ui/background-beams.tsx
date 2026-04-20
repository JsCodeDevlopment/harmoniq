"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          background: `
            radial-gradient(circle 600px at var(--x) var(--y), rgba(234, 179, 8, 0.4), transparent 80%),
            radial-gradient(circle 300px at var(--x) var(--y), rgba(255, 255, 255, 0.1), transparent 50%)
          `,
          // Use CSS variables for the mouse position to keep performance high
          "--x": smoothX.get().toString() + "px",
          "--y": smoothY.get().toString() + "px",
        } as any}
      >
        <div className="absolute inset-0 bg-[#020202] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_20%,black)]" />
      </motion.div>
      
      {/* Dynamic Grid */}
      <svg
        className="absolute h-full w-full opacity-[0.03] grayscale invert"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="inner-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#inner-grid)" />
      </svg>
    </div>
  );
};
