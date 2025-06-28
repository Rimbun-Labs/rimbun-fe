"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingPillProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  gradient?: string;
}

function FloatingPill({
  className,
  delay = 0,
  width = 120,
  height = 40,
  gradient = "from-white/[0.08]",
}: FloatingPillProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        x: -50,
        y: -50,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 15, 0],
          rotate: [0, 5, -3, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full", // Pill shape
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[1px] border border-white/[0.15]",
            "shadow-[0_4px_16px_0_rgba(255,255,255,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Small pill-shaped elements moving around */}
      <FloatingPill
        className="top-20 left-10"
        width={100}
        height={35}
        gradient="from-blue-500/[0.06] to-purple-500/[0.06]"
        delay={0}
      />
      
      <FloatingPill
        className="top-40 right-20"
        width={80}
        height={30}
        gradient="from-purple-500/[0.05] to-pink-500/[0.05]"
        delay={0.5}
      />
      
      <FloatingPill
        className="bottom-40 left-20"
        width={90}
        height={32}
        gradient="from-green-500/[0.04] to-blue-500/[0.04]"
        delay={1}
      />
      
      <FloatingPill
        className="top-60 left-1/3"
        width={70}
        height={28}
        gradient="from-yellow-500/[0.03] to-orange-500/[0.03]"
        delay={1.5}
      />
      
      <FloatingPill
        className="bottom-20 right-1/3"
        width={85}
        height={31}
        gradient="from-indigo-500/[0.04] to-purple-500/[0.04]"
        delay={2}
      />
      
      <FloatingPill
        className="top-1/2 left-1/2"
        width={60}
        height={25}
        gradient="from-cyan-500/[0.02] to-blue-500/[0.02]"
        delay={2.5}
      />
      
      <FloatingPill
        className="bottom-10 right-5"
        width={75}
        height={29}
        gradient="from-emerald-500/[0.03] to-teal-500/[0.03]"
        delay={3}
      />
    </div>
  );
}; 