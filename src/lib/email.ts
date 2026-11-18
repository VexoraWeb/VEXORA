import { Resend } from "resend";
import {
  AUDIT_ONLY,
  auditChoices,
  contactMethods,
  domainChoices,
  extraOptions,
  goals,
  hostingChoices,
  packs,
  siteConfig,
  styles,
} from "@/config/site";
import type { ContactPayload, QuotePayload } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((x) => x.id === id)?.label ?? id;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
const dash = (value: string) => (value && value.trim() ? value : "—");

function formatDate(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Indian/Reunion",
  }).format(new Date());
}

interface Section {
  title: string;
  rows: [string, string][];
}

function renderText(heading: string, sections: Section[], date: string): string {
  const lines = [heading, siteConfig.name, ""];
  for (const s of sections) {
    lines.push(s.title);
    for (const [k, v] of s.rows) lines.push(`- ${k} : ${v}`);
    lines.push("");
  }
  lines.push("DATE DE LA DEMANDE :", date);
  return lines.join("\n");
}

function renderHtml(heading: string, sections: Section[], date: string): string {
  const blocks = sections
    .map(
      (s) => `
      <h2 style="margin:28px 0 10px;font-size:13px;letter-spacing:.12em;color:#7c5cff;">${escapeHtml(s.title)}</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${s.rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;vertical-align:top;width:34%;color:#6b6b80;font-size:14px;border-bottom:1px solid #ececf3;">${escapeHtml(k)}</td>
            <td style="padding:8px 0;vertical-align:top;font-size:14px;color:#14141f;border-bottom:1px solid #ececf3;white-space:pre-wrap;">${escapeHtml(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>`,
    )
    .join("");

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f4f4f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#0a0a12;border-radius:14px 14px 0 0;padding:24px 28px;">
      <div style="color:#9b82ff;font-size:12px;letter-spacing:.2em;">${escapeHtml(siteConfig.name)}</div>
      <div style="color:#ffffff;font-size:22px;font-weight:600;margin-top:6px;">${escapeHtml(heading)}</div>
    </div>
    <div style="background:#ffffff;border-radius:0 0 14px 14px;padding:8px 28px 28px;">
      ${blocks}
      <p style="margin:28px 0 0;font-size:13px;color:#6b6b80;"><strong>DATE DE LA DEMANDE :</strong><br/>${escapeHtml(date)}</p>
    </div>
  </div>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Construction des e-mails
// ---------------------------------------------------------------------------
export interface BuiltEmail {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

export function buildQuoteEmail(d: QuotePayload): BuiltEmail {
  const packLabel = d.pack === AUDIT_ONLY ? "Audit uniquement" : packs.find((p) => p.id === d.pack)?.name ?? d.pack;
  const date = formatDate();
  const options = d.options.length ? d.options.map((o) => labelOf(extraOptions, o)).join(", ") : "Aucune";

  const sections: Section[] = [
    {
      title: "INFORMATIONS CLIENT",
      rows: [
        ["Prénom", d.firstName],
        ["Nom", d.lastName],
        ["E-mail", d.email],
        ["Téléphone", dash(d.phone)],
        ["Entreprise", dash(d.company)],
        ["Contact préféré", labelOf(contactMethods, d.preferredContact)],
      ],
    },
    {
      title: "DESCRIPTION DU PROJET",
      rows: [
        ["Nom du projet", d.projectName],
        ["Activité", d.activity],
        ["Type de site", labelOf(goals, d.goal)],
        ["Objectif", labelOf(goals, d.goal)],
        ["Description détaillée", d.description],
        ["Site existant", d.hasWebsite === "oui" ? "Oui" : "Non"],
        ["URL", dash(d.websiteUrl)],
        ["Style souhaité", labelOf(styles, d.style)],
        ["Sites de référence", dash(d.references)],
      ],
    },
    {
      title: "FORMULE",
      rows: [
        ["Pack choisi", packLabel],
        ["Domaine", labelOf(domainChoices, d.domainChoice) + (d.domainName ? ` — ${d.domainName}` : "")],
        ["Hébergement", labelOf(hostingChoices, d.hostingChoice)],
        ["Options", options],
        ["Audit de sécurité", labelOf(auditChoices, d.auditChoice)],
      ],
    },
  ];

  const heading = "NOUVELLE DEMANDE CLIENT";
  return {
    subject: oneLine(`[NOUVELLE DEMANDE VEXORA] — ${d.projectName} — ${packLabel}`).slice(0, 200),
    text: renderText(heading, sections, date),
    html: renderHtml(heading, sections, date),
    replyTo: d.email,
  };
}

export function buildContactEmail(d: ContactPayload): BuiltEmail {
  const date = formatDate();
  const sections: Section[] = [
    {
      title: "INFORMATIONS CONTACT",
      rows: [
        ["Nom", d.name],
        ["E-mail", d.email],
        ["Sujet", dash(d.subject)],
      ],
    },
    { title: "MESSAGE", rows: [["Message", d.message]] },
  ];
  const heading = "NOUVEAU MESSAGE DE CONTACT";
  return {
    subject: oneLine(`[CONTACT VEXORA] — ${d.subject || "Nouveau message"} — ${d.name}`).slice(0, 200),
    text: renderText(heading, sections, date),
    html: renderHtml(heading, sections, date),
    replyTo: d.email,
  };
}

// ---------------------------------------------------------------------------
// Envoi (côté serveur uniquement)
// ---------------------------------------------------------------------------
export type SendResult = { ok: true } | { ok: false; reason: "not_configured" | "provider_error" };

export async function sendEmail(mail: BuiltEmail): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "not_configured" };

  const to = process.env.CONTACT_EMAIL || siteConfig.contactEmail;
  const from = process.env.RESEND_FROM_EMAIL || "VEXORA_STUDIO <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      console.error("[email] Resend a refusé l'envoi :", error.name, error.message);
      return { ok: false, reason: "provider_error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Échec de l'appel à Resend :", err instanceof Error ? err.message : "erreur inconnue");
    return { ok: false, reason: "provider_error" };
  }
}
