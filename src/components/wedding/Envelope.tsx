import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import florals from "@/assets/envelope-blooms.png";

export function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const open = () => {
    if (opening) return;
    setOpening(true);
    timer.current = setTimeout(onOpen, reduceMotion ? 150 : 2200);
  };

  return (
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-background px-6 py-8"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: opening ? 0 : 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-center font-caps text-[10px] text-muted-foreground sm:text-xs"
        >
          YOU ARE INVITED
        </motion.p>

        <motion.div
          initial={{ scale: reduceMotion ? 1 : 0.92, opacity: 0 }}
          animate={opening ? { scale: 1.08, y: 80, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={opening ? { delay: 1.5, duration: 0.7 } : { duration: 1 }}
          className="relative aspect-[1.75] w-full max-w-xl"
          style={{ perspective: 1200 }}
        >
          {/* letter peeking */}
          <motion.div
            animate={opening ? { y: "-65%" } : { y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute inset-x-[6%] top-[6%] bottom-[6%] z-10 flex flex-col items-center justify-center rounded-md border border-gold/40 bg-card"
          >
            <span className="font-script text-4xl text-gold-gradient">A &amp; Y</span>
            <span className="font-caps text-[10px] tracking-[0.3em] text-muted-foreground">20 · 01 · 2027</span>
          </motion.div>

          {/* body */}
          <div className="envelope-body absolute inset-0 z-20 overflow-hidden rounded-lg border border-gold/40 bg-envelope shadow-card">
            <img src={florals} width={1024} height={1024} alt="" className="absolute -bottom-4 right-0 h-[115%] w-[62%] object-contain" />
            <div className="absolute bottom-[12%] left-[8%] font-script text-3xl leading-tight text-primary sm:text-5xl">Avindu<br /><span className="pl-8 text-2xl sm:text-3xl">&amp;</span><br /><span className="pl-6">Yavishka</span></div>
            <div className="absolute inset-2 rounded-md border border-gold/20" />
          </div>

          {/* flap */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 h-[56%] origin-top"
            animate={opening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
            transition={{ duration: 0.7 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="envelope-flap h-full w-full bg-envelope"
            />
          </motion.div>

          {/* seal */}
          <motion.div
            animate={opening ? { scale: 0, rotate: 90, opacity: 0 } : { scale: 1 }}
            className="absolute left-1/2 top-[54%] z-40 -translate-x-1/2 -translate-y-1/2"
          >
            <Button onClick={open} disabled={opening} aria-label="Open the invitation" className="wedding-seal relative h-16 w-16 rounded-full border border-gold bg-gold-gradient p-0 text-primary shadow-card hover:scale-105 sm:h-20 sm:w-20">
              <span className="absolute inset-1.5 rounded-full border border-primary/30" />
              <span className="font-script text-3xl">AY</span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          animate={{ opacity: opening ? 0 : reduceMotion ? 1 : [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="mt-10 font-serif text-lg italic text-muted-foreground"
        >
          Tap the seal to open
        </motion.p>
      </motion.div>
  );
}
