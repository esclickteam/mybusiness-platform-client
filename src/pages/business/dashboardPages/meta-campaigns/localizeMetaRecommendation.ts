import type { AiCampaignRecommendation } from "../../../../api/metaCampaignsApi";

type Translate = (key: string, options?: Record<string, unknown>) => string;

const TECHNICAL_RE =
  /phase\s*5|create_recommendation|deterministic|hygiene|sourceRule|ads_management|graph api|outcome_|last_\d+d|campaign\s+\d{8,}/i;
const META_ID_RE = /\b\d{10,}\b/g;
const ENUM_RE = /\b[A-Z][A-Z0-9_]{3,}\b/g;

export function looksForeignForLocale(text: string, language: string): boolean {
  const value = String(text || "");
  const hebrew = (value.match(/[\u0590-\u05FF]/g) || []).length;
  const latin = (value.match(/[A-Za-z]/g) || []).length;
  const lang = String(language || "en").toLowerCase();
  if (lang.startsWith("he")) return latin >= 12 && latin > hebrew;
  if (lang.startsWith("en")) return hebrew >= 8 && hebrew > latin;
  return false;
}

export function isTechnicalRecommendationCopy(text: string): boolean {
  const value = String(text || "").trim();
  if (!value) return true;
  if (TECHNICAL_RE.test(value)) return true;
  if (ENUM_RE.test(value) && META_ID_RE.test(value)) return true;
  if (/^[A-Z][A-Z0-9_]{3,}$/.test(value)) return true;
  return false;
}

export function recommendationKind(rec: AiCampaignRecommendation): string {
  const blob = `${(rec.sourceRuleKeys || []).join(" ")} ${rec.title} ${rec.finding} ${rec.recommendedActionType}`;
  if (/CPL|COST_PER_LEAD|cost per lead/i.test(blob)) return "cpl";
  if (/VARIANT|CREATIVE|fatigue|מודעה/i.test(blob)) return "creative";
  if (/BUDGET|SCALE/i.test(blob)) return "budget";
  if (/PAUSE|DISAPPROV|REJECT/i.test(blob)) return "pause";
  return "generic";
}

export function recommendationFilterBucket(
  status: string
): "open" | "applied" | "dismissed" {
  const value = String(status || "").toUpperCase();
  if (["APPLIED", "ACCEPTED"].includes(value)) return "applied";
  if (["DISMISSED", "EXPIRED", "ROLLED_BACK", "FAILED"].includes(value)) {
    return "dismissed";
  }
  return "open";
}

export function localizeRecommendationCopy(
  rec: AiCampaignRecommendation,
  t: Translate,
  language: string
) {
  const kind = recommendationKind(rec);
  const useMapped = (raw?: string) =>
    !raw ||
    isTechnicalRecommendationCopy(raw) ||
    looksForeignForLocale(raw, language);

  const title = useMapped(rec.title)
    ? t(`metaCampaigns.recommendations.kinds.${kind}.title`)
    : String(rec.title).replace(META_ID_RE, "").replace(/\s+/g, " ").trim();
  const body = useMapped(rec.explanation || rec.finding)
    ? t(`metaCampaigns.recommendations.kinds.${kind}.body`)
    : String(rec.explanation || rec.finding)
        .replace(META_ID_RE, "")
        .replace(ENUM_RE, "")
        .replace(/\s+/g, " ")
        .trim();
  const why = useMapped(rec.finding)
    ? t(`metaCampaigns.recommendations.kinds.${kind}.why`)
    : String(rec.finding).replace(META_ID_RE, "").replace(ENUM_RE, "").replace(/\s+/g, " ").trim();
  const campaignName =
    rec.campaignName && !/^\d+$/.test(rec.campaignName) && !META_ID_RE.test(rec.campaignName)
      ? rec.campaignName
      : t("metaCampaigns.recommendations.campaignFallback");

  return { title, body, why, campaignName, kind };
}
