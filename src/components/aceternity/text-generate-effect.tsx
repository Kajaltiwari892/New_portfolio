// Official Aceternity UI registry source: https://ui.aceternity.com/registry/text-generate-effect.json
// Local changes: project import paths; accessibility/theme adaptations are documented inline.
"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.035,
  textClassName,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
  textClassName?: string;
}) => {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const wordsArray = words.split(" ");
  useEffect(() => {
    const animation = animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : stagger(staggerDelay),
      }
    );
    return () => animation.stop();
  }, [animate, duration, filter, reduceMotion, staggerDelay, words]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} aria-hidden="true">
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0"
              style={{
                opacity: reduceMotion ? 1 : undefined,
                filter: filter && !reduceMotion ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <span className="sr-only">{words}</span>
      <div className="mt-4">
        <div className={cn("text-2xl leading-snug tracking-wide", textClassName)}>
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
