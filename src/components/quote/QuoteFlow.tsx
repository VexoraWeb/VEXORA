"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Pencil, ShieldCheck } from "lucide-react";
import {
  AUDIT_ONLY,
  auditChoices,
  contactMethods,
  domainChoices,
  extraOptions,
  goals,
  hasWebsiteChoices,
  hostingChoices,
  packs,
  styles,
  type PackId,
} from "@/config/site";
import { newSubmissionId, submitRequest } from "@/lib/submit";

type PackChoice = PackId | typeof AUDIT_ONLY | "";

interface FormState {
  projectName: string;
  activity: string;
  goal: string;
  description: string;
  hasWebsite: string;
  websiteUrl: string;
  style: string;
  references: string;
  pack: PackChoice;
  domainChoice: string;
  domainName: string;
  hostingChoice: string;
  options: string[];
  auditChoice: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  preferredContact: string;
  consent: boolean;
  hp: string;
}

const initial: FormState = {
  projectName: "",
  activity: "",
  goal: "",
  description: "",
  hasWebsite: "non",
  websiteUrl: "",
  style: "",
  references: "",
  pack: "",
  domainChoice: "advice",
  domainName: "",
  hostingChoice: "unknown",
  options: [],
  auditChoice: "none",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  preferredContact: "email",
  consent: false,
  hp: "",
};

const STORAGE_KEY = "vexora-quote-draft";
const steps = ["Votre projet", "Votre formule", "Vos options", "Vos coordonnées", "Récapitulatif"];

const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((x) => x.id === id)?.label ?? "—";

type Errors = Partial<Record<keyof FormState, string>>;

function validate(step: number, f: FormState): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!f.projectName.trim()) e.projectName = "Indiquez le nom de votre projet ou de votre entreprise.";
    if (!f.activity.trim()) e.activity = "Indiquez votre domaine d'activité.";
    if (!f.goal) e.goal = "Choisissez l'objectif principal du site.";
    if (f.description.trim().length < 10) e.description = "Décrivez votre projet en quelques mots au moins.";
    if (f.hasWebsite === "oui") {
      if (!f.websiteUrl.trim()) e.websiteUrl = "Indiquez l'adresse de votre site.";
      else if (!/^https?:\/\/[^\s]+\.[^\s]+$/i.test(f.websiteUrl.trim())) e.websiteUrl = "Adresse invalide (ex. https://exemple.fr).";
    }
    if (!f.style) e.style = "Choisissez un style.";
  }
  if (step === 1 && !f.pack) e.pack = "Choisissez un pack.";
  if (step === 2) {
    if (f.domainChoice === "have" && !f.domainName.trim()) e.domainName = "Indiquez votre nom de domaine.";
    if (f.pack === AUDIT_ONLY && f.auditChoice === "none") e.auditChoice = "Choisissez le type d'audit souhaité.";
  }
  if (step === 3) {
    if (!f.firstName.trim()) e.firstName = "Votre prénom est requis.";
    if (!f.lastName.trim()) e.lastName = "Votre nom est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Adresse e-mail invalide.";
    if (f.phone.trim() && !/^[0-9+().\s-]{6,25}$/.test(f.phone.trim())) e.phone = "Numéro de téléphone invalide.";
    if (f.preferredContact === "telephone" && !f.phone.trim()) e.phone = "Indiquez votre téléphone pour être rappelé.";
    if (!f.consent) e.consent = "Votre consentement est requis pour envoyer la demande.";
  }
  return e;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p role="alert" className="mt-2 text-xs text-red-300">{msg}</p> : null;
}

function Choice({
  checked, onChange, type = "radio", name, label, description,
}: {
  checked: boolean; onChange: () => void; type?: "radio" | "checkbox"; name: string; label: string; description?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
        checked ? "border-violet-500/70 bg-violet-500/10" : "border-white/10 bg-ink-900/60 hover:border-white/25"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="mt-1 h-4 w-4 shrink-0 accent-violet-500" />
      <span>
        <span className="block text-sm text-white">{label}</span>
        {description && <span className="mt-1 block text-xs leading-relaxed text-white/50">{description}</span>}
      </span>
    </label>
  );
}

export function QuoteFlow() {
  const params = useSearchParams();
  const startedAt = useRef(Date.now());
  const submissionId = useRef(newSubmissionId());
  const topRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState("");
  const [ready, setReady] = useState(false);

  // Restauration du brouillon + présélection depuis l'URL (?pack=… ou ?audit=1)
  useEffect(() => {
    let draft: Partial<FormState> = {};
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) draft = JSON.parse(raw);
    } catch {
      /* stockage indisponible */
    }
    const next: FormState = { ...initial, ...draft, consent: false, hp: "" };
    const pack = params.get("pack");
    if (pack && packs.some((p) => p.id === pack)) next.pack = pack as PackId;
    if (params.get("audit") === "1") {
      next.pack = AUDIT_ONLY;
      if (next.auditChoice === "none") next.auditChoice = "complet";
    }
    setF(next);
    setReady(true);
  }, [params]);

  // Sauvegarde du brouillon (hors consentement)
  useEffect(() => {
    if (!ready || status === "sent") return;
    try {
      // Aucune donnée personnelle (identité, e-mail, téléphone) n'est conservée dans le brouillon.
      const { firstName, lastName, email, phone, company, consent, hp, ...safe } = f;
      void firstName; void lastName; void email; void phone; void company; void consent; void hp;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } catch {
      /* ignore */
    }
  }, [f, ready, status]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const go = (n: number) => {
    setStep(n);
    setServerError("");
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const next = () => {
    const e = validate(step, f);
    setErrors(e);
    if (Object.keys(e).length === 0) go(step + 1);
  };

  const toggleOption = (id: string) =>
    set("options", f.options.includes(id) ? f.options.filter((o) => o !== id) : [...f.options, id]);

  async function submit() {
    if (status === "sending") return;
    // Revalidation complète avant envoi
    for (let s = 0; s < 4; s++) {
      const e = validate(s, f);
      if (Object.keys(e).length) {
        setErrors(e);
        go(s);
        return;
      }
    }
    setServerError("");
    setStatus("sending");
    const res = await submitRequest({
      kind: "quote",
      submissionId: submissionId.current,
      startedAt: startedAt.current,
      ...f,
      projectName: f.projectName,
      options: f.options,
      consent: f.consent,
    });
    if (res.ok) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setStatus("sent");
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Échec : aucune confirmation, les données restent dans le formulaire.
    setStatus("idle");
    setServerError(res.message);
    if (res.fieldErrors) {
      const mapped = res.fieldErrors as Errors;
      setErrors(mapped);
      const order: (keyof FormState)[][] = [
        ["projectName", "activity", "goal", "description", "hasWebsite", "websiteUrl", "style", "references"],
        ["pack"],
        ["domainChoice", "domainName", "hostingChoice", "options", "auditChoice"],
        ["firstName", "lastName", "email", "phone", "company", "preferredContact", "consent"],
      ];
      const target = order.findIndex((keys) => keys.some((k) => mapped[k]));
      if (target >= 0) go(target);
    }
  }

  const pack = packs.find((p) => p.id === f.pack);
  const packLabel = f.pack === AUDIT_ONLY ? "Audit de sécurité uniquement" : pack ? `Pack ${pack.name}` : "—";

  if (status === "sent") {
    return (
      <div ref={topRef} className="glass mx-auto max-w-2xl p-10 text-center sm:p-14" role="status">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
          <CheckCircle2 className="mx-auto h-16 w-16 text-electric-400" />
        </motion.div>
        <h2 className="h-display mt-6 text-3xl">Merci !</h2>
        <p className="mt-3 text-lg text-white/80">Votre demande a bien été transmise à VEXORA_STUDIO.</p>
        <p className="mt-3 text-sm text-white/50">Nous revenons vers vous rapidement pour préciser votre projet. Il s&apos;agit d&apos;une demande de devis : rien n&apos;est facturé.</p>
        <Link href="/" className="btn-primary mt-8">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* Progression */}
      <ol className="mb-8 grid grid-cols-5 gap-2" aria-label="Progression">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-gradient-to-r from-violet-500 to-electric-500" : "bg-white/10"}`} />
            <p className={`mt-2 hidden text-xs sm:block ${i === step ? "text-white" : "text-white/40"}`}>
              <span className="mr-1 text-violet-400">{i + 1}.</span>{label}
            </p>
          </li>
        ))}
      </ol>
      <p className="mb-4 font-display text-sm text-white/60 sm:hidden">Étape {step + 1} sur 5 — {steps[step]}</p>

      <div className="glass p-5 sm:p-9">
        {/* Champ piège */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>Ne pas remplir<input tabIndex={-1} autoComplete="off" value={f.hp} onChange={(e) => set("hp", e.target.value)} /></label>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="h-display text-2xl sm:text-3xl">Parlez-nous de votre projet</h2>
                <div>
                  <label htmlFor="projectName" className="mb-2 block text-sm text-white/70">Nom du projet ou de l&apos;entreprise *</label>
                  <input id="projectName" className="field" value={f.projectName} maxLength={120} onChange={(e) => set("projectName", e.target.value)} aria-invalid={!!errors.projectName} />
                  <Err msg={errors.projectName} />
                </div>
                <div>
                  <label htmlFor="activity" className="mb-2 block text-sm text-white/70">Quel est votre domaine d&apos;activité ? *</label>
                  <input id="activity" className="field" value={f.activity} maxLength={160} onChange={(e) => set("activity", e.target.value)} aria-invalid={!!errors.activity} />
                  <Err msg={errors.activity} />
                </div>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Quel est l&apos;objectif principal du site ? *</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {goals.map((g) => (
                      <Choice key={g.id} name="goal" label={g.label} checked={f.goal === g.id} onChange={() => set("goal", g.id)} />
                    ))}
                  </div>
                  <Err msg={errors.goal} />
                </fieldset>
                <div>
                  <label htmlFor="description" className="mb-2 block text-sm text-white/70">Décrivez plus précisément le projet *</label>
                  <textarea id="description" rows={6} maxLength={4000} className="field resize-y" value={f.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description}
                    placeholder="Décrivez-nous votre projet, vos idées, les fonctionnalités souhaitées et le résultat que vous imaginez..." />
                  <Err msg={errors.description} />
                </div>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Possédez-vous déjà un site ?</legend>
                  <div className="grid grid-cols-2 gap-2.5">
                    {hasWebsiteChoices.map((c) => (
                      <Choice key={c.id} name="hasWebsite" label={c.label} checked={f.hasWebsite === c.id} onChange={() => set("hasWebsite", c.id)} />
                    ))}
                  </div>
                  {f.hasWebsite === "oui" && (
                    <div className="mt-4">
                      <label htmlFor="websiteUrl" className="mb-2 block text-sm text-white/70">Adresse de votre site *</label>
                      <input id="websiteUrl" type="url" inputMode="url" placeholder="https://" className="field" value={f.websiteUrl} maxLength={300} onChange={(e) => set("websiteUrl", e.target.value)} aria-invalid={!!errors.websiteUrl} />
                      <Err msg={errors.websiteUrl} />
                    </div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Quel style de site souhaitez-vous ? *</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {styles.map((s) => (
                      <Choice key={s.id} name="style" label={s.label} checked={f.style === s.id} onChange={() => set("style", s.id)} />
                    ))}
                  </div>
                  <Err msg={errors.style} />
                </fieldset>
                <div>
                  <label htmlFor="references" className="mb-2 block text-sm text-white/70">Des sites que vous appréciez ? (liens, facultatif)</label>
                  <textarea id="references" rows={3} maxLength={1500} className="field resize-y" value={f.references} onChange={(e) => set("references", e.target.value)} placeholder="Un lien par ligne" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="h-display text-2xl sm:text-3xl">Choisissez votre pack</h2>
                {f.pack === AUDIT_ONLY && (
                  <div className="rounded-xl border border-electric-500/40 bg-electric-500/10 p-4 text-sm text-white/80">
                    <ShieldCheck className="mb-2 h-5 w-5 text-electric-400" />
                    Vous avez demandé un audit de sécurité seul. Vous pouvez le conserver ou choisir un pack de création.
                  </div>
                )}
                <div className="grid gap-4 lg:grid-cols-3">
                  {packs.map((p) => {
                    const sel = f.pack === p.id;
                    return (
                      <button key={p.id} type="button" onClick={() => set("pack", p.id)} aria-pressed={sel}
                        className={`flex flex-col rounded-2xl border p-5 text-left transition ${sel ? "border-violet-500 bg-violet-500/10 shadow-[0_0_40px_-12px_rgba(124,92,255,0.8)]" : "border-white/10 bg-ink-900/60 hover:border-white/25"}`}>
                        <span className="flex items-center justify-between">
                          <span className="font-display text-xl font-semibold text-white">{p.name}</span>
                          <span className={`grid h-6 w-6 place-items-center rounded-full border ${sel ? "border-violet-400 bg-violet-500" : "border-white/20"}`}>{sel && <Check className="h-3.5 w-3.5 text-white" />}</span>
                        </span>
                        <span className="mt-1 font-display text-lg text-violet-400">{p.price}</span>
                        <ul className="mt-4 space-y-2">
                          {p.features.map((x) => (
                            <li key={x} className="flex gap-2 text-xs text-white/70"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric-400" />{x}</li>
                          ))}
                        </ul>
                        <span className="mt-4 text-xs text-white/40">{p.note}</span>
                      </button>
                    );
                  })}
                </div>
                <Choice name="pack-audit" label="Audit de sécurité uniquement (sans création de site)" checked={f.pack === AUDIT_ONLY}
                  onChange={() => { set("pack", AUDIT_ONLY); if (f.auditChoice === "none") set("auditChoice", "complet"); }} />
                <Err msg={errors.pack} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="h-display text-2xl sm:text-3xl">Personnalisez votre offre</h2>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Avez-vous déjà un nom de domaine ?</legend>
                  <div className="grid gap-2.5">
                    {domainChoices.map((c) => (
                      <Choice key={c.id} name="domain" label={c.label} checked={f.domainChoice === c.id} onChange={() => set("domainChoice", c.id)} />
                    ))}
                  </div>
                  {f.domainChoice === "have" && (
                    <div className="mt-4">
                      <label htmlFor="domainName" className="mb-2 block text-sm text-white/70">Nom de domaine *</label>
                      <input id="domainName" className="field" placeholder="exemple.fr" value={f.domainName} maxLength={120} onChange={(e) => set("domainName", e.target.value)} aria-invalid={!!errors.domainName} />
                      <Err msg={errors.domainName} />
                    </div>
                  )}
                </fieldset>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Comment souhaitez-vous gérer votre hébergement ?</legend>
                  <div className="grid gap-2.5">
                    {hostingChoices.map((c) => (
                      <Choice key={c.id} name="hosting" label={c.label} checked={f.hostingChoice === c.id} onChange={() => set("hostingChoice", c.id)} />
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Options supplémentaires</legend>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {extraOptions.map((o) => (
                      <Choice key={o.id} type="checkbox" name={`opt-${o.id}`} label={o.label} checked={f.options.includes(o.id)} onChange={() => toggleOption(o.id)} />
                    ))}
                  </div>
                </fieldset>
                <fieldset className="rounded-2xl border border-electric-500/30 bg-electric-500/[0.06] p-5">
                  <legend className="px-2 font-display text-base text-white"><ShieldCheck className="mr-2 inline h-4 w-4 text-electric-400" />Souhaitez-vous renforcer la sécurité de votre site ?</legend>
                  <div className="mt-2 grid gap-2.5">
                    {auditChoices.map((c) => (
                      <Choice key={c.id} name="audit" label={c.label} description={c.description} checked={f.auditChoice === c.id} onChange={() => set("auditChoice", c.id)} />
                    ))}
                  </div>
                  <Err msg={errors.auditChoice} />
                  <p className="mt-3 text-xs text-white/40">L&apos;audit est réalisé uniquement avec l&apos;autorisation du propriétaire du site. Aucune sécurité absolue n&apos;est garantie.</p>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="h-display text-2xl sm:text-3xl">Vos coordonnées</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm text-white/70">Prénom *</label>
                    <input id="firstName" autoComplete="given-name" className="field" value={f.firstName} maxLength={80} onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!errors.firstName} />
                    <Err msg={errors.firstName} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm text-white/70">Nom *</label>
                    <input id="lastName" autoComplete="family-name" className="field" value={f.lastName} maxLength={80} onChange={(e) => set("lastName", e.target.value)} aria-invalid={!!errors.lastName} />
                    <Err msg={errors.lastName} />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-white/70">Adresse e-mail *</label>
                  <input id="email" type="email" autoComplete="email" className="field" value={f.email} maxLength={254} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} />
                  <Err msg={errors.email} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm text-white/70">Téléphone (facultatif)</label>
                    <input id="phone" type="tel" autoComplete="tel" className="field" value={f.phone} maxLength={30} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} />
                    <Err msg={errors.phone} />
                  </div>
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm text-white/70">Entreprise (facultatif)</label>
                    <input id="company" autoComplete="organization" className="field" value={f.company} maxLength={120} onChange={(e) => set("company", e.target.value)} />
                  </div>
                </div>
                <fieldset>
                  <legend className="mb-3 text-sm text-white/70">Moyen de contact préféré</legend>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {contactMethods.map((c) => (
                      <Choice key={c.id} name="contact" label={c.label} checked={f.preferredContact === c.id} onChange={() => set("preferredContact", c.id)} />
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
                    <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-violet-500" />
                    <span>J&apos;ai lu et j&apos;accepte la <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline underline-offset-2">politique de confidentialité</a>. Mes données servent uniquement à traiter ma demande. *</span>
                  </label>
                  <Err msg={errors.consent} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="h-display text-2xl sm:text-3xl">Récapitulatif</h2>
                <p className="text-sm text-white/50">Vérifiez vos informations avant l&apos;envoi. Il s&apos;agit d&apos;une demande de devis, sans paiement.</p>
                {[
                  { title: "Projet", edit: 0, rows: [["Nom", f.projectName], ["Secteur d'activité", f.activity], ["Objectif", labelOf(goals, f.goal)], ["Description", f.description], ["Site existant", f.hasWebsite === "oui" ? f.websiteUrl : "Non"], ["Style", labelOf(styles, f.style)], ["Références", f.references || "—"]] },
                  { title: "Formule", edit: 1, rows: [["Pack choisi", packLabel], ["Tarif", pack ? pack.price : "—"]] },
                  { title: "Options", edit: 2, rows: [["Domaine", labelOf(domainChoices, f.domainChoice) + (f.domainName ? ` — ${f.domainName}` : "")], ["Hébergement", labelOf(hostingChoices, f.hostingChoice)], ["Options", f.options.length ? f.options.map((o) => labelOf(extraOptions, o)).join(", ") : "Aucune"], ["Audit de sécurité", labelOf(auditChoices, f.auditChoice)]] },
                  { title: "Coordonnées", edit: 3, rows: [["Nom", `${f.firstName} ${f.lastName}`], ["E-mail", f.email], ["Téléphone", f.phone || "—"], ["Entreprise", f.company || "—"], ["Contact préféré", labelOf(contactMethods, f.preferredContact)]] },
                ].map((s) => (
                  <section key={s.title} className="rounded-2xl border border-white/[0.07] bg-ink-900/60 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm uppercase tracking-[0.16em] text-violet-400">{s.title}</h3>
                      <button type="button" onClick={() => go(s.edit)} className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white"><Pencil className="h-3.5 w-3.5" />Modifier</button>
                    </div>
                    <dl className="mt-3 divide-y divide-white/[0.06]">
                      {s.rows.map(([k, v]) => (
                        <div key={k} className="grid gap-1 py-2.5 text-sm sm:grid-cols-[170px_1fr]">
                          <dt className="text-white/40">{k}</dt>
                          <dd className="whitespace-pre-wrap break-words text-white/85">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
                {serverError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{serverError}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn-ghost" disabled={status === "sending"}>
              <ArrowLeft className="h-4 w-4" /> {step === 4 ? "Modifier ma demande" : "Retour"}
            </button>
          ) : <span />}
          {step < 4 ? (
            <button type="button" onClick={next} className="btn-primary">Continuer <ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button type="button" onClick={submit} className="btn-primary" disabled={status === "sending"}>
              {status === "sending" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>) : "VALIDER MA DEMANDE"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
