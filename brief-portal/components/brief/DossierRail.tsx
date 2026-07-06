"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Image as ImageIcon, MapPin, Tag, Browser } from "@phosphor-icons/react";
import type { BriefFormData } from "@/lib/types";
import { STEP_LABELS, TYPES_SITE } from "@/lib/config";
import { computeCompletion } from "@/lib/completion";

interface DossierRailProps {
  data: BriefFormData;
  currentStep: number;
}

function RailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="label-mono text-[10px] text-rail-text-soft">{title}</span>
      {children}
    </div>
  );
}

export function DossierRail({ data, currentStep }: DossierRailProps) {
  const completion = computeCompletion(data);
  const siteTypeLabel = TYPES_SITE.find((t) => t.value === data.siteType)?.label;

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-[340px] shrink-0 flex-col justify-between overflow-y-auto bg-rail-bg px-8 py-10 text-rail-text lg:flex">
      <div className="flex flex-col gap-8">
        <Image
          src="/dossier-mark.svg"
          alt="Symbole du dossier client"
          width={40}
          height={40}
          priority
        />
        <div className="flex flex-col gap-1">
          <span className="label-mono text-[11px] text-accent">
            Dossier de projet
          </span>
          <h2 className="h2-clamp font-semibold text-rail-text">
            {data.companyName.trim() || (
              <span className="text-rail-text-soft/50">Votre entreprise</span>
            )}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <RailChip icon={<MapPin size={13} weight="bold" />} value={data.city} placeholder="Ville" />
          <RailChip icon={<Tag size={13} weight="bold" />} value={data.sector} placeholder="Secteur" />
        </div>

        <div className="h-px w-full bg-white/10" />

        <RailSection title="Logo">
          {data.logo ? (
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white/5">
              {data.logo.file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.logo.previewUrl}
                  alt={`Logo de ${data.companyName || "l'entreprise"}`}
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <ImageIcon size={22} className="text-rail-text-soft" />
              )}
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-white/15 text-rail-text-soft/50">
              <ImageIcon size={20} />
            </div>
          )}
        </RailSection>

        <RailSection title="Couleurs de marque">
          {data.brandColors.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.brandColors.map((color) => (
                <span
                  key={color.id}
                  className="h-7 w-7 rounded-full border border-white/20"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full border border-dashed border-white/15"
                />
              ))}
            </div>
          )}
        </RailSection>

        <RailSection title="Type de site">
          {siteTypeLabel ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Browser size={14} weight="bold" />
              {siteTypeLabel}
            </span>
          ) : (
            <span className="text-[13px] text-rail-text-soft/50">
              Pas encore choisi
            </span>
          )}
        </RailSection>

        <RailSection title={`Pages (${data.pages.length})`}>
          {data.pages.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {data.pages.map((page) => (
                <span
                  key={page}
                  className="rounded-full border border-white/15 px-2.5 py-1 text-[12px] text-rail-text-soft"
                >
                  {page}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[13px] text-rail-text-soft/50">
              Aucune page sélectionnée
            </span>
          )}
        </RailSection>
      </div>

      <div className="flex flex-col gap-4 pt-8">
        <ol className="flex items-center gap-2">
          {STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1;
            const isDone = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`label-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] transition-colors duration-200 ${
                    isDone
                      ? "bg-accent text-white"
                      : isActive
                        ? "border border-accent text-accent"
                        : "border border-white/15 text-rail-text-soft/50"
                  }`}
                >
                  {String(stepNumber).padStart(2, "0")}
                </span>
                {stepNumber !== STEP_LABELS.length && (
                  <span
                    className={`h-px flex-1 ${isDone ? "bg-accent" : "bg-white/15"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="label-mono text-[10px] text-rail-text-soft">
              Dossier complété
            </span>
            <span className="label-mono text-[10px] text-accent">{completion}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function RailChip({
  icon,
  value,
  placeholder,
}: {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] ${
        value
          ? "border-white/20 bg-white/5 text-rail-text"
          : "border-dashed border-white/15 text-rail-text-soft/50"
      }`}
    >
      {icon}
      {value || placeholder}
    </span>
  );
}
