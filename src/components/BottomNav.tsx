import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, MessageCircle, BookOpen, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/night", label: "Chat", Icon: MessageCircle },
  { to: "/memories", label: "Memories", Icon: BookOpen },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2"
            >
              {active && (
                <motion.span
                  layoutId="navpill"
                  className="absolute inset-1 rounded-2xl bg-primary/15"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                className={`relative h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`relative text-[11px] ${active ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
