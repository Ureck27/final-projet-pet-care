"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: any;
  splitType?: "chars" | "words" | "lines" | "chars,words" | "chars,words,lines";
  from?: Record<string, any>;
  to?: Record<string, any>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  tag?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
  onLetterAnimationComplete?: () => void;
};

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = [0.25, 0.1, 0.25, 1],
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      },
    },
  };

  const childVariants: Variants = {
    hidden: from,
    visible: {
      ...to,
      transition: { duration, ease },
    },
  };

  const style: React.CSSProperties = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };

  const MotionTag = motion[tag as keyof typeof motion] || motion.p;

  return (
    <MotionTag
      ref={ref}
      style={style}
      className={`split-parent ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onAnimationComplete={() => {
        if (onLetterAnimationComplete) {
          onLetterAnimationComplete();
        }
      }}
    >
      {words.map((word, wordIndex) => {
        const isSplitChars = splitType.includes("chars");
        if (isSplitChars) {
          return (
            <span key={`word-${wordIndex}`} className="split-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={`char-${wordIndex}-${charIndex}`}
                  className="split-char"
                  variants={childVariants}
                  style={{ display: "inline-block", willChange: "transform, opacity" }}
                >
                  {char}
                </motion.span>
              ))}
              {wordIndex < words.length - 1 ? "\u00A0" : ""}
            </span>
          );
        } else {
          return (
            <motion.span
              key={`word-${wordIndex}`}
              className="split-word"
              variants={childVariants}
              style={{ display: "inline-block", whiteSpace: "pre", willChange: "transform, opacity" }}
            >
              {word}
              {wordIndex < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          );
        }
      })}
    </MotionTag>
  );
};

export default SplitText;
