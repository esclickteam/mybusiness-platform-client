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
  initialPage?: LunellePageId;
  isStudioStatic?: boolean;
};

function isValidLunellePageId(value: unknown): value is LunellePageId {
  return [
    "home",
    "about",
    "services",
    "gallery",
    "prices",
    "booking",
    "contact",
  ].includes(String(value));
}

export default function LunellePages({
  initialPage = "home",
  isStudioStatic = false,
}: Props = {}) {
  const safeInitialPage = isValidLunellePageId(initialPage)
    ? initialPage
    : "home";

  const [activePage, setActivePage] =
    React.useState<LunellePageId>(safeInitialPage);

  const pageToRender = isStudioStatic ? safeInitialPage : activePage;

  const page =
    lunelleEditorPages.find((item) => item.id === pageToRender) ||
    lunelleEditorPages[0];

  React.useEffect(() => {
    if (isStudioStatic) return;

    const links = document.querySelectorAll<HTMLAnchorElement>(
      '[data-template-id="lunelle"] a[href^="#"]',
    );

    function handleClick(event: MouseEvent) {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href") || "";

      const map: Record<string, LunellePageId> = {
        "#home": "home",
        "#about": "about",
        "#services": "services",
        "#gallery": "gallery",
        "#prices": "prices",
        "#booking": "booking",
        "#contact": "contact",
      };

      const nextPage = map[href];

      if (!nextPage) return;

      event.preventDefault();
      setActivePage(nextPage);
    }

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, [pageToRender, isStudioStatic]);

  return (
    <main className="min-h-screen bg-[#fff7f1] text-[#2a171c]">
      <style>{lunelleEditorCss}</style>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}