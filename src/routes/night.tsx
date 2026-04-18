import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useGrief } from "@/context/GriefContext";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Send, Mic } from "lucide-react";

export const Route = createFileRoute("/night")({
  head: () => ({ meta: [{ title: "Night Mode — GriefOS" }] }),
  component: Night,
});

const REPLIES = [
  "That sounds heavy. Stay with it for a moment — you don't have to fix it tonight.",
  "I hear you. There's a kind of love that only shows up as missing someone.",
  "Whatever you just said — it makes sense. It really does.",
  "She would have wanted you to rest, but she'd understand why you can't.",
  "Take a slow breath with me. In for four. Hold. Out for six. I'm right here.",
];

function Night() {
  const g = useGrief();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [g.chat, typing]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    g.pushChat({ id: crypto.randomUUID(), role: "user", text: t });
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      g.pushChat({ id: crypto.randomUUID(), role: "ai", text: REPLIES[replyIdx % REPLIES.length] });
      setReplyIdx((i) => i + 1);
    }, 1500);
  };

  return (
    <main className="relative flex min-h-screen flex-col pb-28 dot-grid">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <Link to="/home" aria-label="Back" className="rounded-full p-1.5 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-lg leading-tight">Night Mode</h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Always here
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground glow-purple">
            {g.personName.slice(0, 1).toUpperCase()}
          </div>
          <p className="mt-2 font-display text-base">{g.personName}</p>
          <p className="text-xs text-muted-foreground">Memory portrait active</p>
        </div>
      </header>

      <div ref={scrollRef} className="mx-auto w-full max-w-2xl flex-1 space-y-3 overflow-y-auto px-5 py-6">
        <AnimatePresence initial={true}>
          {g.chat.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i < 3 ? i * 0.3 : 0, duration: 0.4 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-1.5 rounded-2xl border border-border bg-card px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground animate-blink"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Say what you can't say anywhere else…"
            aria-label="Message"
            className="flex-1 rounded-3xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button aria-label="Voice input" className="rounded-full p-3 text-muted-foreground hover:bg-card">
            <Mic className="h-5 w-5" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={send}
            aria-label="Send"
            className="rounded-full bg-primary p-3 text-primary-foreground glow-purple"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
