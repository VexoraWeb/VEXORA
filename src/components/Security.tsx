import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { auditPack, securityChecks } from "@/config/site";

export function Security() {
  return (
    <section id="cybersecurite" className="section">
      <div className="container-x">
        <Reveal>
          <div className="glass relative overflow-hidden p-8 sm:p-14">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-electric-500/20 blur-[110px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-violet-600/20 blur-[110px]"
              aria-hidden="true"
            />

            <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <span className="eyebrow">
                  <ShieldCheck className="h-3.5 w-3.5" /> Cybersécurité
                </span>
                <h2 className="h-display mt-5 text-3xl sm:text-5xl">
                  VEXORA <span className="gradient-text">SECURITY CHECK</span>
                </h2>
                <p className="mt-4 font-display text-lg text-white/80">
                  Un beau site, c&apos;est bien. Un site mieux protégé, c&apos;est essentiel.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  Les audits de sécurité sont une prestation complémentaire : ils peuvent accompagner la création de
                  votre site ou être demandés seuls pour un site existant.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/50">
                  <li>• L&apos;audit est réalisé uniquement avec l&apos;autorisation du propriétaire du site.</li>
                  <li>• Aucune sécurité absolue ne peut être promise : nous identifions et recommandons.</li>
                </ul>
                <p className="mt-6 font-display text-sm text-white/70">
                  {auditPack.name} : <span className="text-white">{auditPack.price}</span>
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link href="/devis?audit=1" className="btn-primary">
                    Demander un audit <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/cybersecurite" className="btn-ghost">
                    En savoir plus
                  </Link>
                </div>
              </div>

              <div>
                <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-white/40">Contrôles possibles</p>
                <ul className="grid gap-2.5">
                  {securityChecks.map((c, i) => (
                    <li
                      key={c}
                      className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-ink-900/60 px-4 py-3 text-sm text-white/80"
                    >
                      <span className="font-display text-xs tracking-widest text-electric-400">{String(i + 1).padStart(2, "0")}</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
