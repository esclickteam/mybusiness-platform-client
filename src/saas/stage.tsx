import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Compass,
  Globe2,
  Handshake,
  MonitorPlay,
  Palette,
  Play,
  Rocket,
  Store,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { checkCountryAvailability } from "./api";
import { MixedText, useSaasLocale } from "./chrome";
import {
  cardFilm,
  demoTarget,
  formatUsd,
  illustrativeMrr,
  isSaasTemplate,
  templateDemoLinks,
  type SaasModelId,
  type SaasProduct,
} from "./logic";
import { CardFilm } from "./templateShowcase";
import SaasScreenMock from "./SaasScreenMock";
import { useStory, type LeadSeed } from "./sections";

const EASE = [0.22, 1, 0.36, 1] as const;
const MRR_STEPS = [10, 50, 100];
const FLOAT_KEYS = ["dashboard", "customers", "calendar", "billing", "mobile"] as const;
const PREVIEW_KEYS = ["dashboard", "customers", "jobs", "billing", "admin"] as const;
const CHIP_ICONS: LucideIcon[] = [Rocket, BadgeCheck, Play, Handshake, Globe2];
const STEP_ICONS: LucideIcon[] = [Compass, MonitorPlay, Handshake, Palette, Store];

function rise(reduce: boolean | null, delay = 0) {
  if (reduce || typeof IntersectionObserver === "undefined") return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, delay, ease: EASE },
  };
}

function Shot({
  product,
  screenKey,
  label,
  framed = true,
}: {
  product: SaasProduct;
  screenKey: string;
  label: string;
  framed?: boolean;
}) {
  const { t } = useSaasLocale();
  const shot = product.screenshots?.find((item) => item.key === screenKey);
  return (
    <SaasScreenMock
      framed={framed}
      caption={t("saasMarket.previewCaption")}
      screen={{ key: screenKey, label, imageUrl: shot?.imageUrl || (screenKey === "dashboard" ? product.mainImageUrl : "") }}
      accent={product.accent}
      accentSecondary={product.accentSecondary}
      productName={product.name}
    />
  );
}

export function HeroStage({
  products,
  index,
  onSelect,
}: {
  products: SaasProduct[];
  index: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const product = products[index] || products[0];
  const floats = t("saasMarket.preview.floats", { returnObjects: true }) as string[];
  if (!product) {
    return <div className="saas-stage-empty" />;
  }
  const hotspotKeys = FLOAT_KEYS.slice(0, 3);
  return (
    <div className="saas-stage">
      <div className="saas-stage-frame">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.slug}
            className="saas-browser"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="saas-browser-bar">
              <span />
              <span />
              <span />
              <bdi dir="ltr">{product.name}</bdi>
            </div>
            <div className="saas-browser-clip">
              <Shot product={product} screenKey="dashboard" label={product.name} framed={false} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="saas-hotspots">
        {hotspotKeys.map((key, hotspotIndex) => (
          <button key={key} type="button" className={`saas-hotspot saas-hotspot-${hotspotIndex + 1}`}>
            <span className="saas-hotspot-dot" aria-hidden="true" />
            <span>
              <MixedText value={Array.isArray(floats) ? floats[hotspotIndex] || key : key} />
            </span>
            <span className="saas-hotspot-preview" aria-hidden="true">
              <Shot product={product} screenKey={key} label={product.name} framed={false} />
            </span>
          </button>
        ))}
      </div>
      <div className="saas-stage-switch" role="tablist">
        {products.map((item, itemIndex) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={itemIndex === index}
            className={itemIndex === index ? "is-on" : ""}
            onClick={() => onSelect(itemIndex)}
          >
            <i aria-hidden="true" />
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrustStrip() {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const chips = t("saasMarket.hero.chips", { returnObjects: true }) as string[];
  return (
    <div className="saas-trust">
      <div className="saas-wrap saas-trust-row">
        {(Array.isArray(chips) ? chips : []).map((chip, index) => {
          const Icon = CHIP_ICONS[index] || Rocket;
          return (
            <motion.div
              key={chip}
              className="saas-trust-item"
              {...rise(reduce, index * 0.05)}
            >
              <Icon aria-hidden="true" className={reduce ? "" : "saas-trust-icon"} />
              <MixedText value={chip} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function useCount(target: number, active: boolean) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!active || reduce) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 880);
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, reduce]);
  return reduce || !active ? target : value;
}

export function StorySection() {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const flow = t("saasMarket.story.flow", { returnObjects: true }) as string[];
  const flowItems = Array.isArray(flow) ? flow : [];
  const [step, setStep] = useState(0);
  const [flowStep, setFlowStep] = useState(0);
  const customers = MRR_STEPS[step];
  const amount = useCount(illustrativeMrr(customers, 99), true);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % MRR_STEPS.length), 2800);
    return () => window.clearInterval(timer);
  }, [reduce]);

  useEffect(() => {
    if (reduce || flowItems.length < 2) return;
    const timer = window.setInterval(() => setFlowStep((current) => (current + 1) % flowItems.length), 2400);
    return () => window.clearInterval(timer);
  }, [reduce, flowItems.length]);

  return (
    <section id="what-is-saas" className="saas-band saas-tone-white">
      <div className="saas-wrap saas-split">
        <motion.div {...rise(reduce)}>
          <p className="saas-kicker">{t("saasMarket.saas.eyebrow")}</p>
          <h2 className="saas-title">
            <MixedText value={t("saasMarket.saas.title")} />
          </h2>
          <p className="saas-lead">
            <MixedText value={t("saasMarket.saas.body")} />
          </p>
          <ol className="saas-flow">
            {flowItems.map((item, index) => (
              <li
                key={item}
                className={index === flowStep ? "is-live" : ""}
                onMouseEnter={() => setFlowStep(index)}
              >
                <span>{index + 1}</span>
                <MixedText value={item} />
              </li>
            ))}
          </ol>
        </motion.div>
        <motion.div className="saas-revenue" {...rise(reduce, 0.08)}>
          <p className="saas-kicker saas-kicker-dark">{t("saasMarket.why.eyebrow")}</p>
          <div className="saas-revenue-steps">
            {MRR_STEPS.map((count, index) => (
              <button key={count} type="button" className={index === step ? "is-on" : ""} onClick={() => setStep(index)}>
                {count}
              </button>
            ))}
          </div>
          <p className="saas-revenue-caption">
            <MixedText value={t("saasMarket.story.mrrCaption", { count: customers })} />
          </p>
          <p className="saas-revenue-figure" aria-live="polite">
            <bdi dir="ltr">{formatUsd(amount)} MRR</bdi>
          </p>
          <div className="saas-revenue-bars" aria-hidden="true">
            {MRR_STEPS.map((count, index) => (
              <span key={count} style={{ height: `${28 + index * 28}%` }} className={index === step ? "is-on" : ""} />
            ))}
          </div>
          <p className="saas-disclaimer">{t("saasMarket.story.disclaimer")}</p>
        </motion.div>
      </div>
    </section>
  );
}

export function WhySection() {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const points = t("saasMarket.why.points", { returnObjects: true }) as { title: string; text: string }[];
  return (
    <section id="why" className="saas-band saas-tone-lavender">
      <div className="saas-wrap">
        <motion.div {...rise(reduce)}>
          <p className="saas-kicker">{t("saasMarket.why.eyebrow")}</p>
          <h2 className="saas-title">
            <MixedText value={t("saasMarket.why.title")} />
          </h2>
          <p className="saas-lead">
            <MixedText value={t("saasMarket.why.intro")} />
          </p>
        </motion.div>
        <div className="saas-why">
          {(Array.isArray(points) ? points : []).map((point, index) => (
            <motion.article
              key={point.title}
              className={index === 0 ? "is-wide" : ""}
              whileHover={reduce ? undefined : { y: -4 }}
              {...rise(reduce, index * 0.05)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>
                <MixedText value={point.title} />
              </h3>
              <p>
                <MixedText value={point.text} />
              </p>
            </motion.article>
          ))}
        </div>
        <p className="saas-disclaimer">{t("saasMarket.story.disclaimer")}</p>
      </div>
    </section>
  );
}

export function ProductRow({
  product,
  flipped,
  index = 0,
  onDemo,
}: {
  product: SaasProduct;
  flipped: boolean;
  index?: number;
  onDemo: (product: SaasProduct) => void;
}) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const story = useStory(product);
  const live = demoTarget(product);
  const template = isSaasTemplate(product);
  const film = template ? cardFilm(product) : [];
  const demoLinks = template ? templateDemoLinks(product) : [];
  const badges = template
    ? [
        demoLinks.length ? t("saasMarket.platforms.interactiveDemo") : t("saasMarket.platforms.demoPreparing"),
        product.whiteLabel ? t("saasMarket.platforms.whiteLabelBadge") : "",
        product.partnerModel ? t("saasMarket.platforms.partnerBadge") : "",
        product.exclusiveCountry ? t("saasMarket.platforms.countryBadge") : "",
      ].filter(Boolean)
    : [
        t("saasMarket.platforms.demoBadge"),
        t("saasMarket.platforms.whiteLabelBadge"),
        t("saasMarket.platforms.partnerBadge"),
        t("saasMarket.platforms.countryBadge"),
      ];
  return (
    <motion.article
      className={`saas-row ${flipped ? "is-flip" : ""} ${film.length ? "has-film" : ""}`}
      whileHover={reduce ? undefined : { y: -4 }}
      {...rise(reduce, Math.min(index, 5) * 0.06)}
    >
      <div className="saas-row-shot">
        {film.length ? (
          <CardFilm product={product} />
        ) : template ? (
          <div className="saas-template-pending">
            <strong>{product.name}</strong>
          </div>
        ) : (
          <div className="saas-shot-fill">
            <Shot product={product} screenKey="dashboard" label={t("saasMarket.screens.dashboard")} framed={false} />
          </div>
        )}
      </div>
      <div className="saas-row-copy">
        <p className="saas-kicker">
          {t(`saasMarket.categories.${product.category}`, { defaultValue: product.categoryLabel })}
        </p>
        <h3>{product.name}</h3>
        <p dir="auto">{story.short}</p>
        <div className="saas-row-badges">
          {badges.map((badge) => (
            <span key={badge}>
              <MixedText value={badge} />
            </span>
          ))}
        </div>
        <div className="saas-row-actions">
          {template && demoLinks.length ? (
            <button type="button" className="is-primary" onClick={() => onDemo(product)}>
              {t("saasMarket.platforms.watchDemo")}
            </button>
          ) : null}
          {template ? (
            <Link to={`/saas/${product.slug}`}>{t("saasMarket.platforms.toSystem")}</Link>
          ) : (
            <Link to={`/saas/${product.slug}`}>{t("saasMarket.platforms.exploreNamed", { name: product.name })}</Link>
          )}
          {!template && !live.external ? (
            <button type="button" onClick={() => onDemo(product)}>
              {t("saasMarket.platforms.liveDemo")}
            </button>
          ) : null}
          {!template && live.external ? (
            <a href={live.href} target="_blank" rel="noreferrer">
              {t("saasMarket.platforms.liveDemo")}
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function PreviewDeck({
  product,
  onDemo,
}: {
  product: SaasProduct | undefined;
  onDemo: (product: SaasProduct) => void;
}) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const live = product ? demoTarget(product) : { href: "#platforms", external: false };
  if (!product) return null;
  const key = PREVIEW_KEYS[tab];
  return (
    <section className="saas-band saas-tone-white" id="preview">
      <div className="saas-wrap">
        <motion.div className="saas-preview-head" {...rise(reduce)}>
          <p className="saas-kicker">{t("saasMarket.preview.eyebrow")}</p>
          <h2 className="saas-title">
            <MixedText value={t("saasMarket.preview.title")} />
          </h2>
          <p className="saas-lead">
            <MixedText value={t("saasMarket.preview.subtitle")} />
          </p>
        </motion.div>
        <div className="saas-preview-tabs" role="tablist">
          {PREVIEW_KEYS.map((screenKey, index) => (
            <button
              key={screenKey}
              type="button"
              role="tab"
              aria-selected={index === tab}
              className={index === tab ? "is-on" : ""}
              onClick={() => setTab(index)}
            >
              {t(`saasMarket.screens.${screenKey}`)}
            </button>
          ))}
        </div>
        <div className="saas-preview-frame">
          <div className="saas-browser-bar">
            <span />
            <span />
            <span />
            <bdi dir="ltr">{product.name}</bdi>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${product.slug}-${key}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <Shot product={product} screenKey={key} label={t(`saasMarket.screens.${key}`)} framed={false} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="saas-preview-actions">
          {live.external ? (
            <a className="saas-btn" href={live.href} target="_blank" rel="noreferrer">
              {t("saasMarket.preview.openDemo")}
            </a>
          ) : (
            <button type="button" className="saas-btn" onClick={() => onDemo(product)}>
              {t("saasMarket.preview.openDemo")}
            </button>
          )}
          <div className="saas-stage-switch saas-stage-switch-light">
            <span>{product.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const MODEL_CARDS: { id: SaasModelId; key: "partner" | "license" | "exclusive"; cta: string }[] = [
  { id: "partner", key: "partner", cta: "apply_partnership" },
  { id: "white_label", key: "license", cta: "request_license" },
  { id: "exclusive_country", key: "exclusive", cta: "check_country" },
];

export function LaunchPicker({
  onApply,
}: {
  onApply: (model: SaasModelId, cta: string) => void;
}) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<SaasModelId>("partner");
  return (
    <section id="models" className="saas-band saas-tone-night">
      <div className="saas-wrap">
        <motion.div {...rise(reduce)}>
          <p className="saas-kicker saas-kicker-light">{t("saasMarket.models.eyebrow")}</p>
          <h2 className="saas-title saas-title-light">
            <MixedText value={t("saasMarket.models.title")} />
          </h2>
          <p className="saas-lead saas-lead-light">{t("saasMarket.models.intro")}</p>
        </motion.div>
        <div className={`saas-models is-${selected}`}>
          {MODEL_CARDS.map((card) => {
            const on = selected === card.id;
            const points = t(`saasMarket.models.${card.key}.points`, { returnObjects: true }) as string[];
            return (
              <motion.article
                key={card.id}
                className={`is-${card.id} ${on ? "is-on" : ""}`}
                whileHover={reduce ? undefined : { y: -4 }}
                {...rise(reduce, MODEL_CARDS.indexOf(card) * 0.08)}
              >
                <button type="button" className="saas-model-hit" onClick={() => setSelected(card.id)} aria-pressed={on}>
                  <h3>
                    <MixedText value={t(`saasMarket.models.${card.key}.name`)} />
                  </h3>
                  <p>{t(`saasMarket.models.${card.key}.summary`)}</p>
                </button>
                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div
                      key="detail"
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <ul>
                        {(Array.isArray(points) ? points : []).map((point) => (
                          <li key={point}>
                            <MixedText value={point} />
                          </li>
                        ))}
                      </ul>
                      {card.id === "exclusive_country" ? (
                        <a className="saas-btn" href="#exclusive">
                          {t(`saasMarket.models.${card.key}.cta`)}
                        </a>
                      ) : (
                        <button type="button" className="saas-btn" onClick={() => onApply(card.id, card.cta)}>
                          {t(`saasMarket.models.${card.key}.cta`)}
                        </button>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
        <p className="saas-disclaimer saas-disclaimer-light">{t("saasMarket.models.disclaimer")}</p>
      </div>
    </section>
  );
}

export function GlobeSection({
  products,
  initialSlug,
  onRequest,
}: {
  products: SaasProduct[];
  initialSlug?: string;
  onRequest: (seed: LeadSeed) => void;
}) {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const [slug, setSlug] = useState(initialSlug || "");
  const selectedSlug = slug || initialSlug || products[0]?.slug || "";
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<"" | "review" | "assigned">("");

  async function onCheck(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    setResult("");
    if (!selectedSlug) {
      setNotice(t("saasMarket.exclusive.pickPlatform"));
      return;
    }
    if (country.trim().length < 2) {
      setNotice(t("saasMarket.exclusive.needCountry"));
      return;
    }
    setBusy(true);
    try {
      const data = await checkCountryAvailability({ slug: selectedSlug, country: country.trim() });
      setResult(data.result === "assigned" ? "assigned" : "review");
    } catch {
      setNotice(t("saasMarket.form.error"));
    } finally {
      setBusy(false);
    }
  }

  const platformName = products.find((item) => item.slug === selectedSlug)?.name || selectedSlug;
  return (
    <section id="exclusive" className="saas-band saas-tone-aurora">
      <div className="saas-wrap saas-split saas-split-globe">
        <motion.div {...rise(reduce)}>
          <div className={`saas-globe ${reduce ? "is-still" : ""}`} aria-hidden="true">
            <span className="saas-globe-ring" />
            <span className="saas-globe-ring saas-globe-ring-b" />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </motion.div>
        <motion.div {...rise(reduce, 0.08)}>
          <p className="saas-kicker saas-kicker-light">{t("saasMarket.exclusive.eyebrow")}</p>
          <h2 className="saas-title saas-title-light">
            <MixedText value={t("saasMarket.exclusive.title")} />
          </h2>
          <p className="saas-lead saas-lead-light">{t("saasMarket.exclusive.body")}</p>
          <p className="saas-disclaimer saas-disclaimer-light">{t("saasMarket.exclusive.note")}</p>
          <form className="saas-check" onSubmit={onCheck}>
            <label>
              {t("saasMarket.exclusive.platform")}
              <select value={selectedSlug} onChange={(event) => setSlug(event.target.value)}>
                {products.map((product) => (
                  <option key={product.slug} value={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("saasMarket.exclusive.country")}
              <input value={country} onChange={(event) => setCountry(event.target.value)} />
            </label>
            <button type="submit" className="saas-btn">
              {busy ? t("saasMarket.exclusive.checking") : t("saasMarket.exclusive.check")}
            </button>
            {notice ? <p className="saas-check-note">{notice}</p> : null}
            {result === "review" ? (
              <div className="saas-check-result">
                <p className="font-black">{t("saasMarket.exclusive.reviewTitle")}</p>
                <p>{t("saasMarket.exclusive.reviewBody", { platform: platformName, country: country.trim() })}</p>
                <button
                  type="button"
                  className="saas-btn saas-btn-ghost"
                  onClick={() =>
                    onRequest({
                      slug: selectedSlug,
                      model: "exclusive_country",
                      ctaSource: "check_country",
                      country: country.trim(),
                    })
                  }
                >
                  {t("saasMarket.exclusive.request")}
                </button>
              </div>
            ) : null}
            {result === "assigned" ? (
              <div className="saas-check-result">
                <p className="font-black">{t("saasMarket.exclusive.assignedTitle")}</p>
                <p>{t("saasMarket.exclusive.assignedBody", { platform: platformName, country: country.trim() })}</p>
              </div>
            ) : null}
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export function PathTimeline() {
  const { t } = useSaasLocale();
  const reduce = useReducedMotion();
  const steps = t("saasMarket.how.steps", { returnObjects: true }) as { title: string; text: string }[];
  return (
    <section id="how" className="saas-band saas-tone-day">
      <div className="saas-wrap">
        <p className="saas-kicker">{t("saasMarket.how.eyebrow")}</p>
        <h2 className="saas-title">
          <MixedText value={t("saasMarket.how.title")} />
        </h2>
        <ol className="saas-timeline">
          {(Array.isArray(steps) ? steps : []).map((step, index) => {
            const Icon = STEP_ICONS[index] || Compass;
            return (
              <motion.li key={step.title} {...rise(reduce, index * 0.06)}>
                <Icon aria-hidden="true" />
                <span>{index + 1}</span>
                <h3>
                  <MixedText value={step.title} />
                </h3>
                <p>
                  <MixedText value={step.text} />
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
