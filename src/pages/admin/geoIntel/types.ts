export type Brand = {
  _id: string;
  slug: string;
  name: string;
  domains: string[];
  languages?: string[];
  market?: string;
  primaryCountry?: string;
};

export type Tab =
  | "overview"
  | "weeklyActions"
  | "gscOpportunities"
  | "aiRadar"
  | "beforeAfter"
  | "brandProfile"
  | "seoGeoMatrix"
  | "pageAudit"
  | "monthlyDecision"
  | "visibility"
  | "appeared"
  | "missing"
  | "discovery"
  | "competitors"
  | "citations"
  | "opportunities"
  | "improvementPlan"
  | "content"
  | "tech"
  | "trends"
  | "reports"
  | "measurements"
  | "alerts"
  | "catalogDraft"
  | "costs"
  | "settings";

export type Engine = {
  id: string;
  label: string;
  labelHe: string;
  status: string;
  notes?: string;
  notesHe?: string;
};
