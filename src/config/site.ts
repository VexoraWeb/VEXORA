/**
 * ============================================================================
 *  CONFIGURATION CENTRALE — VEXORA_STUDIO
 *  Tout ce qui est modifiable sans toucher aux composants se trouve ici :
 *  prix, packs, options, services, coordonnées, équipe, FAQ, mentions légales.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Identité & coordonnées
// ---------------------------------------------------------------------------
export const siteConfig = {
  name: "VEXORA_STUDIO",
  shortName: "VEXORA",
  tagline: "Nous créons votre présence en ligne. Nous contribuons également à sa sécurité.",
  description:
    "VEXORA_STUDIO crée des sites web modernes et personnalisés, et propose des audits de sécurité web. Demandez votre devis en ligne.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "",
  /** Adresse affichée publiquement. Les demandes sont envoyées à CONTACT_EMAIL (variable d'environnement). */
  contactEmail: "600secu_0@proton.me",
  /** Laisser une chaîne vide pour masquer un réseau. Renseigner l'URL complète pour l'activer. */
  socials: {
    instagram: "", // ex. "https://instagram.com/vexora_studio"
    discord: "", // ex. "https://discord.gg/xxxxxx"
    whatsapp: "", // ex. "https://wa.me/33600000000"
  },
} as const;

export const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Nos packs", href: "/#packs" },
  { label: "Cybersécurité", href: "/#cybersecurite" },
  { label: "À propos", href: "/#a-propos" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
] as const;

// ---------------------------------------------------------------------------
// Prix — remplacer les placeholders par les vrais tarifs (ex. "À partir de 490 €")
// ---------------------------------------------------------------------------
export const prices = {
  starter: "[PRIX_STARTER]",
  business: "[PRIX_BUSINESS]",
  premium: "[PRIX_PREMIUM]",
} as const;

// ---------------------------------------------------------------------------
// Packs
// ---------------------------------------------------------------------------
export type PackId = "starter" | "business" | "premium";

export interface Pack {
  id: PackId;
  name: string;
  audience: string;
  price: string;
  features: string[];
  note: string;
  highlighted?: boolean;
}

export const packs: Pack[] = [
  {
    id: "starter",
    name: "Starter",
    audience: "Pour les personnes souhaitant créer leur première présence en ligne.",
    price: prices.starter,
    features: [
      "Site vitrine",
      "Jusqu'à 3 pages",
      "Design moderne",
      "Adaptation mobile et ordinateur",
      "Formulaire de contact",
      "SEO de base",
      "Audit de sécurité de base avant livraison",
    ],
    note: "Domaine et hébergement non inclus par défaut.",
  },
  {
    id: "business",
    name: "Business",
    audience: "Pour les entreprises souhaitant développer leur activité.",
    price: prices.business,
    features: [
      "Site multipage",
      "Jusqu'à 6 pages",
      "Design personnalisé",
      "Adaptation mobile et ordinateur",
      "Formulaire de contact",
      "SEO de base",
      "Intégration des réseaux sociaux",
      "Audit de sécurité approfondi",
      "Rapport de sécurité synthétique",
    ],
    note: "Domaine et hébergement disponibles en option.",
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    audience: "Pour les projets nécessitant une présence numérique plus avancée.",
    price: prices.premium,
    features: [
      "Site entièrement personnalisé",
      "Jusqu'à 10 pages",
      "Design premium",
      "Animations avancées",
      "SEO de base",
      "Formulaires personnalisés",
      "Intégrations supplémentaires",
      "Audit de sécurité approfondi",
      "Rapport détaillé avec recommandations",
      "Accompagnement à la mise en ligne",
    ],
    note: "Domaine et hébergement disponibles en option.",
  },
];

/** Valeur spéciale du champ « pack » pour une demande d'audit seul. */
export const AUDIT_ONLY = "audit-only" as const;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export type ServiceIcon =
  | "globe"
  | "briefcase"
  | "rocket"
  | "shopping"
  | "portfolio"
  | "refresh"
  | "server"
  | "wrench"
  | "search"
  | "shield";

export interface Service {
  id: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  {
    id: "vitrine",
    icon: "globe",
    title: "Sites vitrines",
    description: "Une présence claire et élégante pour présenter votre activité, vos valeurs et vos coordonnées.",
    href: "/devis",
  },
  {
    id: "pro",
    icon: "briefcase",
    title: "Sites professionnels",
    description: "Des sites multipages structurés, pensés pour crédibiliser et développer votre entreprise.",
    href: "/devis?pack=business",
  },
  {
    id: "landing",
    icon: "rocket",
    title: "Landing pages",
    description: "Une page unique, ciblée et soignée, conçue autour d'un objectif précis : contact, offre, événement.",
    href: "/devis",
  },
  {
    id: "ecommerce",
    icon: "shopping",
    title: "Sites e-commerce",
    description: "Présentez et vendez vos produits en ligne. Le périmètre est défini ensemble lors du devis.",
    href: "/devis",
  },
  {
    id: "portfolio",
    icon: "portfolio",
    title: "Portfolios",
    description: "Mettez en valeur vos réalisations avec un site qui vous ressemble.",
    href: "/devis",
  },
  {
    id: "refonte",
    icon: "refresh",
    title: "Refonte de sites",
    description: "Modernisez un site existant : design, lisibilité, adaptation mobile et bonnes pratiques.",
    href: "/devis",
  },
  {
    id: "hebergement",
    icon: "server",
    title: "Hébergement & domaine",
    description: "Nous vous conseillons et vous accompagnons pour le choix et la mise en place de votre domaine et de votre hébergement.",
    href: "/devis",
  },
  {
    id: "maintenance",
    icon: "wrench",
    title: "Maintenance",
    description: "Un suivi mensuel optionnel pour garder votre site à jour et fonctionnel.",
    href: "/devis",
  },
  {
    id: "seo",
    icon: "search",
    title: "Référencement SEO",
    description: "Des bases techniques et éditoriales solides pour être trouvé sur les moteurs de recherche.",
    href: "/devis",
  },
  {
    id: "audit",
    icon: "shield",
    title: "Audits de sécurité",
    description: "Analyse des points d'exposition de votre site et recommandations concrètes, avec votre autorisation.",
    href: "/devis?audit=1",
  },
];

// ---------------------------------------------------------------------------
// Parcours de devis — listes de choix (identifiants stables envoyés au serveur)
// ---------------------------------------------------------------------------
export const goals = [
  { id: "entreprise", label: "Présenter une entreprise" },
  { id: "produits", label: "Vendre des produits" },
  { id: "services", label: "Présenter des services" },
  { id: "portfolio", label: "Créer un portfolio" },
  { id: "restaurant", label: "Présenter un restaurant" },
  { id: "blog", label: "Créer un blog" },
  { id: "autre", label: "Autre" },
] as const;

export const styles = [
  { id: "minimaliste", label: "Minimaliste" },
  { id: "moderne", label: "Moderne" },
  { id: "premium", label: "Premium" },
  { id: "futuriste", label: "Futuriste" },
  { id: "professionnel", label: "Professionnel" },
  { id: "inconnu", label: "Je ne sais pas encore" },
] as const;

export const domainChoices = [
  { id: "have", label: "Oui, j'en possède déjà un" },
  { id: "want", label: "Non, je souhaite en obtenir un" },
  { id: "advice", label: "Je souhaite être conseillé" },
] as const;

export const hostingChoices = [
  { id: "have", label: "Je possède déjà un hébergement" },
  { id: "vexora", label: "Je souhaite que VEXORA m'accompagne" },
  { id: "unknown", label: "Je ne sais pas encore" },
] as const;

export const extraOptions = [
  { id: "maintenance", label: "Maintenance mensuelle" },
  { id: "seo-avance", label: "SEO avancé" },
  { id: "pages-sup", label: "Pages supplémentaires" },
  { id: "email-pro", label: "Adresse e-mail professionnelle" },
  { id: "fonctionnalites", label: "Fonctionnalités personnalisées" },
  { id: "reseaux", label: "Intégration de réseaux sociaux" },
  { id: "audit-independant", label: "Audit de sécurité indépendant" },
  { id: "accompagnement", label: "Accompagnement supplémentaire" },
] as const;

export const auditChoices = [
  {
    id: "none",
    label: "Pas d'audit supplémentaire pour le moment",
    description: "Les audits inclus dans votre pack (le cas échéant) restent compris.",
  },
  {
    id: "base",
    label: "Audit de base",
    description:
      "Contrôle des fondamentaux : HTTPS, en-têtes de sécurité HTTP, configurations publiques visibles et premières bonnes pratiques.",
  },
  {
    id: "approfondi",
    label: "Audit approfondi",
    description:
      "Audit de base complété par le contrôle des formulaires, la recherche d'informations sensibles exposées, l'analyse des dépendances et un rapport avec recommandations.",
  },
  {
    id: "independant",
    label: "Je souhaite un devis pour un audit indépendant",
    description:
      "Audit d'un site existant, sans création de site. Réalisé uniquement avec l'autorisation du propriétaire.",
  },
] as const;

export const contactMethods = [
  { id: "email", label: "E-mail" },
  { id: "telephone", label: "Téléphone" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export const hasWebsiteChoices = [
  { id: "oui", label: "Oui" },
  { id: "non", label: "Non" },
] as const;

// ---------------------------------------------------------------------------
// Cybersécurité
// ---------------------------------------------------------------------------
export const securityChecks = [
  "Vérification HTTPS",
  "Vérification des en-têtes de sécurité HTTP",
  "Vérification des configurations publiques",
  "Contrôle des formulaires",
  "Vérification des informations sensibles exposées",
  "Analyse des dépendances vulnérables",
  "Vérification des bonnes pratiques de sécurité",
  "Rapport avec recommandations",
];

// ---------------------------------------------------------------------------
// Équipe — photos : déposer l'image dans /public/team et renseigner `photo`
// ---------------------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  /** Chemin d'une image (ex. "/team/djibril.jpg"). Vide = placeholder. */
  photo: string;
  links: { label: string; href: string }[];
}

export const team: TeamMember[] = [
  {
    id: "djibril",
    name: "Djibril Elkhamlichi",
    role: "Fondateur de VEXORA_STUDIO",
    description:
      "Djibril Elkhamlichi est le fondateur de VEXORA_STUDIO. Passionné par la création numérique et les nouvelles technologies, il accompagne les particuliers et les professionnels dans la conception de sites web modernes, personnalisés et adaptés à leurs besoins.",
    photo: "",
    links: [], // ex. { label: "LinkedIn", href: "https://linkedin.com/in/..." }
  },
  {
    id: "mahe",
    name: "Mahé Eckenschwiller Bonnin",
    role: "Responsable des audits de sécurité web",
    description:
      "Il sera accompagné de Mahé Eckenschwiller Bonnin, qui se chargera d'auditer les sites web afin d'identifier les éventuelles vulnérabilités et de contribuer à renforcer leur sécurité.",
    photo: "",
    links: [],
  },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export const faq = [
  {
    q: "Comment fonctionne la création d'un site ?",
    a: "Vous nous décrivez votre projet via le parcours de demande de devis. Nous étudions votre demande, puis nous revenons vers vous pour préciser le besoin et proposer une solution adaptée. L'intelligence artificielle sert d'outil de conception et de développement, mais chaque projet est accompagné et personnalisé par une personne.",
  },
  {
    q: "Quels sont les délais ?",
    a: "Les délais dépendent de la taille et de la complexité du projet ainsi que de la réactivité sur les contenus à fournir. Ils sont précisés dans le devis, avant tout engagement.",
  },
  {
    q: "Le domaine est-il compris ?",
    a: "Non, pas par défaut. Le nom de domaine peut être pris en charge en option, ou vous pouvez utiliser le vôtre. Nous pouvons aussi vous conseiller sur le choix.",
  },
  {
    q: "L'hébergement est-il compris ?",
    a: "Pas par défaut dans le pack Starter ; il est disponible en option dans les packs Business et Premium. Vous pouvez aussi conserver votre hébergement actuel ou demander un accompagnement.",
  },
  {
    q: "Puis-je modifier mon site après livraison ?",
    a: "Oui. Les modalités (modifications ponctuelles ou maintenance mensuelle optionnelle) sont à définir ensemble lors du devis.",
  },
  {
    q: "Le site sera-t-il adapté aux téléphones ?",
    a: "Oui, chaque pack inclut une adaptation aux mobiles, tablettes et ordinateurs.",
  },
  {
    q: "Comment fonctionne l'audit de sécurité ?",
    a: "L'audit consiste à contrôler des points essentiels (HTTPS, en-têtes de sécurité, configurations publiques, formulaires, informations exposées, dépendances) puis à vous remettre des recommandations. Il est réalisé uniquement avec l'autorisation du propriétaire du site. Aucun audit ne peut garantir une sécurité absolue.",
  },
  {
    q: "Est-ce que tous les sites sont audités ?",
    a: "Les sites créés par VEXORA_STUDIO bénéficient de l'audit prévu dans leur pack. Un site existant peut aussi être audité sur demande, à condition que son propriétaire donne son autorisation.",
  },
  {
    q: "Puis-je commander uniquement un audit ?",
    a: "Oui. Utilisez le bouton « Demander un audit » : le parcours s'ouvre avec l'option d'audit indépendant présélectionnée.",
  },
  {
    q: "Comment obtenir un devis ?",
    a: "Cliquez sur « Créer mon projet » et remplissez le parcours en cinq étapes. Il s'agit d'une demande de devis : aucun paiement n'est demandé et rien n'est confirmé avant votre accord sur le devis.",
  },
];

// ---------------------------------------------------------------------------
// Mentions légales — compléter les placeholders avant la mise en production
// ---------------------------------------------------------------------------
export const legal = {
  companyName: "[RAISON_SOCIALE]",
  legalForm: "[FORME_JURIDIQUE]",
  address: "[ADRESSE_DU_SIEGE]",
  registration: "[SIRET_OU_NUMERO_D_IMMATRICULATION]",
  vat: "[NUMERO_TVA_SI_APPLICABLE]",
  publisher: "Djibril Elkhamlichi",
  host: "[NOM_ET_ADRESSE_DE_L_HEBERGEUR]",
  dpoContact: siteConfig.contactEmail,
  lastUpdate: "[DATE_DE_MISE_A_JOUR]",
} as const;
