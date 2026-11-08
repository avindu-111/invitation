import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import couple from "@/assets/national-dress-couple.png";
import roses from "@/assets/envelope-blooms.png";

export function WeddingIntro({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(onComplete, reduceMotion ? 1500 : 6500);
    return () => clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <motion.section aria-label="Wedding welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-background px-6 py-6 text-center">
      <img src={roses} width={1024} height={1024} alt="" className="pointer-events-none absolute -left-24 -top-20 w-64 opacity-50 sm:w-80" />
      <img src={roses} width={1024} height={1024} alt="" className="pointer-events-none absolute -bottom-20 -right-24 w-64 rotate-180 opacity-50 sm:w-80" />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative font-caps text-[10px] text-muted-foreground sm:text-xs">TWO HEARTS · ONE BEAUTIFUL JOURNEY</motion.p>
      <motion.img src={couple} alt="Illustrated groom in Sri Lankan national dress and bride in a Kandyan fishtail sari" width={1024} height={1536} initial={{ opacity: 0, y: reduceMotion ? 0 : 30, scale: reduceMotion ? 1 : 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} className="welcome-couple relative my-4 h-[min(53svh,560px)] w-auto max-w-full object-contain" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 1.4, duration: 1 }} className="relative">
        <h2 className="font-script text-4xl leading-tight text-primary sm:text-6xl">Avindu &amp; Yavishka</h2>
        <p className="mt-2 font-serif text-lg italic text-muted-foreground">A lifetime of love begins</p>
        <p className="mt-3 font-caps text-xs text-gold">20 · 01 · 2027</p>
      </motion.div>
      <Button variant="ghost" onClick={onComplete} className="relative mt-5 font-serif text-muted-foreground">View invitation <ArrowRight /></Button>
      {!reduceMotion && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: "linear" }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold" />}
    </motion.section>
  );
}