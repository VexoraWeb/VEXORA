import { z } from "zod";
import {
  AUDIT_ONLY,
  auditChoices,
  contactMethods,
  domainChoices,
  extraOptions,
  goals,
  hasWebsiteChoices,
  hostingChoices,
  styles,
} from "@/config/site";

type WithId = readonly { readonly id: string }[];
const ids = (list: WithId) => list.map((x) => x.id) as [string, ...string[]];

/** Supprime les caractères de contrôle et normalise les sauts de ligne. */
export function clean(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g, "")
    .trim();
}

const text = (max: number) => z.string().max(max).transform(clean);
const requiredText = (max: number, message = "Ce champ est obligatoire.") =>
  z.string().max(max).transform(clean).pipe(z.string().min(1, message));

const envelope = {
  /** Identifiant unique de soumission (évite les doublons). */
  submissionId: z.string().min(8).max(64),
  /** Horodatage d'ouverture du formulaire (anti-robot). */
  startedAt: z.number().int().positive(),
  /** Champ piège : doit rester vide. */
  hp: z.string().max(200).optional().default(""),
};

const optionalUrl = z
  .string()
  .max(300)
  .transform(clean)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), "Adresse invalide (ex. https://exemple.fr).");

export const quoteSchema = z
  .object({
    kind: z.literal("quote"),
    ...envelope,
    projectName: requiredText(120),
    activity: requiredText(160),
    goal: z.enum(ids(goals)),
    description: requiredText(4000).pipe(z.string().min(10, "Décrivez votre projet en quelques mots au moins.")),
    hasWebsite: z.enum(ids(hasWebsiteChoices)),
    websiteUrl: optionalUrl,
    style: z.enum(ids(styles)),
    references: text(1500),
    pack: z.enum(["starter", "business", "premium", AUDIT_ONLY]),
    domainChoice: z.enum(ids(domainChoices)),
    domainName: text(120),
    hostingChoice: z.enum(ids(hostingChoices)),
    options: z.array(z.enum(ids(extraOptions))).max(extraOptions.length),
    auditChoice: z.enum(ids(auditChoices)),
    firstName: requiredText(80),
    lastName: requiredText(80),
    email: z.string().max(254).transform(clean).pipe(z.string().email("Adresse e-mail invalide.")),
    phone: z
      .string()
      .max(30)
      .transform(clean)
      .refine((v) => v === "" || /^[0-9+().\s-]{6,25}$/.test(v), "Numéro de téléphone invalide."),
    company: text(120),
    preferredContact: z.enum(ids(contactMethods)),
    consent: z.literal(true, { error: "Votre consentement est requis." }),
  })
  .superRefine((d, ctx) => {
    if (d.hasWebsite === "oui" && d.websiteUrl === "") {
      ctx.addIssue({ code: "custom", path: ["websiteUrl"], message: "Indiquez l'adresse de votre site." });
    }
    if (d.domainChoice === "have" && d.domainName === "") {
      ctx.addIssue({ code: "custom", path: ["domainName"], message: "Indiquez votre nom de domaine." });
    }
    if (d.pack === AUDIT_ONLY && d.auditChoice === "none") {
      ctx.addIssue({ code: "custom", path: ["auditChoice"], message: "Choisissez le type d'audit souhaité." });
    }
  });

export const contactSchema = z.object({
  kind: z.literal("contact"),
  ...envelope,
  name: requiredText(120),
  email: z.string().max(254).transform(clean).pipe(z.string().email("Adresse e-mail invalide.")),
  subject: text(150),
  message: requiredText(4000).pipe(z.string().min(10, "Votre message est un peu court.")),
  consent: z.literal(true, { error: "Votre consentement est requis." }),
});

export type QuotePayload = z.infer<typeof quoteSchema>;
export type ContactPayload = z.infer<typeof contactSchema>;
