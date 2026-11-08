import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrationsupabase/supabase/client";
import { ThemeToggle } from "@/components/wedding/ThemeToggle";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Couple Portal · Avindu & Yavishka" },
      { name: "description", content: "Private RSVP dashboard for Avindu & Yavishka." },
      { property: "og:title", content: "Couple Portal · Avindu & Yavishka" },
      { property: "og:description", content: "Private RSVP dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Portal,
});

type Rsvp = { id: string; name: string; phone: string | null; email: string | null; attending: boolean; guests: number; message: string | null; created_at: string };

function Portal() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <main className="min-h-svh px-4 py-16">
      <ThemeToggle />
      <div className="text-center">
        <Link to="/" className="font-caps text-xs tracking-[0.4em] text-muted-foreground hover:text-gold">← BACK TO INVITATION</Link>
        <h1 className="mt-3 font-script text-6xl text-gold-gradient">Couple Portal</h1>
      </div>
      {ready && (session ? <Dashboard /> : <AuthForm />)}
    </main>
  );
}

function AuthForm() {
  const [mode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/portal` } });
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
  };
  return (
    <form onSubmit={submit} className="card-paper mx-auto mt-10 max-w-sm space-y-4 p-8">
      <input className="field" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="field" type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {msg && <p className="text-center text-sm text-muted-foreground">{msg}</p>}
      <button className="btn-gold w-full">{mode === "in" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
    </form>
  );
}

function Dashboard() {
  const [rows, setRows] = useState<Rsvp[] | null>(null);
  const [isCouple, setIsCouple] = useState<boolean | null>(null);
  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user!.id).maybeSingle();
    setIsCouple(!!role);
    if (!role) return;
    const { data } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    if (!confirm("Delete this RSVP?")) return;
    await supabase.from("rsvps").delete().eq("id", id);
    load();
  };
  const signOut = () => supabase.auth.signOut();

  if (isCouple === false)
    return (
      <div className="card-paper mx-auto mt-10 max-w-md p-8 text-center font-serif">
        This account doesn't have access to the guest list.
        <button onClick={signOut} className="btn-gold mt-6">SIGN OUT</button>
      </div>
    );
  if (!rows) return <p className="mt-10 text-center font-serif italic">Loading…</p>;

  const yes = rows.filter((r) => r.attending);
  const total = yes.reduce((s, r) => s + r.guests, 0);
  const stats = [["Responses", rows.length], ["Attending", yes.length], ["Total guests", total], ["Declined", rows.length - yes.length]];

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="card-paper p-5 text-center">
            <div className="font-serif text-4xl font-semibold text-primary">{v}</div>
            <div className="font-caps text-[10px] tracking-[0.25em] text-muted-foreground">{String(l).toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {rows.length === 0 && <p className="text-center font-serif italic text-muted-foreground">No RSVPs yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="card-paper flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-xl font-semibold">{r.name}</span>
                <span className={`rounded-full px-3 py-0.5 font-caps text-[10px] tracking-widest ${r.attending ? "bg-gold/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {r.attending ? `ATTENDING · ${r.guests}` : "DECLINED"}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {[r.phone, r.email, new Date(r.created_at).toLocaleString()].filter(Boolean).join(" · ")}
              </div>
              {r.message && <p className="mt-2 font-serif italic">“{r.message}”</p>}
            </div>
            <button onClick={() => remove(r.id)} aria-label="Delete" className="shrink-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center"><button onClick={signOut} className="btn-gold">SIGN OUT</button></div>
    </div>
  );
}
