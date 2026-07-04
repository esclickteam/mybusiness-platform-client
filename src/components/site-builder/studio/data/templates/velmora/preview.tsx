import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, MonitorSmartphone, Wand2 } from "lucide-react";

import VelmoraPages from "./pages";

type VelmoraPreviewProps = {
  onEdit?: () => void;
  onBack?: () => void;
};

type VelmoraPreviewPage =
  | "home"
  | "shop"
  | "collections"
  | "about"
  | "contact"
  | "services"
  | "projects";

const VELMORA_PAGE_IDS: VelmoraPreviewPage[] = [
  "home",
  "shop",
  "collections",
  "about",
  "contact",
  "services",
  "projects",
];

const VELMORA_PAGE_LABELS: Record<VelmoraPreviewPage, string> = {
  home: "בית",
  shop: "חנות",
  collections: "קולקציות",
  about: "אודות",
  contact: "יצירת קשר",
  services: "שירותים",
  projects: "פרויקטים",
};

function normalizePreviewPageId(
  value: string | null | undefined,
): VelmoraPreviewPage {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (!clean || clean === "home" || clean === "index") return "home";

  if (
    clean === "shop" ||
    clean === "store" ||
    clean === "products" ||
    clean === "product"
  ) {
    return "shop";
  }

  if (
    clean === "collections" ||
    clean === "collection" ||
    clean === "catalog" ||
    clean === "gallery"
  ) {
    return "collections";
  }

  if (clean === "about") return "about";
  if (clean === "contact" || clean === "contacts") return "contact";

  /**
   * נשאר לתאימות אם בתבנית יש לינקים כאלה.
   */
  if (clean === "services" || clean === "service") return "services";
  if (clean === "projects" || clean === "project" || clean === "portfolio") {
    return "projects";
  }

  return "home";
}

function getPreviewPageFromHref(href: string): VelmoraPreviewPage | null {
  const cleanHref = String(href || "").trim();

  if (!cleanHref) return null;

  if (cleanHref.startsWith("mailto:")) return null;
  if (cleanHref.startsWith("tel:")) return null;
  if (cleanHref.startsWith("sms:")) return null;
  if (cleanHref.includes("wa.me/")) return null;
  if (cleanHref.includes("api.whatsapp.com")) return null;

  if (cleanHref.startsWith("http://") || cleanHref.startsWith("https://")) {
    try {
      const url = new URL(cleanHref);
      return normalizePreviewPageId(url.pathname);
    } catch {
      return null;
    }
  }

  if (cleanHref.startsWith("#")) {
    return normalizePreviewPageId(cleanHref);
  }

  if (cleanHref.startsWith("/")) {
    return normalizePreviewPageId(cleanHref);
  }

  return normalizePreviewPageId(cleanHref);
}

export default function VelmoraPreview({
  onEdit,
  onBack,
}: VelmoraPreviewProps = {}) {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activePreviewPage = normalizePreviewPageId(searchParams.get("page"));

  const basePath = businessId ? `/business/${businessId}` : "/business";

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-key", "velmora");
    localStorage.setItem("bizuply-selected-template-id", "velmora");

    if (onEdit) {
      onEdit();
      return;
    }

    navigate(`${basePath}/dashboard/website?template=velmora`);
  }

  function handleBackToTemplates() {
    if (onBack) {
      onBack();
      return;
    }

    navigate(`${basePath}/dashboard/website/templates`);
  }

  function setPreviewPage(pageId: VelmoraPreviewPage) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (pageId === "home") {
      nextSearchParams.delete("page");
    } else {
      nextSearchParams.set("page", pageId);
    }

    setSearchParams(nextSearchParams, {
      replace: false,
    });
  }

  function handlePreviewClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    const link = target.closest("a") as HTMLAnchorElement | null;

    if (!link) return;

    const href = String(link.getAttribute("href") || "").trim();

    if (!href) return;

    const nextPage = getPreviewPageFromHref(href);

    /**
     * בפריוויו לא נותנים לקישורים לצאת לדשבורד / ראוטר / אתר חיצוני.
     */
    event.preventDefault();
    event.stopPropagation();

    if (!nextPage || !VELMORA_PAGE_IDS.includes(nextPage)) return;

    setPreviewPage(nextPage);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#2a2119] p-4 text-white"
    >
      <div className="mx-auto max-w-[1600px]">
        <header
          className="
            mb-4 flex items-center justify-between gap-4 rounded-[28px]
            border border-white/10 bg-white/10 px-5 py-4
            shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="
                inline-flex h-11 w-11 shrink-0 items-center justify-center
                rounded-full border border-white/10 bg-white/10 text-white
                transition hover:bg-white/15
              "
              aria-label="חזרה לתבניות"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              <span className="absolute h-10 w-10 rounded-full bg-[#caa36d]" />
              <Check className="relative z-10 h-5 w-5 text-[#2a2119]" />
            </span>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-[-0.06em]">
                Velmora · {VELMORA_PAGE_LABELS[activePreviewPage]}
              </h1>

              <p className="truncate text-xs font-bold text-white/55">
                Fashion store premium website template
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="
              inline-flex h-12 shrink-0 items-center gap-3 rounded-full
              bg-[#caa36d] px-6 text-sm font-black text-[#2a2119]
              transition hover:-translate-y-1
              hover:shadow-[0_18px_45px_rgba(202,163,109,0.35)]
            "
          >
            השתמשי בתבנית
            <Wand2 className="h-4 w-4" />
          </button>
        </header>

        <section
          className="
            overflow-hidden rounded-[34px] border border-white/10 bg-white
            shadow-[0_30px_110px_rgba(0,0,0,0.32)]
          "
        >
          <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-black/40">
              <MonitorSmartphone className="h-4 w-4" />
              Velmora Live Preview
            </div>
          </div>

          <div
            onClickCapture={handlePreviewClickCapture}
            className="h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden bg-white"
          >
            <VelmoraPages
              key={activePreviewPage}
              initialPage={activePreviewPage}
              activePageId={activePreviewPage}
              pageId={activePreviewPage}
              isStudioStatic
            />
          </div>
        </section>
      </div>
    </main>
  );
}