import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal, siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function Page() {
  return (
    <LegalPage title="Conditions générales de vente">
      <h2>Objet</h2>
      <p>Les présentes conditions encadrent les prestations proposées par {legal.companyName} ({siteConfig.name}) : création de sites web, hébergement et domaine en accompagnement, maintenance, SEO et audits de sécurité.</p>
      <h2>Demande de devis</h2>
      <p>Le formulaire en ligne est une demande de devis et non une commande. Aucun paiement n&apos;est effectué en ligne. Une prestation n&apos;est engagée qu&apos;après acceptation écrite du devis par le client.</p>
      <h2>Tarifs et paiement</h2>
      <p>[TARIFS_ET_MODALITES_DE_PAIEMENT — acompte, échéances, pénalités de retard].</p>
      <h2>Délais et livraison</h2>
      <p>[DELAIS — précisés dans chaque devis].</p>
      <h2>Audits de sécurité</h2>
      <ul>
        <li>Un audit n&apos;est réalisé qu&apos;avec l&apos;autorisation écrite du propriétaire du site.</li>
        <li>L&apos;audit identifie des points d&apos;amélioration ; il ne garantit pas une sécurité absolue.</li>
      </ul>
      <h2>Droit de rétractation</h2>
      <p>[CONDITIONS_DE_RETRACTATION — à adapter selon le statut du client (consommateur ou professionnel)].</p>
      <h2>Responsabilité, litiges</h2>
      <p>[LIMITATION_DE_RESPONSABILITE_ET_DROIT_APPLICABLE].</p>
      <p>Dernière mise à jour : {legal.lastUpdate}</p>
    </LegalPage>
  );
}
