export function GriefLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40"
      style={{ width: size, height: size }}
      aria-label="GriefOS logo"
    >
      <span
        className="font-display font-semibold text-primary"
        style={{ fontSize: size * 0.55, lineHeight: 1 }}
      >
        G
      </span>
    </div>
  );
}
