import { Metier } from "./metiers";

/**
 * Banque de types de contenu marketing. Chaque type fournit une structure
 * réutilisable (accroche + corps) qui s'adapte à n'importe quel métier via
 * `generer(metier)`. Combiné aux 22 métiers de metiers.ts, ça donne des
 * centaines de publications uniques sans texte figé.
 */

export interface ContenuGenere {
  accroche: string;
  corps: string[];
}

export interface TypeContenu {
  key: string;
  nom: string;
  generer: (metier: Metier) => ContenuGenere;
}

export const TYPES_CONTENU: TypeContenu[] = [
  {
    key: "astuce",
    nom: "Astuce",
    generer: (m) => ({
      accroche: `💡 Astuce du jour pour votre ${m.nom} :`,
      corps: [
        `Le secret pour ne plus laisser ${m.douleur} : digitalisez votre prise de rendez-vous.`,
        `Avec ProRDV, vous profitez de ${m.beneficeCle}.`,
        `Résultat : moins de stress, plus de temps pour votre cœur de métier.`,
      ],
    }),
  },
  {
    key: "conseil",
    nom: "Conseil",
    generer: (m) => ({
      accroche: `Conseil de pro pour les professionnels du secteur ${m.secteur.toLowerCase()} : ne laissez plus ${m.douleur}.`,
      corps: [
        `La solution la plus simple : ${m.beneficeCle}.`,
        `C'est exactement ce que propose ProRDV pour votre ${m.nom}.`,
        `Un changement simple, un impact immédiat sur votre activité.`,
      ],
    }),
  },
  {
    key: "avant-apres",
    nom: "Avant / Après",
    generer: (m) => ({
      accroche: `Avant : ${m.douleur}. Avec ProRDV : tout change. 🔄`,
      corps: [
        `Avant : gestion manuelle, erreurs, temps perdu.`,
        `Après : ${m.beneficeCle}.`,
        `Une transformation simple pour votre ${m.nom}, sans rien changer à votre métier.`,
      ],
    }),
  },
  {
    key: "temoignage",
    nom: "Témoignage",
    generer: (m) => ({
      accroche: `"Depuis que j'utilise ProRDV, je ne reviendrais jamais en arrière." — un professionnel du secteur ${m.secteur.toLowerCase()} 💬`,
      corps: [
        `Avant, ${m.douleur}.`,
        `Aujourd'hui, ${m.beneficeCle}.`,
        `Ce témoignage résume ce que vivent des centaines de professionnels avec ProRDV.`,
      ],
    }),
  },
  {
    key: "nouveaute",
    nom: "Nouveauté",
    generer: (m) => ({
      accroche: `Nouveau chez ProRDV : encore plus simple pour votre ${m.nom}. 🚀`,
      corps: [
        `Fini le temps où ${m.douleur}.`,
        `Profitez dès maintenant de ${m.beneficeCle}.`,
        `Une plateforme qui évolue en permanence pour votre secteur.`,
      ],
    }),
  },
  {
    key: "fonctionnalite",
    nom: "Fonctionnalité",
    generer: (m) => ({
      accroche: `Zoom sur une fonctionnalité clé de ProRDV pour votre ${m.nom}. 🔍`,
      corps: [
        `${m.beneficeCle.charAt(0).toUpperCase()}${m.beneficeCle.slice(1)}.`,
        `Une réponse directe au fait que ${m.douleur}.`,
        `Disponible dès votre inscription, sans configuration compliquée.`,
      ],
    }),
  },
  {
    key: "cas-client",
    nom: "Cas client",
    generer: (m) => ({
      accroche: `Cas client : comment un ${m.nom} a transformé sa gestion des rendez-vous. 📈`,
      corps: [
        `Le problème de départ : ${m.douleur}.`,
        `La solution mise en place : ${m.beneficeCle}.`,
        `Le résultat : plus de sérénité au quotidien et plus de rendez-vous honorés.`,
      ],
    }),
  },
  {
    key: "faq",
    nom: "FAQ",
    generer: (m) => ({
      accroche: `Question fréquente des professionnels du secteur ${m.secteur.toLowerCase()} : "Comment éviter que ${m.douleur} ?" 🤔`,
      corps: [
        `Réponse : avec ${m.beneficeCle}.`,
        `C'est exactement ce que ProRDV met en place pour votre ${m.nom}.`,
        `Une question, une solution simple, disponible dès aujourd'hui.`,
      ],
    }),
  },
  {
    key: "erreur-frequente",
    nom: "Erreur fréquente",
    generer: (m) => ({
      accroche: `Erreur fréquente dans le secteur ${m.secteur.toLowerCase()} : laisser ${m.douleur}. ⚠️`,
      corps: [
        `Cette erreur coûte du temps et des clients, chaque semaine.`,
        `La solution : ${m.beneficeCle}.`,
        `Ne la commettez plus avec votre ${m.nom}.`,
      ],
    }),
  },
  {
    key: "citation",
    nom: "Citation",
    generer: (m) => ({
      accroche: `"Le temps que vous perdez à gérer, c'est du temps que vous ne passez pas à développer." 💭`,
      corps: [
        `Pour un ${m.nom}, chaque minute compte.`,
        `ProRDV vous offre ${m.beneficeCle}.`,
        `Reprenez le contrôle de votre emploi du temps dès aujourd'hui.`,
      ],
    }),
  },
  {
    key: "chiffre",
    nom: "Chiffre",
    generer: (m) => ({
      accroche: `📊 Un rendez-vous manqué peut représenter plusieurs milliers de FCFA de perte pour un ${m.nom}.`,
      corps: [
        `La cause la plus fréquente : ${m.douleur}.`,
        `La solution : ${m.beneficeCle}.`,
        `Un chiffre qui parle, une solution qui existe déjà.`,
      ],
    }),
  },
  {
    key: "productivite",
    nom: "Productivité",
    generer: (m) => ({
      accroche: `Comment gagner plusieurs heures par semaine dans votre ${m.nom} ? ⏱️`,
      corps: [
        `En ne laissant plus ${m.douleur}.`,
        `Avec ${m.beneficeCle}.`,
        `Du temps regagné, à réinvestir directement dans votre activité.`,
      ],
    }),
  },
  {
    key: "gestion",
    nom: "Gestion",
    generer: (m) => ({
      accroche: `Bien gérer un ${m.nom} commence par bien gérer son agenda. 🗂️`,
      corps: [
        `Le premier obstacle : ${m.douleur}.`,
        `La réponse ProRDV : ${m.beneficeCle}.`,
        `Une gestion plus fluide, du premier rendez-vous au dernier.`,
      ],
    }),
  },
  {
    key: "motivation",
    nom: "Motivation",
    generer: (m) => ({
      accroche: `Votre ${m.nom} mérite les meilleurs outils pour grandir. 💪`,
      corps: [
        `Ne laissez plus ${m.douleur} freiner votre activité.`,
        `Avec ProRDV, profitez de ${m.beneficeCle}.`,
        `Chaque petit changement vous rapproche d'une activité plus sereine.`,
      ],
    }),
  },
  {
    key: "storytelling",
    nom: "Storytelling",
    generer: (m) => ({
      accroche: `Il y a quelques mois encore, ce ${m.nom} vivait avec ${m.douleur}. 📖`,
      corps: [
        `Aujourd'hui, tout a changé grâce à ${m.beneficeCle}.`,
        `Une histoire simple, vécue par de nombreux professionnels avec ProRDV.`,
        `Et si la prochaine histoire, c'était la vôtre ?`,
      ],
    }),
  },
  {
    key: "coulisses",
    nom: "Coulisses",
    generer: (m) => ({
      accroche: `Dans les coulisses d'un ${m.nom} qui a digitalisé sa gestion. 🎬`,
      corps: [
        `Le quotidien avant : ${m.douleur}.`,
        `Le quotidien après ProRDV : ${m.beneficeCle}.`,
        `Une transformation discrète, mais qui change tout au jour le jour.`,
      ],
    }),
  },
  {
    key: "comparaison",
    nom: "Comparaison",
    generer: (m) => ({
      accroche: `Cahier papier vs ProRDV pour votre ${m.nom} : le match n'a pas vraiment de suspense. ⚖️`,
      corps: [
        `Cahier papier : erreurs, oublis, et ${m.douleur}.`,
        `ProRDV : ${m.beneficeCle}.`,
        `Le choix est vite fait pour qui veut gagner du temps.`,
      ],
    }),
  },
  {
    key: "checklist",
    nom: "Checklist",
    generer: (m) => ({
      accroche: `Checklist pour un ${m.nom} bien organisé : ✅`,
      corps: [
        `Ne plus laisser ${m.douleur}.`,
        `Mettre en place ${m.beneficeCle}.`,
        `Vérifier son agenda en un coup d'œil, où que l'on soit.`,
      ],
    }),
  },
  {
    key: "demonstration",
    nom: "Démonstration",
    generer: (m) => ({
      accroche: `Voici comment ProRDV s'utilise concrètement pour un ${m.nom}. 🖥️`,
      corps: [
        `Étape 1 : le client réserve en ligne, sans appel.`,
        `Étape 2 : ${m.beneficeCle}.`,
        `Étape 3 : vous vous concentrez sur votre métier, pas sur l'administratif.`,
      ],
    }),
  },
  {
    key: "tutoriel",
    nom: "Tutoriel",
    generer: (m) => ({
      accroche: `Tutoriel express : configurez votre ${m.nom} sur ProRDV en quelques minutes. 🛠️`,
      corps: [
        `1. Créez votre compte gratuitement.`,
        `2. Ajoutez vos services et horaires.`,
        `3. Profitez immédiatement de ${m.beneficeCle}.`,
      ],
    }),
  },
  {
    key: "carrousel",
    nom: "Carrousel",
    generer: (m) => ({
      accroche: `3 raisons pour un ${m.nom} de passer à ProRDV ➡️`,
      corps: [
        `1. Fini ${m.douleur}.`,
        `2. Profitez de ${m.beneficeCle}.`,
        `3. Une image professionnelle et moderne pour votre activité.`,
      ],
    }),
  },
  {
    key: "promotion",
    nom: "Promotion",
    generer: (m) => ({
      accroche: `Offre du moment pour les professionnels du secteur ${m.secteur.toLowerCase()} : inscription 100% gratuite. 🎁`,
      corps: [
        `Aucun frais caché, aucune commission sur vos réservations.`,
        `Profitez immédiatement de ${m.beneficeCle}.`,
        `Une occasion à saisir pour digitaliser votre ${m.nom}.`,
      ],
    }),
  },
  {
    key: "jeu-concours",
    nom: "Jeu concours",
    generer: (m) => ({
      accroche: `🎉 Ce mois-ci, ProRDV met à l'honneur les professionnels du secteur ${m.secteur.toLowerCase()} ! Partagez votre expérience en commentaire.`,
      corps: [
        `Racontez comment vous gérez vos rendez-vous aujourd'hui.`,
        `Les meilleures réponses seront mises en avant sur notre page.`,
        `Et si vous en profitiez pour découvrir ${m.beneficeCle} ?`,
      ],
    }),
  },
  {
    key: "actualite",
    nom: "Actualité",
    generer: (m) => ({
      accroche: `De plus en plus de professionnels du secteur ${m.secteur.toLowerCase()} passent au digital pour gérer leurs rendez-vous. 📰`,
      corps: [
        `La raison : ${m.douleur}, et plus personne n'en veut.`,
        `La tendance : adopter ${m.beneficeCle}.`,
        `Une évolution que ProRDV accompagne au quotidien.`,
      ],
    }),
  },
];

export function getTypeContenuByKey(key: string): TypeContenu | undefined {
  return TYPES_CONTENU.find((t) => t.key === key);
}
