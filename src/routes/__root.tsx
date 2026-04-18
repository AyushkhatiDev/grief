import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { GriefProvider } from "@/context/GriefContext";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">This page hasn't been written yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Take a breath. Then come back home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GriefOS — Heal What Was Unsaid" },
      { name: "description", content: "A gentle companion for navigating loss. Letter Mode, Night Mode, and Memory Mode — built for the hardest hours." },
      { name: "author", content: "GriefOS" },
      { property: "og:title", content: "GriefOS — Heal What Was Unsaid" },
      { property: "og:description", content: "A gentle companion for navigating loss." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <GriefProvider>
      <Outlet />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "oklch(0.21 0.04 280)",
            color: "oklch(0.96 0.01 280)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
          },
        }}
      />
    </GriefProvider>
  );
}
