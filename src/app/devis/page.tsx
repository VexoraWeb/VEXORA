import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteFlow } from "@/components/quote/QuoteFlow";

export const metadata: Metadata = {
  title: "Créer mon projet",
  description: "Demandez votre devis VEXORA_STUDIO en cinq étapes.",
};

export default function DevisPage() {
  return (
    <section className="relative pb-24 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-[520px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" aria-hidden="true" />
      <div className="container-x relative max-w-4xl">
        <div className="mb-10 text-center">
          <span className="eyebrow">Demande de devis</span>
          <h1 className="h-display mt-5 text-4xl sm:text-5xl">
            Créons votre <span className="gradient-text">projet</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/55">Cinq étapes rapides. Aucun paiement : c&apos;est une demande de devis.</p>
        </div>
        <Suspense fallback={<div className="glass h-96 animate-pulse" />}>
          <QuoteFlow />
        </Suspense>
      </div>
    </section>
  );
}
