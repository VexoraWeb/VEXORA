import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-display text-sm tracking-[0.3em] text-violet-400">404</p>
        <h1 className="h-display mt-4 text-4xl">Page introuvable</h1>
        <p className="mt-3 text-white/55">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-primary mt-8">Retour à l&apos;accueil</Link>
      </div>
    </section>
  );
}
