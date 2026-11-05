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
  | "visibility"
  | "appeared"
  | "missing"
  | "discovery"
  | "competitors"
  | "citations"
  | "opportunities"
  | "content"
  | "tech"
  | "trends"
  | "reports"
  | "measurements"
  | "alerts"
  | "settings";

export type Engine = {
  id: string;
  label: string;
  labelHe: string;
  status: string;
  notes?: string;
  notesHe?: string;
};
