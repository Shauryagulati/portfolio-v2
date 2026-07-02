import { motion, useReducedMotion } from "motion/react";

/** Entrance choreography: one well-orchestrated rise per element,
 *  staggered by `order`. Falls back to static under reduced motion. */
export function Reveal({
  children,
  order = 0,
  as = "div",
}: {
  children: React.ReactNode;
  order?: number;
  as?: "div" | "section" | "header" | "li" | "span" | "p";
}) {
  const reduced = useReducedMotion();
  const M = motion[as];
  return (
    <M
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: order * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </M>
  );
}
