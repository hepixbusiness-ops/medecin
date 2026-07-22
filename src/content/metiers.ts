/**
 * Banque de métiers ciblés par la rotation quotidienne de contenu ProRDV.
 * Chaque jour, un seul métier est sélectionné (voir describe.ts) ; les 3
 * publications du jour ciblent toutes ce même métier, avec des types de
 * contenu différents (voir typesContenu.ts).
 */

export interface Metier {
  /** Identifiant unique et stable (utilisé dans l'historique anti-répétition) */
  key: string;
  /** Nom du métier au singulier, ex: "salon de coiffure" */
  nom: string;
  /** Libellé de secteur, ex: "Coiffure" */
  secteur: string;
  /** Douleur / problème concret vécu par ce métier sans ProRDV */
  douleur: string;
  /** Bénéfice ProRDV le plus pertinent pour ce métier */
  beneficeCle: string;
  /** Fragment descriptif pour le prompt d'illustration (scène/objets du métier) */
  visuel: string;
  /** Hashtag dédié au métier */
  hashtag: string;
}

export const METIERS: Metier[] = [
  {
    key: "coiffure",
    nom: "salon de coiffure",
    secteur: "Coiffure",
    douleur: "les rendez-vous notés à la main se perdent et les clientes annulent au dernier moment",
    beneficeCle: "un agenda en ligne avec rappels automatiques qui réduit les annulations",
    visuel: "d'un salon de coiffure minimaliste avec fauteuil, miroir arrondi et ciseaux vectoriels",
    hashtag: "#Coiffure",
  },
  {
    key: "barbier",
    nom: "barbershop",
    secteur: "Barbier",
    douleur: "la file d'attente s'allonge le samedi et des clients repartent sans être servis",
    beneficeCle: "la réservation en ligne qui étale les rendez-vous sur toute la semaine",
    visuel: "d'un fauteuil de barbier stylisé avec rasoir et peigne vectoriels",
    hashtag: "#Barbershop",
  },
  {
    key: "institut-beaute",
    nom: "institut de beauté",
    secteur: "Institut de beauté",
    douleur: "gérer les appels pendant un soin dérange la cliente et fait perdre du temps",
    beneficeCle: "une réservation autonome 24h/24 qui ne dérange jamais une prestation en cours",
    visuel: "de produits de beauté et pinceaux de maquillage disposés harmonieusement",
    hashtag: "#InstitutBeaute",
  },
  {
    key: "spa",
    nom: "spa",
    secteur: "Spa",
    douleur: "le calme du spa est rompu par des appels téléphoniques incessants",
    beneficeCle: "des réservations en ligne silencieuses qui préservent l'ambiance",
    visuel: "de pierres de massage empilées et d'une feuille stylisée évoquant la détente",
    hashtag: "#Spa",
  },
  {
    key: "restaurant",
    nom: "restaurant",
    secteur: "Restaurant",
    douleur: "les réservations prises par téléphone pendant le coup de feu provoquent des doubles réservations",
    beneficeCle: "un système de réservation de table en ligne fiable et sans erreur",
    visuel: "d'une table dressée vue de dessus avec assiette et couverts stylisés",
    hashtag: "#Restaurant",
  },
  {
    key: "dentiste",
    nom: "cabinet dentaire",
    secteur: "Dentiste",
    douleur: "les rendez-vous manqués coûtent cher en temps et en revenus perdus",
    beneficeCle: "des rappels automatiques qui réduisent nettement les absences",
    visuel: "d'une croix médicale stylisée et d'un fauteuil dentaire minimaliste",
    hashtag: "#Dentiste",
  },
  {
    key: "medecin",
    nom: "cabinet médical",
    secteur: "Médecin",
    douleur: "le secrétariat est débordé par les appels de prise de rendez-vous",
    beneficeCle: "une prise de rendez-vous en ligne qui libère le secrétariat",
    visuel: "d'une croix médicale stylisée et d'un stéthoscope vectoriel",
    hashtag: "#Medecin",
  },
  {
    key: "kinesitherapeute",
    nom: "cabinet de kinésithérapie",
    secteur: "Kinésithérapeute",
    douleur: "les séances de rééducation se désorganisent si un patient oublie son rendez-vous",
    beneficeCle: "des rappels automatiques qui sécurisent l'assiduité des patients",
    visuel: "d'une silhouette stylisée en étirement et d'un calendrier arrondi",
    hashtag: "#Kine",
  },
  {
    key: "osteopathe",
    nom: "cabinet d'ostéopathie",
    secteur: "Ostéopathe",
    douleur: "jongler entre les appels et les consultations fait perdre un temps précieux",
    beneficeCle: "un agenda en ligne qui se remplit tout seul, même en consultation",
    visuel: "d'une colonne vertébrale stylisée minimaliste et d'un calendrier arrondi",
    hashtag: "#Osteopathe",
  },
  {
    key: "salle-sport",
    nom: "salle de sport",
    secteur: "Fitness",
    douleur: "les créneaux de cours collectifs se remplissent au hasard sans visibilité claire",
    beneficeCle: "une réservation de créneaux en ligne claire pour vos adhérents",
    visuel: "d'haltères et d'un tapis de sport stylisés en composition géométrique",
    hashtag: "#SalleDeSport",
  },
  {
    key: "coach-sportif",
    nom: "coaching sportif",
    secteur: "Coach sportif",
    douleur: "les séances annulées à la dernière minute désorganisent tout le planning",
    beneficeCle: "des rappels automatiques qui réduisent les désistements",
    visuel: "d'un chronomètre stylisé et d'une corde à sauter minimaliste",
    hashtag: "#CoachSportif",
  },
  {
    key: "auto-ecole",
    nom: "auto-école",
    secteur: "Auto-école",
    douleur: "coordonner les créneaux de conduite par téléphone prend un temps fou",
    beneficeCle: "un planning en ligne où les élèves réservent eux-mêmes leurs créneaux",
    visuel: "d'un volant de voiture stylisé et d'un calendrier arrondi",
    hashtag: "#AutoEcole",
  },
  {
    key: "boutique-mode",
    nom: "boutique de mode",
    secteur: "Boutique de mode",
    douleur: "les essayages et rendez-vous de stylisme se gèrent encore sur cahier papier",
    beneficeCle: "une prise de rendez-vous en ligne pour vos essayages et conseils styling",
    visuel: "d'un cintre stylisé avec vêtements minimalistes et sac à main vectoriel",
    hashtag: "#BoutiqueMode",
  },
  {
    key: "pressing",
    nom: "pressing",
    secteur: "Pressing",
    douleur: "les clients ne savent jamais précisément quand récupérer leurs vêtements",
    beneficeCle: "des rappels automatiques qui préviennent le client dès que c'est prêt",
    visuel: "d'un cintre et d'un fer à repasser stylisés minimalistes",
    hashtag: "#Pressing",
  },
  {
    key: "traiteur",
    nom: "service traiteur",
    secteur: "Traiteur",
    douleur: "gérer les devis et rendez-vous de dégustation par messages épars fait perdre des clients",
    beneficeCle: "une prise de rendez-vous en ligne claire pour vos dégustations et devis",
    visuel: "d'un plateau de mets stylisé et d'une cloche de service minimaliste",
    hashtag: "#Traiteur",
  },
  {
    key: "photographe",
    nom: "studio photo",
    secteur: "Photographe",
    douleur: "les séances photo se réservent encore par messages privés dispersés",
    beneficeCle: "un agenda en ligne centralisé pour toutes vos séances",
    visuel: "d'un appareil photo stylisé minimaliste et d'un flash vectoriel",
    hashtag: "#Photographe",
  },
  {
    key: "garage",
    nom: "garage automobile",
    secteur: "Garage",
    douleur: "les clients débarquent sans rendez-vous et l'atelier déborde",
    beneficeCle: "une prise de rendez-vous en ligne qui lisse la charge de l'atelier",
    visuel: "d'une voiture stylisée minimaliste et d'une clé à molette vectorielle",
    hashtag: "#Garage",
  },
  {
    key: "hotel",
    nom: "hôtel",
    secteur: "Hôtel",
    douleur: "un voyageur qui ne peut pas réserver immédiatement part chez le concurrent",
    beneficeCle: "une réservation de chambres 24h/24 sans intermédiaire",
    visuel: "d'un bâtiment d'hôtel stylisé avec fenêtres arrondies et enseigne",
    hashtag: "#Hotel",
  },
  {
    key: "cabinet-avocat",
    nom: "cabinet d'avocat",
    secteur: "Avocat",
    douleur: "le secrétariat passe un temps précieux à caler des rendez-vous par téléphone",
    beneficeCle: "une prise de rendez-vous en ligne qui professionnalise l'accueil des clients",
    visuel: "d'une balance de la justice stylisée minimaliste et d'un calendrier arrondi",
    hashtag: "#CabinetAvocat",
  },
  {
    key: "comptable",
    nom: "cabinet comptable",
    secteur: "Comptable",
    douleur: "la période des bilans transforme la prise de rendez-vous en cauchemar",
    beneficeCle: "un agenda en ligne qui absorbe les pics de demande sans effort",
    visuel: "d'une calculatrice stylisée et de graphiques minimalistes",
    hashtag: "#Comptable",
  },
  {
    key: "consultant",
    nom: "cabinet de conseil",
    secteur: "Consultant",
    douleur: "caler un appel découverte prend souvent plusieurs échanges d'emails",
    beneficeCle: "un lien de réservation qui élimine les allers-retours par email",
    visuel: "d'une mallette stylisée minimaliste et d'un graphique de croissance vectoriel",
    hashtag: "#Consultant",
  },
  {
    key: "artisan",
    nom: "atelier d'artisan",
    secteur: "Artisan",
    douleur: "les devis et rendez-vous de chantier se gèrent encore sur un carnet",
    beneficeCle: "une prise de rendez-vous en ligne pour vos visites et devis",
    visuel: "d'outils d'artisan stylisés minimalistes (marteau, règle, crayon)",
    hashtag: "#Artisan",
  },
];

export function getMetierByKey(key: string): Metier | undefined {
  return METIERS.find((m) => m.key === key);
}
