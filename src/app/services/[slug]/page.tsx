import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { packs, services } from "@/config/site";
import { serviceIcons } from "@/lib/service-icons";

// Seules les pages listées ici existent ; l'audit a sa propre page (/cybersecurite).
export const dynamicParams = false;

export function generateStaticParams() {
  return services.filter((s) => s.href.startsWith("/services/")).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function findService(slug: string) {
  return services.find((s) => s.slug === slug && s.href.startsWith("/services/"));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return { title: service.title, description: service.description };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const Icon = serviceIcons[service.icon];
  const pack = packs.find((p) => p.id === service.packId);
  const quoteHref = pack ? `/devis?pack=${pack.id}` : "/devis";
  const others = services.filter((s) => s.id !== service.id);

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[520px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" aria-hidden="true" />
        <div className="container-x relative max-w-3xl">
          <Link href="/#services" className="text-sm text-white/50 transition hover:text-white">
            ← Tous les services
          </Link>
          <span className="mt-8 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/25 to-electric-500/15 text-violet-400">
            <Icon className="h-6 w-6" />
          </span>
          <h1 className="h-display mt-6 text-4xl sm:text-5xl">{service.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/60">{service.intro}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-x max-w-3xl">
          <Reveal>
            <div className="glass p-7 sm:p-9">
              <h2 className="font-display text-sm uppercase tracking-[0.18em] text-violet-400">Ce que cela comprend</h2>
              <ul className="mt-5 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/80 sm:text-base">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-electric-400" />
                    {item}
                  </li>
                ))}
              </ul>
              {pack && (
                <p className="mt-6 border-t border-white/[0.07] pt-5 text-sm text-white/55">
                  Pack conseillé : <span className="text-white">{pack.name}</span> ({pack.price}). Vous pouvez en changer à
                  l&apos;étape 2 de la demande de devis.
                </p>
              )}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={quoteHref} className="btn-primary">
                  Demander un devis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/#packs" className="btn-ghost">
                  Voir les packs
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/40">Il s&apos;agit d&apos;une demande de devis : aucun paiement en ligne.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x max-w-3xl">
          <h2 className="font-display text-sm uppercase tracking-[0.18em] text-white/40">Autres services</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link
                  href={o.href}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
                >
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
