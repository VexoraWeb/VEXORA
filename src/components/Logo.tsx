import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="VEXORA_STUDIO — Accueil" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-ink-800">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9b82ff" />
              <stop offset="1" stopColor="#5ea2ff" />
            </linearGradient>
          </defs>
          <path d="M10 12h12l10 26 10-26h12L38 54h-12z" fill="url(#logo-g)" />
        </svg>
        <span className="absolute inset-0 rounded-xl opacity-0 shadow-[0_0_24px_rgba(124,92,255,0.7)] transition group-hover:opacity-100" />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-[0.14em] text-white">
        VEXORA<span className="text-violet-400">_</span>STUDIO
      </span>
    </Link>
  );
}
