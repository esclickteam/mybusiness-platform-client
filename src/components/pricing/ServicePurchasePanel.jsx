import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Check, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { lockPageScroll } from "../../utils/pageScrollLock";
import { createServiceOrderCheckout } from "../../utils/serviceOrders";
import {
  createCheckoutLaunchSignature,
  createServiceCheckoutAttempt,
  getPurchaseModeNextStep,
  shouldPreservePendingServicePurchase,
} from "../../utils/servicePurchaseFlow";
import {
  clearPendingPurchaseIntent,
  savePendingPurchaseIntent,
} from "../../utils/pendingPurchaseIntent";
import { WEBSITE_ADDON } from "../../data/pricingPackagesData";
import { getIntlLocale } from "../../i18n/localeUtils";

const PLAN_OPTIONS = [
  { key: "website", amount: 600, billing: "year" },
  { key: "monthly", amount: 149, billing: "month" },
  { key: "yearly", amount: 1490, billing: "year" },
];
const LAUNCH_MARKER_KEY = "bizuply_service_checkout_launch";

function money(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function SelectionCard({ selected, onClick, title, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-start transition ${
        selected
          ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-200"
      }`}
    >
      <span className="flex items-start gap-3">
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>
          {selected ? <Check size={12} strokeWidth={3} /> : null}
        </span>
        <span>
          <span className="block text-sm font-black text-slate-900">{title}</span>
          {text ? <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{text}</span> : null}
        </span>
      </span>
    </button>
  );
}

export default function ServicePurchasePanel({
  service,
  purchase,
  open,
  onClose,
  user,
  activePlan,
  restoredIntent,
  autoContinue = false,
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const navigate = useNavigate();
  const planName = (key) =>
    key === "website"
      ? t("billing.purchase.websitePlan")
      : key === "monthly"
        ? t("billing.purchase.monthlyPlan")
        : key === "yearly"
          ? t("billing.purchase.yearlyPlan")
          : "";
  const planPeriod = (billing) =>
    billing === "month" ? t("billing.purchase.perMonth") : t("billing.purchase.perYear");
  const restored = restoredIntent?.serviceKey;
  const initialTrack = Math.max(
    0,
    purchase?.trackOptions?.findIndex((option) => option.serviceKey === restored) ?? 0
  );
  const [trackIndex, setTrackIndex] = useState(initialTrack);
  const [selectedAddOns, setSelectedAddOns] = useState(
    () => new Set(restoredIntent?.selectedAddOnKeys || [])
  );
  const [quantities, setQuantities] = useState(restoredIntent?.quantities || {});
  const [purchaseMode, setPurchaseMode] = useState(restoredIntent?.purchaseMode || null);
  const [selectedPlanKey, setSelectedPlanKey] = useState(
    restoredIntent?.selectedPlanKey || (activePlan ? "existing" : null)
  );
  const [includeWebsiteAddon, setIncludeWebsiteAddon] = useState(
    () => restoredIntent?.includeWebsiteAddon === true
  );
  const [step, setStep] = useState(restoredIntent ? "summary" : "details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!open) return undefined;
    return lockPageScroll();
  }, [open]);

  useEffect(() => {
    if (open && !restoredIntent) {
      sessionStorage.removeItem(LAUNCH_MARKER_KEY);
    }
  }, [open, restoredIntent]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  const selectedTrack = purchase?.trackOptions?.[trackIndex] || null;
  const serviceKey = selectedTrack?.serviceKey || purchase?.serviceKey || restored || "";
  const contactOnly = Boolean(selectedTrack?.contact) || !serviceKey;
  const serviceBilling = selectedTrack?.billing || purchase?.billing || "one_time";
  const baseAmount = selectedTrack?.amountIls ?? purchase?.amountIls ?? 0;
  const selectedAddOnOptions = useMemo(
    () =>
      (purchase?.addOnOptions || []).filter((option) =>
        selectedAddOns.has(option.addOnKey)
      ),
    [purchase, selectedAddOns]
  );

  const intent = useMemo(
    () => ({
      serviceKey,
      purchaseMode,
      selectedPlanKey:
        purchaseMode === "bundle"
          ? activePlan
            ? "existing"
            : selectedPlanKey
          : null,
      includeWebsiteAddon:
        purchaseMode === "bundle" &&
        !activePlan &&
        (selectedPlanKey === "monthly" || selectedPlanKey === "yearly") &&
        includeWebsiteAddon,
      selectedAddOnKeys: selectedAddOnOptions.map((option) => option.addOnKey),
      quantities: Object.fromEntries(
        selectedAddOnOptions
          .filter((option) => option.allowQuantity)
          .map((option) => [
            option.addOnKey,
            Math.max(1, Math.floor(Number(quantities[option.addOnKey]) || 1)),
          ])
      ),
      returnPath: "/pricing",
    }),
    [
      activePlan,
      includeWebsiteAddon,
      purchaseMode,
      quantities,
      selectedAddOnOptions,
      selectedPlanKey,
      serviceKey,
    ]
  );

  const addOnTotal = selectedAddOnOptions.reduce(
    (sum, option) =>
      sum + option.amountIls * (quantities[option.addOnKey] || 1),
    0
  );
  const plan = PLAN_OPTIONS.find(
    (option) => option.key === (activePlan?.key || selectedPlanKey)
  );
  const isNewPlan = purchaseMode === "bundle" && !activePlan;
  const websiteAddonAmount =
    isNewPlan &&
    intent.includeWebsiteAddon &&
    (plan?.key === "monthly" || plan?.key === "yearly")
      ? WEBSITE_ADDON.price
      : 0;
  const waitingForActivePlan = Boolean(
    autoContinue &&
      restoredIntent &&
      purchaseMode === "bundle" &&
      !activePlan
  );
  const paymentToday =
    baseAmount +
    addOnTotal +
    websiteAddonAmount +
    (isNewPlan && plan?.key !== "monthly" ? plan?.amount || 0 : 0) +
    (isNewPlan && plan?.key === "monthly" ? plan.amount : 0);
  const monthlyTotal =
    (serviceBilling === "recurring_month" ? baseAmount : 0) +
    (isNewPlan && plan?.key === "monthly" ? plan.amount : 0);
  const yearlyTotal =
    isNewPlan && plan?.key === "yearly" ? plan.amount : 0;
  const oneTimeTotal =
    (serviceBilling === "one_time" ? baseAmount : 0) +
    addOnTotal +
    websiteAddonAmount +
    (isNewPlan && plan?.key === "website" ? plan.amount : 0);

  const goToContact = () => {
    onClose();
    navigate("/contact", {
      state: {
        prefillMessage: t("billing.purchase.quotePrefill", {
          service: service?.displayName || t("billing.purchase.theService"),
        }),
      },
    });
  };

  const proceedFromDetails = () => {
    if (contactOnly) {
      goToContact();
      return;
    }
    setStep("mode");
  };

  const selectMode = (mode) => {
    setPurchaseMode(mode);
    if (mode === "standalone") {
      setSelectedPlanKey(null);
      setIncludeWebsiteAddon(false);
    } else if (activePlan) {
      setSelectedPlanKey("existing");
      setIncludeWebsiteAddon(false);
    }
    setStep(getPurchaseModeNextStep(mode, activePlan));
  };

  const selectPlan = (key) => {
    setSelectedPlanKey(key);
    if (key !== "monthly" && key !== "yearly") {
      setIncludeWebsiteAddon(false);
    }
  };

  const persistIntent = () => savePendingPurchaseIntent(intent);

  const registerAndContinue = () => {
    persistIntent();
    navigate("/register?purchaseIntent=1&redirect=%2Fpricing");
  };

  const launchCheckout = async ({ automatic = false } = {}) => {
    if (!user) {
      persistIntent();
      navigate("/login?redirect=%2Fpricing");
      return;
    }
    if (loading || waitingForActivePlan || !serviceKey || !purchaseMode) return;

    const checkoutAttempt = createServiceCheckoutAttempt(intent, {
      automatic,
      activePlan,
    });
    const signature = createCheckoutLaunchSignature(checkoutAttempt.intent, {
      automatic,
    });
    const previous = sessionStorage.getItem(LAUNCH_MARKER_KEY);
    if (previous === signature) return;

    try {
      setLoading(true);
      setError("");
      sessionStorage.setItem(LAUNCH_MARKER_KEY, signature);
      const data = await createServiceOrderCheckout({
        intent: checkoutAttempt.intent,
        authenticatedUser: user,
      });
      if (!data?.url) throw new Error("Missing checkout URL");

      const mustContinue = shouldPreservePendingServicePurchase({
        response: data,
        isSequentialContinuation:
          checkoutAttempt.isSequentialContinuation,
        isNewPlan,
        serviceBilling,
      });
      if (mustContinue) persistIntent();
      else clearPendingPurchaseIntent();
      window.location.assign(data.url);
    } catch (checkoutError) {
      sessionStorage.removeItem(LAUNCH_MARKER_KEY);
      setLoading(false);
      setError(t("billing.purchase.checkoutError"));
      console.error("Service checkout failed", checkoutError);
    }
  };

  useEffect(() => {
    if (
      !open ||
      !autoContinue ||
      !restoredIntent ||
      !user ||
      !activePlan ||
      autoStarted.current
    ) {
      return;
    }
    autoStarted.current = true;
    launchCheckout({ automatic: true });
    // Intentional one-shot continuation after Stripe redirects back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlan, autoContinue, open, restoredIntent, user]);

  if (typeof document === "undefined") return null;
  if (!open || !service || !purchase) return null;

  const title =
    step === "mode"
      ? t("billing.purchase.howToPurchase")
      : step === "plan"
        ? t("billing.purchase.choosePlan")
        : step === "summary"
          ? t("billing.purchase.summaryTitle")
          : service.displayName;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t("billing.purchase.close")}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-purchase-title"
        className="relative z-10 flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
      >
        <header
          className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8"
          style={{ background: `linear-gradient(135deg, ${service.accent}16, white)` }}
        >
          <div className="text-start">
            <p className="text-xs font-black text-slate-500">{service.displayName}</p>
            <h2 id="service-purchase-title" className="mt-1 text-2xl font-black text-slate-900">
              {title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600">
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {step === "details" ? (
            <div className="space-y-5">
              {purchase.trackOptions?.length ? (
                <div className="space-y-2">
                  <h3 className="text-start text-sm font-black text-slate-700">
                    {t("billing.purchase.chooseTrack")}
                  </h3>
                  {purchase.trackOptions.map((option, index) => (
                    <SelectionCard
                      key={`${service.key}-${index}`}
                      selected={trackIndex === index}
                      onClick={() => setTrackIndex(index)}
                      title={service.displayTracks?.[index]?.label || t("billing.purchase.trackN", { number: index + 1 })}
                      text={service.displayTracks?.[index]?.price}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-start text-sm font-bold text-slate-700">
                  {service.displayDescription}
                </p>
              )}

              {purchase.addOnOptions?.length ? (
                <div className="space-y-2">
                  <h3 className="text-start text-sm font-black text-slate-700">
                    {t("billing.purchase.optionalAddons")}
                  </h3>
                  {purchase.addOnOptions.map((option, index) => {
                    const selected = selectedAddOns.has(option.addOnKey);
                    return (
                      <div key={option.addOnKey} className="rounded-2xl border border-slate-200 p-4">
                        <label className="flex cursor-pointer items-start gap-3 text-start">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              setSelectedAddOns((previous) => {
                                const next = new Set(previous);
                                if (next.has(option.addOnKey)) next.delete(option.addOnKey);
                                else next.add(option.addOnKey);
                                return next;
                              })
                            }
                            className="mt-1"
                          />
                          <span className="flex-1 text-sm font-black text-slate-800">
                            {service.displayExtras?.[index]?.label || option.addOnKey}
                            <span className="ms-2 text-slate-500">
                              {service.displayExtras?.[index]?.price}
                            </span>
                          </span>
                        </label>
                        {selected && option.allowQuantity ? (
                          <input
                            aria-label={t("billing.purchase.quantity")}
                            type="number"
                            min="1"
                            max="50"
                            value={quantities[option.addOnKey] || 1}
                            onChange={(event) =>
                              setQuantities((previous) => ({
                                ...previous,
                                [option.addOnKey]: Math.max(1, Number(event.target.value) || 1),
                              }))
                            }
                            className="mt-3 h-10 w-24 rounded-xl border border-slate-200 px-3"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "mode" ? (
            <div className="grid gap-3">
              <SelectionCard
                selected={purchaseMode === "bundle"}
                onClick={() => selectMode("bundle")}
                title={activePlan ? t("billing.purchase.addToExisting") : t("billing.purchase.addToPlan")}
                text={
                  activePlan
                    ? t("billing.purchase.activePlanLine", { name: activePlan.name })
                    : t("billing.purchase.bundleHint")
                }
              />
              <SelectionCard
                selected={purchaseMode === "standalone"}
                onClick={() => selectMode("standalone")}
                title={t("billing.purchase.standalone")}
                text={t("billing.purchase.standaloneHint")}
              />
            </div>
          ) : null}

          {step === "plan" ? (
            <div className="grid gap-3">
              {PLAN_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.key}
                  selected={selectedPlanKey === option.key}
                  onClick={() => selectPlan(option.key)}
                  title={`${planName(option.key)} · ${money(option.amount, locale)}${planPeriod(option.billing)}`}
                  text={
                    option.key === "website"
                      ? t("billing.purchase.websiteYearHint")
                      : undefined
                  }
                />
              ))}
              {selectedPlanKey === "monthly" || selectedPlanKey === "yearly" ? (
                <label
                  data-testid="website-addon-toggle"
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition ${
                    includeWebsiteAddon
                      ? "border-emerald-300 bg-emerald-50/80 shadow-sm"
                      : "border-slate-200 bg-slate-50/70 hover:border-indigo-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeWebsiteAddon}
                    onChange={() => setIncludeWebsiteAddon((value) => !value)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5 text-slate-900">
                      {t("pricing.websiteAddon.label")}
                    </span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                      {t("pricing.websiteAddon.hint")}
                    </span>
                  </span>
                </label>
              ) : null}
            </div>
          ) : null}

          {step === "summary" ? (
            <div className="space-y-4 text-start">
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-xs font-bold text-slate-300">{t("billing.purchase.payToday")}</p>
                <p className="mt-1 text-3xl font-black">{money(paymentToday, locale)}</p>
                <p className="mt-2 text-xs font-semibold text-slate-300">
                  {t("billing.purchase.estimateNote")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500">{t("billing.purchase.monthlyRecurring")}</p>
                  <p className="mt-1 font-black">{money(monthlyTotal, locale)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500">{t("billing.purchase.yearlyRecurring")}</p>
                  <p className="mt-1 font-black">{money(yearlyTotal, locale)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500">{t("billing.purchase.oneTimeItems")}</p>
                  <p className="mt-1 font-black">{money(oneTimeTotal, locale)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
                <p>{service.displayName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {purchaseMode === "bundle"
                    ? t("billing.purchase.inPlan", { name: activePlan?.name || planName(plan?.key) })
                    : t("billing.purchase.standaloneSummary")}
                </p>
                                {websiteAddonAmount > 0 ? (
                  <p data-testid="website-addon-summary" className="mt-2 text-xs text-emerald-700">
                    {t("billing.purchase.includesWebsiteAddon", {
                      amount: money(WEBSITE_ADDON.price, locale),
                    })}
                  </p>
                ) : null}
{activePlan?.nextRenewal ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {t("billing.purchase.nextRenewal", {
                      date: new Date(activePlan.nextRenewal).toLocaleDateString(locale),
                    })}
                  </p>
                ) : null}
              </div>
              {isNewPlan && serviceBilling === "recurring_month" ? (
                <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
                  <AlertCircle className="mt-0.5 shrink-0" size={20} />
                  <p>
                    {t("billing.purchase.sequentialCheckout")}
                  </p>
                </div>
              ) : null}
              {waitingForActivePlan ? (
                <p
                  role="status"
                  className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-bold text-indigo-800"
                >
                  {t("billing.purchase.waitingPlan")}
                </p>
              ) : null}
              {error ? <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</p> : null}
            </div>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:px-8">
          {step !== "details" ? (
            <button type="button" disabled={loading || waitingForActivePlan} onClick={() => setStep(step === "summary" ? (purchaseMode === "standalone" || activePlan ? "mode" : "plan") : step === "plan" ? "mode" : "details")} className="inline-flex items-center gap-1 text-sm font-black text-slate-600 disabled:opacity-50">
              <ChevronLeft size={16} className="rtl:rotate-180" />
              {t("billing.purchase.back")}
            </button>
          ) : <span />}
          {step === "details" ? (
            <button type="button" onClick={proceedFromDetails} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white">
              {t("billing.purchase.choosePurchase")}
            </button>
          ) : null}
          {step === "plan" ? (
            <button type="button" disabled={!selectedPlanKey} onClick={() => setStep("summary")} className="rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white disabled:opacity-40">
              {t("billing.purchase.continueSummary")}
            </button>
          ) : null}
          {step === "summary" && user ? (
            <button
              type="button"
              disabled={loading || waitingForActivePlan}
              onClick={() =>
                launchCheckout({
                  automatic: Boolean(
                    autoContinue && activePlan && restoredIntent
                  ),
                })
              }
              className="rounded-full bg-gradient-to-l from-indigo-600 to-violet-600 px-6 py-3 text-sm font-black text-white disabled:opacity-60"
            >
              {loading
                ? t("billing.purchase.openingCheckout")
                : t("billing.purchase.continueSecure")}
            </button>
          ) : null}
          {step === "summary" && !user ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => launchCheckout()}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {t("billing.purchase.loginContinue")}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={registerAndContinue}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-800 disabled:opacity-50"
              >
                {t("billing.purchase.registerContinue")}
              </button>
            </div>
          ) : null}
        </footer>
      </section>
    </div>,
    document.body
  );
}
