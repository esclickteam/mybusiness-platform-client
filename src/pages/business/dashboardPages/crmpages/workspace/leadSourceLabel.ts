type LeadSourceView = {
  source?: string | null;
};

const META_SOURCE_LABELS = new Set([
  "make",
  "meta_lead_ads",
  "facebook_lead_ads",
]);

function clean(value: unknown) {
  return String(value ?? "").trim();
}

/**
 * Display label only. `make`, `meta_lead_ads` and `facebook_lead_ads` are
 * shown as Meta. Every other stored source is shown unchanged. This does not
 * change the stored value, filters, or integrations.
 */
export function leadSourceLabel(lead: LeadSourceView) {
  const source = clean(lead.source);
  if (!source) return "";
  if (META_SOURCE_LABELS.has(source.toLowerCase())) return "Meta";
  return source;
}
