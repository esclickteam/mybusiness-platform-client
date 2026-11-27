import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";
import ProductTheater, { type TheaterFilm, type TheaterStep } from "./ProductTheater";
import films from "./theaterFilms.json";
const ShowHome = lazy(() => import("./ShowHome"));

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

function Words({ text, hot = -1 }: { text: string; hot?: number }) {
  const words = String(text || "").split(" ").filter(Boolean);
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export default function WorldHome() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const cine = cinematicFor(language);
  const hero = cine.hero;
  const dir = getTextDirection(language);
  const reduced = useReduced();
  const lang = language.toLowerCase().startsWith("he") ? "he" : "en";
  const openRef = useRef<HTMLElement | null>(null);
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
    let frame = 0;
    const tick = () => {
      frame = 0;
      if (open && !reduced) {
        const rect = open.getBoundingClientRect();
        const total = open.offsetHeight - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        open.style.setProperty("--p", progress.toFixed(4));
      } else if (open) {
        open.style.setProperty("--p", "0");
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
            {hero.kicker ? <p className="hx-hero-kicker">{hero.kicker}</p> : null}
            <h1 className="hx-display" id="hx-hero-title">
              <span className="hx-line"><Words text={hero.lineOne} hot={hero.lineThree ? -1 : Math.max(0, String(hero.lineOne || "").trim().split(/\s+/).filter(Boolean).length - 1)} /></span>
              {hero.lineTwo || hero.lineThree ? (
                <span className="hx-line">
                  {hero.lineTwo ? <Words text={hero.lineTwo} /> : null}
                  {hero.lineThree ? <> <Words text={hero.lineThree} hot={hot} delay={120} /></> : null}
                </span>
              ) : null}
            </h1>
            {hero.sub ? <p className="hx-sub">{hero.sub}</p> : null}
            <p className="hx-lead">{hero.lead1}</p>
            <div className="hx-actions">
              <Link className="hx-btn" to="/register"><span>{hero.start}</span></Link>
              <Link className="hx-btn hx-btn-line" to="/contact"><span>{hero.see}</span></Link>
            </div>
          </div>
          <div className="bz-spec__film">
            <img className="bz-mark bz-mark--a" src="/brand/mark.png" alt="" width="778" height="953" />
            <img className="bz-mark bz-mark--b" src="/brand/mark.png" alt="" width="778" height="953" />
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

      <Suspense fallback={null}>
        <ShowHome language={language} />
      </Suspense>
    </div>
  );
}
