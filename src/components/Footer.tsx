import Link from "next/link";
import { Logo } from "@/components/Logo";
import { navLinks, siteConfig } from "@/config/site";

const columns = [
  {
    title: "Navigation",
    links: navLinks.filter((l) => ["Accueil", "À propos", "FAQ"].includes(l.label)).map((l) => ({ label: l.label, href: l.href })),
  },
  {
    title: "Services",
    links: [
      { label: "Nos services", href: "/#services" },
      { label: "Packs", href: "/#packs" },
      { label: "Cybersécurité", href: "/#cybersecurite" },
      { label: "Créer mon projet", href: "/devis" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` },
      { label: "Formulaire de contact", href: "/#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-white/50">{siteConfig.tagline}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-xs font-medium uppercase tracking-[0.18em] text-white/40">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="break-all text-sm text-white/65 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
            <li><Link href="/cgv" className="hover:text-white">Conditions générales de vente</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
