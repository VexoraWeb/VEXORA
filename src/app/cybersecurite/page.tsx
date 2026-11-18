import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, TriangleAlert } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { auditPack, securityChecks, siteConfig, team } from "@/config/site";

export const metadata: Metadata = {
  title: "Cybersécurité — VEXORA SECURITY CHECK",
  description: `Analyse complète de la sécurité de votre site web : ${auditPack.price}. Rapport avec recommandations, réalisée avec l'autorisation du propriétaire.`,
};

export default function CybersecuritePage() {
  const lead = team.find((m) => m.id === "mahe");

  return (
    <>
      {/* En-tête */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-electric-500/20 blur-[130px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-[130px]" aria-hidden="true" />
        <div className="container-x relative max-w-4xl text-center">
          <span className="eyebrow">
            <ShieldCheck className="h-3.5 w-3.5" /> Cybersécurité
          </span>
          <h1 className="h-display mt-6 text-4xl sm:text-6xl">
            VEXORA <span className="gradient-text">SECURITY CHECK</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-display text-xl text-white/80">
            Un beau site, c&apos;est bien. Un site mieux protégé, c&apos;est essentiel.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/55">
            Une analyse de la sécurité de votre site web, avec un rapport clair et des recommandations concrètes. Elle
            peut accompagner la création de votre site ou être demandée seule pour un site existant.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/devis?audit=1" className="btn-primary">
              Demander une analyse <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#faq" className="btn-ghost">
              Questions fréquentes
            </Link>
          </div>
        </div>
      </section>

      {/* Pack */}
      <section className="section !pt-8">
        <div className="container-x">
          <Reveal>
            <article className="glass relative mx-auto max-w-4xl overflow-hidden p-7 sm:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" aria-hidden="true" />
              <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-violet-400">Pack</p>
                  <h2 className="h-display mt-2 text-3xl">{auditPack.name}</h2>
                  <div className="mt-6 border-y border-white/[0.07] py-5">
                    <p className="text-xs uppercase tracking-widest text-white/35">Tarif</p>
                    <p className="mt-1 font-display text-5xl font-semibold text-white">{auditPack.price}</p>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-white/45">{auditPack.priceNote}</p>
                  <Link href="/devis?audit=1" className="btn-primary mt-6 w-full sm:w-auto">
                    Choisir ce pack <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div>
                  <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-white/40">Ce que nous contrôlons</p>
                  <ul className="space-y-2.5">
                    {securityChecks.map((c) => (
                      <li key={c} className="flex gap-3 text-sm text-white/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Livrables */}
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeading
            eyebrow="Livrables"
            title={
              <>
                Ce que vous <span className="gradient-text">recevez</span>
              </>
            }
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            {auditPack.deliverables.map((d, i) => (
              <li key={d}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="glow-card h-full p-6">
                    <span className="font-display text-sm tracking-[0.2em] text-violet-400">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-4 text-sm leading-relaxed text-white/75">{d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Déroulement */}
      <section className="section !pt-8">
        <div className="container-x">
          <SectionHeading
            eyebrow="Déroulement"
            title={
              <>
                Comment ça <span className="gradient-text">se passe</span>
              </>
            }
          />
          <ol className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {auditPack.steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="glow-card h-full p-6">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-violet-500/30 to-electric-500/20 font-display text-sm text-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cadre et limites + responsable */}
      <section className="section !pt-8">
        <div className="container-x">
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="glass h-full p-7">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <TriangleAlert className="h-5 w-5 text-amber-300" /> Cadre et limites
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
                  {auditPack.limits.map((l) => (
                    <li key={l} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            {lead && (
              <Reveal delay={0.1} className="h-full">
                <div className="glass h-full p-7">
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-violet-400">Votre interlocuteur</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-white">{lead.name}</h2>
                  <p className="mt-1 text-sm text-white/55">{lead.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{lead.description}</p>
                </div>
              </Reveal>
            )}
          </div>

          <Reveal>
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <h2 className="h-display text-2xl sm:text-3xl">Prêt à faire analyser votre site ?</h2>
              <p className="mt-3 text-sm text-white/55">
                Il s&apos;agit d&apos;une demande de devis : aucun paiement en ligne. Une question ? Écrivez-nous à{" "}
                <a className="text-violet-400 underline underline-offset-2" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>
                .
              </p>
              <Link href="/devis?audit=1" className="btn-primary mt-7">
                Demander une analyse <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
