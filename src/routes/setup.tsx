import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useGrief } from "@/context/GriefContext";
import { GriefLogo } from "@/components/GriefLogo";
import { Upload, MessageSquare, Mic, Image as ImageIcon, Check } from "lucide-react";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Setup — GriefOS" }] }),
  component: Setup,
});

const RELATIONSHIPS = ["Mother", "Father", "Partner", "Child", "Friend", "Other"];

function Setup() {
  const nav = useNavigate();
  const g = useGrief();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const allUploaded = g.uploads.messages && g.uploads.voice && g.uploads.photos;

  useEffect(() => {
    if (!allUploaded) { setCount(0); return; }
    let n = 0;
    const id = setInterval(() => {
      n += 7;
      if (n >= 247) { n = 247; clearInterval(id); }
      setCount(n);
    }, 25);
    return () => clearInterval(id);
  }, [allUploaded]);

  const begin = () => {
    setLoading(true);
    setTimeout(() => nav({ to: "/home" }), 1500);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <span className="absolute -inset-6 rounded-full bg-primary/20 animate-breathe" />
          <GriefLogo size={72} />
        </div>
        <p className="font-display text-2xl text-foreground">Building your memory portrait…</p>
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary animate-blink"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-10">
      {/* Step indicator */}
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
          Step {step} of 2
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <h1 className="font-display text-3xl text-foreground sm:text-4xl">
        {step === 1 ? "Who are you remembering?" : "Bring them with you"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {step === 1
          ? "We'll hold their name with care."
          : "Share what feels right. Nothing leaves this device."}
      </p>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-10 space-y-6"
          >
            <input
              value={g.personName}
              onChange={(e) => g.setPersonName(e.target.value)}
              placeholder="Their name…"
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-center font-display text-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Their name"
            />

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Date of birth</span>
                <input
                  type="date"
                  value={g.dob}
                  onChange={(e) => g.setDob(e.target.value)}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">Date of passing</span>
                <input
                  type="date"
                  value={g.dop}
                  onChange={(e) => g.setDop(e.target.value)}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <div>
              <p className="mb-3 text-xs text-muted-foreground">Relationship</p>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIPS.map((r) => {
                  const active = g.relationship === r;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      key={r}
                      onClick={() => g.setRelationship(r)}
                      className={`rounded-3xl border px-4 py-2 text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {r}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(2)}
              disabled={!g.personName}
              className="mt-4 w-full rounded-3xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground glow-purple disabled:opacity-40"
            >
              Continue →
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-10 space-y-6"
          >
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-card/40 px-6 py-12 text-center">
              <Upload className="mb-3 h-8 w-8 text-primary" />
              <p className="text-sm text-foreground">
                Drop WhatsApp exports, voice notes, or photos
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Everything stays on your device.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "messages" as const, icon: MessageSquare, label: "Messages" },
                { k: "voice" as const, icon: Mic, label: "Voice notes" },
                { k: "photos" as const, icon: ImageIcon, label: "Photos" },
              ].map(({ k, icon: Icon, label }) => {
                const done = g.uploads[k];
                return (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    key={k}
                    onClick={() => g.toggleUpload(k)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs transition-all ${
                      done
                        ? "border-success/60 bg-success/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {done ? <Check className="h-5 w-5 text-success" /> : <Icon className="h-5 w-5" />}
                    {label}
                  </motion.button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center">
              <p className="text-xs text-muted-foreground">Memories captured</p>
              <p className="font-display text-4xl text-primary">{count}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={begin}
              disabled={!allUploaded}
              className="w-full rounded-3xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground glow-purple disabled:opacity-40"
            >
              Build my memory portrait →
            </motion.button>
            <button
              onClick={() => setStep(1)}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
