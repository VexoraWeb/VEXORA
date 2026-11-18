"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Instagram, Loader2, Mail, MessageCircle, MessagesSquare, Send } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { siteConfig } from "@/config/site";
import { newSubmissionId, submitRequest } from "@/lib/submit";

export function ContactSection() {
  const startedAt = useRef(Date.now());
  const submissionId = useRef(newSubmissionId());
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", consent: false, hp: "" });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return; // évite les doubles soumissions
    setError("");
    setFieldErrors({});
    setStatus("sending");
    const res = await submitRequest({
      kind: "contact",
      submissionId: submissionId.current,
      startedAt: startedAt.current,
      ...form,
    });
    if (res.ok) {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    setError(res.message);
    if (res.fieldErrors) setFieldErrors(res.fieldErrors);
  }

  const socials = [
    { key: "instagram", label: "Instagram", href: siteConfig.socials.instagram, Icon: Instagram },
    { key: "discord", label: "Discord", href: siteConfig.socials.discord, Icon: MessagesSquare },
    { key: "whatsapp", label: "WhatsApp", href: siteConfig.socials.whatsapp, Icon: MessageCircle },
  ];

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Parlons de <span className="gradient-text">votre projet</span>
            </>
          }
          text="Une question avant de demander un devis ? Écrivez-nous, nous revenons vers vous."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="glass h-full p-7">
              <h3 className="font-display text-lg font-semibold text-white">Coordonnées</h3>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="mt-5 flex items-center gap-3 break-all rounded-xl border border-white/[0.07] bg-ink-900/60 px-4 py-3 text-sm text-white/80 transition hover:border-violet-500/50"
              >
                <Mail className="h-4 w-4 shrink-0 text-violet-400" />
                {siteConfig.contactEmail}
              </a>
              <ul className="mt-3 space-y-3">
                {socials.map(({ key, label, href, Icon }) => (
                  <li key={key}>
                    {/^https:\/\//i.test(href) ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-900/60 px-4 py-3 text-sm text-white/80 transition hover:border-violet-500/50"
                      >
                        <Icon className="h-4 w-4 text-violet-400" /> {label}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-white/35">
                        <Icon className="h-4 w-4" /> {label} — bientôt disponible
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass p-6 sm:p-8">
              {status === "sent" ? (
                <div className="py-10 text-center" role="status">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-electric-400" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-white">Message transmis</h3>
                  <p className="mt-2 text-sm text-white/60">Votre message a bien été transmis à VEXORA_STUDIO.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  {/* Champ piège anti-robot */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label>
                      Ne pas remplir
                      <input tabIndex={-1} autoComplete="off" value={form.hp} onChange={(e) => set("hp", e.target.value)} />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="mb-2 block text-sm text-white/70">Nom *</label>
                      <input id="c-name" className="field" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!fieldErrors.name} required maxLength={120} />
                      {fieldErrors.name && <p className="mt-1.5 text-xs text-red-300">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="mb-2 block text-sm text-white/70">E-mail *</label>
                      <input id="c-email" type="email" className="field" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!fieldErrors.email} required maxLength={254} />
                      {fieldErrors.email && <p className="mt-1.5 text-xs text-red-300">{fieldErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-subject" className="mb-2 block text-sm text-white/70">Sujet</label>
                    <input id="c-subject" className="field" value={form.subject} onChange={(e) => set("subject", e.target.value)} maxLength={150} />
                  </div>
                  <div>
                    <label htmlFor="c-message" className="mb-2 block text-sm text-white/70">Message *</label>
                    <textarea id="c-message" rows={5} className="field resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!fieldErrors.message} required maxLength={4000} />
                    {fieldErrors.message && <p className="mt-1.5 text-xs text-red-300">{fieldErrors.message}</p>}
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
                    <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-violet-500" />
                    <span>
                      J&apos;accepte que mes données soient utilisées pour répondre à ma demande, conformément à la{" "}
                      <a href="/confidentialite" className="text-violet-400 underline underline-offset-2" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
                    </span>
                  </label>
                  {fieldErrors.consent && <p className="text-xs text-red-300">{fieldErrors.consent}</p>}

                  {error && (
                    <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </p>
                  )}

                  <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
                    {status === "sending" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</>) : (<>Envoyer le message <Send className="h-4 w-4" /></>)}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
