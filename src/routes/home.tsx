import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useGrief } from "@/context/GriefContext";
import { GriefLogo } from "@/components/GriefLogo";
import { BottomNav } from "@/components/BottomNav";
import { Settings, PenLine, Moon, BookHeart } from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — GriefOS" }] }),
  component: Home,
});

const MOODS = ["😔", "😞", "😐", "🙂", "😌"];

const MODES = [
  {
    to: "/letter" as const,
    icon: PenLine,
    title: "Letter Mode",
    desc: "Write the words you never got to say",
  },
  {
    to: "/night" as const,
    icon: Moon,
    title: "Night Mode",
    desc: "A companion for the hardest hours",
  },
  {
    to: "/memories" as const,
    icon: BookHeart,
    title: "Memory Mode",
    desc: "Revisit the moments that mattered",
  },
];

function Home() {
  const g = useGrief();
  const initials = g.personName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen pb-28">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <GriefLogo size={36} />
          <span className="font-display text-xl">GriefOS</span>
        </div>
        <Link to="/profile" aria-label="Settings" className="rounded-full p-2 hover:bg-card">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-primary/20 animate-breathe-slow" />
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary text-2xl font-medium text-primary-foreground glow-purple">
              {initials}
            </div>
          </div>
          <h1 className="mt-5 font-display text-3xl text-foreground">{g.personName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            247 moments captured · Active since April 2024
          </p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Memory portrait ready
          </span>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map(({ to, icon: Icon, title, desc }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:glow-purple"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <Link
                to={to}
                className="mt-5 inline-flex items-center gap-2 rounded-3xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Enter →
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 rounded-2xl border border-border bg-card p-6"
        >
          <p className="font-display text-lg">How are you feeling today?</p>
          <p className="text-xs text-muted-foreground">There's no wrong answer.</p>
          <div className="mt-4 flex justify-between gap-2">
            {MOODS.map((m, i) => {
              const active = g.mood === i;
              return (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  key={m}
                  onClick={() => g.setMood(i)}
                  aria-label={`Mood ${i + 1} of 5`}
                  className={`flex h-14 flex-1 items-center justify-center rounded-2xl border text-2xl transition-all ${
                    active
                      ? "border-primary bg-primary/20 glow-purple"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {m}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      <BottomNav />
    </main>
  );
}
