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
import { themePalettes, fontOptions } from "./data/themePalettes";

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
  { key: "add", label: "הוספת אלמנטים", icon: "+" },
  { key: "sections", label: "הוספת סקשן", icon: "▭" },
  { key: "theme", label: "עיצוב אתר", icon: "◐" },
  { key: "pages", label: "דפים", icon: "▤" },
  { key: "media", label: "מדיה", icon: "▧" },
  { key: "store", label: "חנות וסליקה", icon: "◈" },
  { key: "services", label: "שירותים", icon: "◇" },
  { key: "bookings", label: "תיאום תורים", icon: "◷" },
  { key: "club", label: "מועדון לקוחות", icon: "♛" },
  { key: "leads", label: "טפסים ולידים", icon: "✉" },
  { key: "animations", label: "אנימציות", icon: "✺" },
  { key: "seo", label: "SEO", icon: "⌕" },
  { key: "settings", label: "הגדרות", icon: "⚙" },
];

export default function StudioSidebar({
  activePanel,
  setActivePanel,
  onAddHtml,
  onApplyTemplate,
  onApplyPalette,
  onOpenMedia,
}: Props) {
  const [elementCategory, setElementCategory] = useState<ElementCategory>("text");
  const [sectionCategory, setSectionCategory] = useState<SectionCategory>("welcome");

  const filteredElements = useMemo(
    () => studioElements.filter((element) => element.category === elementCategory),
    [elementCategory]
  );

  const filteredSections = useMemo(
    () => sectionTemplates.filter((section) => section.category === sectionCategory),
    [sectionCategory]
  );

  return (
    <aside className="grid min-h-0 grid-cols-[92px_430px] border-l border-slate-200 bg-white">
      <nav className="flex min-h-0 flex-col items-center gap-2 overflow-y-auto border-l border-slate-100 bg-white px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActivePanel(item.key)}
            className={[
              "group flex w-full flex-col items-center justify-center rounded-2xl px-2 py-3 text-[11px] font-black transition",
              activePanel === item.key
                ? "bg-violet-100 text-violet-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
            ].join(" ")}
          >
            <span className="mb-1 text-lg">{item.icon}</span>
            <span className="leading-4">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="min-h-0 overflow-y-auto bg-white p-5">
        {activePanel === "templates" && (
          <Panel title="תבניות" subtitle="בחרי תבנית מלאה ומעוצבת לפי תחום">
            <div className="space-y-4">
              {pageTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onApplyTemplate(template)}
                  className="group w-full rounded-[1.7rem] border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                >
                  <img
                    src={template.preview}
                    alt=""
                    className="mb-3 h-32 w-full rounded-2xl object-cover"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        {template.name}
                      </p>
                      <p className="mt-1 text-xs font-bold text-violet-600">
                        {template.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                      בחירה
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {activePanel === "add" && (
          <Panel title="הוספת אלמנטים" subtitle="כמו Wix — קטגוריות ואלמנטים לחיצים">
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
                  <span className="ml-2">{category.icon}</span>
                  {category.label}
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
          </Panel>
        )}

        {activePanel === "sections" && (
          <Panel title="הוספת סקשן" subtitle="מבנים מוכנים לכל חלק באתר">
            <div className="mb-5 space-y-2">
              {sectionCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSectionCategory(category.key)}
                  className={[
                    "w-full rounded-2xl px-4 py-3 text-right text-sm font-black transition",
                    sectionCategory === category.key
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {category.label}
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
          </Panel>
        )}

        {activePanel === "theme" && (
          <Panel title="עיצוב אתר" subtitle="צבעים, פונטים, רקעים ומעברי עמוד">
            <div className="mb-6 rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-950">Theme Assistant ✨</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                בהמשך AI יבחר צבעים, פונטים ומבנה לפי תחום העסק.
              </p>
            </div>

            <p className="mb-3 text-sm font-black text-slate-900">ערכות צבעים</p>
            <div className="space-y-3">
              {themePalettes.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => onApplyPalette(palette)}
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
                </button>
              ))}
            </div>

            <p className="mb-3 mt-8 text-sm font-black text-slate-900">פונטים</p>
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
              אפשר לבחור תמונה, להכניס אותה לעמוד, או להגדיר אותה כרקע לבלוק מתוך
              הפאנל הימני.
            </p>
          </Panel>
        )}

        {["store", "bookings", "services", "club", "leads"].includes(activePanel) && (
          <Panel title="בלוקים חכמים" subtitle="חיבורים חכמים למערכת Bizuply">
            <SmartButton title="שירותים מהעסק" text="מושך שירותים, מחיר וזמן" onClick={() => onAddHtml(studioElements.find((e) => e.id === "bizuply-services")?.html || "")} />
            <SmartButton title="תיאום תורים" text="מחובר ליומן ושעות פעילות" onClick={() => onAddHtml(studioElements.find((e) => e.id === "bizuply-booking")?.html || "")} />
            <SmartButton title="מועדון לקוחות" text="הטבות, קופונים והרשמות" onClick={() => onAddHtml(studioElements.find((e) => e.id === "bizuply-club")?.html || "")} />
            <SmartButton title="טופס ליד" text="כל פנייה נכנסת ל־CRM" onClick={() => onAddHtml(studioElements.find((e) => e.id === "form-lead")?.html || "")} />
          </Panel>
        )}

        {activePanel === "animations" && (
          <Panel title="אנימציות" subtitle="אפקטי כניסה, hover וקרוסלות">
            <Info title="Fade Up" text="כניסה מלמטה עם שקיפות" />
            <Info title="Zoom In" text="כניסה עם הגדלה עדינה" />
            <Info title="Hover Lift" text="הרמה וצל במעבר עכבר" />
            <Info title="Parallax" text="רקע שזז בגלילה — נוסיף בהמשך" />
            <Info title="Carousel" text="קרוסלה מובנית קיימת בספריית האלמנטים" />
          </Panel>
        )}

        {activePanel === "seo" && (
          <Panel title="SEO" subtitle="כותרת, תיאור, תמונת שיתוף וכתובת">
            <Info title="כותרת SEO" text="תתחבר בהמשך לשמירת האתר" />
            <Info title="תיאור SEO" text="מופיע בגוגל ובשיתוף קישור" />
            <Info title="Open Graph" text="תמונת שיתוף לפייסבוק ווואטסאפ" />
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
      className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/60 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
    >
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700">
        {element.icon}
      </span>
      <span className="text-xs font-black text-slate-800">{element.label}</span>
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
      className="w-full rounded-[1.7rem] border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
    >
      <img
        src={section.preview}
        alt=""
        className="mb-3 h-36 w-full rounded-2xl object-cover"
      />
      <p className="text-sm font-black text-slate-950">{section.title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-400">
        {section.description}
      </p>
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
      className="mb-3 w-full rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{text}</p>
    </button>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-950">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{text}</p>
    </div>
  );
}