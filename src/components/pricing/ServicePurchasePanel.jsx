import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import { lockPageScroll } from "../../utils/pageScrollLock";
import { createServiceOrderCheckout } from "../../utils/serviceOrders";

function formatIls(amount) {
  return `₪${Number(amount || 0).toLocaleString("he-IL")}`;
}

/**
 * Managed-service purchase / checkout panel.
 *
 * Renders the interactive purchase surface for a single managed service:
 *  - tier picker (e.g. automations 1 / 3 / 6),
 *  - expert-website-build add-ons with a page-quantity stepper,
 *  - a clear pre-checkout total with monthly vs one-time labelling,
 * then creates a Stripe Checkout session via the server and redirects.
 *
 * The client sends ONLY serviceKey + selectedAddOnKeys + quantities
 * (+ businessId / userId). Amounts shown here are display-only; the server
 * resolves the real Stripe Price.
 */
export default function ServicePurchasePanel({
  service,
  purchase,
  open,
  onClose,
  user,
  isHe,
}) {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const trackOptions = purchase?.trackOptions || null;
  const addOnOptions = purchase?.addOnOptions || null;

  // Fresh state per service: parent remounts this panel via `key={service.key}`.
  const [trackIndex, setTrackIndex] = useState(() => {
    if (!trackOptions) return 0;
    const idx = trackOptions.findIndex((o) => !o.contact);
    return idx >= 0 ? idx : 0;
  });
  const [addOnState, setAddOnState] = useState({}); // { [addOnKey]: qty }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.userId || user?.id || null;
  const businessId = user?.businessId || user?.business?._id || null;

  useEffect(() => {
    if (!open) return undefined;
    return lockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const activeTrack = trackOptions ? trackOptions[trackIndex] : null;
  const isContactOnly = Boolean(activeTrack?.contact);

  const serviceKey = trackOptions
    ? activeTrack?.serviceKey || null
    : purchase?.serviceKey || null;

  const billing = trackOptions
    ? activeTrack?.billing
    : purchase?.billing;
  const isMonthly = billing === "recurring_month";

  const baseAmount = trackOptions
    ? activeTrack?.amountIls
    : purchase?.amountIls;

  const toggleAddOn = (addOnKey) => {
    setAddOnState((prev) => {
      const next = { ...prev };
      if (next[addOnKey] != null) delete next[addOnKey];
      else next[addOnKey] = 1;
      return next;
    });
  };

  const setAddOnQty = (addOnKey, qty) => {
    const clamped = Math.max(1, Math.round(Number(qty) || 1));
    setAddOnState((prev) => ({ ...prev, [addOnKey]: clamped }));
  };

  const selectedAddOnKeys = Object.keys(addOnState);
  const quantities = addOnState;

  const addOnsTotal = (addOnOptions || []).reduce((sum, opt) => {
    const qty = addOnState[opt.addOnKey];
    if (!qty) return sum;
    return sum + opt.amountIls * qty;
  }, 0);

  const total =
    baseAmount != null ? Number(baseAmount) + addOnsTotal : null;

  const canCheckout = Boolean(serviceKey) && !isContactOnly;

  const billingLabel = isMonthly
    ? isHe
      ? "חיוב חודשי מתחדש"
      : "Recurring monthly billing"
    : isHe
    ? "תשלום חד־פעמי"
    : "One-time payment";

  const goToContact = () => {
    const name = service?.displayName || "";
    const prefillMessage = isHe
      ? `אשמח לקבל הצעת מחיר עבור: ${name}`
      : `I'd like a quote for: ${name}`;
    onClose();
    navigate("/contact", { state: { prefillMessage } });
  };

  const goToLogin = () => {
    onClose();
    navigate("/login", { state: { from: "/pricing" } });
  };

  const handleSubmit = async () => {
    setError("");

    if (!userId) {
      goToLogin();
      return;
    }
    if (isContactOnly || !serviceKey) {
      goToContact();
      return;
    }

    try {
      setLoading(true);
      const data = await createServiceOrderCheckout({
        serviceKey,
        selectedAddOnKeys: addOnOptions ? selectedAddOnKeys : [],
        quantities: addOnOptions ? quantities : {},
        businessId,
        userId,
      });
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        isHe
          ? "לא התקבל קישור לתשלום. נסו שוב או פנו לתמיכה."
          : "No checkout link received. Please try again or contact support."
      );
      setLoading(false);
    } catch (err) {
      setError(
        err?.message ||
          (isHe ? "אירעה שגיאה. נסו שוב." : "Something went wrong. Please try again.")
      );
      setLoading(false);
    }
  };

  const ctaLabel = !userId
    ? isHe
      ? "התחברו כדי לרכוש"
      : "Log in to purchase"
    : isContactOnly
    ? isHe
      ? "לבקשת הצעה מותאמת"
      : "Request a custom quote"
    : loading
    ? isHe
      ? "מעבירים לתשלום..."
      : "Redirecting to payment..."
    : isHe
    ? "המשך לתשלום מאובטח"
    : "Continue to secure checkout";

  return createPortal(
    <AnimatePresence>
      {open && service && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          role="presentation"
        >
          <button
            type="button"
            aria-label={isHe ? "סגירה" : "Close"}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-purchase-title"
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] sm:rounded-[2rem]"
          >
            {/* Header */}
            <div
              className="relative shrink-0 px-6 pb-5 pt-6 sm:px-8"
              style={{
                background: `linear-gradient(135deg, ${service.accent}18, #ffffff 55%, ${service.accent}10)`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 text-start">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {isHe ? "רכישת שירות" : "Purchase service"}
                  </p>
                  <h2
                    id="service-purchase-title"
                    className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl"
                  >
                    {service.displayName}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  aria-label={isHe ? "סגירה" : "Close"}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              {/* Track / tier picker */}
              {trackOptions && (
                <div>
                  <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                    {isHe ? "בחרו מסלול" : "Choose an option"}
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {trackOptions.map((opt, index) => {
                      const label =
                        service.displayTracks?.[index]?.label ||
                        (isHe ? `מסלול ${index + 1}` : `Option ${index + 1}`);
                      const priceText =
                        service.displayTracks?.[index]?.price ||
                        (opt.amountIls != null ? formatIls(opt.amountIls) : "");
                      const active = trackIndex === index;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setTrackIndex(index)}
                          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition ${
                            active
                              ? "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-200"
                              : "border-slate-200 bg-slate-50/80 hover:border-slate-300"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                                active
                                  ? "border-indigo-500 bg-indigo-500 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {active && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {label}
                            </span>
                          </span>
                          <span
                            className="shrink-0 text-sm font-black"
                            style={{ color: service.accent }}
                          >
                            {priceText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Base line for single-option services */}
              {!trackOptions && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                  <span className="text-sm font-bold text-slate-700">
                    {service.displayName}
                  </span>
                  <span
                    className="shrink-0 text-sm font-black"
                    style={{ color: service.accent }}
                  >
                    {baseAmount != null ? formatIls(baseAmount) : service.displayPrice}
                  </span>
                </div>
              )}

              {/* Expert-build add-ons */}
              {addOnOptions && (
                <div className="mt-7">
                  <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                    {isHe ? "תוספות (אופציונלי)" : "Add-ons (optional)"}
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {addOnOptions.map((opt, index) => {
                      const label =
                        service.displayExtras?.[index]?.label || opt.addOnKey;
                      const checked = addOnState[opt.addOnKey] != null;
                      const qty = addOnState[opt.addOnKey] || 1;
                      return (
                        <div
                          key={opt.addOnKey}
                          className={`rounded-2xl border px-4 py-3 transition ${
                            checked
                              ? "border-indigo-300 bg-indigo-50/60"
                              : "border-slate-200 bg-slate-50/80"
                          }`}
                        >
                          <label className="flex cursor-pointer items-center justify-between gap-3">
                            <span className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAddOn(opt.addOnKey)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm font-bold text-slate-700">
                                {label}
                              </span>
                            </span>
                            <span
                              className="shrink-0 text-sm font-black"
                              style={{ color: service.accent }}
                            >
                              {formatIls(opt.amountIls)}
                            </span>
                          </label>

                          {checked && opt.allowQuantity && (
                            <div className="mt-3 flex items-center justify-between gap-3 ps-6">
                              <span className="text-xs font-bold text-slate-500">
                                {isHe ? "כמות עמודים" : "Number of pages"}
                              </span>
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label={isHe ? "הפחתה" : "Decrease"}
                                  onClick={() =>
                                    setAddOnQty(opt.addOnKey, qty - 1)
                                  }
                                  disabled={qty <= 1}
                                  className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="min-w-[2ch] text-center text-sm font-black text-slate-900">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  aria-label={isHe ? "הוספה" : "Increase"}
                                  onClick={() =>
                                    setAddOnQty(opt.addOnKey, qty + 1)
                                  }
                                  className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {service.displayNote && (
                <p className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-start text-sm font-semibold leading-6 text-amber-900">
                  {service.displayNote}
                </p>
              )}

              {error && (
                <div className="mt-6 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-start">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
                  <p className="text-sm font-bold leading-6 text-rose-700">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Footer: total + CTA */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4 sm:px-8">
              <div className="flex items-end justify-between gap-3">
                <div className="text-start">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {isHe ? 'סה"כ' : "Total"}
                  </p>
                  <p className="text-2xl font-black tracking-tight text-slate-900">
                    {isContactOnly || total == null
                      ? isHe
                        ? "הצעה מותאמת"
                        : "Custom quote"
                      : formatIls(total)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    isMonthly
                      ? "bg-sky-100 text-sky-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {billingLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {canCheckout && userId && !loading && (
                  <ShieldCheck size={16} aria-hidden="true" />
                )}
                {ctaLabel}
              </button>

              {canCheckout && userId && (
                <p className="mt-2 text-center text-xs font-semibold text-slate-400">
                  {isHe
                    ? "התשלום מתבצע באופן מאובטח דרך Stripe"
                    : "Payment is processed securely via Stripe"}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
