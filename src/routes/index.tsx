import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GriefLogo } from "@/components/GriefLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GriefOS — Heal What Was Unsaid" },
      { name: "description", content: "A gentle companion for navigating loss." },
    ],
  }),
  component: Landing,
});

const particles = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  size: 2 + Math.random() * 3,
}));

function Landing() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-foreground/60 animate-drift"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Breathing logo */}
        <div className="relative mb-8 flex items-center justify-center">
          <span className="absolute h-40 w-40 rounded-full bg-primary/15 animate-breathe-slow" />
          <span className="absolute h-28 w-28 rounded-full bg-primary/25 animate-breathe" />
          <GriefLogo size={88} />
        </div>

        <h1 className="font-display text-5xl text-foreground sm:text-6xl">GriefOS</h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">Heal What Was Unsaid</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { icon: "✦", label: "Letter Mode" },
            { icon: "☽", label: "Night Mode" },
            { icon: "◈", label: "Memory Mode" },
          ].map((p) => (
            <span
              key={p.label}
              className="rounded-3xl border border-border bg-card/60 px-4 py-2 text-sm text-foreground/90 backdrop-blur"
            >
              <span className="mr-2 text-primary">{p.icon}</span>
              {p.label}
            </span>
          ))}
        </div>

        <motion.div whileTap={{ scale: 0.97 }} className="mt-12">
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 rounded-3xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground glow-purple-lg transition-colors hover:bg-primary/90"
          >
            Begin your journey
            <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <p className="mt-16 text-xs text-muted-foreground">
          Used by 60M+ people navigating loss every year
        </p>
      </motion.div>
    </main>
  );
}
