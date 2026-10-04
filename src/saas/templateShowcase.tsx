import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cardFilm, isPublicDemoUrl, templateShots, type SaasProduct, type SaasScreenshot } from "./logic";
import { useSaasLocale } from "./chrome";

const GALLERY_ORDER = [
  "dashboard",
  "marketplace",
  "properties",
  "customers",
  "admin",
  "leads",
  "enquiry",
  "reports",
  "mobile",
  "settings",
  "jobs",
  "services",
  "search",
  "property",
  "investor",
];

export function CardFilm({ product }: { product: SaasProduct }) {
  const frames = cardFilm(product);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (reduce || !hover || frames.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % frames.length), 1400);
    return () => window.clearInterval(timer);
  }, [frames.length, hover, reduce]);
  if (!frames.length) return null;
  const frame = frames[index] || frames[0];
  return (
    <div
      className="saas-film"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setIndex(0);
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={frame.imageUrl}
          src={frame.imageUrl}
          alt={frame.label || product.name}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      </AnimatePresence>
      {frames.length > 1 ? (
        <div className="saas-film-dots" aria-hidden="true">
          {frames.map((item, dot) => (
            <i key={item.imageUrl} className={dot === index ? "is-on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PreviewTabs({ product }: { product: SaasProduct }) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const shots = templateShots(product);
  const tabs: { id: string; label: string }[] = [];
  for (const shot of shots) {
    const id = shot.tab || shot.key || shot.label;
    if (!id || tabs.some((tab) => tab.id === id)) continue;
    tabs.push({ id, label: shot.label || id });
  }
  const [active, setActive] = useState(tabs[0]?.id || "");
  if (!tabs.length) return null;
  const current = shots.find((shot) => (shot.tab || shot.key) === active) || shots[0];
  return (
    <section className="saas-showcase-block" id="preview">
      <p className="saas-kicker">{t("saasMarket.showcase.previewEyebrow")}</p>
      <h2 className="saas-title">{t("saasMarket.showcase.previewTitle")}</h2>
      <div className="saas-preview-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            className={tab.id === active ? "is-on" : ""}
            onClick={() => setActive(tab.id)}
          >
            {t(`saasMarket.screens.${tab.id}`, { defaultValue: tab.label })}
          </button>
        ))}
      </div>
      <div className="saas-preview-frame">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.imageUrl}
            src={current.imageUrl}
            alt={current.caption || current.label}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>
      </div>
      {current.caption ? <p className="saas-showcase-caption">{current.caption}</p> : null}
    </section>
  );
}

export function AudiencePreview({
  product,
  audience,
  title,
  body,
}: {
  product: SaasProduct;
  audience: "admin" | "customer";
  title: string;
  body?: string;
}) {
  const { t } = useSaasLocale();
  const shot =
    templateShots(product).find((item) => item.audience === audience) ||
    (audience === "customer"
      ? templateShots(product).find((item) => item.key === "marketplace")
      : templateShots(product).find((item) => item.key === "leads" || item.key === "admin"));
  if (!shot?.imageUrl) return null;
  return (
    <section className="saas-showcase-block" id={audience === "customer" ? "public-preview" : "admin-preview"}>
      <p className="saas-kicker">
        {audience === "customer" ? t("saasMarket.showcase.publicPreviewTitle") : t("saasMarket.showcase.adminPreviewTitle")}
      </p>
      <h2 className="saas-title">{title}</h2>
      {body ? <p className="saas-lead">{body}</p> : null}
      <div className="saas-preview-frame saas-audience-frame">
        <img src={shot.imageUrl} alt={shot.caption || shot.label} />
      </div>
    </section>
  );
}

export function ScreenshotGallery({ product }: { product: SaasProduct }) {
  const { t } = useSaasLocale();
  const shots = templateShots(product);
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  if (!shots.length) return null;
  const groups = GALLERY_ORDER.filter((key) => shots.some((shot) => shot.gallery === key));
  const current = shots[Math.min(active, shots.length - 1)];
  return (
    <section className="saas-showcase-block" id="gallery">
      <p className="saas-kicker">{t("saasMarket.showcase.galleryEyebrow")}</p>
      <h2 className="saas-title">{t("saasMarket.showcase.galleryTitle")}</h2>
      <div className="saas-gallery-stage">
        <button type="button" className="saas-gallery-open" onClick={() => setOpen(active)}>
          <img src={current.imageUrl} alt={current.caption || current.label} />
        </button>
        <div className="saas-gallery-thumbs">
          {shots.map((shot, index) => (
            <button key={`${shot.key}-${index}`} type="button" className={index === active ? "is-on" : ""} onClick={() => setActive(index)}>
              <img src={shot.imageUrl} alt="" />
              <span>{t(`saasMarket.screens.${shot.key}`, { defaultValue: shot.label })}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="saas-gallery-groups">
        {groups.map((key) => (
          <div key={key}>
            <h3>{t(`saasMarket.screens.${key}`, { defaultValue: key })}</h3>
            <div className="saas-gallery-row">
              {shots
                .filter((shot) => shot.gallery === key)
                .map((shot) => {
                  const index = shots.indexOf(shot);
                  return (
                    <button key={`${shot.imageUrl}-${index}`} type="button" onClick={() => { setActive(index); setOpen(index); }}>
                      <img src={shot.imageUrl} alt={shot.caption || shot.label} />
                      <b>{t(`saasMarket.screens.${shot.key}`, { defaultValue: shot.label })}</b>
                      {shot.caption ? <span>{shot.caption}</span> : null}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {open != null ? <Lightbox shots={shots} index={open} onClose={() => setOpen(null)} onIndex={setOpen} /> : null}
    </section>
  );
}

function Lightbox({
  shots,
  index,
  onClose,
  onIndex,
}: {
  shots: SaasScreenshot[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const { t } = useSaasLocale();
  const shot = shots[index];
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndex((index + 1) % shots.length);
      if (event.key === "ArrowLeft") onIndex((index - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onIndex, shots.length]);
  if (!shot) return null;
  return (
    <div className="saas-lightbox" role="dialog" aria-modal="true">
      <button type="button" className="saas-lightbox-close" onClick={onClose}>
        {t("saasMarket.showcase.close")}
      </button>
      <img src={shot.imageUrl} alt={shot.caption || shot.label} />
      <p>{shot.caption || shot.label}</p>
      <div className="saas-gallery-thumbs">
        {shots.map((item, itemIndex) => (
          <button key={`${item.imageUrl}-light`} type="button" className={itemIndex === index ? "is-on" : ""} onClick={() => onIndex(itemIndex)}>
            <img src={item.imageUrl} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromoVideo({ url, poster, title }: { url?: string; poster?: string; title: string }) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const [engaged, setEngaged] = useState(false);
  if (!url) return null;
  return (
    <div className="saas-video">
      <video
        src={url}
        poster={isPublicDemoUrl(poster) ? poster : undefined}
        muted={!engaged}
        loop={!engaged}
        autoPlay={!reduce}
        playsInline
        controls={engaged}
      />
      {engaged ? null : (
        <button
          type="button"
          className="saas-video-play"
          onClick={(event) => {
            const video = event.currentTarget.parentElement?.querySelector("video");
            setEngaged(true);
            if (video) {
              video.muted = false;
              video.currentTime = 0;
              void video.play();
            }
          }}
        >
          {t("saasMarket.showcase.play")}
          <span>{title}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Compact iPhone-style device showcase.
 * Mobile screenshots are clipped inside a fixed aspect-ratio frame —
 * they never stretch the product page into an endlessly tall layout.
 * Swipe/carousel between 3–5 screens; content can scroll inside the frame.
 */
export function MobilePreview({ product }: { product: SaasProduct }) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const shots = (product.mobileScreenshots || [])
    .filter((shot) => isPublicDemoUrl(shot.imageUrl))
    .slice(0, 5);
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    if (reduce || shots.length < 2) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % shots.length), 4200);
    return () => window.clearInterval(timer);
  }, [reduce, shots.length]);

  if (!shots.length) return null;
  const current = shots[Math.min(index, shots.length - 1)]!;

  function go(delta: number) {
    setIndex((current) => (current + delta + shots.length) % shots.length);
  }

  return (
    <section className="saas-showcase-block saas-mobile-showcase" id="mobile">
      <p className="saas-kicker">{t("saasMarket.showcase.mobileTitle")}</p>
      <h2 className="saas-title">{t("saasMarket.showcase.mobileTitle")}</h2>
      <div className="saas-mobile-stage">
        <button type="button" className="saas-mobile-nav" aria-label="Previous" onClick={() => go(-1)}>
          ‹
        </button>
        <div
          className="saas-phone-device"
          onTouchStart={(event) => setTouchX(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            if (touchX == null) return;
            const x = event.changedTouches[0]?.clientX ?? touchX;
            const dx = x - touchX;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <div className="saas-phone-notch" aria-hidden="true" />
          <div className="saas-phone-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.imageUrl}
                className="saas-phone-scroll"
                initial={reduce ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -18 }}
                transition={{ duration: 0.28 }}
              >
                <img src={current.imageUrl} alt={current.caption || current.label} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="saas-phone-home" aria-hidden="true" />
        </div>
        <button type="button" className="saas-mobile-nav" aria-label="Next" onClick={() => go(1)}>
          ›
        </button>
      </div>
      <p className="saas-showcase-caption">{current.caption || current.label}</p>
      <div className="saas-mobile-dots" role="tablist" aria-label="Mobile screens">
        {shots.map((shot, i) => (
          <button
            key={shot.imageUrl}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? "is-on" : ""}
            onClick={() => setIndex(i)}
          >
            <span>{t(`saasMarket.screens.${shot.key}`, { defaultValue: shot.label })}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
