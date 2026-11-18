import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Globe,
  type LucideIcon,
  RefreshCw,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  LayoutTemplate,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { type ServiceIcon, services } from "@/config/site";

const icons: Record<ServiceIcon, LucideIcon> = {
  globe: Globe,
  briefcase: Briefcase,
  rocket: Rocket,
  shopping: ShoppingBag,
  portfolio: LayoutTemplate,
  refresh: RefreshCw,
  server: Server,
  wrench: Wrench,
  search: Search,
  shield: ShieldCheck,
};

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              Tout pour votre <span className="gradient-text">présence en ligne</span>
            </>
          }
          text="De la conception à la mise en ligne, nous couvrons l'essentiel pour particuliers, entrepreneurs et entreprises."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.id}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article className="glow-card group flex h-full flex-col p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-electric-500/10 text-violet-400 transition group-hover:text-white group-hover:shadow-[0_0_28px_rgba(124,92,255,0.45)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.description}</p>
                    <Link
                      href={s.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition hover:text-white"
                    >
                      Découvrir ce service
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
