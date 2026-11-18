import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { team } from "@/config/site";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Team() {
  return (
    <section id="a-propos" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="À propos"
          title={
            <>
              Derrière <span className="gradient-text">VEXORA_STUDIO</span>
            </>
          }
          text="L'IA est un outil de conception et de développement. Chaque projet bénéficie d'un accompagnement humain et d'une personnalisation."
        />

        <ul className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {team.map((m, i) => (
            <li key={m.id}>
              <Reveal delay={i * 0.1} className="h-full">
                <article className="glow-card flex h-full flex-col p-7">
                  <div className="flex items-center gap-5">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={`Photo de ${m.name}`}
                        width={84}
                        height={84}
                        className="h-[84px] w-[84px] rounded-2xl object-cover"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`Photo de ${m.name} à venir`}
                        className="grid h-[84px] w-[84px] shrink-0 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/30 via-ink-800 to-electric-500/25 font-display text-2xl font-semibold text-white/80"
                      >
                        {initials(m.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">{m.name}</h3>
                      <p className="mt-1 text-sm text-violet-400">{m.role}</p>
                    </div>
                  </div>
                  <p className="mt-6 flex-1 text-sm leading-relaxed text-white/60">{m.description}</p>
                  {m.links.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/25 hover:text-white"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
