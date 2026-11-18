import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { packs } from "@/config/site";

export function Packs() {
  return (
    <section id="packs" className="section">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 mx-auto h-96 max-w-4xl rounded-full bg-violet-600/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Nos packs"
          title={
            <>
              Une formule pour <span className="gradient-text">chaque ambition</span>
            </>
          }
          text="Trois packs pour démarrer. Vous choisissez, puis nous affinons ensemble dans le devis. Aucun paiement n'est demandé en ligne."
        />

        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {packs.map((p, i) => (
            <li key={p.id} className="flex">
              <Reveal delay={i * 0.1} className="flex w-full">
                <article
                  className={`glow-card relative flex w-full flex-col p-7 ${
                    p.highlighted ? "border-violet-500/40 bg-violet-500/[0.06] lg:-translate-y-3" : ""
                  }`}
                >
                  {p.highlighted && (
                    <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-violet-500 to-electric-500 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-widest text-white">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-white/55">{p.audience}</p>

                  <div className="mt-6 border-y border-white/[0.07] py-5">
                    <p className="text-xs uppercase tracking-widest text-white/35">Tarif</p>
                    <p className="mt-1 font-display text-3xl font-semibold text-white">{p.price}</p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-xs leading-relaxed text-white/40">{p.note}</p>

                  <Link
                    href={`/devis?pack=${p.id}`}
                    className={`${p.highlighted ? "btn-primary" : "btn-ghost"} mt-6 w-full`}
                  >
                    Choisir ce pack <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/40">
          Il s'agit d'une demande de devis et non d'une commande confirmée.
        </p>
      </div>
    </section>
  );
}
