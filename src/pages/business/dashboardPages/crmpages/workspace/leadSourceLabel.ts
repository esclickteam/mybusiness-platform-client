type LeadSourceView = {
  source?: string | null;
  provider?: string | null;
  facebook?: Record<string, unknown> | null;
};

const META_PROVIDERS = new Set([
  "facebook_lead_ads",
  "meta_lead_ads",
  "meta",
  "facebook",
  "instagram",
]);

const META_FACEBOOK_FIELDS = [
  "leadId",
  "formId",
  "pageId",
  "campaignId",
  "adId",
  "formName",
  "campaignName",
  "adName",
  "pageName",
];

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function hasValue(value: unknown) {
  return clean(value).length > 0;
}

/**
 * A stored source of "make" is Meta only when the lead also carries the
 * Facebook lead-ad fields written by the Make intake. Other Make leads stay
 * labeled with the stored source.
 */
export function leadCameFromMetaViaMake(lead: LeadSourceView) {
  if (clean(lead.source).toLowerCase() !== "make") return false;
  if (META_PROVIDERS.has(clean(lead.provider).toLowerCase())) return true;
  const facebook = lead.facebook || {};
  return META_FACEBOOK_FIELDS.some((field) => hasValue(facebook[field]));
}

/** Display label only. Does not change the stored source or any filter value. */
export function leadSourceLabel(lead: LeadSourceView) {
  const source = clean(lead.source);
  if (!source) return "";
  if (source.toLowerCase() === "meta_lead_ads" || leadCameFromMetaViaMake(lead)) return "Meta";
  return source;
}
