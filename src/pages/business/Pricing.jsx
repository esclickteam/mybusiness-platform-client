import React, { useMemo, useState, startTransition, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Bot,
  CalendarCheck2,
  Check,
  ChevronLeft,
  ClipboardList,
  Globe,
  Handshake,
  Headset,
  Image as ImageIcon,
  Megaphone,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  PRICING_ADDONS,
  PRICING_CATEGORY_ACCENTS,
  PRICING_CATEGORY_LABELS,
  PRICING_CATEGORY_ORDER,
} from "../../data/pricingAddonsData";
import {
  PRICING_PACKAGES,
  WEBSITE_ADDON,
} from "../../data/pricingPackagesData";
import ServiceDetailModal from "../../components/pricing/ServiceDetailModal";
import { ScrollProgress } from "../../components/product-marketing";
import "../../components/product-marketing/marketingKit.css";
import "../../styles/PricingServices.css";

const ICON_MAP = {
  headset: Headset,
  "calendar-check": CalendarCheck2,
  handshake: Handshake,
  bot: Bot,
  sparkles: Sparkles,
  megaphone: Megaphone,
  message: MessageCircle,
  globe: Globe,
  "user-tie": UserRound,
  refresh: RefreshCw,
  clipboard: ClipboardList,
  settings: Settings2,
  image: ImageIcon,
};

function AddonIcon({ name, accent }) {
  const Icon = ICON_MAP[name] || Sparkles;
  return (
    <span
      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/80 shadow-sm"
      style={{
        background: `linear-gradient(145deg, ${accent}24, ${accent}0d)`,
        color: accent,
      }}
    >
      <Icon size={22} strokeWidth={2.15} aria-hidden="true" />
    </span>
  );
}

function formatIls(amount) {
  return `₪${Number(amount).toLocaleString("he-IL")}`;
}

function localizeService(addon, isHe) {
  return {
    ...addon,
    displayName: isHe ? addon.name : addon.nameEn,
    displayDescription: isHe ? addon.description : addon.descriptionEn,
    displayPrice: isHe ? addon.priceLabel : addon.priceLabelEn,
    displayDetails: isHe ? addon.details : addon.detailsEn,
    displayTracks: (addon.tracks || []).map((track) => ({
      label: isHe ? track.label : track.labelEn,
      price: isHe ? track.price : track.priceEn,
    })),
    displayExtras: (addon.extras || []).map((extra) => ({
      label: isHe ? extra.label : extra.labelEn,
      price: isHe ? extra.price : extra.priceEn,
    })),
    displayExamples: isHe ? addon.examples || [] : addon.examplesEn || [],
    displayNote: isHe ? addon.note : addon.noteEn,
  };
}

export default function Plans() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isHe = (i18n.language || "he").startsWith("he");

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [detailKey, setDetailKey] = useState(null);
  const [websiteAddonByPlan, setWebsiteAddonByPlan] = useState({
    monthly: false,
    yearly: false,
  });

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;
  const websiteAddonLabel = isHe ? WEBSITE_ADDON.labelHe : WEBSITE_ADDON.labelEn;
  const websiteAddonHint = isHe ? WEBSITE_ADDON.hintHe : WEBSITE_ADDON.hintEn;

  const catLabel = (key) => {
    const entry = PRICING_CATEGORY_LABELS[key];
    if (!entry) return key;
    return isHe ? entry.he : entry.en;
  };

  const toggleWebsiteAddon = (planType) => {
    setWebsiteAddonByPlan((prev) => ({
      ...prev,
      [planType]: !prev[planType],
    }));
  };

  const goToBusinessRegister = (plan, wantsWebsiteAddon) => {
    const planKey = plan.checkoutPlan || plan.type;
    const params = new URLSearchParams({ plan: planKey });
    if (wantsWebsiteAddon) params.set("websiteAddon", "1");
    navigate(`/register?${params.toString()}`);
  };

  const handleCheckout = async (plan) => {
    const wantsWebsiteAddon = Boolean(
      plan.allowsWebsiteAddon && websiteAddonByPlan[plan.type]
    );

    // Guests: business registration (fixed as בעל עסק) → Stripe → account only after payment
    if (!userId) {
      goToBusinessRegister(plan, wantsWebsiteAddon);
      return;
    }

    // Logged-in: website-only has no subscription checkout plan
    if (!plan.checkoutPlan) {
      navigate("/contact", {
        state: {
          prefillMessage: t("pricing.websiteContactMessage"),
        },
      });
      return;
    }

    try {
      setLoadingPlan(plan.checkoutPlan);

      const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan: plan.checkoutPlan,
          includeWebsiteAddon: wantsWebsiteAddon,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        alert(t("pricing.alertCheckoutFailed"));
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(t("pricing.alertGenericError"));
      setLoadingPlan(null);
    }
  };

  const packages = useMemo(
    () =>
      PRICING_PACKAGES.map((pkg) => ({
        ...pkg,
        name: isHe ? pkg.nameHe : pkg.nameEn,
        badge: isHe ? pkg.badgeHe : pkg.badgeEn,
        description: isHe ? pkg.descriptionHe : pkg.descriptionEn,
        note: isHe ? pkg.noteHe : pkg.noteEn,
        button: isHe ? pkg.buttonHe : pkg.buttonEn,
        pricePeriod: isHe ? pkg.pricePeriodHe : pkg.pricePeriodEn,
        features: isHe ? pkg.featuresHe : pkg.featuresEn,
      })),
    [isHe]
  );

  const categories = useMemo(() => ["all", ...PRICING_CATEGORY_ORDER], []);

  const localizedAddons = useMemo(
    () => PRICING_ADDONS.map((addon) => localizeService(addon, isHe)),
    [isHe]
  );

  const filteredAddons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localizedAddons.filter((addon) => {
      if (activeCategory !== "all" && addon.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        addon.displayName.toLowerCase().includes(q) ||
        addon.displayDescription.toLowerCase().includes(q) ||
        addon.key.toLowerCase().includes(q) ||
        addon.displayDetails.some((d) => d.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, query, localizedAddons]);

  const featuredAddons = useMemo(
    () => filteredAddons.filter((addon) => addon.featured),
    [filteredAddons]
  );

  const regularAddons = useMemo(
    () => filteredAddons.filter((addon) => !addon.featured),
    [filteredAddons]
  );

  const selectedAddons = useMemo(
    () => localizedAddons.filter((a) => selectedKeys.has(a.key)),
    [selectedKeys, localizedAddons]
  );

  const detailService = useMemo(
    () => localizedAddons.find((a) => a.key === detailKey) || null,
    [detailKey, localizedAddons]
  );

  const toggleAddon = (key) => {
    startTransition(() => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    });
  };

  const clearSelection = () => setSelectedKeys(new Set());

  const goToContactWithAddons = () => {
    const names = selectedAddons.map((a) => a.displayName).join(", ");
    const message = names
      ? t("pricing.addonsContactMessage", { services: names })
      : t("pricing.addonsContactMessageEmpty");
    navigate("/contact", { state: { prefillMessage: message } });
  };

  const onCardPointerMove = useCallback((event) => {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--pw-mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--pw-my", `${event.clientY - rect.top}px`);
  }, []);

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  const renderServiceCard = (addon, index, featured = false) => {
    const selected = selectedKeys.has(addon.key);

    return (
      <motion.article
        layout={!reduceMotion}
        key={addon.key}
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
        transition={{
          duration: 0.35,
          delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.24),
        }}
        onPointerMove={onCardPointerMove}
        className={`pricing-wow__service group flex h-full flex-col rounded-[1.85rem] border bg-white/90 p-5 text-start shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 ${
          selected
            ? "is-selected border-indigo-300 ring-2 ring-indigo-200"
            : "border-slate-200/90"
        } ${featured ? "is-featured sm:p-7" : ""}`}
        style={{ "--pw-accent": addon.accent }}
      >
        <span className="pricing-wow__sheen" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <AddonIcon name={addon.icon} accent={addon.accent} />
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                {catLabel(addon.category)}
              </p>
              <h3
                className={`mt-1 font-black tracking-[-0.03em] text-slate-900 ${
                  featured ? "text-xl sm:text-2xl" : "text-lg"
                }`}
              >
                {addon.displayName}
              </h3>
            </div>
          </div>

          {addon.featured && (
            <span
              className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm"
              style={{ background: addon.accent }}
            >
              {t("pricing.addonsFeatured")}
            </span>
          )}
        </div>

        <p
          className={`mt-4 text-sm font-semibold leading-7 text-slate-600 ${
            featured ? "sm:text-[15px]" : "line-clamp-3"
          }`}
        >
          {addon.displayDescription}
        </p>

        <ul className="mt-4 grid gap-1.5">
          {addon.displayDetails.slice(0, featured ? 4 : 3).map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: addon.accent }}
              />
              <span className="text-xs font-bold leading-5 text-slate-600 sm:text-[13px]">
                {item}
              </span>
            </li>
          ))}
          {addon.displayDetails.length > (featured ? 4 : 3) && (
            <li className="ps-3.5 text-xs font-bold text-slate-400">
              +{addon.displayDetails.length - (featured ? 4 : 3)}{" "}
              {t("pricing.moreDetails")}
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-5">
          <p
            className={`font-black tracking-tight ${
              featured ? "text-2xl" : "text-lg"
            }`}
            style={{ color: addon.accent }}
          >
            {addon.displayPrice}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDetailKey(addon.key)}
              className="inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("pricing.viewDetails")}
              <ChevronLeft
                size={15}
                className="rtl:rotate-180"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => toggleAddon(addon.key)}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-black transition hover:-translate-y-0.5 ${
                selected
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-white shadow-lg"
              }`}
              style={
                selected
                  ? undefined
                  : {
                      background: `linear-gradient(135deg, ${addon.accent}, ${addon.accent}cc)`,
                    }
              }
            >
              {selected ? (
                <>
                  <Check size={15} />
                  {t("pricing.addonsAdded")}
                </>
              ) : (
                <>
                  <Plus size={15} />
                  {t("pricing.addonsAdd")}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="pricing-wow pm relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7ff_38%,#eefaf8_72%,#ffffff_100%)] text-slate-800">
      <Helmet>
        <title>{t("pricing.seoTitle")}</title>
        <meta name="description" content={t("pricing.seoDescription")} />
      </Helmet>

      <ScrollProgress />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pricing-wow__orb pricing-wow__orb--a" />
        <div className="pricing-wow__orb pricing-wow__orb--b" />
        <div className="pricing-wow__orb pricing-wow__orb--c" />
        <div className="pricing-wow__grid" />
      </div>

      <main
        className={`relative mx-auto max-w-7xl px-5 pb-36 pt-16 sm:px-6 lg:px-8 lg:pt-20 ${
          selectedKeys.size > 0 ? "pb-44" : ""
        }`}
      >
        {/* Compact title — no fluff hero */}
        <motion.header
          className="mx-auto max-w-4xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="pricing-wow__brand text-3xl font-black tracking-[-0.05em] sm:text-4xl">
            BizUply
          </p>
          <h1 className="pricing-wow__title mt-4 text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {t("pricing.addonsTitle")}
          </h1>
        </motion.header>

        {/* 1) System / platform packages first */}
        <section
          id="platform-packages"
          className="mx-auto mt-14 max-w-6xl scroll-mt-28 sm:mt-16"
        >
          <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-4 py-1.5 text-sm font-black text-indigo-700 shadow-lg shadow-indigo-100/60">
              <Globe size={14} aria-hidden="true" />
              {t("pricing.platformBadge")}
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
              {t("pricing.platformTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              {t("pricing.platformSubtitle")}
            </p>
          </motion.div>

          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {packages.map((plan, index) => {
              const isLoading =
                plan.checkoutPlan != null && loadingPlan === plan.checkoutPlan;
              const websiteAddonChecked = Boolean(
                plan.allowsWebsiteAddon && websiteAddonByPlan[plan.type]
              );

              return (
                <motion.article
                  key={plan.type}
                  {...fadeUp}
                  transition={{
                    duration: 0.55,
                    delay: reduceMotion ? 0 : 0.06 + index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative overflow-hidden rounded-[2.25rem] border p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                    plan.highlighted
                      ? "border-indigo-200 bg-gradient-to-br from-teal-100/80 via-violet-100 to-sky-100 shadow-[0_30px_100px_rgba(79,70,229,0.26)] lg:scale-[1.02]"
                      : "border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(79,70,229,0.12)]"
                  }`}
                >
                  <div
                    className={`relative flex h-full flex-col rounded-[1.85rem] border p-6 sm:p-7 ${
                      plan.highlighted
                        ? "border-white/50 bg-white/55"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="relative flex flex-1 flex-col text-start">
                      <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-black text-indigo-700">
                        {plan.badge}
                      </div>

                      <h3 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                        {plan.name}
                      </h3>

                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
                        {plan.description}
                      </p>

                      <div className="mt-7 flex items-end gap-2">
                        <span className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                          {formatIls(plan.price)}
                        </span>
                        <span className="pb-2 text-sm font-black text-slate-500">
                          {plan.pricePeriod}
                        </span>
                      </div>

                      {websiteAddonChecked && (
                        <p className="mt-2 text-base font-black text-emerald-700">
                          {t("pricing.websiteAddonStripeNote", {
                            packagePrice: formatIls(plan.price),
                            period: plan.pricePeriod,
                            websitePrice: formatIls(WEBSITE_ADDON.price),
                          })}
                        </p>
                      )}

                      <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700">
                        {plan.note}
                      </div>

                      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                      <ul className="mt-6 grid gap-2.5">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-[10px] text-white">
                              ✓
                            </span>
                            <span className="text-sm font-bold leading-5 text-slate-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.allowsWebsiteAddon && (
                        <label
                          className={`mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition ${
                            websiteAddonChecked
                              ? "border-emerald-300 bg-emerald-50/80 shadow-sm"
                              : "border-slate-200 bg-slate-50/70 hover:border-indigo-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={websiteAddonChecked}
                            onChange={() => toggleWebsiteAddon(plan.type)}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-black leading-5 text-slate-900">
                              {websiteAddonLabel}
                            </span>
                            <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                              {websiteAddonHint}
                            </span>
                          </span>
                        </label>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCheckout(plan)}
                        disabled={isLoading}
                        className={`group mt-auto inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black shadow-xl transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${
                          plan.allowsWebsiteAddon ? "mt-6" : "mt-8"
                        } ${
                          plan.highlighted
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "border border-violet-200 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 text-slate-900"
                        }`}
                      >
                        {isLoading ? t("pricing.processing") : plan.button}
                        {!isLoading && (
                          <span className="ms-2 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                            →
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* 2) Upsells / managed service packages after system plans */}
        <section
          id="business-services"
          className="relative mx-auto mt-24 max-w-6xl scroll-mt-28 sm:mt-28"
        >
          <motion.div className="mx-auto max-w-3xl text-center" {...fadeUp}>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-4 py-1.5 text-sm font-black text-emerald-700 shadow-lg shadow-emerald-100/50">
              <Sparkles size={14} aria-hidden="true" />
              {t("pricing.upsellsBadge")}
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
              {t("pricing.upsellsTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              {t("pricing.addonsSubtitle")}
            </p>
          </motion.div>

          <div className="pricing-wow__cat-sticky mt-10">
            <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="relative min-w-0 flex-1">
                  <Search
                    size={16}
                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("pricing.addonsSearch")}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-4 ps-11 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((key) => {
                  const active = activeCategory === key;
                  const accent =
                    key === "all"
                      ? "#0f172a"
                      : PRICING_CATEGORY_ACCENTS[key] || "#4f46e5";
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveCategory(key)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                        active
                          ? "text-white shadow-lg"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                      style={active ? { background: accent } : undefined}
                    >
                      {catLabel(key)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold text-slate-500">
            {t("pricing.addonsCount", { count: filteredAddons.length })}
          </p>

          {featuredAddons.length > 0 && (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {featuredAddons.map((addon, index) =>
                  renderServiceCard(addon, index, true)
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {regularAddons.map((addon, index) =>
                renderServiceCard(addon, index, false)
              )}
            </AnimatePresence>
          </div>

          {filteredAddons.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center">
              <p className="text-base font-bold text-slate-500">
                {t("pricing.addonsEmpty")}
              </p>
            </div>
          )}

          <motion.div
            className="mt-14 overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-l from-emerald-100 via-sky-100 to-indigo-100 p-8 text-center shadow-[0_24px_70px_rgba(16,185,129,0.16)] sm:p-10"
            {...fadeUp}
          >
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {t("pricing.addonsCtaTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              {t("pricing.addonsCtaText")}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToContactWithAddons}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {t("pricing.addonsCtaButton")}
              </button>
              <Link
                to="/agents"
                className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/80 px-7 py-3.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5"
              >
                {t("pricing.addonsCtaAgents")}
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <ServiceDetailModal
        service={detailService}
        open={Boolean(detailService)}
        onClose={() => setDetailKey(null)}
        selected={detailService ? selectedKeys.has(detailService.key) : false}
        onToggle={toggleAddon}
        catLabel={catLabel}
        t={t}
        AddonIcon={AddonIcon}
      />

      <AnimatePresence>
        {selectedKeys.size > 0 && (
          <motion.div
            initial={reduceMotion ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-100 bg-white/95 px-4 py-4 shadow-[0_-16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">
                  {t("pricing.addonsSelected", { count: selectedKeys.size })}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                  {selectedAddons.map((a) => a.displayName).join(" · ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-slate-300"
                >
                  <X size={14} />
                  {t("pricing.addonsClear")}
                </button>
                <button
                  type="button"
                  onClick={goToContactWithAddons}
                  className="inline-flex h-11 items-center rounded-full bg-slate-900 px-5 text-sm font-black text-white shadow-lg transition hover:bg-slate-800"
                >
                  {t("pricing.addonsRequestQuote")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
