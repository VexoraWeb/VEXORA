# VEXORA_STUDIO

Site web de l'agence **VEXORA_STUDIO** (création de sites et audits de sécurité web).
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Motion · Lucide · Resend.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner RESEND_API_KEY
npm run dev                  # http://localhost:3000
npm run build && npm start   # version de production
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | Clé API Resend (**secrète**, jamais committée) |
| `CONTACT_EMAIL` | Destinataire des demandes (`600secu@proton.me`) |
| `RESEND_FROM_EMAIL` | Expéditeur. Défaut : `VEXORA_STUDIO <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (optionnel) |

Sans `RESEND_API_KEY`, `/api/contact` répond **503** et le site n'affiche **aucune** confirmation : une demande n'est jamais présentée comme envoyée si l'e-mail ne l'est pas.

## Configurer Resend

1. Créer un compte sur <https://resend.com>.
2. *API Keys* → créer une clé, la copier dans `RESEND_API_KEY` (Netlify : *Site configuration → Environment variables*).
3. **Test rapide** : avec l'expéditeur par défaut `onboarding@resend.dev`, Resend n'envoie qu'à l'adresse e-mail du compte Resend. Pour que `600secu@proton.me` reçoive les demandes, soit ouvrir le compte Resend avec cette adresse, soit passer à l'étape 4.
4. **Production** : *Domains → Add Domain*, ajouter les enregistrements DNS (SPF, DKIM) chez votre registrar, attendre « Verified », puis définir `RESEND_FROM_EMAIL="VEXORA_STUDIO <contact@votre-domaine.fr>"`.
5. Redéployer le site.

## Personnaliser (fichier central)

Tout est dans **`src/config/site.ts`** : prix (`prices`), packs, services, options du devis, FAQ, coordonnées, réseaux sociaux (Instagram / Discord / WhatsApp : renseigner l'URL pour activer), équipe (photos dans `public/team/`, puis renseigner `photo`), informations légales (`legal`).

Les pages `mentions-legales`, `confidentialite` et `cgv` sont des **modèles à compléter** (placeholders entre crochets).

## Architecture

```
src/
  app/            pages (accueil, /devis, pages légales) et API (/api/contact)
  components/     sections de la page d'accueil, navigation, footer
    quote/        parcours de devis en 5 étapes
  config/site.ts  configuration centrale
  lib/            validation (zod), e-mail (Resend), limitation de débit, client d'envoi
```

## Sécurité de `/api/contact`

Validation et nettoyage serveur (zod), échappement HTML des e-mails, contrôle d'origine, limite de 5 requêtes / 10 min / IP, champ piège + temps de remplissage minimal, identifiant anti-doublon, taille de corps limitée, en-têtes de sécurité HTTP, clé API uniquement côté serveur.

Limite connue : la limitation de débit et l'anti-doublon sont en mémoire (par instance serverless). Pour une garantie globale, brancher un stockage partagé (Netlify Blobs, Upstash).

## Déploiement Netlify

Le fichier `netlify.toml` est fourni ; Netlify détecte Next.js automatiquement. Ajouter les variables d'environnement ci-dessus, puis déployer.
