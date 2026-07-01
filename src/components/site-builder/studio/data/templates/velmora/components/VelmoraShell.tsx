import React from "react";
import { Menu, ShoppingBag } from "lucide-react";

import type { VelmoraPageId } from "../pages";

type Props = {
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

export default function VelmoraShell({
  activePage,
  onPageChange,
  children,
}: Props) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f6f2ea] text-[#27231f] [font-family:Inter,Arial,sans-serif]"
    >
      {/* FLOATING HEADER */}
      <header className="fixed left-1/2 top-5 z-50 w-[min(1120px,calc(100%-32px))] -translate-x-1/2 rounded-[10px] border border-black/10 bg-white/88 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl">
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
            <p className="[font-family:Georgia,serif] text-[25px] font-normal uppercase leading-none tracking-[0.08em] text-[#27231f]">
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
      </header>

      {children}

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-[#e8dfcf]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div>
            <p className="[font-family:Georgia,serif] text-3xl uppercase tracking-[0.08em]">
              ATELIER NOA
            </p>

            <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
              אופנה מדויקת, סגנון אישי וחוויית רכישה נקייה שמתאימה לכל לקוח
              ולקוחה.
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