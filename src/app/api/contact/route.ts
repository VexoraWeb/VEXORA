import { NextResponse } from "next/server";
import { buildContactEmail, buildQuoteEmail, sendEmail } from "@/lib/email";
import { beginSubmission, endSubmission, markSent, rateLimit, wasAlreadySent } from "@/lib/rate-limit";
import { contactSchema, quoteSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 60_000; // octets
const MIN_FILL_TIME_MS = 3_000; // un humain met plus de 3 s à remplir le formulaire
const MAX_FILL_AGE_MS = 1000 * 60 * 60 * 24; // formulaire ouvert depuis moins de 24 h
const RATE_LIMIT = 5; // demandes
const RATE_WINDOW_MS = 10 * 60 * 1000; // par 10 minutes et par IP
const GLOBAL_LIMIT = 60; // plafond d'e-mails par heure et par instance (protège la boîte de réception)
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;

function fail(status: number, error: string, extra: Record<string, unknown> = {}, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers });
}

function clientIp(req: Request) {
  // En-tête posé par Netlify (non falsifiable par le client).
  const nf = req.headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  // Sinon on prend la DERNIÈRE valeur de x-forwarded-for (ajoutée par notre proxy) :
  // la première est fournie par le client et donc falsifiable.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((x) => x.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

export async function POST(req: Request) {
  // 1. Même origine uniquement (protection CSRF) + JSON obligatoire
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== host) return fail(403, "Origine non autorisée.");
    } catch {
      return fail(403, "Origine non autorisée.");
    }
  }
  if (!(req.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    return fail(415, "Format de requête non pris en charge.");
  }
  const declaredLength = Number(req.headers.get("content-length") || "0");
  if (declaredLength > MAX_BODY) return fail(413, "Demande trop volumineuse.");

  // 2. Limitation de débit
  const rl = rateLimit(`contact:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return fail(
      429,
      "Trop de demandes en peu de temps. Merci de réessayer dans quelques minutes.",
      {},
      { "Retry-After": String(rl.retryAfter) },
    );
  }

  const global = rateLimit("contact:global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!global.ok) {
    return fail(429, "Le service reçoit beaucoup de demandes. Merci de réessayer plus tard.", {}, { "Retry-After": String(global.retryAfter) });
  }

  // 3. Lecture et taille du corps
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return fail(400, "Requête illisible.");
  }
  if (raw.length > MAX_BODY) return fail(413, "Demande trop volumineuse.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "Requête invalide.");
  }

  const kind = typeof body === "object" && body !== null ? (body as { kind?: unknown }).kind : undefined;
  if (kind !== "quote" && kind !== "contact") return fail(400, "Type de demande inconnu.");

  // 4. Validation + nettoyage côté serveur
  const parsed = kind === "quote" ? quoteSchema.safeParse(body) : contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail(422, "Certaines informations sont invalides ou manquantes.", { fieldErrors });
  }
  const data = parsed.data;

  // 5. Anti-spam : champ piège + temps de remplissage
  const elapsed = Date.now() - data.startedAt;
  if (data.hp !== "" || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_AGE_MS) {
    return fail(400, "Demande refusée par le filtre anti-spam. Merci de réessayer.");
  }

  // 6. Anti-doublon : cette soumission a déjà été réellement envoyée
  if (wasAlreadySent(data.submissionId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // 7. Envoi réel
  if (!beginSubmission(data.submissionId)) {
    return fail(409, "Cette demande est déjà en cours de traitement.");
  }
  let result: Awaited<ReturnType<typeof sendEmail>>;
  try {
    const mail = data.kind === "quote" ? buildQuoteEmail(data) : buildContactEmail(data);
    result = await sendEmail(mail);
  } finally {
    endSubmission(data.submissionId);
  }

  if (!result.ok) {
    if (result.reason === "not_configured") {
      return fail(503, "Le service d'envoi n'est pas encore configuré. Votre demande n'a PAS été transmise.");
    }
    return fail(502, "L'envoi a échoué. Votre demande n'a PAS été transmise, merci de réessayer.");
  }

  markSent(data.submissionId);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return fail(405, "Méthode non autorisée.", {}, { Allow: "POST" });
}
