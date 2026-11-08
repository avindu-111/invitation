import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, from = "up", className }: { children: ReactNode; delay?: number; from?: "up" | "left" | "right" | "zoom"; className?: string }) {
  const reduced = useReducedMotion();
  const init = reduced ? {} : { up: { y: 50 }, left: { x: -60 }, right: { x: 60 }, zoom: { scale: 0.85 } }[from];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: reduced ? "none" : "blur(6px)", ...init }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduced ? 0.15 : 1.1, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Ornament() {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-3 text-gold">
      <span className="h-px w-16 bg-gold/60" />
      <span className="text-xl">❦</span>
      <span className="h-px w-16 bg-gold/60" />
    </div>
  );
}

export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="text-center">
      <p className="font-caps text-xs tracking-[0.4em] text-muted-foreground">{kicker}</p>
      <h2 className="mt-2 font-script text-5xl text-gold-gradient sm:text-6xl">{title}</h2>
      <Ornament />
    </Reveal>
  );
}
