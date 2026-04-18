import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useGrief, type Memory } from "@/context/GriefContext";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Plus, X } from "lucide-react";

export const Route = createFileRoute("/memories")({
  head: () => ({ meta: [{ title: "Memory Portrait — GriefOS" }] }),
  component: Memories,
});

const TAG_META: Record<Memory["tag"], { label: string; cls: string }> = {
  "her-words": { label: "Her words", cls: "bg-primary/15 text-primary border-primary/30" },
  "your-memory": { label: "Your memory", cls: "bg-teal-400/15 text-teal-300 border-teal-400/30" },
  "voice-note": { label: "Voice note", cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" },
  "photo": { label: "Photo", cls: "bg-pink-400/15 text-pink-300 border-pink-400/30" },
};

const TAG_ORDER: Memory["tag"][] = ["her-words", "your-memory", "voice-note", "photo"];

function Waveform() {
  const bars = [0.5, 0.9, 0.4, 0.7, 1, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7];
  return (
    <div className="mt-3 flex h-12 items-center gap-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-amber-300/70 animate-wave"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function PhotoBlock() {
  return (
    <div
      className="mt-3 h-28 w-full rounded-xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,182,193,0.35), rgba(108,99,255,0.4), rgba(255,200,150,0.3))",
        filter: "blur(0.4px)",
      }}
    />
  );
}

function Memories() {
  const g = useGrief();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [tag, setTag] = useState<Memory["tag"]>("your-memory");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = () => {
    if (!text.trim()) return;
    const formatted = new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    g.addMemory({ date: formatted, text, tag });
    setText("");
    setOpen(false);
    toast.success("Memory added");
  };

  return (
    <main className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <Link to="/home" aria-label="Back" className="rounded-full p-1.5 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 font-display text-lg">Memory portrait</h1>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-3xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Add memory
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 py-8">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-center">
          {[
            { v: g.memories.length + 241, l: "Moments" },
            { v: 3, l: "Types" },
            { v: 2019, l: "Since" },
          ].map((s) => (
            <div key={s.l} className="flex-1">
              <p className="font-display text-2xl text-primary">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {g.memories.map((m) => {
              const meta = TAG_META[m.tag];
              return (
                <motion.article
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:glow-purple"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{m.date}</p>
                  <p className="mt-2 text-base leading-relaxed text-foreground">{m.text}</p>
                  {m.tag === "voice-note" && <Waveform />}
                  {m.tag === "photo" && <PhotoBlock />}
                  <span className={`mt-3 inline-block rounded-full border px-3 py-0.5 text-xs ${meta.cls}`}>
                    {meta.label}
                  </span>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl rounded-t-3xl border-t border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl">Add a memory</h2>
                <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1.5 hover:bg-background">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What do you want to remember?"
                className="min-h-[120px] w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <p className="mt-4 mb-2 text-xs text-muted-foreground">Tag</p>
              <div className="flex flex-wrap gap-2">
                {TAG_ORDER.map((t) => {
                  const active = tag === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      className={`rounded-3xl border px-3 py-1.5 text-xs ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"
                      }`}
                    >
                      {TAG_META[t].label}
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 block">
                <span className="text-xs text-muted-foreground">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                className="mt-5 w-full rounded-3xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-purple"
              >
                Save memory
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
