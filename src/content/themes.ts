/**
 * Banque de thèmes rotatifs pour les publications Facebook ProRDV.
 * Chaque thème alimente describe.ts (génération de la description du jour)
 * et generate.ts (génération de l'image).
 */

export type Secteur =
  | "général"
  | "coiffure"
  | "restaurant"
  | "hôtel"
  | "fitness"
  | "spa"
  | "santé";

export interface Theme {
  /** Identifiant unique et stable du thème (utilisé pour l'historique anti-répétition) */
  key: string;
  /** Argument commercial du thème, en une phrase */
  angle: string;
  /** Secteur ciblé, ou "général" si le thème s'adresse à tous les établissements */
  secteur: Secteur;
  /** Prompt d'illustration flat design (préfixé automatiquement par la charte de marque dans generate.ts) */
  promptImage: string;
  /** Gabarit de légende Facebook : accroche + bénéfices + CTA + hashtags */
  gabaritLegende: string;
}

/** Appel à l'action standard, injecté dans chaque gabaritLegende via le marqueur {CTA} */
export const CTA = "Inscription gratuite → prordv.app/pro";

export const THEMES: Theme[] = [
  {
    key: "reservations-24h",
    angle:
      "ProRDV permet aux clients de réserver en ligne 24h/24 et 7j/7, sans appel téléphonique ni attente.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un smartphone flottant affichant un calendrier de réservation avec une coche verte de confirmation, entouré d'icônes d'horloge et d'étoiles, fond violet #7C3AED avec formes géométriques arrondies en dégradé, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos clients veulent réserver même à 23h, un dimanche, ou pendant que vous êtes avec un autre client ? Avec ProRDV, ce n'est plus un problème. 📅\n\nFini le temps où chaque réservation dépendait d'un appel décroché à temps. Votre agenda reste ouvert et accessible en permanence, pendant que vous vous concentrez sur votre travail.\n\n✅ Réservation en ligne 24h/24 et 7j/7, même quand votre établissement est fermé\n✅ Aucun appel manqué, aucune opportunité perdue faute de réponse à temps\n✅ Confirmation automatique et instantanée envoyée directement au client\n✅ Un agenda centralisé, à jour en temps réel, sans double réservation possible\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #ReservationEnLigne #Entreprenariat",
  },
  {
    key: "site-web-auto",
    angle:
      "Chaque établissement inscrit sur ProRDV obtient automatiquement un site web professionnel généré pour lui.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un ordinateur portable et d'un smartphone affichant côte à côte une même page web moderne violette avec sections arrondies, une baguette magique stylisée créant le site à partir de blocs géométriques, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Pas de site web pour votre établissement ? Beaucoup de clients potentiels vous cherchent en ligne avant même de passer votre porte. ProRDV s'occupe de tout pour vous. 💻\n\nDès votre inscription, une page professionnelle à votre nom est générée automatiquement, avec vos services, vos horaires et un bouton de réservation intégré — sans budget web ni une seule ligne de code.\n\n✅ Site web professionnel généré automatiquement dès l'inscription\n✅ Prêt en quelques minutes, sans compétence technique ni développeur à payer\n✅ Visible par vos clients partout au Cameroun, jour et nuit\n✅ Mis à jour automatiquement à chaque changement sur votre profil ProRDV\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #SiteWeb #PME",
  },
  {
    key: "momo-paiement",
    angle:
      "ProRDV intègre le paiement Mobile Money (MTN MoMo, Orange Money) directement au moment de la réservation.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un smartphone affichant une interface de paiement mobile avec icônes stylisées jaune et orange évoquant Mobile Money, entouré de pièces et billets stylisés minimalistes, fond violet #7C3AED avec touches de vert pour une coche de validation, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Le paiement ne doit jamais être un frein à la réservation. 💳\n\nAvec ProRDV, vos clients règlent directement au moment de réserver, en Mobile Money — plus besoin d'attendre leur arrivée pour encaisser, ni de courir après un paiement oublié.\n\n✅ Paiement Mobile Money intégré : MTN MoMo et Orange Money\n✅ Transactions sécurisées et instantanées, confirmées en temps réel\n✅ Moins de rendez-vous annulés à la dernière minute\n✅ Une trésorerie plus prévisible pour votre établissement\n\n{CTA}\n\n#ProRDV #Cameroun #MobileMoney #MTNMoMo #OrangeMoney #Yaoundé",
  },
  {
    key: "rappels-auto",
    angle:
      "ProRDV envoie des rappels automatiques aux clients pour réduire les rendez-vous manqués.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'une cloche de notification stylisée avec une bulle de rappel affichant une icône d'horloge et une coche verte, connectée par une ligne pointillée à un smartphone, fond violet #7C3AED clair avec formes rondes, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Fini les rendez-vous oubliés. ⏰\n\nUn client qui oublie son rendez-vous, c'est un créneau perdu et un manque à gagner pour votre établissement. ProRDV s'en charge à votre place, sans que vous ayez à lever le petit doigt.\n\n✅ Rappels automatiques envoyés à vos clients avant chaque rendez-vous\n✅ Moins de no-show, plus de chiffre d'affaires réellement encaissé\n✅ Zéro effort de votre côté : tout est automatique, du premier au dernier rappel\n✅ Une meilleure expérience client, qui se traduit en fidélité\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #GestionRDV #Productivité",
  },
  {
    key: "secteur-coiffure",
    angle:
      "Les salons de coiffure et instituts de beauté optimisent leur agenda grâce à ProRDV.",
    secteur: "coiffure",
    promptImage:
      "Illustration flat design d'un salon de coiffure stylisé minimaliste avec fauteuil, miroir arrondi et ciseaux vectoriels, superposé d'une interface de réservation flottante violette avec coche verte, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Salons de coiffure, votre agenda mérite mieux qu'un cahier papier. ✂️\n\nEntre les appels pendant une coupe, les rendez-vous mal notés et les clientes qui repartent sans reprendre rendez-vous, chaque minute perdue coûte cher. ProRDV simplifie tout, du premier contact au paiement.\n\n✅ Réservation en ligne pour vos clientes, jour et nuit, sans interrompre votre travail\n✅ Paiement Mobile Money direct à la prise de rendez-vous\n✅ Rappels automatiques pour réduire les absences de dernière minute\n✅ Un site web professionnel pour présenter votre salon et vos prestations\n\n{CTA}\n\n#ProRDV #Coiffure #Cameroun #Yaoundé #Douala #SalonDeCoiffure",
  },
  {
    key: "secteur-resto",
    angle:
      "Les restaurants gèrent leurs réservations de table facilement grâce à ProRDV.",
    secteur: "restaurant",
    promptImage:
      "Illustration flat design d'une table de restaurant vue de dessus avec assiette et couverts stylisés minimalistes, entourée d'une interface de réservation violette flottante avec calendrier arrondi, fond violet #7C3AED clair, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Votre restaurant complet chaque soir, sans surbooking. 🍽️\n\nGérer les réservations par téléphone pendant le coup de feu du service, c'est le meilleur moyen de perdre une table ou de doubler une réservation par erreur. Avec ProRDV, vos clients réservent eux-mêmes, en toute autonomie.\n\n✅ Réservation de table en ligne, simple et rapide, à toute heure\n✅ Paiement Mobile Money pour sécuriser les réservations importantes\n✅ Rappels automatiques envoyés à vos clients avant leur venue\n✅ Un agenda clair, sans double réservation ni erreur de planning\n\n{CTA}\n\n#ProRDV #Restaurant #Cameroun #Yaoundé #Douala #Gastronomie",
  },
  {
    key: "secteur-hotel",
    angle:
      "Les hôtels centralisent leurs réservations de chambres avec ProRDV.",
    secteur: "hôtel",
    promptImage:
      "Illustration flat design d'un bâtiment d'hôtel stylisé minimaliste avec fenêtres arrondies et enseigne, superposé d'une interface de réservation violette flottante avec icône de lit stylisée, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Votre hôtel, réservable en ligne à toute heure. 🏨\n\nUn voyageur qui ne trouve pas d'information claire ou ne peut pas réserver immédiatement ira chez le concurrent suivant. ProRDV vous donne une vitrine professionnelle et un système de réservation disponible en permanence.\n\n✅ Réservation de chambres 24h/24, sans intermédiaire ni commission cachée\n✅ Paiement Mobile Money sécurisé directement à la réservation\n✅ Site web professionnel généré automatiquement pour présenter votre établissement\n✅ Une gestion centralisée de vos disponibilités, à jour en temps réel\n\n{CTA}\n\n#ProRDV #Hotel #Cameroun #Yaoundé #Douala #Tourisme",
  },
  {
    key: "secteur-fitness",
    angle:
      "Les salles de sport et coachs fitness gèrent leurs créneaux avec ProRDV.",
    secteur: "fitness",
    promptImage:
      "Illustration flat design d'haltères et d'un tapis de sport stylisés minimalistes disposés en composition géométrique, superposés d'une interface de réservation violette flottante avec chronomètre stylisé, fond violet #7C3AED clair, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos séances de sport se réservent maintenant en un clic. 🏋️\n\nEntre les créneaux mal gérés, les coachs surbookés et les membres qui abandonnent faute de rappel, une salle de sport perd vite en fréquentation. ProRDV structure votre planning et garde vos membres engagés.\n\n✅ Réservation de créneaux et de coachs en ligne, sans appel ni file d'attente\n✅ Rappels automatiques pour fidéliser vos membres et réduire les absences\n✅ Paiement Mobile Money intégré dès la réservation\n✅ Une vue claire de votre planning, pour mieux organiser vos équipes\n\n{CTA}\n\n#ProRDV #Fitness #Cameroun #Yaoundé #Douala #SalleDeSport",
  },
  {
    key: "secteur-spa",
    angle:
      "Les spas et centres de bien-être simplifient la prise de rendez-vous avec ProRDV.",
    secteur: "spa",
    promptImage:
      "Illustration flat design de pierres de massage empilées et d'une feuille stylisée minimaliste évoquant la détente, superposées d'une interface de réservation violette flottante arrondie, fond blanc et violet #7C3AED avec touches de vert doux, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Le bien-être de vos clients commence par une réservation sans friction. 🌿\n\nUn spa se vit dans le calme et la détente — pas dans les allers-retours au téléphone pour caler un rendez-vous. ProRDV laisse vos clients réserver sereinement, à leur rythme, et vous libère du temps pour vous concentrer sur votre art.\n\n✅ Prise de rendez-vous en ligne 24h/24, sans interruption de vos soins\n✅ Paiement Mobile Money direct et sécurisé\n✅ Rappels automatiques pour limiter les absences et optimiser votre planning\n✅ Une image professionnelle et apaisante, à l'image de votre établissement\n\n{CTA}\n\n#ProRDV #Spa #Cameroun #Yaoundé #Douala #BienEtre",
  },
  {
    key: "secteur-sante",
    angle:
      "Les cliniques et cabinets de santé optimisent la gestion de leurs rendez-vous patients avec ProRDV.",
    secteur: "santé",
    promptImage:
      "Illustration flat design d'une croix médicale stylisée minimaliste et d'un calendrier arrondi flottant avec coche verte de validation, fond violet #7C3AED clair et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos patients méritent une prise de rendez-vous simple et fiable. 🩺\n\nEntre les appels manqués, les rendez-vous mal notés et les patients qui oublient leur consultation, la gestion de votre cabinet ou clinique peut vite devenir chronophage. ProRDV vous libère de cette charge administrative.\n\n✅ Réservation en ligne 24h/24 pour vos consultations, sans surcharger votre secrétariat\n✅ Rappels automatiques pour réduire les rendez-vous manqués\n✅ Site web professionnel généré automatiquement pour informer vos patients\n✅ Un agenda centralisé et à jour, accessible à toute votre équipe\n\n{CTA}\n\n#ProRDV #Santé #Cameroun #Yaoundé #Douala #Clinique",
  },
  {
    key: "avis-clients",
    angle:
      "ProRDV aide les établissements à collecter des avis clients et à renforcer leur réputation en ligne.",
    secteur: "général",
    promptImage:
      "Illustration flat design de cinq étoiles arrondies dorées flottant au-dessus d'une bulle de commentaire violette stylisée avec coche verte de validation, fond violet #7C3AED et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos meilleurs clients sont vos meilleurs ambassadeurs. ⭐\n\nUn client satisfait qui ne laisse jamais d'avis, c'est une occasion manquée de convaincre les dix suivants. ProRDV vous aide à transformer chaque bon rendez-vous en preuve sociale visible par tous.\n\n✅ Collecte automatique des avis après chaque rendez-vous, sans relance manuelle\n✅ Réputation en ligne renforcée, confiance accrue auprès de nouveaux clients\n✅ Plus de visibilité pour attirer du monde, même sans budget publicitaire\n✅ Des retours concrets pour identifier ce qui plaît vraiment à votre clientèle\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #AvisClients #Reputation",
  },
  {
    key: "0-commission",
    angle:
      "ProRDV ne prend aucune commission sur les réservations : les établissements gardent 100% de leurs revenus.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un bouclier arrondi stylisé avec un symbole 0% en son centre en blanc sur fond violet #7C3AED, entouré de pièces stylisées minimalistes et d'une coche verte, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "0% de commission. 100% de vos revenus vous appartiennent. 💰\n\nBeaucoup de plateformes de réservation prélèvent une part de chaque transaction, réduisant peu à peu votre marge. ProRDV fait le choix inverse : vous laisser votre argent, pour que votre croissance profite d'abord à vous.\n\n✅ Aucune commission prélevée sur vos réservations, quel que soit leur nombre\n✅ Vous gardez l'intégralité de votre chiffre d'affaires, sans surprise\n✅ Une plateforme pensée pour faire grandir votre activité, pas pour se servir dessus\n✅ Une tarification simple et transparente, sans frais cachés\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #ZeroCommission #Entreprenariat",
  },
  {
    key: "avant-apres",
    angle:
      "ProRDV transforme la gestion des rendez-vous : du cahier papier et des appels manqués à un système 100% automatisé.",
    secteur: "général",
    promptImage:
      "Illustration flat design en deux panneaux côte à côte : à gauche un cahier papier froissé et un téléphone avec icône d'appel manqué en gris terne, à droite une interface de réservation violette moderne arrondie avec coche verte de validation, séparation nette entre les deux styles, fond blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Avant : cahier papier, appels manqués et rendez-vous doublés par erreur. Avec ProRDV : tout devient automatique. 🔄\n\nDigitaliser la gestion de vos rendez-vous n'est plus réservé aux grandes entreprises. En quelques minutes, votre établissement passe d'une organisation artisanale à un système professionnel, sans rien changer à votre façon de travailler au quotidien.\n\n✅ Fini la double réservation et les erreurs de planning\n✅ Gain de temps immédiat pour vous et votre équipe, chaque jour\n✅ Une image professionnelle et moderne pour votre établissement\n✅ Un historique complet de vos rendez-vous, accessible à tout moment\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #Digitalisation #PME",
  },
  {
    key: "multi-secteurs",
    angle:
      "ProRDV s'adapte à tous les types d'établissements : coiffure, spa, restaurant, fitness, hôtel, santé.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'une grille de six icônes arrondies minimalistes représentant ciseaux, feuille de spa, couverts, haltère, lit d'hôtel et croix médicale, disposées autour d'un logo central violet arrondi, fond violet #7C3AED et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Coiffure, spa, restaurant, fitness, hôtel, santé : ProRDV s'adapte à votre métier. 🔗\n\nQuel que soit votre secteur d'activité, la même problématique revient : gérer les rendez-vous, les paiements et les rappels sans perdre de temps ni de clients. ProRDV a été pensé pour répondre à tous ces besoins depuis une seule plateforme.\n\n✅ Une seule plateforme pour tous les secteurs de service, adaptée à chaque métier\n✅ Réservation, paiement Mobile Money et rappels automatiques inclus\n✅ Un site web professionnel généré pour chaque établissement inscrit\n✅ Déjà adopté par des établissements partout au Cameroun\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #MultiSecteurs #Reservation",
  },
];

export function getThemeByKey(key: string): Theme | undefined {
  return THEMES.find((theme) => theme.key === key);
}
