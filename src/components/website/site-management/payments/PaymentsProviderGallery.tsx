import React from "react";
import { CheckCircle2, CreditCard } from "lucide-react";

import type { SitePaymentProvider } from "../../../../api/sitePaymentsApi";
import { btnPrimary, btnSecondary } from "../siteManagementUi";
import {
  SITE_PAYMENT_PROVIDERS,
  isProviderConnected,
  type PaymentProviderCatalogItem,
} from "./paymentProvidersCatalog";

type PaymentsProviderGalleryProps = {
  savedProviders: SitePaymentProvider[];
  onConnect: (provider: PaymentProviderCatalogItem) => void;
  onManage: (provider: PaymentProviderCatalogItem) => void;
};

function ProviderLogo({ item }: { item: PaymentProviderCatalogItem }) {
  return (
    <div
      className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-xs font-bold text-white shadow-sm"
      style={{ background: item.accent }}
      aria-hidden
    >
      {item.logoText}
    </div>
  );
}

export default function PaymentsProviderGallery({
  savedProviders,
  onConnect,
  onManage,
}: PaymentsProviderGalleryProps) {
  const savedMap = new Map(
    savedProviders.map((item) => [item.provider, item])
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          חיבור אמצעי תשלום
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          בחרו איך לקבל תשלומים מלקוחות עבור העסק שלכם ב־
          <span className="font-semibold text-slate-700"> ישראל</span>
        </p>
      </div>

      <div className="space-y-3">
        {SITE_PAYMENT_PROVIDERS.map((item) => {
          const saved = savedMap.get(item.key);
          const connected = isProviderConnected(
            saved?.connectionStatus,
            saved?.isEnabled
          );

          return (
            <div
              key={item.key}
              className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <ProviderLogo item={item} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.name}
                    </h3>
                    {connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <CheckCircle2 size={12} />
                        מחובר
                      </span>
                    ) : null}
                  </div>
                  {item.subtitle ? (
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                  {item.badges?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-2 text-[11px] text-slate-400">
                    העמלות משתנות בהתאם למיקום העסק ולספק.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch">
                {connected ? (
                  <button
                    type="button"
                    onClick={() => onManage(item)}
                    className={`${btnSecondary} h-10 px-4 text-xs`}
                  >
                    <CreditCard size={14} />
                    ניהול
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConnect(item)}
                    className={`${btnPrimary} h-10 px-4 text-xs`}
                  >
                    חיבור
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
