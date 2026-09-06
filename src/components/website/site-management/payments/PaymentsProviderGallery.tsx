import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, CreditCard } from "lucide-react";

import type { SitePaymentProvider } from "../../../../api/sitePaymentsApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
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

const BADGE_KEYS: Record<string, string> = {
  "תומך בהוראות קבע": "badgeRecurring",
  "בינלאומי": "badgeIntl",
  "תומך בתשלומים": "badgePayments",
};

export default function PaymentsProviderGallery({
  savedProviders,
  onConnect,
  onManage,
}: PaymentsProviderGalleryProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const savedMap = new Map(
    savedProviders.map((item) => [item.provider, item])
  );

  return (
    <div dir={pageDir} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {t("payments.gallery.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {t("payments.gallery.subtitle", {
            country: t("payments.gallery.israel"),
          })}
        </p>
      </div>

      <div className="space-y-3">
        {SITE_PAYMENT_PROVIDERS.map((item) => {
          const saved = savedMap.get(item.key);
          const connected = isProviderConnected(
            saved?.connectionStatus,
            saved?.isEnabled
          );
          const description = t(`payments.providers.${item.key}.description`, {
            defaultValue: item.description,
          });
          const subtitle = item.subtitle
            ? t(`payments.providers.${item.key}.subtitle`, {
                defaultValue: item.subtitle,
              })
            : null;

          return (
            <div
              key={item.key}
              className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <ProviderLogo item={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.name}
                    </h3>
                    {connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <CheckCircle2 size={12} />
                        {t("payments.gallery.connected")}
                      </span>
                    ) : null}
                  </div>
                  {subtitle ? (
                    <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                  {item.badges?.length ? (
                    <div className="mt-2 flex flex-wrap justify-start gap-1.5">
                      {item.badges.map((badge) => {
                        const badgeKey = BADGE_KEYS[badge];
                        return (
                          <span
                            key={badge}
                            className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                          >
                            {badgeKey
                              ? t(`payments.providers.${item.key}.${badgeKey}`, {
                                  defaultValue: badge,
                                })
                              : badge}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  <p className="mt-2 text-[11px] text-slate-400">
                    {t("payments.gallery.fees")}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-start gap-2 sm:flex-col sm:items-stretch">
                {connected ? (
                  <button
                    type="button"
                    onClick={() => onManage(item)}
                    className={`${btnSecondary} h-10 px-4 text-xs`}
                  >
                    <CreditCard size={14} />
                    {t("payments.gallery.manage")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onConnect(item)}
                    className={`${btnPrimary} h-10 px-4 text-xs`}
                  >
                    {t("payments.gallery.connect")}
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
