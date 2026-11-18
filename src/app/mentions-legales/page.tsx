import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal, siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <ul>
        <li>Nom commercial : {siteConfig.name}</li>
        <li>Raison sociale : {legal.companyName}</li>
        <li>Forme juridique : {legal.legalForm}</li>
        <li>Adresse du siège : {legal.address}</li>
        <li>Immatriculation : {legal.registration}</li>
        <li>TVA : {legal.vat}</li>
        <li>Directeur de la publication : {legal.publisher}</li>
        <li>Contact : <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></li>
      </ul>
      <h2>Hébergeur</h2>
      <p>{legal.host}</p>
      <h2>Propriété intellectuelle</h2>
      <p>L&apos;ensemble des contenus du site (textes, visuels, logo, code) est la propriété de {siteConfig.name}, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
      <p>Dernière mise à jour : {legal.lastUpdate}</p>
    </LegalPage>
  );
}
