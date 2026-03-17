"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowingEffectProps = {
  className?: string;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  borderWidth?: number;
};

export function GlowingEffect({
  className,
  spread = 40,
  glow = true,
  disabled = false,
  borderWidth = 2,
}: GlowingEffectProps) {
  if (disabled) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-2xl",
        className,
      )}
      style={{
        padding: borderWidth,
      }}
    >
      <motion.div
        className="h-full w-full rounded-2xl bg-gradient-to-tr from-primary/40 via-secondary/40 to-accent/40"
        style={{
          boxShadow: glow
            ? `0 0 ${spread}px rgba(255,255,255,0.45)`
            : undefined,
        }}
        initial={{ opacity: 0.35, scale: 0.98 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

