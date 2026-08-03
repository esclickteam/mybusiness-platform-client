import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { lockPageScroll } from "../../utils/pageScrollLock";

export default function ServiceDetailModal({
  service,
  open,
  onClose,
  onPurchase,
  catLabel,
  t,
  AddonIcon,
  purchaseLabel,
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    return lockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && service && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          role="presentation"
        >
          <button
            type="button"
            aria-label={t("pricing.modalClose")}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-detail-title"
            initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] sm:rounded-[2rem]"
          >
            <div
              className="relative shrink-0 px-6 pb-5 pt-6 sm:px-8"
              style={{
                background: `linear-gradient(135deg, ${service.accent}18, #ffffff 55%, ${service.accent}10)`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <AddonIcon name={service.icon} accent={service.accent} />
                  <div className="min-w-0 text-start">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      {catLabel(service.category)}
                    </p>
                    <h2
                      id="service-detail-title"
                      className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl"
                    >
                      {service.displayName}
                    </h2>
                    {service.featured && (
                      <span
                        className="mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white"
                        style={{ background: service.accent }}
                      >
                        {t("pricing.addonsFeatured")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                  aria-label={t("pricing.modalClose")}
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-start text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                {service.displayDescription}
              </p>

              <p
                className="mt-4 text-start text-xl font-black tracking-tight sm:text-2xl"
                style={{ color: service.accent }}
              >
                {service.displayPrice}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                {t("pricing.modalIncludes")}
              </h3>
              <ul className="mt-3 grid gap-2.5">
                {service.displayDetails.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-start">
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] text-white"
                      style={{
                        background: `linear-gradient(135deg, ${service.accent}, ${service.accent}cc)`,
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-bold leading-6 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {service.displayTracks?.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                    {t("pricing.modalTracks")}
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {service.displayTracks.map((track) => (
                      <div
                        key={track.label}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-start"
                      >
                        <span className="text-sm font-bold text-slate-700">
                          {track.label}
                        </span>
                        <span
                          className="shrink-0 text-sm font-black"
                          style={{ color: service.accent }}
                        >
                          {track.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.displayExtras?.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                    {t("pricing.modalExtras")}
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {service.displayExtras.map((extra) => (
                      <div
                        key={extra.label}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-start"
                      >
                        <span className="text-sm font-bold text-slate-700">
                          {extra.label}
                        </span>
                        <span
                          className="shrink-0 text-sm font-black"
                          style={{ color: service.accent }}
                        >
                          {extra.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.displayExamples?.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-start text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                    {t("pricing.modalExamples")}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.displayExamples.map((example) => (
                      <span
                        key={example}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {service.displayNote && (
                <p className="mt-7 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-start text-sm font-semibold leading-6 text-amber-900">
                  {service.displayNote}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-col gap-2 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:px-8">
              <button
                type="button"
                onClick={() => onPurchase && onPurchase(service)}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}, ${service.accent}dd)`,
                }}
              >
                <Plus size={16} />
                {purchaseLabel || t("pricing.addonsAdd")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                {t("pricing.modalClose")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
