import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, X, MapPin, Clock, CalendarHeart, Phone, Heart } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import roses from "@/assets/envelope-blooms.png";
import couple from "@/assets/national-dress-couple.png";
import { CEREMONY_ISO, GALLERY, VENUE, timeLeft } from "@/lib/wedding";
import { Reveal, Ornament, SectionTitle } from "./Reveal";

export function Petals() {
  const [items, setItems] = useState<{ l: number; d: number; s: number; delay: number }[]>([]);
  useEffect(() => {
    setItems(Array.from({ length: 14 }, () => ({ l: Math.random() * 100, d: 10 + Math.random() * 10, s: 8 + Math.random() * 10, delay: Math.random() * 12 })));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-petal rounded-[60%_0_60%_0] bg-gold-soft/70"
          style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-12 text-center">
      <motion.img src={roses} alt="" width={1024} height={1024} className="pointer-events-none absolute -left-24 -top-16 z-0 w-52 opacity-60 sm:w-72 animate-floaty" style={{ y }} />
      <motion.img src={roses} alt="" width={1024} height={1024} className="pointer-events-none absolute -bottom-20 -right-24 z-0 w-52 rotate-180 opacity-60 sm:w-72 animate-floaty" />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-10 font-caps text-[10px] text-muted-foreground sm:text-xs">
        TOGETHER WITH THEIR FAMILIES
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-5"
      >
        <img src={couple} width={1024} height={1536} alt="Illustrated groom in Sri Lankan national dress and bride in a Kandyan fishtail sari" className="relative h-[min(44svh,420px)] w-auto max-w-full object-contain" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="relative z-10 font-script text-5xl leading-tight text-primary sm:text-7xl">
        Avindu <span className="text-4xl sm:text-6xl">&amp;</span> Yavishka
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="relative z-10 mt-3 font-serif text-xl italic text-muted-foreground">
        are getting married
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="relative z-10 mt-5 flex items-center gap-4 font-caps text-sm text-primary">
        <span className="h-px w-10 bg-gold" /> 20 · 01 · 2027 <span className="h-px w-10 bg-gold" />
      </motion.div>
      <motion.a href="#rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="btn-gold relative z-10 mt-8">
        RSVP NOW
      </motion.a>
    </section>
  );
}

export function Invitation() {
  return (
    <section className="relative px-6 py-20">
      <Reveal from="zoom" className="mx-auto max-w-2xl border-y border-gold/30 px-2 py-12 text-center sm:px-12">
        <img src={roses} alt="" width={1024} height={1024} loading="lazy" className="mx-auto mb-8 h-44 w-44 object-contain" />
        <p className="font-serif text-lg leading-relaxed sm:text-xl">
          Mr. Sugath Senanayaka &amp; Mrs. Renuka Wikramarachchi
          <br /><span className="italic text-muted-foreground">together with</span><br />
          Mr. Dishantha Kodikara &amp; Mrs. Thushari Hewamanage
        </p>
        <p className="mt-4 font-serif italic text-muted-foreground">request the honour of your presence to celebrate the wedding of their beloved son and daughter</p>
        <Ornament />
        <h3 className="font-script text-5xl text-gold-gradient sm:text-6xl">Avindu &amp; Yavishka</h3>
        <div className="mt-8 grid grid-cols-3 items-center gap-2 font-caps text-primary">
          <span className="border-y border-gold/60 py-2 text-xs tracking-widest sm:text-sm">WEDNESDAY</span>
          <div>
            <div className="text-xs tracking-[0.3em]">JANUARY</div>
            <div className="font-serif text-6xl font-semibold leading-none">20</div>
            <div className="text-sm tracking-[0.3em]">2027</div>
          </div>
          <span className="border-y border-gold/60 py-2 text-xs tracking-widest sm:text-sm">9AM – 3.30PM</span>
        </div>
        <p className="mt-6 font-serif text-lg italic">Poruwa ceremony at 9.42 am</p>
        <p className="mt-2 font-caps tracking-[0.2em] text-primary">{VENUE.name}, {VENUE.town}</p>
        <p className="mt-6 font-script text-4xl text-gold-gradient">Reception to follow</p>
      </Reveal>
    </section>
  );
}

export function Countdown() {
  const target = Date.parse(CEREMONY_ISO);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = now ? timeLeft(target, now) : null;
  const units = [["Days", t?.days], ["Hours", t?.hours], ["Minutes", t?.minutes], ["Seconds", t?.seconds]] as const;
  return (
    <section className="px-6 py-20">
      <SectionTitle kicker="SAVE THE DATE" title="Counting Down" />
      {t?.done ? (
        <p className="text-center font-script text-5xl text-gold-gradient">Today we say "I do"!</p>
      ) : (
        <div className="mx-auto grid max-w-2xl grid-cols-4 gap-3 sm:gap-5">
          {units.map(([label, v], i) => (
            <Reveal key={label} delay={i * 0.12} className="card-paper flex flex-col items-center py-5 sm:py-8">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={v ?? "-"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="font-serif text-3xl font-semibold text-primary tabular-nums sm:text-5xl"
                >
                  {v === undefined ? "--" : String(v).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <span className="mt-1 font-caps text-[9px] tracking-[0.2em] text-muted-foreground sm:text-xs">{label.toUpperCase()}</span>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export function Details() {
  const items = [
    { icon: CalendarHeart, title: "The Date", text: "Wednesday, 20th January 2027" },
    { icon: Clock, title: "The Time", text: "9.00 am – 3.30 pm · Poruwa 9.42 am" },
    { icon: MapPin, title: "The Venue", text: `${VENUE.name}, ${VENUE.town}` },
  ];
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.15} from={i === 0 ? "left" : i === 2 ? "right" : "up"} className="card-paper p-7 text-center">
            <it.icon className="mx-auto h-8 w-8 text-gold" />
            <h3 className="mt-3 font-script text-3xl text-primary">{it.title}</h3>
            <p className="mt-2 font-serif text-lg">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);
  const go = (d: number) => setIdx((i) => (i === null ? i : (i + d + GALLERY.length) % GALLERY.length));
  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setIdx(null); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx]);
  return (
    <section className="px-4 py-20">
      <SectionTitle kicker="OUR MOMENTS" title="Gallery" />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {GALLERY.map((g, i) => (
          <Reveal key={g.src} delay={i * 0.1} from="zoom" className={i % 3 === 0 ? "row-span-2" : ""}>
            <button onClick={() => setIdx(i)} className="group relative block h-full w-full overflow-hidden rounded-2xl border border-gold/40 shadow-card">
              <img src={g.src} alt={g.caption} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${i % 3 === 0 ? "h-full min-h-72" : "h-44 sm:h-56"}`} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent p-3 text-left font-script text-2xl text-background opacity-0 transition-opacity group-hover:opacity-100">
                {g.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {idx !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4" onClick={() => setIdx(null)}>
            <motion.img
              key={idx}
              src={GALLERY[idx]!.src}
              alt={GALLERY[idx]!.caption}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-xl border-2 border-gold/60 object-contain"
            />
            <button aria-label="Close" className="absolute right-4 top-4 rounded-full bg-background/20 p-2 text-background"><X /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-2 rounded-full bg-background/20 p-2 text-background"><ChevronLeft /></button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-2 rounded-full bg-background/20 p-2 text-background"><ChevronRight /></button>
            <p className="absolute bottom-6 font-script text-3xl text-background">{GALLERY[idx]!.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Venue() {
  return (
    <section className="px-4 py-20">
      <SectionTitle kicker="FIND YOUR WAY" title="The Venue" />
      <Reveal from="zoom" className="card-paper mx-auto max-w-4xl overflow-hidden p-2">
        <iframe
          title="Venue map"
          src={`https://maps.google.com/maps?q=${VENUE.lat},${VENUE.lng}&z=16&output=embed`}
          className="h-80 w-full rounded-xl sm:h-96"
          loading="lazy"
        />
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="font-script text-4xl text-primary">{VENUE.name}</p>
          <p className="font-caps text-sm tracking-[0.25em] text-muted-foreground">{VENUE.town}, Sri Lanka</p>
          <a href={VENUE.link} target="_blank" rel="noreferrer" className="btn-gold mt-2"><MapPin className="h-4 w-4" /> GET DIRECTIONS</a>
        </div>
      </Reveal>
    </section>
  );
}

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z.string().trim().max(30).optional(),
  email: z.union([z.literal(""), z.string().trim().email("Invalid email").max(255)]),
  attending: z.boolean(),
  guests: z.number().int().min(0).max(10),
  message: z.string().trim().max(1000).optional(),
});

export function Rsvp() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", attending: true, guests: 1, message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = rsvpSchema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    setStatus("sending");
    const d = parsed.data;
    const { error } = await supabase.from("rsvps").insert({
      name: d.name, phone: d.phone || null, email: d.email || null, attending: d.attending, guests: d.attending ? d.guests : 0, message: d.message || null,
    });
    if (error) { setStatus("idle"); return setError("Something went wrong, please try again."); }
    setStatus("done");
  };

  return (
    <section id="rsvp" className="scroll-mt-10 px-4 py-20">
      <SectionTitle kicker="KINDLY REPLY" title="RSVP" />
      <Reveal className="card-paper relative mx-auto max-w-xl overflow-hidden p-6 sm:p-10">
        <img src={roses} alt="" loading="lazy" width={1024} height={1024} className="pointer-events-none absolute -right-16 -top-16 w-40 opacity-60" />
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                <Heart className="mx-auto h-14 w-14 fill-seal text-seal" />
              </motion.div>
              <p className="mt-4 font-script text-5xl text-gold-gradient">Thank you!</p>
              <p className="mt-2 font-serif text-lg italic text-muted-foreground">
                {form.attending ? "We can't wait to celebrate with you." : "You'll be missed — thank you for letting us know."}
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="relative space-y-4">
              <p className="text-center font-serif italic text-muted-foreground">Please confirm your attendance</p>
              <input className="field" placeholder="Your full name *" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={100} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="field" placeholder="Phone" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} />
                <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((a) => (
                  <button
                    type="button"
                    key={String(a)}
                    onClick={() => set("attending", a)}
                    className={`rounded-xl border px-3 py-3 font-serif text-lg transition-all ${form.attending === a ? "border-gold bg-gold/15 text-primary shadow-card" : "border-input text-muted-foreground"}`}
                  >
                    {a ? "Joyfully accept" : "Regretfully decline"}
                  </button>
                ))}
              </div>
              {form.attending && (
                <label className="flex items-center justify-between gap-3 font-serif text-lg">
                  Number of guests
                  <select className="field w-28" value={form.guests} onChange={(e) => set("guests", Number(e.target.value))}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
              )}
              <textarea className="field min-h-24" placeholder="A message for the couple (optional)" value={form.message} onChange={(e) => set("message", e.target.value)} maxLength={1000} />
              {error && <p className="text-center text-sm text-destructive">{error}</p>}
              <button className="btn-gold w-full" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "SEND RSVP"}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="px-6 pb-16 pt-10 text-center">
      <Reveal>
        <p className="font-caps text-xs tracking-[0.4em] text-muted-foreground">RSVP BY PHONE</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 font-serif text-lg sm:flex-row sm:gap-8">
          <a href="tel:0789481126" className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4 text-gold" /> Avindu · 078 948 1126</a>
          <a href="tel:0760178126" className="flex items-center gap-2 hover:text-gold"><Phone className="h-4 w-4 text-gold" /> Yavishka · 076 017 8126</a>
        </div>
        <div className="mt-6">
          <Link to="/portal" className="font-caps text-[10px] tracking-[0.3em] text-muted-foreground/70 transition-colors hover:text-gold">
            COUPLE PORTAL · RSVP LIST
          </Link>
        </div>
        <Ornament />
        <p className="font-script text-5xl text-gold-gradient">With love, A &amp; Y</p>
      </Reveal>
    </footer>
  );
}
