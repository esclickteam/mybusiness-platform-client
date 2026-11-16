import { useState } from "react";
import { Helmet } from "react-helmet-async";
import "./siteWindowSketches.css";

type Lang = "he" | "en";

const COPY = {
  he: {
    window: "בניית אתרים",
    edit: "עריכה",
    preview: "תצוגה",
    publish: "פרסום",
    treatments: "טיפולים",
    about: "אודות",
    line: "טיפוח שמרגיש אישי",
    cta: "קביעת תור",
    next: "הטיפולים",
    one: "טיפול פנים",
    two: "ייעוץ עור",
  },
  en: {
    window: "Website",
    edit: "Edit",
    preview: "Preview",
    publish: "Publish",
    treatments: "Treatments",
    about: "About",
    line: "Care that feels personal",
    cta: "Book a visit",
    next: "Treatments",
    one: "Facial care",
    two: "Skin consult",
  },
} as const;

function Website({ lang, scroll }: { lang: Lang; scroll: boolean }) {
  const copy = COPY[lang];
  return (
    <div className="sws-site">
      <div className="sws-editor">
        <b>Petaluxe</b>
        <span>{copy.edit}</span>
        <span className="is-on">{copy.preview}</span>
        <span>{copy.publish}</span>
      </div>
      <div className="sws-scroll">
        <nav className="sws-nav">
          <b>Petaluxe</b>
          <span>{copy.treatments}</span>
          <span>{copy.about}</span>
        </nav>
        <div className="sws-clip">
          <div className={scroll ? "sws-page is-scroll" : "sws-page"}>
            <div className="sws-hero">
              <div>
                <strong>{copy.line}</strong>
                <em>{copy.cta}</em>
              </div>
              <img src="/demo-direction/site-cleanser.webp?v=3" alt="" />
            </div>
            <section className="sws-next">
              <b>{copy.next}</b>
              <div className="sws-rows">
                <div className="sws-rows-track">
                  <p><span>{copy.one}</span><span dir="ltr">₪280</span></p>
                  <p><span>{copy.two}</span><span dir="ltr">₪160</span></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Window({ lang, scroll, label }: { lang: Lang; scroll: boolean; label: string }) {
  const copy = COPY[lang];
  return (
    <figure className="sws-figure" data-sketch={scroll ? "b" : "a"}>
      <figcaption>{label}</figcaption>
      <div className="sws-stage">
        <article className="sws-window">
          <header>
            <span className="sws-dots" aria-hidden="true"><i /><i /><i /></span>
            <strong>{copy.window}</strong>
          </header>
          <Website lang={lang} scroll={scroll} />
        </article>
      </div>
    </figure>
  );
}

export default function SiteWindowSketches() {
  const [lang, setLang] = useState<Lang>("he");
  const he = lang === "he";
  return (
    <main className="sws" lang={lang} dir={he ? "rtl" : "ltr"}>
      <Helmet>
        <title>סקיצות חלון בניית האתרים | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="sws-intro">
        <p>BizUply</p>
        <h1>שתי סקיצות לחלון בניית האתרים</h1>
        <p>החלון באותו גודל של הקרוסלה במובייל. שאר הכרטיסים, האנימציה ודף הבית לא השתנו.</p>
        <div>
          <button type="button" aria-pressed={he} onClick={() => setLang("he")}>עברית</button>
          <button type="button" aria-pressed={!he} onClick={() => setLang("en")}>English</button>
        </div>
      </header>
      <Window lang={lang} scroll={false} label="סקיצה A · אתר מלא עם Hero ברור" />
      <Window lang={lang} scroll label="סקיצה B · גלילה קצרה אל המקטע הבא" />
    </main>
  );
}
