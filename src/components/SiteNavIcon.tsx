const PATHS: Record<string, string> = {
  overview: "M4 5h16v14H4zM4 10h16M9 10v9",
  flow: "M5 7h6v4H5zM13 13h6v4h-6zM11 9h2M8 11v2h5",
  features: "M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z",
  automation: "M12 4v3M12 17v3M4 12h3M17 12h3M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2",
  crm: "M5 5h14v14H5zM8 9h8M8 12h8M8 15h5",
  whatsapp: "M6 18l-1 3 3-1a8 8 0 1 0-2-2z",
  campaigns: "M4 10v4h3l6 4V6L7 10zM16 9.5a3 3 0 0 1 0 5",
  website: "M4 6h16v12H4zM4 10h16M8 6v4",
  catalog: "M6 4h9l3 3v13H6zM15 4v4h4",
  need: "M12 4l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z",
  industry: "M4 20V9l8-5 8 5v11H4z",
  clinic: "M8 4h8v4h4v12H4V8h4zM11 11v6M8 14h6",
  beauty: "M12 4l1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4z",
  estate: "M4 20V9l8-5 8 5v11M9 20v-5h6v5",
  restaurant: "M7 4v7a3 3 0 0 0 2 2.8V20M10 4v6M14 4v16M14 8h3a2 2 0 0 1-2 2",
  service: "M14 6l4 4-8 8H6v-4z",
  agency: "M4 16l8-9 8 9H4zM7 20h10",
  leads: "M5 12h8M10 9l3 3-3 3M14 8h5v3h-5M14 13h5v3h-5",
  start: "M12 4l2.2 4.6L19 9.2l-3.5 3.3.9 5L12 15.2 7.6 17.5l.9-5L5 9.2l4.8-.6z",
  faq: "M12 18h.01M9.5 9a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 1.9V14",
  contact: "M5 6h14v12H5zM5 7l7 6 7-6",
  library: "M5 5h5v14H5zM10 5h5v14h-5M15 8h4v11h-4",
  guides: "M6 4h9l3 3v13H6zM15 4v4h4",
  templates: "M7 4h7l3 3v13H7zM8 12h8M8 16h5",
  calculator: "M7 4h10v16H7zM9 8h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  glossary: "M5 5h10a4 4 0 0 1 4 4v10H9a4 4 0 0 0-4 4zM9 5v14",
  compare: "M5 6h6v12H5zM13 6h6v12h-6",
  path: "M6 16a3 3 0 1 0 0.1 0M18 8a3 3 0 1 0 0.1 0M8.5 14.5l7-5",
  calendar: "M5 6h14v13H5zM5 10h14M9 4v4M15 4v4",
  ai: "M12 4l1.2 3.2L16.5 8.4 13.2 9.6 12 13l-1.2-3.4L7.5 8.4l3.3-1.2zM6 16h4M14 17h4",
};

export default function SiteNavIcon({ name }: { name?: string }) {
  return (
    <svg className="site-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name || ""] || "M5 12h14"} />
    </svg>
  );
}
