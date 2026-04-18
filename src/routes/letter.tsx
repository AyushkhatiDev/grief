import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGrief } from "@/context/GriefContext";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/letter")({
  head: () => ({ meta: [{ title: "Letter Mode — GriefOS" }] }),
  component: Letter,
});

function Letter() {
  const g = useGrief();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!text) { setSaved(false); return; }
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(true), 2000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const saveLetter = () => {
    if (!text.trim()) return;
    g.addLetter(text);
    toast.success("Letter saved");
  };

  const sendToGrief = () => {
    if (!text.trim()) return;
    setThinking(true);
    setResponse(null);
    setTimeout(() => {
      setThinking(false);
      setResponse(
        `What you wrote to ${g.personName} matters. The part about what you wished you'd said — that's not a failure of love, that's its proof. She didn't need the words said out loud to know. But you needed to write them. That counts.`
      );
    }, 1000);
  };

  return (
    <main className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <Link to="/home" aria-label="Back" className="rounded-full p-1.5 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg">Letter Mode</h1>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 py-8">
        <h2 className="font-display text-2xl italic text-foreground sm:text-3xl">
          Dear {g.personName}, there's something I never got to say…
        </h2>

        <div className="relative mt-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Begin wherever you need to…"
            aria-label="Your letter"
            className="min-h-[320px] w-full resize-none rounded-2xl border border-transparent bg-card px-5 py-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="absolute bottom-3 right-4 flex items-center gap-3 text-xs text-muted-foreground">
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1 text-success"
              >
                <Check className="h-3 w-3" /> Saved
              </motion.span>
            )}
            <span>{wordCount} words</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={saveLetter}
            className="flex-1 rounded-3xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:border-primary/50"
          >
            Save letter
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={sendToGrief}
            disabled={!text.trim() || thinking}
            className="flex-1 rounded-3xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-purple disabled:opacity-40"
          >
            {thinking ? "Reading…" : "Send to GriefOS →"}
          </motion.button>
        </div>

        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-primary animate-blink" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-primary/30 bg-primary/8 p-6 glow-purple"
              style={{ background: "linear-gradient(180deg, rgba(108,99,255,0.08), rgba(108,99,255,0.02))" }}
            >
              <p className="font-display text-sm uppercase tracking-widest text-primary">Response</p>
              <p className="mt-3 text-base leading-relaxed text-foreground">{response}</p>
              <p className="mt-6 text-sm text-muted-foreground">
                Would you like to explore this feeling further?
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/night"
                  className="flex-1 rounded-3xl bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Continue in Night Mode
                </Link>
                <button
                  onClick={() => {
                    g.addMemory({ date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), text: text.slice(0, 140), tag: "your-memory" });
                    toast.success("Saved to your memory portrait");
                  }}
                  className="flex-1 rounded-3xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50"
                >
                  Save this moment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <BottomNav />
    </main>
  );
}
