import React, { useMemo, useState } from "react";
import type {
  ElementCategory,
  PageTemplate,
  SectionCategory,
  SectionTemplate,
  StudioElement,
  StudioPanel,
  ThemePalette,
} from "./types";

import { elementCategories, studioElements } from "./data/elementLibrary";
import { sectionCategories, sectionTemplates } from "./data/sectionTemplates";
import { pageTemplates } from "./data/pageTemplates";
import { fontOptions, themePalettes } from "./data/themePalettes";

type Props = {
  activePanel: StudioPanel;
  setActivePanel: (value: StudioPanel) => void;
  onAddHtml: (html: string) => void;
  onApplyTemplate: (template: PageTemplate) => void;
  onApplyPalette: (palette: ThemePalette) => void;
  onOpenMedia: () => void;
};

const navItems: { key: StudioPanel; label: string; icon: string }[] = [
  { key: "templates", label: "תבניות", icon: "▦" },
  { key: "add", label: "אלמנטים", icon: "+" },
  { key: "sections", label: "סקשנים", icon: "▭" },
  { key: "theme", label: "עיצוב", icon: "◐" },
  { key: "pages", label: "דפים", icon: "▤" },
  { key: "media", label: "מדיה", icon: "▧" },
  { key: "store", label: "חנות", icon: "◈" },
  { key: "services", label: "שירותים", icon: "◇" },
  { key: "bookings", label: "תורים", icon: "◷" },
  { key: "club", label: "מועדון", icon: "♛" },
  { key: "leads", label: "לידים", icon: "✉" },
  { key: "animations", label: "תנועה", icon: "✺" },
  { key: "seo", label: "SEO", icon: "⌕" },
  { key: "settings", label: "הגדרות", icon: "⚙" },
];

const smartBlockIds = [
  "bizuply-services",
  "bizuply-booking",
  "bizuply-products",
  "bizuply-lead-form",
  "bizuply-reviews",
  "bizuply-club",
];

export default function StudioSidebar({
  activePanel,
  setActivePanel,
  onAddHtml,
  onApplyTemplate,
  onApplyPalette,
  onOpenMedia,
}: Props) {
  const [elementCategory, setElementCategory] =
    useState<ElementCategory>("text");

  const [sectionCategory, setSectionCategory] =
    useState<SectionCategory>("welcome");

  const [search, setSearch] = useState("");

  const sectionCountByCategory = useMemo(() => {
    return sectionTemplates.reduce<Record<string, number>>((acc, section) => {
      acc[section.category] = (acc[section.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const elementCountByCategory = useMemo(() => {
    return studioElements.reduce<Record<string, number>>((acc, element) => {
      acc[element.category] = (acc[element.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const smartBlocks = useMemo(() => {
    return smartBlockIds
      .map((id) => studioElements.find((element) => element.id === id))
      .filter(Boolean) as StudioElement[];
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredElements = useMemo(() => {
    return studioElements.filter((element) => {
      const matchesCategory = element.category === elementCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${element.label} ${element.description || ""} ${
        element.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [elementCategory, normalizedSearch]);

  const filteredSections = useMemo(() => {
    return sectionTemplates.filter((section) => {
      const matchesCategory = section.category === sectionCategory;

      if (!normalizedSearch) return matchesCategory;

      const haystack = `${section.title} ${section.description} ${
        section.category
      }`.toLowerCase();

      return matchesCategory && haystack.includes(normalizedSearch);
    });
  }, [sectionCategory, normalizedSearch]);

  const filteredPageTemplates = useMemo(() => {
    if (!normalizedSearch) return pageTemplates;

    return pageTemplates.filter((template) => {
      const haystack = `${template.name} ${template.category} ${template.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const clearSearch = () => setSearch("");

  return (
    <aside className="grid min-h-0 grid-cols-[92px_430px] border-l border-slate-200 bg-white">
      <nav className="flex min-h-0 flex-col items-center gap-2 overflow-y-auto border-l border-slate-100 bg-white px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setActivePanel(item.key);
              clearSearch();
            }}
            className={[
              "group flex w-full flex-col items-center justify-center rounded-2xl px-2 py-3 text-[11px] font-black transition",
              activePanel === item.key
                ? "bg-violet-100 text-violet-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
          >
            <span className="mb-1 text-lg leading-none">{item.icon}</span>
            <span className="leading-4">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="min-h-0 overflow-y-auto bg-white p-5">
        {activePanel === "templates" && (
          <Panel
            title="תבניות אתר"
            subtitle="בחרי תבנית מלאה לפי תחום, ואז ערכי כל חלק בעמוד"
          >
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="חיפוש תבנית לפי תחום..."
            />

            <div className="mb-4 grid grid-cols-2 gap-2">
              <MiniStat label="תבניות" value={pageTemplates.length} />
              <MiniStat label="עריכה חופשית" value="100%" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredPageTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => onApplyTemplate(template)}
                />
              ))}
            </div>

            {filteredPageTemplates.length === 0 && <EmptyState />}
          </Panel>
        )}

        {activePanel === "add" && (
          <Panel
            title="הוספת אלמנטים"
            subtitle="טקסט, תמונות, כפתורים, טפסים, חנות, תורים ועוד"
          >
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="חיפוש אלמנט..."
            />

            <div className="mb-5 grid grid-cols-2 gap-2">
              {elementCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setElementCategory(category.key)}
                  className={[
                    "rounded-2xl px-3 py-3 text-right text-xs font-black transition",
                    elementCategory === category.key
                      ? "bg-violet-700 text-white shadow-xl shadow-violet-100"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <span className="ml-2">{category.icon}</span>
                      {category.label}
                    </span>

                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] font-black",
                        elementCategory === category.key
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      {elementCountByCategory[category.key] || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredElements.map((element) => (
                <ElementCard
                  key={element.id}
                  element={element}
                  onClick={() => onAddHtml(element.html)}
                />
              ))}
            </div>

            {filteredElements.length === 0 && <EmptyState />}
          </Panel>
        )}

        {activePanel === "sections" && (
          <Panel
            title="הוספת סקשן"
            subtitle="לכל חלק באתר יש מבנים לבחירה — הירו, אודות, חנות, תורים ועוד"
          >
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="חיפוש מבנה / סקשן..."
            />

            <div className="mb-5 grid grid-cols-2 gap-2">
              {sectionCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSectionCategory(category.key)}
                  className={[
                    "rounded-2xl px-3 py-3 text-right text-xs font-black transition",
                    sectionCategory === category.key
                      ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{category.label}</span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] font-black",
                        sectionCategory === category.key
                          ? "bg-violet-200/70 text-violet-800"
                          : "bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      {sectionCountByCategory[category.key] || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredSections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onClick={() => onAddHtml(section.html)}
                />
              ))}
            </div>

            {filteredSections.length === 0 && <EmptyState />}
          </Panel>
        )}

        {activePanel === "theme" && (
          <Panel
            title="עיצוב אתר"
            subtitle="צבעים, פונטים, רקעים ומיתוג לכל האתר"
          >
            <div className="mb-6 rounded-[1.7rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg shadow-sm">
                ✨
              </div>

              <p className="text-sm font-black text-slate-950">
                Theme Assistant
              </p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                בחרי ערכת צבעים, וכל האתר יתעדכן אוטומטית לפי המיתוג.
              </p>
            </div>

            <p className="mb-3 text-sm font-black text-slate-900">
              ערכות צבעים
            </p>

            <div className="space-y-3">
              {themePalettes.map((palette) => (
                <PaletteCard
                  key={palette.id}
                  palette={palette}
                  onClick={() => onApplyPalette(palette)}
                />
              ))}
            </div>

            <p className="mb-3 mt-8 text-sm font-black text-slate-900">
              פונטים
            </p>

            <div className="grid grid-cols-2 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font}
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </Panel>
        )}

        {activePanel === "media" && (
          <Panel title="מדיה" subtitle="תמונות, וידאו ותמונת רקע">
            <button
              type="button"
              onClick={onOpenMedia}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              פתיחת מנהל מדיה
            </button>

            <p className="mt-4 rounded-3xl bg-violet-50 p-4 text-sm font-bold leading-7 text-violet-700">
              אפשר לבחור תמונה, להכניס אותה לעמוד, או להגדיר אותה כרקע לבלוק
              מתוך הפאנל הימני.
            </p>
          </Panel>
        )}

        {["store", "bookings", "services", "club", "leads"].includes(
          activePanel
        ) && (
          <Panel title="בלוקים חכמים" subtitle="חיבורים למודולים של Bizuply">
            <div className="space-y-3">
              {smartBlocks.map((block) => (
                <SmartButton
                  key={block.id}
                  title={block.label}
                  text={block.description || "בלוק חכם שמתחבר למערכת"}
                  onClick={() => onAddHtml(block.html)}
                />
              ))}
            </div>
          </Panel>
        )}

        {activePanel === "animations" && (
          <Panel title="אנימציות" subtitle="אפקטי כניסה, hover וקרוסלות">
            <Info title="Fade Up" text="כניסה מלמטה עם שקיפות" />
            <Info title="Zoom In" text="כניסה עם הגדלה עדינה" />
            <Info title="Slide Right" text="כניסה מצד ימין" />
            <Info title="Blur Reveal" text="חשיפה עם טשטוש יוקרתי" />
            <Info title="Carousel" text="קרוסלה קיימת בספריית האלמנטים" />
          </Panel>
        )}

        {activePanel === "seo" && (
          <Panel title="SEO" subtitle="כותרת, תיאור, תמונת שיתוף וכתובת">
            <Info title="כותרת SEO" text="תתחבר בהמשך לשמירת האתר" />
            <Info title="תיאור SEO" text="מופיע בגוגל ובשיתוף קישור" />
            <Info title="Open Graph" text="תמונת שיתוף לפייסבוק ווואטסאפ" />
          </Panel>
        )}

        {activePanel === "pages" && (
          <Panel title="דפים" subtitle="ניהול דפי האתר">
            <Info title="דף הבית" text="הדף הראשי של האתר" />
            <Info title="אודות" text="אפשר להוסיף בהמשך דף נפרד" />
            <Info title="צור קשר" text="אפשר להוסיף בהמשך דף נפרד" />
          </Panel>
        )}

        {activePanel === "settings" && (
          <Panel title="הגדרות" subtitle="דומיין, שפה, פיקסלים והרשאות">
            <Info title="דומיין" text="hadar-beauty.bizuply.com או דומיין אישי" />
            <Info title="אנליטיקס" text="חיבור Google Analytics / Pixel" />
            <Info title="סטטוס פרסום" text="טיוטה / פורסם / לא פעיל" />
          </Panel>
        )}
      </div>
    </aside>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-400">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-400">⌕</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-400 hover:text-rose-500"
        >
          ×
        </button>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
    </div>
  );
}

function TemplateCard({
  template,
  onClick,
}: {
  template: PageTemplate;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-[1.7rem] border border-slate-200 bg-white p-2 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-2xl">
        <img
          src={template.preview}
          alt=""
          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          בחירה
        </span>
      </div>

      <p className="text-sm font-black text-slate-950">{template.name}</p>
      <p className="mt-1 text-[11px] font-bold text-violet-600">
        {template.category}
      </p>
      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-400">
        {template.description}
      </p>
    </button>
  );
}

function ElementCard({
  element,
  onClick,
}: {
  element: StudioElement;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/60 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
    >
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
        {element.icon}
      </span>

      <span className="text-xs font-black text-slate-800">
        {element.label}
      </span>

      {element.description && (
        <span className="mt-1 block text-[11px] font-bold leading-4 text-slate-400">
          {element.description}
        </span>
      )}
    </button>
  );
}

function SectionCard({
  section,
  onClick,
}: {
  section: SectionTemplate;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[1.7rem] border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="relative mb-3 overflow-hidden rounded-2xl">
        <img
          src={section.preview}
          alt=""
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm">
          הוספה
        </span>
      </div>

      <p className="text-sm font-black text-slate-950">{section.title}</p>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {section.description}
      </p>
    </button>
  );
}

function PaletteCard({
  palette,
  onClick,
}: {
  palette: ThemePalette;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[1.7rem] border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <div className="mb-3 flex gap-2">
        {Object.values(palette.colors).map((color) => (
          <span
            key={color}
            className="h-8 w-8 rounded-xl border border-white shadow"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="text-sm font-black text-slate-950">{palette.name}</p>

      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {palette.description}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500"
          style={{ fontFamily: palette.font.heading }}
        >
          {palette.font.heading}
        </span>

        <span
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500"
          style={{ fontFamily: palette.font.body }}
        >
          {palette.font.body}
        </span>
      </div>
    </button>
  );
}

function SmartButton({
  title,
  text,
  onClick,
}: {
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </button>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm font-black text-slate-700">לא נמצאו תוצאות</p>
      <p className="mt-1 text-xs font-bold text-slate-400">
        נסי לבחור קטגוריה אחרת או למחוק את החיפוש.
      </p>
    </div>
  );
}