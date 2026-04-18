import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useGrief } from "@/context/GriefContext";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Heart, Shield, Bell, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — GriefOS" }] }),
  component: Profile,
});

const SETTINGS = [
  { icon: Heart, label: "Memory portrait", sub: "Manage what GriefOS remembers" },
  { icon: Bell, label: "Gentle reminders", sub: "Daily check-ins · 9:00pm" },
  { icon: Shield, label: "Privacy", sub: "Everything stays on this device" },
  { icon: LifeBuoy, label: "Crisis resources", sub: "If tonight is too heavy" },
];

function Profile() {
  const g = useGrief();
  return (
    <main className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-4">
          <Link to="/home" aria-label="Back" className="rounded-full p-1.5 hover:bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg">Profile</h1>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-medium text-primary-foreground glow-purple">
            {g.personName.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-4 font-display text-2xl">Remembering {g.personName}</h2>
          <p className="text-sm text-muted-foreground">{g.relationship} · since April 2024</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { v: g.memories.length + 241, l: "Moments" },
            { v: g.letters.length || 0, l: "Letters" },
            { v: g.chat.filter((c) => c.role === "user").length, l: "Conversations" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-4 text-center">
              <p className="font-display text-2xl text-primary">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          {SETTINGS.map(({ icon: Icon, label, sub }) => (
            <button
              key={label}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground">{sub}</span>
              </span>
              <span className="text-muted-foreground">→</span>
            </button>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          GriefOS · Heal What Was Unsaid
        </p>
      </section>

      <BottomNav />
    </main>
  );
}
