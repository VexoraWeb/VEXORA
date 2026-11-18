export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Envoie une demande à /api/contact.
 * Retourne ok:true UNIQUEMENT si le serveur confirme l'envoi réel de l'e-mail.
 */
export async function submitRequest(payload: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let data: { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } = {};
    try {
      data = await res.json();
    } catch {
      /* réponse non JSON */
    }
    if (res.ok && data.ok === true) return { ok: true };
    return {
      ok: false,
      message: data.error || "L'envoi a échoué. Vos informations sont conservées, vous pouvez réessayer.",
      fieldErrors: data.fieldErrors,
    };
  } catch {
    return {
      ok: false,
      message: "Connexion impossible. Vos informations sont conservées, vérifiez votre connexion et réessayez.",
    };
  }
}

export function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
