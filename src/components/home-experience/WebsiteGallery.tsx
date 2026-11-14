import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { useAuth } from "../../context/AuthContext";
import { homeText } from "./homeCopy";
import {
  GALLERY_FILTERS,
  GALLERY_SITES,
  galleryBuildPath,
  galleryDemoPath,
  galleryStageSrc,
  galleryThumbSrc,
  selectedAfterFilter,
  sitesForFilter,
  type GalleryFilter,
  type GallerySite,
} from "./websiteGallery";
import "./websiteGallery.css";

const FILTER_LABELS: Record<GalleryFilter, [string, string]> = {
  all: ["הכל", "All"],
  studio: ["סטודיו", "Studio"],
  style: ["אופנה ויופי", "Fashion & beauty"],
  property: ["נדל״ן", "Real estate"],
  business: ["עסקים", "Business"],
};

type AuthUser = {
  role?: string;
  businessId?: string;
  managedBusinessId?: string;
};

export default function WebsiteGallery() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const dir = getTextDirection(language);
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const auth = useAuth() as { user?: AuthUser | null } | null;
  const user = auth?.user;
  const businessId = user?.businessId || user?.managedBusinessId || "";

  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [selectedKey, setSelectedKey] = useState(() => {
    try {
      const saved = sessionStorage.getItem("bizuply-gallery-site") || "";
      if (GALLERY_SITES.some((site) => site.key === saved)) return saved;
    } catch {
      /* private mode */
    }
    return GALLERY_SITES[0].key;
  });
  const [underKey, setUnderKey] = useState<string | null>(null);
  const thumbs = useRef<HTMLDivElement | null>(null);
  const reduced = useRef(false);

  const visible = sitesForFilter(filter);
  const selected = visible.find((site) => site.key === selectedKey) || visible[0];

  useEffect(() => {
    try {
      sessionStorage.setItem("bizuply-gallery-site", selectedKey);
    } catch {
      /* private mode */
    }
  }, [selectedKey]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reduced.current = query.matches;
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const row = thumbs.current;
    const current = row?.querySelector<HTMLElement>("[aria-current='true']");
    if (!row || !current) return;
    const rowBox = row.getBoundingClientRect();
    const thumbBox = current.getBoundingClientRect();
    const visible = thumbBox.left >= rowBox.left - 1 && thumbBox.right <= rowBox.right + 1;
    if (visible) return;
    const delta = thumbBox.left - rowBox.left - (rowBox.width - thumbBox.width) / 2;
    row.scrollBy({ left: delta, behavior: reduced.current ? "auto" : "smooth" });
  }, [selected.key, filter]);

  const stage = (from: string, to: string) => {
    if (from === to) return;
    if (!reduced.current) setUnderKey(from);
    setSelectedKey(to);
  };

  const choose = (site: GallerySite) => stage(selected.key, site.key);

  const chooseFilter = (next: GalleryFilter) => {
    const nextKey = selectedAfterFilter(selected.key, next);
    stage(selected.key, nextKey);
    setFilter(next);
  };

  useEffect(() => {
    if (!underKey) return undefined;
    const timer = window.setTimeout(() => setUnderKey(null), 520);
    return () => window.clearTimeout(timer);
  }, [underKey, selected.key]);

  const step = (direction: 1 | -1) => {
    const index = visible.findIndex((site) => site.key === selected.key);
    const next = visible[(index + direction + visible.length) % visible.length];
    if (next) choose(next);
  };

  return (
    <section className="ht-products wg-section" id="websites" dir={dir} aria-labelledby="ht-sites-title">
      <div className="ht-wrap">
        <div className="wg-head">
          <div>
            <p className="ht-eyebrow">{text("גלריית האתרים", "Website gallery")}</p>
            <h2 id="ht-sites-title">{text("האתרים של Bizuply", "Websites by Bizuply")}</h2>
          </div>
          <div className="wg-filters" role="toolbar" aria-label={text("סינון לפי תחום", "Filter by field")}>
            {GALLERY_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "wg-chip is-on" : "wg-chip"}
                aria-pressed={item === filter}
                onClick={() => chooseFilter(item)}
              >
                {text(...FILTER_LABELS[item])}
              </button>
            ))}
          </div>
        </div>

        <div className="wg-layout">
          <div className="wg-copy">
            <p className="wg-showing">{text("מוצג כעת", "Now showing")}</p>
            <h3 className="wg-name">{selected.name}</h3>
            <p className="wg-cat">{text(selected.heCategory, selected.enCategory)}</p>
            <p className="wg-blurb">{text(selected.heText, selected.enText)}</p>
            <div className="wg-actions">
              <a
                className="wg-btn"
                href={galleryDemoPath(selected.key, language)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text("צפייה בדמו", "View demo")}
              </a>
              <Link className="wg-btn wg-btn-line" to={galleryBuildPath(selected.key, user?.role, businessId)}>
                {text("בניית אתר בסגנון הזה", "Build a site in this style")}
              </Link>
            </div>
          </div>

          <div className="wg-stage" aria-hidden="true">
            {underKey ? (
              <img className="wg-stage-photo is-under" src={galleryStageSrc(underKey, language)} alt="" width={960} height={600} />
            ) : null}
            <img
              key={selected.key}
              className={underKey ? "wg-stage-photo is-current" : "wg-stage-photo"}
              src={galleryStageSrc(selected.key, language)}
              alt=""
              width={960}
              height={600}
              decoding="async"
              fetchPriority={underKey ? "high" : "low"}
              onAnimationEnd={() => setUnderKey(null)}
            />
          </div>

          <div
            className="wg-thumbs"
            ref={thumbs}
            role="listbox"
            aria-label={text("בחירת אתר", "Choose a website")}
            aria-orientation="horizontal"
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const forward = dir === "rtl" ? event.key === "ArrowLeft" : event.key === "ArrowRight";
              step(forward ? 1 : -1);
            }}
          >
            {visible.map((site) => {
              const active = site.key === selected.key;
              return (
                <button
                  key={site.key}
                  type="button"
                  role="option"
                  className={active ? "wg-thumb is-on" : "wg-thumb"}
                  aria-selected={active}
                  aria-current={active ? "true" : undefined}
                  aria-label={`${site.name}, ${text(site.heCategory, site.enCategory)}`}
                  onClick={() => choose(site)}
                >
                  <img
                    src={galleryThumbSrc(site.key, language)}
                    alt=""
                    width={420}
                    height={262}
                    loading={active ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span>{site.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
