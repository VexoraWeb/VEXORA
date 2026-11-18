/**
 * Limitation de débit en mémoire (par IP).
 *
 * ⚠️ Sur une plateforme serverless, chaque instance a sa propre mémoire : cette
 * limitation freine les abus simples mais n'est pas une garantie globale.
 * Pour une protection renforcée, brancher un stockage partagé (Netlify Blobs,
 * Upstash Redis…) en remplaçant ce module.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (buckets.size > 2000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Soumissions en cours de traitement (évite deux envois simultanés identiques). */
const inFlight = new Set<string>();
export function beginSubmission(id: string): boolean {
  if (inFlight.has(id)) return false;
  inFlight.add(id);
  return true;
}
export function endSubmission(id: string) {
  inFlight.delete(id);
}

/** Soumissions déjà envoyées avec succès (anti-doublon). */
const sent = new Map<string, number>();
const SENT_TTL = 60 * 60 * 1000;

export function wasAlreadySent(id: string) {
  const at = sent.get(id);
  if (!at) return false;
  if (Date.now() - at > SENT_TTL) {
    sent.delete(id);
    return false;
  }
  return true;
}

export function markSent(id: string) {
  if (sent.size > 2000) {
    const now = Date.now();
    for (const [k, t] of sent) if (now - t > SENT_TTL) sent.delete(k);
  }
  sent.set(id, Date.now());
}
