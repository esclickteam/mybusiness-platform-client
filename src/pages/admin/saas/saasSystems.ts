export type SaasSystem = {
  slug: string;
  name: string;
  host: string;
  backup: string;
};

/**
 * The ten systems approved for sale. Delivera stays out of this list.
 * Backup text records the closed audit; it is not a new production probe.
 */
export const SAAS_SYSTEMS: SaasSystem[] = [
  {
    slug: "tableflow",
    name: "TableFlow",
    host: "tableflow.bizuply.com",
    backup: "MongoDB בגיבוי שוטף. אין PostgreSQL. שחזור סנאפשוט Atlas לא נבדק.",
  },
  {
    slug: "dinevo",
    name: "Dinevo",
    host: "dinevo.bizuply.com",
    backup: "MongoDB וגיבוי יומי של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "beautyflow",
    name: "BeautyFlow",
    host: "beautyflow.bizuply.com",
    backup: "MongoDB וגיבוי יומי של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "global-properties",
    name: "Global Properties",
    host: "globalproperties.bizuply.com",
    backup: "MongoDB וגיבוי יומי של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "cliny",
    name: "Cliny",
    host: "cliny.bizuply.com",
    backup: "MongoDB וגיבוי יומי של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "fitora",
    name: "Fitora",
    host: "fitora.bizuply.com",
    backup: "MongoDB ו־PITR של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "bakeora",
    name: "Bakeora",
    host: "bakeora.bizuply.com",
    backup: "MongoDB וגיבוי יומי חדש של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "shiftly",
    name: "Shiftly",
    host: "shiftly.bizuply.com",
    backup: "MongoDB וגיבוי יומי חדש של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "meetora",
    name: "Meetora",
    host: "meetora-production.up.railway.app",
    backup: "MongoDB וגיבוי יומי של PostgreSQL. תיקיית התמונות ריקה ואין לה לוח גיבוי. שחזור סנאפשוט לא נבדק.",
  },
  {
    slug: "agentflow",
    name: "AgentFlow",
    host: "agentflow.bizuply.com",
    backup: "MongoDB, גיבוי יומי ו־PITR של PostgreSQL. שחזור סנאפשוט לא נבדק.",
  },
];

export const SALE_STATUS = "זמינה למכירה, עם סיכון מתועד";

export function systemBySlug(slug: string) {
  return SAAS_SYSTEMS.find((system) => system.slug === slug);
}
