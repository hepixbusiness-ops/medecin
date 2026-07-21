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
      "Vos clients veulent réserver même à 23h ? Avec ProRDV, c'est possible. 📅\n\n✅ Réservation en ligne 24h/24 et 7j/7\n✅ Aucun appel manqué, aucune opportunité perdue\n✅ Confirmation automatique et instantanée\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #ReservationEnLigne #Entreprenariat",
  },
  {
    key: "site-web-auto",
    angle:
      "Chaque établissement inscrit sur ProRDV obtient automatiquement un site web professionnel généré pour lui.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un ordinateur portable et d'un smartphone affichant côte à côte une même page web moderne violette avec sections arrondies, une baguette magique stylisée créant le site à partir de blocs géométriques, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Pas de site web pour votre établissement ? ProRDV s'en occupe pour vous. 💻\n\n✅ Site web professionnel généré automatiquement\n✅ Prêt en quelques minutes, sans compétence technique\n✅ Visible par vos clients partout au Cameroun\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #SiteWeb #PME",
  },
  {
    key: "momo-paiement",
    angle:
      "ProRDV intègre le paiement Mobile Money (MTN MoMo, Orange Money) directement au moment de la réservation.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un smartphone affichant une interface de paiement mobile avec icônes stylisées jaune et orange évoquant Mobile Money, entouré de pièces et billets stylisés minimalistes, fond violet #7C3AED avec touches de vert pour une coche de validation, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Le paiement ne doit jamais être un frein à la réservation. 💳\n\n✅ Paiement Mobile Money intégré : MTN MoMo et Orange Money\n✅ Transactions sécurisées et instantanées\n✅ Moins de rendez-vous annulés à la dernière minute\n\n{CTA}\n\n#ProRDV #Cameroun #MobileMoney #MTNMoMo #OrangeMoney #Yaoundé",
  },
  {
    key: "rappels-auto",
    angle:
      "ProRDV envoie des rappels automatiques aux clients pour réduire les rendez-vous manqués.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'une cloche de notification stylisée avec une bulle de rappel affichant une icône d'horloge et une coche verte, connectée par une ligne pointillée à un smartphone, fond violet #7C3AED clair avec formes rondes, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Fini les rendez-vous oubliés. ⏰\n\n✅ Rappels automatiques envoyés à vos clients\n✅ Moins de no-show, plus de chiffre d'affaires\n✅ Zéro effort de votre côté : tout est automatique\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #GestionRDV #Productivité",
  },
  {
    key: "secteur-coiffure",
    angle:
      "Les salons de coiffure et instituts de beauté optimisent leur agenda grâce à ProRDV.",
    secteur: "coiffure",
    promptImage:
      "Illustration flat design d'un salon de coiffure stylisé minimaliste avec fauteuil, miroir arrondi et ciseaux vectoriels, superposé d'une interface de réservation flottante violette avec coche verte, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Salons de coiffure, votre agenda mérite mieux qu'un cahier papier. ✂️\n\n✅ Réservation en ligne pour vos clientes, jour et nuit\n✅ Paiement Mobile Money direct à la prise de rendez-vous\n✅ Rappels automatiques pour réduire les absences\n\n{CTA}\n\n#ProRDV #Coiffure #Cameroun #Yaoundé #Douala #SalonDeCoiffure",
  },
  {
    key: "secteur-resto",
    angle:
      "Les restaurants gèrent leurs réservations de table facilement grâce à ProRDV.",
    secteur: "restaurant",
    promptImage:
      "Illustration flat design d'une table de restaurant vue de dessus avec assiette et couverts stylisés minimalistes, entourée d'une interface de réservation violette flottante avec calendrier arrondi, fond violet #7C3AED clair, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Votre restaurant complet chaque soir, sans surbooking. 🍽️\n\n✅ Réservation de table en ligne, simple et rapide\n✅ Paiement Mobile Money pour sécuriser les réservations\n✅ Rappels automatiques envoyés à vos clients\n\n{CTA}\n\n#ProRDV #Restaurant #Cameroun #Yaoundé #Douala #Gastronomie",
  },
  {
    key: "secteur-hotel",
    angle:
      "Les hôtels centralisent leurs réservations de chambres avec ProRDV.",
    secteur: "hôtel",
    promptImage:
      "Illustration flat design d'un bâtiment d'hôtel stylisé minimaliste avec fenêtres arrondies et enseigne, superposé d'une interface de réservation violette flottante avec icône de lit stylisée, fond blanc et violet #7C3AED, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Votre hôtel, réservable en ligne à toute heure. 🏨\n\n✅ Réservation de chambres 24h/24, sans intermédiaire\n✅ Paiement Mobile Money sécurisé à la réservation\n✅ Site web professionnel généré automatiquement\n\n{CTA}\n\n#ProRDV #Hotel #Cameroun #Yaoundé #Douala #Tourisme",
  },
  {
    key: "secteur-fitness",
    angle:
      "Les salles de sport et coachs fitness gèrent leurs créneaux avec ProRDV.",
    secteur: "fitness",
    promptImage:
      "Illustration flat design d'haltères et d'un tapis de sport stylisés minimalistes disposés en composition géométrique, superposés d'une interface de réservation violette flottante avec chronomètre stylisé, fond violet #7C3AED clair, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos séances de sport se réservent maintenant en un clic. 🏋️\n\n✅ Réservation de créneaux et de coachs en ligne\n✅ Rappels automatiques pour fidéliser vos membres\n✅ Paiement Mobile Money intégré\n\n{CTA}\n\n#ProRDV #Fitness #Cameroun #Yaoundé #Douala #SalleDeSport",
  },
  {
    key: "secteur-spa",
    angle:
      "Les spas et centres de bien-être simplifient la prise de rendez-vous avec ProRDV.",
    secteur: "spa",
    promptImage:
      "Illustration flat design de pierres de massage empilées et d'une feuille stylisée minimaliste évoquant la détente, superposées d'une interface de réservation violette flottante arrondie, fond blanc et violet #7C3AED avec touches de vert doux, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Le bien-être de vos clients commence par une réservation sans friction. 🌿\n\n✅ Prise de rendez-vous en ligne 24h/24\n✅ Paiement Mobile Money direct et sécurisé\n✅ Rappels automatiques pour limiter les absences\n\n{CTA}\n\n#ProRDV #Spa #Cameroun #Yaoundé #Douala #BienEtre",
  },
  {
    key: "secteur-sante",
    angle:
      "Les cliniques et cabinets de santé optimisent la gestion de leurs rendez-vous patients avec ProRDV.",
    secteur: "santé",
    promptImage:
      "Illustration flat design d'une croix médicale stylisée minimaliste et d'un calendrier arrondi flottant avec coche verte de validation, fond violet #7C3AED clair et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos patients méritent une prise de rendez-vous simple et fiable. 🩺\n\n✅ Réservation en ligne 24h/24 pour vos consultations\n✅ Rappels automatiques pour réduire les rendez-vous manqués\n✅ Site web professionnel généré automatiquement\n\n{CTA}\n\n#ProRDV #Santé #Cameroun #Yaoundé #Douala #Clinique",
  },
  {
    key: "avis-clients",
    angle:
      "ProRDV aide les établissements à collecter des avis clients et à renforcer leur réputation en ligne.",
    secteur: "général",
    promptImage:
      "Illustration flat design de cinq étoiles arrondies dorées flottant au-dessus d'une bulle de commentaire violette stylisée avec coche verte de validation, fond violet #7C3AED et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Vos meilleurs clients sont vos meilleurs ambassadeurs. ⭐\n\n✅ Collecte automatique des avis après chaque rendez-vous\n✅ Réputation en ligne renforcée, confiance accrue\n✅ Plus de visibilité pour attirer de nouveaux clients\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #AvisClients #Reputation",
  },
  {
    key: "0-commission",
    angle:
      "ProRDV ne prend aucune commission sur les réservations : les établissements gardent 100% de leurs revenus.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'un bouclier arrondi stylisé avec un symbole 0% en son centre en blanc sur fond violet #7C3AED, entouré de pièces stylisées minimalistes et d'une coche verte, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "0% de commission. 100% de vos revenus vous appartiennent. 💰\n\n✅ Aucune commission prélevée sur vos réservations\n✅ Vous gardez l'intégralité de votre chiffre d'affaires\n✅ Une plateforme pensée pour faire grandir votre activité\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #ZeroCommission #Entreprenariat",
  },
  {
    key: "avant-apres",
    angle:
      "ProRDV transforme la gestion des rendez-vous : du cahier papier et des appels manqués à un système 100% automatisé.",
    secteur: "général",
    promptImage:
      "Illustration flat design en deux panneaux côte à côte : à gauche un cahier papier froissé et un téléphone avec icône d'appel manqué en gris terne, à droite une interface de réservation violette moderne arrondie avec coche verte de validation, séparation nette entre les deux styles, fond blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Avant : cahier papier et appels manqués. Avec ProRDV : tout est automatique. 🔄\n\n✅ Fini la double réservation et les erreurs de planning\n✅ Gain de temps immédiat pour vous et votre équipe\n✅ Une image professionnelle et moderne pour votre établissement\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #Digitalisation #PME",
  },
  {
    key: "multi-secteurs",
    angle:
      "ProRDV s'adapte à tous les types d'établissements : coiffure, spa, restaurant, fitness, hôtel, santé.",
    secteur: "général",
    promptImage:
      "Illustration flat design d'une grille de six icônes arrondies minimalistes représentant ciseaux, feuille de spa, couverts, haltère, lit d'hôtel et croix médicale, disposées autour d'un logo central violet arrondi, fond violet #7C3AED et blanc, ambiance africaine urbaine contemporaine, style plat, coins arrondis, ombres douces, sans visage réaliste, haute qualité.",
    gabaritLegende:
      "Coiffure, spa, restaurant, fitness, hôtel, santé : ProRDV s'adapte à votre métier. 🔗\n\n✅ Une seule plateforme pour tous les secteurs de service\n✅ Réservation, paiement et rappels automatiques inclus\n✅ Déjà adopté par des établissements partout au Cameroun\n\n{CTA}\n\n#ProRDV #Cameroun #Yaoundé #Douala #MultiSecteurs #Reservation",
  },
];

export function getThemeByKey(key: string): Theme | undefined {
  return THEMES.find((theme) => theme.key === key);
}
