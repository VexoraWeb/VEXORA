import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal, siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Responsable du traitement</h2>
      <p>{legal.companyName} ({siteConfig.name}) — {legal.address}. Contact : <a href={`mailto:${legal.dpoContact}`}>{legal.dpoContact}</a>.</p>
      <h2>Données collectées</h2>
      <p>Nous ne collectons que les informations nécessaires au traitement de votre demande :</p>
      <ul>
        <li>identité et coordonnées (prénom, nom, e-mail, téléphone facultatif, entreprise facultative) ;</li>
        <li>informations sur votre projet (activité, description, style, options, domaine, hébergement, audit) ;</li>
        <li>le contenu de vos messages via le formulaire de contact.</li>
      </ul>
      <h2>Finalité et base légale</h2>
      <p>Ces données servent uniquement à répondre à vos demandes de devis ou de contact. Base légale : votre consentement et l&apos;exécution de mesures précontractuelles.</p>
      <h2>Destinataires et sous-traitants</h2>
      <p>Vos demandes sont transmises par e-mail à {siteConfig.name} via le prestataire d&apos;envoi Resend. Aucune donnée n&apos;est vendue. Le site n&apos;enregistre pas vos demandes dans une base de données.</p>
      <h2>Durée de conservation</h2>
      <p>[DUREE_DE_CONSERVATION — ex. 3 ans après le dernier contact].</p>
      <h2>Vos droits</h2>
      <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de limitation. Pour les exercer, écrivez à <a href={`mailto:${legal.dpoContact}`}>{legal.dpoContact}</a>. Vous pouvez aussi saisir la CNIL.</p>
      <h2>Brouillon du formulaire</h2>
      <p>Pendant que vous remplissez le formulaire de devis, un brouillon est conservé dans le stockage de session de votre navigateur pour éviter de perdre vos réponses. Il reste sur votre appareil et est supprimé après l&apos;envoi ou à la fermeture de l&apos;onglet.</p>
      <p>Dernière mise à jour : {legal.lastUpdate}</p>
    </LegalPage>
  );
}
