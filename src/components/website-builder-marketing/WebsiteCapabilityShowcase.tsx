import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  Globe,
  LayoutTemplate,
  Library,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { ProgressRing, StickyShowcase } from "../product-marketing";
import type { ShowcaseItem } from "../product-marketing";
import { websiteHeroTemplates } from "./websiteHeroTemplates";
import {
  schemaTypes,
  seoControls,
  templateCategories,
} from "./websiteMarketingData";
import "./websiteSections.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function StageShell({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wbx-stage">
      <div className="wbx-stage__head">
        <p className="wbx-stage__title">{title}</p>
        <span className="wbx-stage__meta">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function TemplatesStage() {
  const max = Math.max(...templateCategories.map((c) => c.count));

  return (
    <StageShell title="ספריית התבניות" meta="205 תבניות · עריכה מלאה">
      <div className="wbx-templates">
        {websiteHeroTemplates.slice(0, 6).map((template) => (
          <div key={template.id} className="wbx-template">
            <img
              src={template.desktopImage}
              alt={`תבנית ${template.title} — ${template.category}`}
              loading="lazy"
              decoding="async"
            />
            <span>{template.title}</span>
          </div>
        ))}
      </div>

      <ul className="wbx-cats">
        {templateCategories.map((cat, index) => (
          <li key={cat.label} className="wbx-cat">
            <span>{cat.label}</span>
            <span className="wbx-cat__track">
              <motion.span
                className="wbx-cat__fill"
                style={{ background: cat.accent }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: cat.count / max }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, delay: index * 0.06, ease: EASE }}
              />
            </span>
            <span className="wbx-cat__count">{cat.count}</span>
          </li>
        ))}
      </ul>
    </StageShell>
  );
}

function WizardStage() {
  return (
    <StageShell title="אשף הבנייה עם AI" meta="4 שלבים · טיוטה מלאה">
      <div className="wbx-wizard">
        <div className="wbx-wizard__step">
          <span className="wbx-wizard__num">1</span>
          <div>
            <h4>מספרים על העסק</h4>
            <div className="wbx-wizard__chips">
              <span>שם העסק</span>
              <span>תחום</span>
              <span>תיאור</span>
              <span>קהל יעד</span>
            </div>
          </div>
        </div>

        <div className="wbx-wizard__step">
          <span className="wbx-wizard__num">2</span>
          <div>
            <h4>בוחרים סגנון וטון</h4>
            <div className="wbx-wizard__chips">
              <span>מודרני</span>
              <span>מינימלי</span>
              <span>יוקרתי</span>
              <span>צבע ראשי</span>
              <span>צבע משני</span>
            </div>
          </div>
        </div>

        <div className="wbx-wizard__step">
          <span className="wbx-wizard__num">3</span>
          <div>
            <h4>מסמנים אילו עמודים צריך</h4>
            <div className="wbx-wizard__chips">
              <span>בית</span>
              <span>אודות</span>
              <span>שירותים</span>
              <span>גלריה</span>
              <span>מחירים</span>
              <span>המלצות</span>
              <span>שאלות נפוצות</span>
              <span>צור קשר</span>
            </div>
          </div>
        </div>

        <div className="wbx-wizard__result">
          <Sparkles size={16} aria-hidden="true" />
          טיוטת אתר מרובת עמודים נפתחת ישירות בעורך הוויזואלי
        </div>
      </div>
    </StageShell>
  );
}

function LibraryStage() {
  return (
    <StageShell title="ספריות תוכן בעורך" meta="140 עמודים · סקשנים לפי קטגוריה">
      <div className="wbx-library">
        <div className="wbx-library__tabs">
          <span className="is-active">סקשנים</span>
          <span>עמודים</span>
          <span>תוספים</span>
          <span>אייקונים</span>
          <span>אנימציות</span>
          <span>מדיה</span>
          <span>קוד</span>
        </div>

        <div className="wbx-library__grid">
          {[
            "כותרת ראשית",
            "שירותים",
            "המלצות",
            "מחירון",
            "גלריה",
            "טופס",
            "צוות",
            "שאלות נפוצות",
          ].map((name) => (
            <div key={name} className="wbx-library__card">
              <i />
              <i />
              <b>{name}</b>
            </div>
          ))}
        </div>

        <div className="wbx-wizard__result">
          <Library size={16} aria-hidden="true" />
          גוררים סקשנים ועמודים למקום, מוסיפים תפריט ותתי־עמודים
        </div>
      </div>
    </StageShell>
  );
}

function SeoStage() {
  return (
    <StageShell title="פאנל ה־SEO" meta="לכל עמוד בנפרד">
      <div className="wbx-seo">
        <ProgressRing value={92} label="SEO" size={128} />
        <ul className="wbx-seo__controls">
          {seoControls.map((control) => (
            <li key={control}>
              <Check size={14} strokeWidth={3} aria-hidden="true" />
              {control}
            </li>
          ))}
        </ul>
      </div>

      <div className="wbx-seo__serp">
        <span className="wbx-seo__serp-url">
          studio-demo.sites.bizuply.com › services
        </span>
        <span className="wbx-seo__serp-title">
          סטודיו לעיצוב שיער בתל אביב | תורים אונליין
        </span>
        <span className="wbx-seo__serp-desc">
          מחירון מלא, גלריית עבודות וזימון תור בלחיצה. פתוח ראשון–שישי, חניה
          בשפע.
        </span>
      </div>

      <div className="wbx-schema">
        {schemaTypes.map((type) => (
          <span key={type}>{type}</span>
        ))}
      </div>
    </StageShell>
  );
}

function PublishStage() {
  return (
    <StageShell title="פרסום וחיבור דומיין" meta="כתובת משלכם">
      <div className="wbx-publish">
        <div className="wbx-publish__url">
          <BadgeCheck size={17} color="#059669" aria-hidden="true" />
          <b>studio-demo.sites.bizuply.com</b>
          <em>באוויר</em>
        </div>

        <div className="wbx-publish__domain">
          <div className="wbx-publish__search">
            <Search size={14} aria-hidden="true" />
            studio-demo
          </div>
          <ul className="wbx-publish__results">
            <li className="is-free">
              <span>studio-demo.co.il</span>
              <em>פנוי · לרכישה</em>
            </li>
            <li className="is-free">
              <span>studio-demo.com</span>
              <em>פנוי · לרכישה</em>
            </li>
            <li className="is-taken">
              <span>studio-demo.net</span>
              <em>תפוס</em>
            </li>
          </ul>
        </div>

        <div className="wbx-wizard__result">
          <Globe size={16} aria-hidden="true" />
          רוכשים דומיין מתוך המערכת ומחברים אותו לאתר — או מחברים דומיין קיים
        </div>
      </div>
    </StageShell>
  );
}

const ITEMS: ShowcaseItem[] = [
  {
    id: "templates",
    icon: LayoutTemplate,
    title: "205 תבניות שנבנו לפי תחומים",
    text: "כל תבנית מגיעה עם עמודים מוכנים, פלטת צבעים ותוכן לדוגמה בעברית — חנויות, דפי נחיתה, יופי, מסעדות, נדל״ן, פורטפוליו, קורסים ותיירות.",
    accent: "#e11d8c",
    render: () => <TemplatesStage />,
  },
  {
    id: "ai",
    icon: Wand2,
    title: "בנייה עם AI בארבעה שלבים",
    text: "עונים על כמה שאלות על העסק, הסגנון והעמודים — ומקבלים טיוטת אתר מלאה עם תוכן מותאם שנפתחת מיד בעורך.",
    accent: "#7c3aed",
    render: () => <WizardStage />,
  },
  {
    id: "library",
    icon: Library,
    title: "ספריית סקשנים ועמודים",
    text: "140 עמודים מוכנים וקטלוג סקשנים לפי קטגוריה, פאנל שכבות עם גרירה, בונה טפסים, ספריית מדיה עם חיפוש תמונות — והכל בתוך העורך.",
    accent: "#4f46e5",
    render: () => <LibraryStage />,
  },
  {
    id: "seo",
    icon: Search,
    title: "SEO ברמת עמוד, לא ברמת סיסמה",
    text: "לכל עמוד יש כותרת, תיאור, canonical, הנחיות robots, תצוגת שיתוף, hreflang ו־JSON‑LD. ה־sitemap וה־robots.txt נבנים אוטומטית לאתר שפורסם.",
    accent: "#0891b2",
    render: () => <SeoStage />,
  },
  {
    id: "publish",
    icon: Globe,
    title: "פרסום, דומיין ושיתוף",
    text: "כל אתר מקבל כתובת תחת sites.bizuply.com. אפשר לרכוש דומיין מתוך המערכת, לחבר אותו לאתר, להזמין מעצב בהרשאת עריכה או להעביר בעלות.",
    accent: "#059669",
    render: () => <PublishStage />,
  },
];

export default function WebsiteCapabilityShowcase() {
  const reduceMotion = useReducedMotion();
  return (
    <StickyShowcase items={ITEMS} interval={reduceMotion ? 999999 : 6800} />
  );
}
