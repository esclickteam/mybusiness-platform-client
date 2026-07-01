import React from "react";
import { Menu, ShoppingBag } from "lucide-react";

import VelmoraHome from "./template-pages/VelmoraHome";
import VelmoraShop from "./template-pages/VelmoraShop";
import VelmoraAbout from "./template-pages/VelmoraAbout";
import VelmoraProjects from "./template-pages/VelmoraProjects";
import VelmoraCustom from "./template-pages/VelmoraCustom";
import VelmoraContact from "./template-pages/VelmoraContact";
import VelmoraProduct from "./template-pages/VelmoraProduct";

export type VelmoraPageId =
  | "home"
  | "about"
  | "shop"
  | "projects"
  | "custom"
  | "contact"
  | "product";

export type VelmoraPageSection = {
  id: string;
  type:
    | "header"
    | "hero"
    | "about"
    | "collections"
    | "carousel"
    | "projects"
    | "custom"
    | "gallery"
    | "contact"
    | "product"
    | "footer";
  title: string;
};

export const velmoraPages = [
  {
    id: "home",
    name: "Home",
    slug: "/",
    sections: [
      "header",
      "hero",
      "about",
      "carousel",
      "collections",
      "projects",
      "custom",
      "gallery",
      "contact",
      "footer",
    ],
  },
  {
    id: "about",
    name: "About",
    slug: "/about",
    sections: ["header", "about", "gallery", "custom", "footer"],
  },
  {
    id: "shop",
    name: "Shop",
    slug: "/shop",
    sections: ["header", "product", "footer"],
  },
  {
    id: "product",
    name: "Product",
    slug: "/product",
    sections: ["header", "product", "gallery", "footer"],
  },
  {
    id: "projects",
    name: "Projects",
    slug: "/projects",
    sections: ["header", "projects", "gallery", "custom", "footer"],
  },
  {
    id: "custom",
    name: "Custom",
    slug: "/custom",
    sections: ["header", "custom", "gallery", "contact", "footer"],
  },
  {
    id: "contact",
    name: "Contact",
    slug: "/contact",
    sections: ["header", "contact", "gallery", "footer"],
  },
] as const;

export const velmoraSections: VelmoraPageSection[] = [
  { id: "header", type: "header", title: "Header" },
  { id: "hero", type: "hero", title: "Hero" },
  { id: "about", type: "about", title: "About" },
  { id: "collections", type: "collections", title: "Collections" },
  { id: "carousel", type: "carousel", title: "Carousel" },
  { id: "projects", type: "projects", title: "Projects" },
  { id: "custom", type: "custom", title: "Custom" },
  { id: "gallery", type: "gallery", title: "Gallery" },
  { id: "contact", type: "contact", title: "Contact" },
  { id: "product", type: "product", title: "Product" },
  { id: "footer", type: "footer", title: "Footer" },
];

type ShellProps = {
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
  children: React.ReactNode;
};

const leftNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
];

const rightNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
];

const footerNavItems: Array<{ id: VelmoraPageId; label: string }> = [
  { id: "home", label: "בית" },
  { id: "about", label: "אודות" },
  { id: "shop", label: "חנות" },
  { id: "projects", label: "קולקציות" },
  { id: "custom", label: "סטיילינג" },
  { id: "contact", label: "צור קשר" },
];

function NavButton({
  id,
  label,
  activePage,
  onPageChange,
}: {
  id: VelmoraPageId;
  label: string;
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  const active = activePage === id;

  return (
    <button
      type="button"
      onClick={() => onPageChange(id)}
      className={[
        "relative text-[13px] font-medium transition duration-300 hover:text-black",
        active ? "text-black" : "text-black/55",
      ].join(" ")}
    >
      {label}

      <span
        className={[
          "absolute -bottom-2 right-0 h-px bg-black transition-all duration-300",
          active ? "w-full" : "w-0",
        ].join(" ")}
      />
    </button>
  );
}

function VelmoraTemplateHeader({
  activePage,
  onPageChange,
}: {
  activePage: VelmoraPageId;
  onPageChange: (page: VelmoraPageId) => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#f6f2ea]/92 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto w-[min(1120px,calc(100%-12px))] rounded-[10px] border border-black/10 bg-white/90 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center px-5">
          <nav className="hidden items-center justify-start gap-9 lg:flex">
            {leftNavItems.map((item) => (
              <NavButton
                key={item.id}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}
          </nav>

          <button
            type="button"
            onClick={() => onPageChange("home")}
            className="text-center"
            aria-label="Go to homepage"
          >
            <p className="[font-family:Georgia,Times_New_Roman,serif] text-[25px] font-normal uppercase leading-none tracking-[0.08em] text-[#27231f]">
              ATELIER NOA
            </p>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              Boutique
            </p>
          </button>

          <nav className="hidden items-center justify-end gap-9 lg:flex">
            {rightNavItems.map((item) => (
              <NavButton
                key={item.id}
                id={item.id}
                label={item.label}
                activePage={activePage}
                onPageChange={onPageChange}
              />
            ))}

            <button
              type="button"
              onClick={() => onPageChange("shop")}
              className="flex h-11 items-center gap-2 rounded-[5px] bg-[#292318] px-5 text-[13px] font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              סל קניות
              <ShoppingBag className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex justify-start lg:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function VelmoraShell({
  activePage,
  onPageChange,
  children,
}: ShellProps) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f6f2ea] text-[#27231f] [font-family:Inter,Arial,sans-serif]"
    >
      <VelmoraTemplateHeader
        activePage={activePage}
        onPageChange={onPageChange}
      />

      {children}

      <footer className="border-t border-black/10 bg-[#e8dfcf]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <p className="[font-family:Georgia,Times_New_Roman,serif] text-3xl uppercase tracking-[0.08em]">
              ATELIER NOA
            </p>

            <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
              אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה לכל קהל יעד.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">שירות לקוחות</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              <button type="button" className="text-right hover:text-black">
                שאלות נפוצות
              </button>

              <button type="button" className="text-right hover:text-black">
                משלוחים והחזרות
              </button>

              <button type="button" className="text-right hover:text-black">
                שירות והזמנות
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">מידע</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              <button type="button" className="text-right hover:text-black">
                תקנון אתר
              </button>

              <button type="button" className="text-right hover:text-black">
                מדיניות פרטיות
              </button>

              <button type="button" className="text-right hover:text-black">
                הצהרת נגישות
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">ניווט מהיר</h3>

            <div className="mt-4 grid gap-2 text-sm text-black/60">
              {footerNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPageChange(item.id)}
                  className="text-right hover:text-black"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-black/45 md:flex-row md:items-center">
            <p>© 2026 ATELIER NOA. כל הזכויות שמורות.</p>

            <div className="flex flex-wrap gap-5">
              <button type="button" className="hover:text-black">
                תקנון אתר
              </button>

              <button type="button" className="hover:text-black">
                מדיניות פרטיות
              </button>

              <button type="button" className="hover:text-black">
                נגישות
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VelmoraPages() {
  const [activePage, setActivePage] = React.useState<VelmoraPageId>("home");

  function handlePageChange(page: VelmoraPageId) {
    setActivePage(page);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <VelmoraShell activePage={activePage} onPageChange={handlePageChange}>
      {activePage === "home" && (
        <VelmoraHome onPageChange={handlePageChange} />
      )}

      {activePage === "about" && (
        <VelmoraAbout onPageChange={handlePageChange} />
      )}

      {activePage === "shop" && (
        <VelmoraShop onPageChange={handlePageChange} />
      )}

      {activePage === "projects" && (
        <VelmoraProjects onPageChange={handlePageChange} />
      )}

      {activePage === "custom" && (
        <VelmoraCustom onPageChange={handlePageChange} />
      )}

      {activePage === "contact" && (
        <VelmoraContact onPageChange={handlePageChange} />
      )}

      {activePage === "product" && (
        <VelmoraProduct onPageChange={handlePageChange} />
      )}
    </VelmoraShell>
  );
}