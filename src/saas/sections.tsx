import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { checkCountryAvailability, submitSaasLead } from "./api";
import { GhostButton, MixedText, PrimaryButton, Reveal, useSaasLocale } from "./chrome";
import SaasScreenMock from "./SaasScreenMock";
import {
  demoTarget,
  formatUsd,
  isSaasModel,
  partnerEntryUsd,
  SAAS_MODELS,
  type SaasModelId,
  type SaasProduct,
} from "./logic";

export type LeadSeed = {
  slug: string;
  model: SaasModelId;
  ctaSource: string;
  country?: string;
};

export function useStory(product: SaasProduct) {
  const { t } = useSaasLocale();
  const base = `saasMarket.products.${product.slug}`;
  const features = t(`${base}.features`, { returnObjects: true, defaultValue: product.features || [] });
  const useCases = t(`${base}.useCases`, { returnObjects: true, defaultValue: [] });
  return {
    headline: t(`${base}.headline`, { defaultValue: product.headline }),
    subtitle: t(`${base}.subtitle`, { defaultValue: product.subtitle }),
    short: t(`${base}.short`, { defaultValue: product.shortDescription }),
    full: t(`${base}.full`, { defaultValue: product.fullDescription }),
    why: t(`${base}.why`, { defaultValue: "" }),
    seoTitle: t(`${base}.seoTitle`, { defaultValue: product.seoTitle || product.name }),
    seoDescription: t(`${base}.seoDescription`, { defaultValue: product.seoDescription || product.shortDescription }),
    features: Array.isArray(features) ? (features as string[]) : product.features || [],
    useCases: Array.isArray(useCases) ? (useCases as string[]) : [],
  };
}

export function screenLabel(key: string, fallback: string, t: (key: string, opts?: object) => string) {
  return t(`saasMarket.screens.${key}`, { defaultValue: fallback || key });
}

export function PlatformCard({
  product,
  onDemo,
  onModel,
}: {
  product: SaasProduct;
  onDemo: (product: SaasProduct) => void;
  onModel: (product: SaasProduct) => void;
}) {
  const { t } = useSaasLocale();
  const story = useStory(product);
  const entry = formatUsd(partnerEntryUsd(product.priceUsd));
  const live = demoTarget(product);
  return (
    <article className="saas-card saas-glass flex flex-col overflow-hidden rounded-[32px]">
      <div className="relative h-64 bg-slate-50">
        <SaasScreenMock
          framed={false}
          caption={t("saasMarket.previewCaption")}
          screen={{ key: "dashboard", label: t("saasMarket.screens.dashboard"), imageUrl: product.mainImageUrl }}
          accent={product.accent}
          accentSecondary={product.accentSecondary}
          productName={product.name}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d4aff]">
          {t(`saasMarket.categories.${product.category}`, { defaultValue: product.categoryLabel })}
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-tight">{product.name}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{story.short}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.badge ? (
            <Pill>{t(`saasMarket.badges.${product.badge}`, { defaultValue: product.badge })}</Pill>
          ) : null}
          <Pill>{t("saasMarket.platforms.demoBadge")}</Pill>
          <Pill>{t("saasMarket.platforms.whiteLabelBadge")}</Pill>
          <Pill>{t("saasMarket.platforms.partnerBadge")}</Pill>
          <Pill>{t("saasMarket.platforms.countryBadge")}</Pill>
        </div>
        <p className="mt-5 text-lg font-black text-slate-950">
          {t("saasMarket.platforms.entryLabel", { amount: entry })}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{t("saasMarket.platforms.entryNote")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={`/saas/${product.slug}`} className="rounded-full bg-[#24124d] px-4 py-2 text-sm font-black text-white">
            {t("saasMarket.platforms.viewDetails")}
          </Link>
          {live.external ? (
            <a href={live.href} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-800 ring-1 ring-slate-200">
              {t("saasMarket.platforms.liveDemo")}
            </a>
          ) : (
            <button type="button" onClick={() => onDemo(product)} className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-800 ring-1 ring-slate-200">
              {t("saasMarket.platforms.preview")}
            </button>
          )}
          <button type="button" onClick={() => onModel(product)} className="rounded-full px-4 py-2 text-sm font-black text-[#5b3df5]">
            {t("saasMarket.platforms.chooseModel")}
          </button>
        </div>
      </div>
    </article>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">{children}</span>;
}

export function ModelBoard({
  onApply,
}: {
  onApply: (model: SaasModelId, cta: string) => void;
}) {
  const { t } = useSaasLocale();
  const [selected, setSelected] = useState<SaasModelId>("partner");
  const cards: { id: SaasModelId; key: "partner" | "license" | "exclusive"; cta: string }[] = [
    { id: "partner", key: "partner", cta: "apply_partnership" },
    { id: "white_label", key: "license", cta: "request_license" },
    { id: "exclusive_country", key: "exclusive", cta: "check_country" },
  ];
  const rows = t("saasMarket.models.rows", { returnObjects: true }) as { label: string; partner: string; license: string; exclusive: string }[];
  return (
    <section id="models" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.models.eyebrow")}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{t("saasMarket.models.title")}</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t("saasMarket.models.intro")}</p>
      </Reveal>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const on = selected === card.id;
          const points = t(`saasMarket.models.${card.key}.points`, { returnObjects: true }) as string[];
          return (
            <article key={card.id} className={`saas-model saas-glass rounded-[28px] p-5 ${on ? "is-on" : ""}`}>
              <button type="button" className="w-full text-start" onClick={() => setSelected(card.id)}>
                <h3 className="text-xl font-black">{t(`saasMarket.models.${card.key}.name`)}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{t(`saasMarket.models.${card.key}.summary`)}</p>
              </button>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-700">
                {(Array.isArray(points) ? points : []).map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6d4aff]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                {card.id === "exclusive_country" ? (
                  <GhostButton href="#exclusive">{t(`saasMarket.models.${card.key}.cta`)}</GhostButton>
                ) : (
                  <PrimaryButton onClick={() => onApply(card.id, card.cta)}>{t(`saasMarket.models.${card.key}.cta`)}</PrimaryButton>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="saas-glass mt-6 overflow-hidden rounded-[28px]">
        <table className="w-full text-start text-sm">
          <tbody>
            {Array.isArray(rows)
              ? rows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100">
                    <th className="px-4 py-3 font-black">{row.label}</th>
                    <td className={`px-4 py-3 font-semibold ${selected === "partner" ? "bg-violet-50" : ""}`}>{row.partner}</td>
                    <td className={`px-4 py-3 font-semibold ${selected === "white_label" ? "bg-violet-50" : ""}`}>{row.license}</td>
                    <td className={`px-4 py-3 font-semibold ${selected === "exclusive_country" ? "bg-violet-50" : ""}`}>{row.exclusive}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs font-semibold leading-5 text-slate-500">{t("saasMarket.models.disclaimer")}</p>
    </section>
  );
}

export function FaqList({ wide = false }: { wide?: boolean }) {
  const { t } = useSaasLocale();
  const items = t("saasMarket.faq.items", { returnObjects: true }) as { q: string; a: string }[];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className={wide ? "saas-band saas-band-paper" : "mx-auto max-w-3xl px-4 py-16 sm:px-6"}>
      <div className={wide ? "saas-wrap" : ""}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.faq.eyebrow")}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
          <MixedText value={t("saasMarket.faq.title")} />
        </h2>
        <div className={wide ? "mt-8 grid gap-3 lg:grid-cols-2" : "mt-6 space-y-3"}>
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.q} className="saas-glass rounded-3xl">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-black"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <MixedText value={item.q} />
                  <span className="text-[#6d4aff]">{expanded ? "–" : "+"}</span>
                </button>
                {expanded ? (
                  <p className="px-5 pb-5 text-sm font-semibold leading-7 text-slate-600">
                    <MixedText value={item.a} />
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CountryCheck({
  products,
  initialSlug,
  onRequest,
}: {
  products: SaasProduct[];
  initialSlug?: string;
  onRequest: (seed: LeadSeed) => void;
}) {
  const { t } = useSaasLocale();
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
    <section id="exclusive" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="saas-glass grid gap-8 rounded-[32px] p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6d4aff]">{t("saasMarket.exclusive.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">{t("saasMarket.exclusive.title")}</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{t("saasMarket.exclusive.body")}</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">{t("saasMarket.exclusive.note")}</p>
        </div>
        <form onSubmit={onCheck} className="space-y-3">
          <label className="block text-sm font-bold">
            {t("saasMarket.exclusive.platform")}
            <select value={selectedSlug} onChange={(event) => setSlug(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3">
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>{product.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold">
            {t("saasMarket.exclusive.country")}
            <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3" />
          </label>
          <PrimaryButton type="submit">{busy ? t("saasMarket.exclusive.checking") : t("saasMarket.exclusive.check")}</PrimaryButton>
          {notice ? <p className="text-sm font-bold text-rose-600">{notice}</p> : null}
          {result === "review" ? (
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="font-black">{t("saasMarket.exclusive.reviewTitle")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {t("saasMarket.exclusive.reviewBody", { platform: platformName, country: country.trim() })}
              </p>
              <div className="mt-3">
                <GhostButton onClick={() => onRequest({ slug: selectedSlug, model: "exclusive_country", ctaSource: "check_country", country: country.trim() })}>
                  {t("saasMarket.exclusive.request")}
                </GhostButton>
              </div>
            </div>
          ) : null}
          {result === "assigned" ? (
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="font-black">{t("saasMarket.exclusive.assignedTitle")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                {t("saasMarket.exclusive.assignedBody", { platform: platformName, country: country.trim() })}
              </p>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}

export function DemoTheater({
  product,
  onClose,
}: {
  product: SaasProduct | null;
  onClose: () => void;
}) {
  const { t } = useSaasLocale();
  const [active, setActive] = useState(0);
  if (!product) return null;
  const screens = product.screenshots?.length
    ? product.screenshots
    : [{ key: "dashboard", label: "Dashboard", imageUrl: product.mainImageUrl || "" }];
  const current = screens[Math.min(active, screens.length - 1)];
  const live = demoTarget(product);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" role="dialog" aria-modal="true">
      <div className="saas-glass max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[28px] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6d4aff]">{product.name}</p>
            <h3 className="text-2xl font-black">{t("saasMarket.galleryTitle")}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{t("saasMarket.previewNote")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white px-3 py-2 text-sm font-black">
            {t("saasMarket.form.close")}
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-[24px]">
          <SaasScreenMock
            caption={t("saasMarket.previewCaption")}
            screen={{ ...current, label: screenLabel(current.key, current.label, t) }}
            accent={product.accent}
            accentSecondary={product.accentSecondary}
            productName={product.name}
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {screens.map((screen, index) => (
            <button
              key={`${screen.key}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${index === active ? "bg-[#24124d] text-white" : "bg-white text-slate-700"}`}
            >
              {screenLabel(screen.key, screen.label, t)}
            </button>
          ))}
        </div>
        {live.external ? (
          <a href={live.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-[#24124d] px-4 py-2 text-sm font-black text-white">
            {t("saasMarket.product.demo")}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function LeadForm({
  seed,
  products,
  onClose,
}: {
  seed: LeadSeed;
  products: SaasProduct[];
  onClose: () => void;
}) {
  const { t } = useSaasLocale();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(seed.country || "");
  const [slug, setSlug] = useState(seed.slug);
  const [model, setModel] = useState(seed.model);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await submitSaasLead({
        slug,
        name,
        businessName,
        email,
        phone,
        country,
        model,
        ctaSource: seed.ctaSource,
        message,
        pageUrl: window.location.href,
      });
      setDone(true);
    } catch {
      setError(t("saasMarket.form.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" role="dialog" aria-modal="true">
      <form onSubmit={onSubmit} className="saas-glass max-h-[92vh] w-full max-w-xl overflow-auto rounded-[28px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black">{t("saasMarket.form.title")}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{t("saasMarket.form.subtitle")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white px-3 py-2 text-sm font-black">
            {t("saasMarket.form.close")}
          </button>
        </div>
        {done ? <p className="mt-6 font-bold text-emerald-700">{t("saasMarket.form.success")}</p> : (
          <div className="mt-4 grid gap-3">
            <Field label={t("saasMarket.form.name")} value={name} onChange={setName} />
            <Field label={t("saasMarket.form.business")} value={businessName} onChange={setBusinessName} />
            <Field label={t("saasMarket.form.email")} value={email} onChange={setEmail} type="email" />
            <Field label={t("saasMarket.form.phone")} value={phone} onChange={setPhone} />
            <Field label={t("saasMarket.form.country")} value={country} onChange={setCountry} />
            <label className="text-sm font-bold">
              {t("saasMarket.form.platform")}
              <select value={slug} onChange={(event) => setSlug(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3">
                {products.map((product) => (
                  <option key={product.slug} value={product.slug}>{product.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              {t("saasMarket.form.model")}
              <select value={model} onChange={(event) => setModel(isSaasModel(event.target.value) ? event.target.value : "partner")} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3">
                {SAAS_MODELS.map((id) => (
                  <option key={id} value={id}>{t(`saasMarket.form.models.${id}`)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              {t("saasMarket.form.message")}
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-1 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3" />
            </label>
            {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}
            <PrimaryButton type="submit">{busy ? t("saasMarket.form.sending") : t("saasMarket.form.submit")}</PrimaryButton>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3" />
    </label>
  );
}

export function LeadDialog({
  seed,
  products,
  onClose,
}: {
  seed: LeadSeed | null;
  products: SaasProduct[];
  onClose: () => void;
}) {
  if (!seed) return null;
  return <LeadForm key={`${seed.slug}-${seed.model}-${seed.ctaSource}-${seed.country || ""}`} seed={seed} products={products} onClose={onClose} />;
}

export function IncludedGrid() {
  const { t } = useSaasLocale();
  const items = t("saasMarket.included", { returnObjects: true }) as string[];
  const ownership = t("saasMarket.ownership", { returnObjects: true }) as string[];
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2">
      <div className="saas-glass rounded-[32px] p-6">
        <h2 className="text-2xl font-black">{t("saasMarket.includedTitle")}</h2>
        <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="saas-glass rounded-[32px] p-6">
        <h2 className="text-2xl font-black">{t("saasMarket.ownershipTitle")}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-slate-700">
          {ownership.map((item) => (
            <li key={item} className="rounded-2xl bg-white px-3 py-3">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function messageFor(t: (key: string, opts?: object) => string, platform: string, model?: string) {
  if (model) {
    return t("saasMarket.whatsapp.prefill", {
      model: t(`saasMarket.form.models.${model}`),
      platform,
    });
  }
  return t("saasMarket.whatsapp.prefillGeneric", { platform });
}
