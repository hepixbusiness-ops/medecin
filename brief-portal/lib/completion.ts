import type { BriefFormData } from "./types";

type Check = (data: BriefFormData) => boolean;

const CHECKS: Check[] = [
  (d) => d.companyName.trim().length > 0,
  (d) => d.sector.length > 0,
  (d) => d.city.length > 0,
  (d) => d.activity.trim().length > 0,
  (d) => d.email.trim().length > 0,
  (d) => d.whatsapp.trim().length > 0,
  (d) => d.logo !== null,
  (d) => d.brandColors.length > 0,
  (d) => d.photos.length > 0,
  (d) => d.inspirationLinks.trim().length > 0,
  (d) => d.siteType.length > 0,
  (d) => d.pages.length > 0,
  (d) => d.features.length > 0,
  (d) => d.goal.trim().length > 0,
  (d) => d.timeline.length > 0,
  (d) => d.budget.length > 0,
  (d) => d.message.trim().length > 0,
];

export function computeCompletion(data: BriefFormData): number {
  const filled = CHECKS.filter((check) => check(data)).length;
  return Math.round((filled / CHECKS.length) * 100);
}
