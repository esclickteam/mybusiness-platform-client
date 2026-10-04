import React, { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2 } from "lucide-react";
import API from "../../../../api";
import { getIntlLocale, getTextDirection } from "../../../../i18n/localeUtils";
import {
  calculateMetaQuote,
  OFFICIAL_RATE_CARD,
  selectableCountries,
} from "../../../../lib/metaWhatsappPricing/calculate";
import MenuSelect from "../../../public/MenuSelect";
import type {
  MessageCategory,
  MetaQuote,
  MetaRateCard,
  QuoteLineInput,
} from "../../../../lib/metaWhatsappPricing/types";

type Variant = "dashboard" | "public";

type UsagePoint = {
  country: string | null;
  category: MessageCategory | null;
  rawCategory: string | null;
  volume: number | null;
  cost: string | null;
};

type UsageView = {
  available: boolean;
  reason?: string | null;
  message?: string;
  currency?: string | null;
  period?: { startIso?: string; endIso?: string };
  points?: UsagePoint[];
  totalCost?: string | null;
  costComplete?: boolean;
};

type CardPayload = {
  success?: boolean;
  stale?: boolean;
  lastRefreshError?: string | null;
  card?: MetaRateCard;
};

const CATEGORIES: MessageCategory[] = [
  "marketing",
  "utility",
  "authentication",
  "service",
  "authentication_international",
];

const REGION_KEYS: Record<string, string> = {
  north_america: "regionNorthAmerica",
  rest_of_africa: "regionAfrica",
  rest_of_asia_pacific: "regionAsia",
  rest_of_central_and_eastern_europe: "regionCee",
  rest_of_latin_america: "regionLatam",
  rest_of_middle_east: "regionMe",
  rest_of_western_europe: "regionWe",
  other: "regionOther",
};

function preferCard(current: MetaRateCard, incoming?: MetaRateCard | null): MetaRateCard {
  if (!incoming || incoming.markets?.length !== 47 || !incoming.effectiveDate) return current;
  if (incoming.effectiveDate > current.effectiveDate) return incoming;
  if (
    incoming.effectiveDate === current.effectiveDate &&
    String(incoming.fetchedAt || "") > String(current.fetchedAt || "")
  ) {
    return incoming;
  }
  return current;
}

function defaultCountry(language: string): string {
  if (language.startsWith("he") || language.startsWith("ar")) return "IL";
  if (language.startsWith("es")) return "ES";
  if (language.toLowerCase().startsWith("pt")) return "BR";
  return "US";
}

function newLine(countryIso: string): QuoteLineInput {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    countryIso,
    category: "marketing",
    quantity: 1000,
    priorVolume: 0,
  };
}

function formatMoney(amount: string | null, currency: string, locale: string): string {
  if (amount == null) return "—";
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${amount} ${currency}`;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: value >= 100 ? 2 : 4,
    }).format(value);
  } catch {
    return `${amount} ${currency}`;
  }
}

function countryLabel(iso: string, fallback: string, locale: string, otherLabel: string): string {
  if (iso === "OTHER") return otherLabel;
  try {
    const name = new Intl.DisplayNames([locale], { type: "region" }).of(iso);
    if (name && name !== iso) return name;
  } catch {
    /* official English name remains */
  }
  return fallback;
}

export default function MetaCostCalculator({
  variant,
  businessId = null,
  connected = false,
}: {
  variant: Variant;
  businessId?: string | null;
  connected?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const dir = getTextDirection(i18n.language);
  const publicTheme = variant === "public";
  const searchId = useId();
  const [card, setCard] = useState<MetaRateCard>(OFFICIAL_RATE_CARD);
  const [cardNote, setCardNote] = useState<"bundled" | "live" | "failed">("bundled");
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [phoneNumbers, setPhoneNumbers] = useState(1);
  const [nonprofit, setNonprofit] = useState(false);
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<QuoteLineInput[]>(() => [
    newLine(defaultCountry(i18n.language)),
  ]);
  const [usage, setUsage] = useState<UsageView | null>(null);
  const [usageNotice, setUsageNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    const apply = (payload: CardPayload | null) => {
      if (cancelled || !payload?.card) {
        if (!cancelled && payload && payload.success === false) setCardNote("failed");
        return;
      }
      setCard((current) => preferCard(current, payload.card));
      setRefreshError(payload.lastRefreshError || null);
      setCardNote(payload.lastRefreshError ? "failed" : "live");
    };
    if (publicTheme) {
      fetch("/api/whatsapp/meta-pricing/card")
        .then((response) => (response.ok ? response.json() : null))
        .then((payload) => apply(payload))
        .catch(() => {
          if (!cancelled) setCardNote("bundled");
        });
    } else {
      API.get("/whatsapp/meta-pricing/card")
        .then((response) => apply(response.data))
        .catch(() => {
          if (!cancelled) setCardNote("bundled");
        });
    }
    return () => {
      cancelled = true;
    };
  }, [publicTheme]);

  useEffect(() => {
    if (publicTheme || !businessId) return undefined;
    let cancelled = false;
    API.get("/whatsapp/meta-pricing/usage", { params: { businessId } })
      .then((response) => {
        if (!cancelled) setUsage(response.data);
      })
      .catch(() => {
        if (!cancelled) {
          setUsage({
            available: false,
            reason: "PRICING_ANALYTICS_FAILED",
            points: [],
            totalCost: null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, publicTheme]);

  const countries = useMemo(() => selectableCountries(card), [card]);
  const visibleCountries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const selected = new Set(lines.map((line) => line.countryIso));
    if (!needle) return countries;
    return countries.filter((country) => {
      if (selected.has(country.iso)) return true;
      const label = countryLabel(country.iso, country.name, locale, t("whatsapp.metaCosts.otherCountry"));
      return (
        label.toLowerCase().includes(needle) ||
        country.name.toLowerCase().includes(needle) ||
        country.iso.toLowerCase().includes(needle) ||
        country.callingCode.includes(needle)
      );
    });
  }, [countries, lines, locale, query, t]);

  const quote: MetaQuote | null = useMemo(() => {
    try {
      return calculateMetaQuote(
        {
          currency,
          phoneNumbers,
          serviceFreeForEligibleOrganization: nonprofit,
          lines,
        },
        { card }
      );
    } catch {
      return null;
    }
  }, [card, currency, lines, nonprofit, phoneNumbers]);

  const blended = useMemo(() => {
    if (!quote) return null;
    const quantity = quote.lines.reduce((sum, line) => sum + line.quantity, 0);
    if (!quantity) return null;
    const value = Number(quote.metaMonthly);
    if (!Number.isFinite(value)) return null;
    return String(value / quantity);
  }, [quote]);

  async function refreshCard() {
    setRefreshing(true);
    setUsageNotice("");
    try {
      const response = await API.post("/whatsapp/meta-pricing/refresh");
      const payload = response.data as CardPayload;
      if (payload?.card) setCard((current) => preferCard(current, payload.card));
      setRefreshError(payload?.lastRefreshError || null);
      setCardNote(payload?.success ? "live" : "failed");
      setUsageNotice(payload?.success ? t("whatsapp.metaCosts.refreshOk") : "");
    } catch (error: unknown) {
      const payload = (error as { response?: { data?: CardPayload } })?.response?.data;
      if (payload?.card) setCard((current) => preferCard(current, payload.card));
      setRefreshError(payload?.lastRefreshError || t("whatsapp.metaCosts.refreshFailed"));
      setCardNote("failed");
    } finally {
      setRefreshing(false);
    }
  }

  function loadUsageIntoForecast() {
    const points = usage?.points || [];
    const next = points
      .filter((point) => point.category && point.volume && point.volume > 0)
      .map((point) => ({
        id: `${point.country || "OTHER"}-${point.category}`,
        countryIso: countries.some((country) => country.iso === point.country)
          ? String(point.country)
          : "OTHER",
        category: point.category as MessageCategory,
        quantity: Math.floor(point.volume || 0),
        priorVolume: 0,
      }));
    if (!next.length) return;
    setLines(next);
    setUsageNotice(t("whatsapp.metaCosts.usageLoaded"));
  }

  const box = publicTheme ? "wa-calc-box" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm";
  const alert = publicTheme
    ? "wa-calc-alert"
    : "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900";
  const label = publicTheme ? "wa-calc-label" : "mb-1 block text-xs font-bold text-slate-500";
  const field = publicTheme
    ? "wa-calc-field"
    : "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900";
  const muted = publicTheme ? "wa-calc-muted" : "text-xs font-medium text-slate-500";

  return (
    <div dir={dir} className={publicTheme ? "wa-calc" : "space-y-4"}>
      <div className={box}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={publicTheme ? "wa-eyebrow" : "text-xs font-black uppercase tracking-wide text-emerald-700"}>
              {t("whatsapp.metaCosts.forecast")}
            </p>
            <h2 className={publicTheme ? "" : "mt-1 text-xl font-black text-slate-900"}>
              {t("whatsapp.metaCosts.title")}
            </h2>
            <p className={publicTheme ? "wa-calc-lead" : "mt-1 max-w-3xl text-sm font-medium text-slate-600"}>
              {t("whatsapp.metaCosts.subtitle")}
            </p>
          </div>
          <div className={muted}>
            <div>
              {t("whatsapp.metaCosts.updated")}:{" "}
              <time dateTime={card.fetchedAt}>{new Date(card.fetchedAt).toLocaleDateString(locale)}</time>
            </div>
            <div>
              {t("whatsapp.metaCosts.effective")}:{" "}
              <time dateTime={card.effectiveDate}>{card.effectiveDate}</time>
            </div>
            <a href={card.sourceUrl} target="_blank" rel="noreferrer">
              {t("whatsapp.metaCosts.source")}
            </a>
          </div>
        </div>
        {quote?.stale ? <p className={alert}>{t("whatsapp.metaCosts.stale")}</p> : null}
        {refreshError || cardNote === "failed" ? (
          <p className={alert}>
            {publicTheme ? t("whatsapp.metaCosts.refreshFailed") : refreshError || t("whatsapp.metaCosts.refreshFailed")}
          </p>
        ) : null}
        {cardNote === "bundled" && !quote?.stale ? (
          <p className={muted}>{t("whatsapp.metaCosts.usingBundled")}</p>
        ) : null}
        {variant === "dashboard" ? (
          <button type="button" className={publicTheme ? "wa-btn wa-btn-ghost" : "mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"} onClick={refreshCard} disabled={refreshing}>
            {refreshing ? <Loader2 className="inline h-4 w-4 animate-spin" /> : null}{" "}
            {refreshing ? t("whatsapp.metaCosts.refreshing") : t("whatsapp.metaCosts.refresh")}
          </button>
        ) : null}
      </div>

      <div className={box}>
        <div className="grid gap-3 md:grid-cols-3">
          <label>
            <span className={label}>{t("whatsapp.metaCosts.currency")}</span>
            <MenuSelect
              theme={publicTheme ? "dark" : "light"}
              ariaLabel={t("whatsapp.metaCosts.currency")}
              value={currency}
              options={card.currencies.map((code) => ({ value: code, label: code }))}
              onChange={setCurrency}
            />
          </label>
          <label>
            <span className={label}>{t("whatsapp.metaCosts.phoneNumbers")}</span>
            <input
              className={field}
              type="number"
              min={1}
              step={1}
              value={phoneNumbers}
              onChange={(event) => setPhoneNumbers(Math.max(1, Math.floor(Number(event.target.value) || 1)))}
            />
            <span className={muted}>{t("whatsapp.metaCosts.phoneHint")}</span>
          </label>
          <label className="flex items-start gap-2 pt-6">
            <input
              type="checkbox"
              checked={nonprofit}
              onChange={(event) => setNonprofit(event.target.checked)}
            />
            <span>
              <span className={publicTheme ? "font-semibold" : "block text-sm font-bold text-slate-800"}>
                {t("whatsapp.metaCosts.nonprofit")}
              </span>
              <span className={muted}>{t("whatsapp.metaCosts.nonprofitHint")}</span>
            </span>
          </label>
        </div>
        <label className="mt-3 block">
          <span className={label} id={searchId}>{t("whatsapp.metaCosts.search")}</span>
          <input className={field} value={query} onChange={(event) => setQuery(event.target.value)} aria-labelledby={searchId} />
        </label>
      </div>

      <div className="space-y-3">
        {lines.map((line, index) => (
          <div key={line.id} className={box}>
            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto]">
              <label>
                <span className={label}>{t("whatsapp.metaCosts.country")}</span>
                <MenuSelect
                  theme={publicTheme ? "dark" : "light"}
                  ariaLabel={t("whatsapp.metaCosts.country")}
                  value={line.countryIso}
                  options={visibleCountries.map((country) => ({
                    value: country.iso,
                    label: `${countryLabel(country.iso, country.name, locale, t("whatsapp.metaCosts.otherCountry"))}${country.callingCode ? ` +${country.callingCode}` : ""}`,
                  }))}
                  onChange={(next) =>
                    setLines((current) =>
                      current.map((item) => (item.id === line.id ? { ...item, countryIso: next } : item))
                    )
                  }
                />
              </label>
              <label>
                <span className={label}>{t("whatsapp.metaCosts.category")}</span>
                <MenuSelect
                  theme={publicTheme ? "dark" : "light"}
                  ariaLabel={t("whatsapp.metaCosts.category")}
                  value={line.category}
                  options={CATEGORIES.map((category) => ({
                    value: category,
                    label: t(`whatsapp.metaCosts.cat_${category}`),
                  }))}
                  onChange={(next) =>
                    setLines((current) =>
                      current.map((item) =>
                        item.id === line.id ? { ...item, category: next as MessageCategory } : item
                      )
                    )
                  }
                />
              </label>
              <label>
                <span className={label}>{t("whatsapp.metaCosts.quantity")}</span>
                <input
                  className={field}
                  type="number"
                  min={0}
                  step={1}
                  value={line.quantity}
                  onChange={(event) =>
                    setLines((current) =>
                      current.map((item) =>
                        item.id === line.id
                          ? { ...item, quantity: Math.max(0, Math.floor(Number(event.target.value) || 0)) }
                          : item
                      )
                    )
                  }
                />
              </label>
              <label>
                <span className={label}>{t("whatsapp.metaCosts.priorVolume")}</span>
                <input
                  className={field}
                  type="number"
                  min={0}
                  step={1}
                  value={line.priorVolume || 0}
                  onChange={(event) =>
                    setLines((current) =>
                      current.map((item) =>
                        item.id === line.id
                          ? { ...item, priorVolume: Math.max(0, Math.floor(Number(event.target.value) || 0)) }
                          : item
                      )
                    )
                  }
                />
              </label>
              <button
                type="button"
                className={publicTheme ? "wa-calc-icon" : "self-end rounded-lg border border-slate-200 px-3 py-2 text-slate-500"}
                aria-label={t("whatsapp.metaCosts.removeLine")}
                disabled={lines.length === 1}
                onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))}
              >
                <Trash2 size={16} />
              </button>
            </div>
            {quote?.lines[index]?.status === "rate_unavailable" ? (
              <p className={alert}>{t("whatsapp.metaCosts.unavailableRate")}</p>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className={publicTheme ? "wa-btn wa-btn-ghost" : "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"}
          onClick={() => setLines((current) => [...current, newLine(current.at(-1)?.countryIso || "US")])}
        >
          <Plus size={16} /> {t("whatsapp.metaCosts.addLine")}
        </button>
      </div>

      {quote ? (
        <div className={box}>
          <p className={publicTheme ? "wa-eyebrow" : "text-xs font-black uppercase tracking-wide text-sky-700"}>
            {t("whatsapp.metaCosts.forecast")}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat publicTheme={publicTheme} label={t("whatsapp.metaCosts.perMessage")} value={formatMoney(blended, currency, locale)} />
            <Stat publicTheme={publicTheme} label={t("whatsapp.metaCosts.monthly")} value={formatMoney(quote.metaMonthly, currency, locale)} />
            <Stat publicTheme={publicTheme} label={t("whatsapp.metaCosts.yearly")} value={formatMoney(quote.metaYearly, currency, locale)} hint={t("whatsapp.metaCosts.yearlyHint")} />
            <Stat publicTheme={publicTheme} label={t("whatsapp.metaCosts.bizuply")} value={formatMoney(quote.bizuplyMonthlyUsd, "USD", locale)} hint={t("whatsapp.metaCosts.bizuplyHint")} />
          </div>
          <p className={`mt-3 ${muted}`}>
            {quote.combinedMonthlyUsd
              ? `${t("whatsapp.metaCosts.combined")}: ${formatMoney(quote.combinedMonthlyUsd, "USD", locale)} / ${formatMoney(quote.combinedYearlyUsd, "USD", locale)}. ${t("whatsapp.metaCosts.combinedHint")}`
              : t("whatsapp.metaCosts.combinedUnavailable")}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className={publicTheme ? "wa-calc-table" : "w-full min-w-[720px] text-sm"}>
              <thead>
                <tr className={publicTheme ? "" : "text-start text-xs uppercase text-slate-400"}>
                  {[
                    "country",
                    "market",
                    "category",
                    "quantity",
                    "free",
                    "listRate",
                    "perMessage",
                    "lineCost",
                  ].map((key) => (
                    <th key={key} className={publicTheme ? undefined : "px-2 py-2 text-start font-bold"}>
                      {t(`whatsapp.metaCosts.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quote.lines.map((line) => (
                  <tr key={line.id}>
                    {[
                      countryLabel(line.countryIso, line.countryName, locale, t("whatsapp.metaCosts.otherCountry")),
                      REGION_KEYS[line.marketId] ? t(`whatsapp.metaCosts.${REGION_KEYS[line.marketId]}`) : line.marketName,
                      t(`whatsapp.metaCosts.cat_${line.category}`),
                      line.quantity.toLocaleString(locale),
                      line.freeMessages.toLocaleString(locale),
                      line.listRate ? formatMoney(line.listRate, currency, locale) : "—",
                      line.averageRate ? formatMoney(line.averageRate, currency, locale) : "—",
                      line.status === "priced" ? formatMoney(line.monthlyCost, currency, locale) : "—",
                    ].map((cell, cellIndex) => (
                      <td key={`${line.id}-${cellIndex}`} className={publicTheme ? undefined : "border-t border-slate-100 px-2 py-2 font-semibold"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className={`mt-4 space-y-1 ${muted}`}>
            <li>{t("whatsapp.metaCosts.serviceNote")}</li>
            <li>{t("whatsapp.metaCosts.marketingNote")}</li>
            <li>{t("whatsapp.metaCosts.authNote")}</li>
            <li>{t("whatsapp.metaCosts.windowNote")}</li>
            <li>{t("whatsapp.metaCosts.priorHint")}</li>
          </ul>
        </div>
      ) : (
        <p className={alert}>{t("whatsapp.metaCosts.noLines")}</p>
      )}

      {variant === "dashboard" ? (
        <div className={box}>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
            {t("whatsapp.metaCosts.actual")}
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900">{t("whatsapp.metaCosts.actualTitle")}</h3>
          <p className={muted}>{t("whatsapp.metaCosts.actualHint")}</p>
          {!connected ? <p className="mt-2 text-sm font-semibold text-slate-600">{t("whatsapp.metaCosts.notConnected")}</p> : null}
          {usage?.available ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                {t("whatsapp.metaCosts.actualPeriod")}: {usage.period?.startIso?.slice(0, 10)} – {usage.period?.endIso?.slice(0, 10)}
              </p>
              {usage.totalCost != null ? (
                <p className="text-2xl font-black text-slate-900">
                  {formatMoney(usage.totalCost, usage.currency || currency, locale)}
                </p>
              ) : (
                <p className="text-sm font-semibold text-slate-600">{t("whatsapp.metaCosts.actualEmpty")}</p>
              )}
              {usage.costComplete === false ? (
                <p className={alert}>{t("whatsapp.metaCosts.actualPartial")}</p>
              ) : null}
              {(usage.points || []).length > 0 ? (
                <button type="button" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white" onClick={loadUsageIntoForecast}>
                  {t("whatsapp.metaCosts.loadUsage")}
                </button>
              ) : null}
            </div>
          ) : usage ? (
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {usage.reason === "NOT_CONNECTED"
                ? t("whatsapp.metaCosts.notConnected")
                : t("whatsapp.metaCosts.actualUnavailable")}
            </p>
          ) : null}
          {usageNotice ? <p className="mt-2 text-sm font-semibold text-emerald-700">{usageNotice}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  publicTheme,
}: {
  label: string;
  value: string;
  hint?: string;
  publicTheme: boolean;
}) {
  return (
    <div className={publicTheme ? "wa-calc-stat" : "rounded-xl bg-slate-50 p-3"}>
      <div className={publicTheme ? "wa-calc-muted" : "text-xs font-bold text-slate-500"}>{label}</div>
      <div className={publicTheme ? "wa-calc-stat-value" : "mt-1 text-xl font-black text-slate-900"} dir="ltr">{value}</div>
      {hint ? <div className={publicTheme ? "wa-calc-muted" : "mt-1 text-[11px] font-medium text-slate-500"}>{hint}</div> : null}
    </div>
  );
}
