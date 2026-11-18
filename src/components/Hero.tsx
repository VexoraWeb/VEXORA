"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Code2, Palette, ShieldCheck } from "lucide-react";

const pillars = [
  { n: "01", title: "Création web", text: "Des sites modernes, rapides et adaptés à tous les écrans.", icon: Code2 },
  { n: "02", title: "Design personnalisé", text: "Une identité visuelle pensée pour votre activité, pas un modèle générique.", icon: Palette },
  { n: "03", title: "Cybersécurité", text: "Des contrôles de sécurité intégrés à nos prestations et disponibles en audit.", icon: ShieldCheck },
];

/** Maquette de site abstraite (blocs), purement décorative. */
function MockWindow({ accent, variant }: { accent: string; variant: "landing" | "shop" | "dash" }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 h-4 flex-1 rounded-full bg-white/[0.05]" />
      </div>
      <div className="p-4">
        {variant === "landing" && (
          <div className="space-y-3">
            <div className="h-3 w-1/3 rounded-full bg-white/20" />
            <div className="h-6 w-4/5 rounded-md bg-white/80" />
            <div className="h-6 w-3/5 rounded-md" style={{ background: accent }} />
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="h-2 w-5/6 rounded-full bg-white/10" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 rounded-full" style={{ background: accent }} />
              <div className="h-8 w-20 rounded-full border border-white/15" />
            </div>
          </div>
        )}
        {variant === "shop" && (
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div
                  className="aspect-square rounded-lg"
                  style={{ background: `linear-gradient(${135 + i * 20}deg, ${accent}, rgba(255,255,255,0.06))`, opacity: 0.55 + (i % 3) * 0.15 }}
                />
                <div className="h-2 w-4/5 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        )}
        {variant === "dash" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-white/[0.06]" />
              ))}
            </div>
            <div className="flex h-24 items-end gap-1.5 rounded-lg bg-white/[0.04] p-3">
              {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: accent, opacity: 0.4 + i * 0.08 }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      {/* Fond */}
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] animate-pulse-glow rounded-full bg-violet-600/25 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-40 h-[460px] w-[460px] animate-pulse-glow rounded-full bg-electric-500/20 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-x relative grid items-center gap-14 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric-400 shadow-[0_0_10px_#5ea2ff]" />
            Agence web &amp; cybersécurité
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-display mt-6 text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem]"
          >
            Votre présence en ligne <span className="gradient-text">mérite mieux.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Des sites web modernes, personnalisés et pensés pour votre activité. Avec VEXORA_STUDIO, donnez vie à vos
            projets numériques tout en accordant une attention particulière à leur sécurité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/#packs" className="btn-ghost">
              Découvrir nos packs
            </Link>
            <Link href="/devis" className="btn-primary">
              Démarrer mon projet <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Composition 3D de maquettes flottantes */}
        <div className="relative mx-auto hidden h-[500px] w-full max-w-[560px] scene-3d sm:block" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute left-0 top-6 w-[62%] animate-float-slow"
            style={{ transform: "rotateY(14deg) rotateX(6deg) rotateZ(-3deg)" }}
          >
            <MockWindow accent="#7c5cff" variant="landing" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute right-0 top-28 w-[60%] animate-float"
            style={{ transform: "rotateY(-12deg) rotateX(4deg) rotateZ(3deg)" }}
          >
            <MockWindow accent="#3b82ff" variant="shop" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute bottom-0 left-[14%] w-[58%] animate-float-slow"
            style={{ transform: "rotateY(8deg) rotateX(-3deg)" }}
          >
            <MockWindow accent="#9b82ff" variant="dash" />
          </motion.div>
          <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500/30 to-electric-500/20 blur-3xl" />
        </div>
      </div>

      {/* Trois piliers */}
      <div className="container-x relative pb-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.li
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="glow-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm tracking-[0.2em] text-violet-400">{p.n}</span>
                <p.icon className="h-5 w-5 text-white/40" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{p.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
