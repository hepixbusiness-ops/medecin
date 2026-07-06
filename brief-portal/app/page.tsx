import { BriefPortal } from "@/components/brief/BriefPortal";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Brief Client — Dossier de projet web",
  description:
    "Formulaire guidé permettant à un client de transmettre à son agence toutes les informations et fichiers nécessaires à la création de son site web.",
  isPartOf: {
    "@type": "WebSite",
    name: "Brief Client",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BriefPortal />
    </>
  );
}
