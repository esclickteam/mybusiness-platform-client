import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";
import ProductTheater, { type TheaterFilm, type TheaterStep } from "./ProductTheater";
import films from "./theaterFilms.json";

const MEDIA = "/demo-media/home";
const FILM_VERSION = "t7";
const STEP_IDS = ["lead", "crm", "whatsapp", "task", "automation", "done"] as const;

type FilmKey = keyof typeof films;

function filmFor(key: FilmKey): TheaterFilm {
  const spec = films[key];
  return {
    src: `${MEDIA}/theater/${key}.mp4?v=${FILM_VERSION}`,
    poster: `${MEDIA}/theater/${key}.webp?v=${FILM_VERSION}`,
    width: spec.width,
    height: spec.height,
    duration: spec.duration,
    chapters: spec.chapters,
  };
}

function useReduced() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function Words({ text, hot = -1, delay = 0 }: { text: string; hot?: number; delay?: number }) {
  const words = String(text || "").split(" ").filter(Boolean);
  const reduced = useReduced();
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    if (reduced) {
      setMotionReady(false);
      return undefined;
    }
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setMotionReady(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [reduced, text]);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span
              className={motionReady ? "hx-word__in" : undefined}
              style={motionReady ? { animationDelay: `${delay + index * 70}ms` } : undefined}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

const NODES = [
  { to: "/crm", he: "CRM", en: "CRM", es: "CRM", pt: "CRM", ar: "CRM" },
  { to: "/whatsapp-api", he: "WhatsApp", en: "WhatsApp", es: "WhatsApp", pt: "WhatsApp", ar: "WhatsApp" },
  { to: "/automations", he: "אוטומציות", en: "Automations", es: "Automatizaciones", pt: "Automações", ar: "الأتمتة" },
  { to: "/meta-campaigns", he: "שיווק", en: "Marketing", es: "Marketing", pt: "Marketing", ar: "التسويق" },
  { to: "/appointments", he: "יומן ופגישות", en: "Calendar and meetings", es: "Calendario y reuniones", pt: "Agenda e reuniões", ar: "التقويم والاجتماعات" },
  { to: "/website-builder", he: "בניית אתרים", en: "Website builder", es: "Creador de sitios", pt: "Criador de sites", ar: "بناء المواقع" },
] as const;

export default function WorldHome() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const cine = cinematicFor(language);
  const hero = cine.hero;
  const dir = getTextDirection(language);
  const reduced = useReduced();
  const openRef = useRef<HTMLElement | null>(null);
  const connectRef = useRef<HTMLElement | null>(null);
  const lang = language.toLowerCase().startsWith("he") ? "he" : "en";
  const locale = language.toLowerCase().startsWith("he") ? "he"
    : language.toLowerCase().startsWith("es") ? "es"
    : language.toLowerCase().startsWith("pt") ? "pt"
    : language.toLowerCase().startsWith("ar") ? "ar"
    : "en";
  const hot = Math.max(0, String(hero.lineThree || "").trim().split(/\s+/).filter(Boolean).length - 1);
  const labels = (hero.processSteps || []) as [string, string][];
  const copy = (hero.processCopy || []) as [string, string][];
  const steps: TheaterStep[] = STEP_IDS.map((id, index) => ({
    id,
    label: labels[index]?.[1] || id,
    title: copy[index]?.[0] || "",
    body: copy[index]?.[1] || "",
  }));

  useEffect(() => {
    const open = openRef.current;
    const connect = connectRef.current;
    let frame = 0;
    const tick = () => {
      frame = 0;
      if (open && !reduced && window.matchMedia("(min-width: 861px)").matches) {
        const rect = open.getBoundingClientRect();
        const total = open.offsetHeight - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        open.style.setProperty("--p", progress.toFixed(4));
      } else if (open) {
        open.style.setProperty("--p", "0");
      }
      if (connect) {
        if (reduced) {
          connect.style.setProperty("--in", "1");
        } else {
          const rect = connect.getBoundingClientRect();
          const start = window.innerHeight * 0.92;
          const end = window.innerHeight * 0.4;
          const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
          connect.style.setProperty("--in", progress.toFixed(4));
        }
      }
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [reduced]);

  return (
    <div className="bz-world" dir={dir}>
      <a className="bz-skip" href="#how">{homeText(language, "דילוג לתוכן", "Skip to content")}</a>
      <section className="hx-hero" id="how" ref={openRef} data-bz-tone="paper" aria-labelledby="hx-hero-title">
        <div className="bz-open__pin">
          <div className="bz-sheet" aria-hidden="true" />
          <div className="bz-spec__copy">
            <p className="hx-hero-kicker">{hero.kicker}</p>
            <h1 className="hx-display" id="hx-hero-title">
              <span className="hx-line"><Words text={hero.lineOne} /></span>
              <span className="hx-line">
                <Words text={hero.lineTwo} />
                {hero.lineThree ? <> <Words text={hero.lineThree} hot={hot} delay={120} /></> : null}
              </span>
            </h1>
            <p className="hx-lead">{hero.lead1}</p>
            <div className="hx-actions">
              <Link className="hx-btn" to="/register"><span>{hero.start}</span></Link>
              <Link className="hx-btn hx-btn-line" to="/contact"><span>{hero.see}</span></Link>
            </div>
          </div>
          <div className="bz-spec__film">
            <span className="bz-spec__pink" aria-hidden="true" />
            <span className="bz-spec__yellow" aria-hidden="true" />
            <ProductTheater
              desktop={filmFor(`${lang}-desktop` as FilmKey)}
              mobile={filmFor(`${lang}-mobile` as FilmKey)}
              steps={steps}
              labels={{
                region: hero.processLabel || hero.stageAlt,
                play: hero.play,
                pause: hero.pause,
                prev: hero.prev,
                next: hero.next,
                step: hero.stepOf,
              }}
            />
          </div>
        </div>
      </section>

      <section className="bz-connect" ref={connectRef} data-bz-tone="paper" aria-labelledby="bz-connect-title">
        <div className="bz-connect__copy">
          <h2 id="bz-connect-title">
            <span>{homeText(language, "לא עוד מערכת לכל משימה.", "Not another system for every task.")}</span>
            <span>{homeText(language, "כל העסק שלכם מחובר.", "Your whole business, connected.")}</span>
          </h2>
          <p>
            {homeText(
              language,
              "מהפנייה הראשונה ועד המשך הטיפול בלקוח – כל המידע, התקשורת והפעולות העסקיות נמצאים בסביבת עבודה אחת.",
              "From the first enquiry through the next step with a customer, the information, the communication and the business actions sit in one workspace.",
            )}
          </p>
        </div>
        <div className="bz-orbit" aria-hidden="false">
          <svg className="bz-orbit__lines" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M50 50 C 50 32, 50 28, 50 18" />
            <path d="M50 50 C 64 46, 74 36, 82 28" />
            <path d="M50 50 C 66 54, 76 64, 84 74" />
            <path d="M50 50 C 50 66, 50 74, 50 86" />
            <path d="M50 50 C 36 56, 26 66, 18 76" />
            <path d="M50 50 C 34 44, 24 34, 16 24" />
          </svg>
          <span className="bz-orbit__hub">Bizuply</span>
          <span className="bz-orbit__dot" aria-hidden="true" />
          {NODES.map((node) => (
            <Link key={node.to} to={node.to} className="bz-orbit__node">
              {node[locale]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
