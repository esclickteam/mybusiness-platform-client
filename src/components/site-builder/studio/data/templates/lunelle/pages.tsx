import React from "react";
import { lunelleEditorCss } from "./editorCss";
import { lunelleEditorPages } from "./lunelleData";

export type LunellePageId =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "prices"
  | "booking"
  | "contact";

export const lunellePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "gallery", label: "גלריה", slug: "/gallery" },
  { id: "prices", label: "מחירים", slug: "/prices" },
  { id: "booking", label: "קביעת תור", slug: "/booking" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
] as const;

type Props = {
  initialPage?: LunellePageId | string;
  isStudioStatic?: boolean;
};

const pageAliases: Record<string, LunellePageId> = {
  "": "home",
  "/": "home",

  home: "home",
  "#home": "home",
  בית: "home",

  about: "about",
  "#about": "about",
  אודות: "about",

  services: "services",
  "#services": "services",
  שירותים: "services",

  gallery: "gallery",
  "#gallery": "gallery",
  גלריה: "gallery",

  prices: "prices",
  "#prices": "prices",
  pricing: "prices",
  מחירים: "prices",

  booking: "booking",
  "#booking": "booking",
  appointment: "booking",
  appointments: "booking",
  "קביעת-תור": "booking",
  "קביעת תור": "booking",

  contact: "contact",
  "#contact": "contact",
  "צור-קשר": "contact",
  "צור קשר": "contact",
};

function normalizePageInput(value: unknown): LunellePageId {
  const clean = String(value ?? "home")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .toLowerCase();

  return pageAliases[clean] || pageAliases[String(value ?? "").trim()] || "home";
}

function getLunellePage(pageId: LunellePageId) {
  return (
    lunelleEditorPages.find((item) => item.id === pageId) ||
    lunelleEditorPages.find((item) => item.id === "home") ||
    lunelleEditorPages[0]
  );
}

function LunelleEmptyState() {
  return (
    <section
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fff7f1] px-6 text-[#2a171c]"
    >
      <div className="max-w-xl rounded-[32px] border border-[#2a171c]/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(42,23,28,.12)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8a4f5f]">
          Lunelle Studio
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em]">
          אין תוכן להצגה בעמוד הזה
        </h1>

        <p className="mt-4 text-sm font-semibold leading-7 text-[#2a171c]/60">
          העמוד קיים ברשימת הדפים, אבל ה־HTML שלו ריק בתוך
          lunelleEditorPages. צריך לעדכן את lunelleData.ts.
        </p>
      </div>
    </section>
  );
}

export default function LunellePages({
  initialPage = "home",
  isStudioStatic = false,
}: Props = {}) {
  const safeInitialPage = React.useMemo(
    () => normalizePageInput(initialPage),
    [initialPage],
  );

  const [activePage, setActivePage] =
    React.useState<LunellePageId>(safeInitialPage);

  React.useEffect(() => {
    setActivePage(safeInitialPage);
  }, [safeInitialPage]);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;
  const page = getLunellePage(pageToRender);

  React.useEffect(() => {
    if (isStudioStatic) return;

    const root = document.querySelector('[data-template-id="lunelle"]');
    if (!root) return;

    const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";
      const nextPage = normalizePageInput(href);

      if (!nextPage) return;

      event.preventDefault();
      setActivePage(nextPage);
    }

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic]);

  const html = typeof page?.html === "string" ? page.html.trim() : "";

  return (
    <main
      dir="rtl"
      data-template-id="lunelle"
      className="min-h-screen bg-[#fff7f1] text-[#2a171c]"
    >
      <style>{lunelleEditorCss}</style>

      {html ? (
        <div
          className="lunelle-template-root min-h-screen"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <LunelleEmptyState />
      )}
    </main>
  );
}