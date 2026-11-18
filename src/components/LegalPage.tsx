export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pb-24 pt-32 sm:pt-40">
      <div className="container-x max-w-3xl">
        <h1 className="h-display text-4xl">{title}</h1>
        <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100/90">
          Modèle à compléter : les éléments entre crochets [ ] sont des placeholders à remplacer par vos informations
          réelles, puis à faire valider si nécessaire par un professionnel du droit avant la mise en production.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/65 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_a]:text-violet-400 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}
