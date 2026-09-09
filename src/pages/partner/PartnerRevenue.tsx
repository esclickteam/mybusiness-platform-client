import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchPartnerLedger, partnerApiError } from "../../lib/partnerApi";
import type { AmountDue } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { PartnerCard } from "../../components/partner/partnerUi";
import { getIntlLocale } from "../../i18n/localeUtils";

function ils(value?: number, locale = "he-IL") {
  return `₪${Number(value || 0).toLocaleString(locale)}`;
}

export default function PartnerRevenue() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [due, setDue] = useState<AmountDue | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPartnerLedger()
      .then((data) => {
        setDue(data);
        setItems(data.items || []);
      })
      .catch((err) => setError(partnerApiError(err, t("partner.errors.billing"))));
  }, [t]);

  const monthlyStatus =
    due?.partnerSubscription?.monthlyStatus === "active" ? t("partner.active") : t("partner.inactive");
  const monthlyPayment =
    due?.partnerSubscription?.currentMonthPayment === "paid" ? t("partner.paid") : t("partner.unpaid");
  const setupPaid =
    due?.partnerSubscription?.setupPayment === "paid" ||
    due?.partnerSubscription?.setupPayment === "waived"
      ? t("partner.paid")
      : t("partner.unpaid");

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.revenue.title")}
        title={t("partner.revenue.mySubscription")}
        subtitle={t("partner.revenue.subtitle")}
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-2">
        <PartnerCard className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
            {t("partner.revenue.myPartnerPlan")}
          </p>
          <p className="mt-2 text-2xl font-black">
            {due?.partnerSubscription?.planName || t("partner.planNames.partner_basic")}
          </p>
          <p className="mt-1 font-bold text-slate-700">
            {t("partner.dashboard.perMonthPlain", {
              amount: ils(due?.partnerSubscription?.monthlyFeeIls, locale),
            })}{" "}
            · {monthlyStatus} / {monthlyPayment}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-600">
            {t("partner.revenue.setupFee", {
              amount: ils(due?.partnerSubscription?.setupFeeIls, locale),
              status: setupPaid,
            })}
          </p>
          <p className="mt-3 text-sm font-bold text-slate-500">
            {t("partner.revenue.openDebt", {
              amount: ils(due?.openPartnerSubscriptionDebtIls, locale),
            })}
          </p>
          <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600">
            {t("partner.revenue.billingManaged")}
          </p>
        </PartnerCard>
        <PartnerCard className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C4DFF]">
            {t("partner.revenue.notPartnerDebt")}
          </p>
          <p className="mt-2 text-sm font-bold text-slate-600">
            {t("partner.revenue.customerPays")}
          </p>
        </PartnerCard>
      </section>
      <PartnerCard className="p-5">
        <div className="mt-0 grid gap-2 text-sm sm:grid-cols-2">
          <p>{t("partner.revenue.wholesale", { amount: ils(due?.breakdown?.wholesaleSubscriptions, locale) })}</p>
          <p>{t("partner.revenue.bizuplyMarkup", { amount: ils(due?.breakdown?.bizuplyMarkupShare, locale) })}</p>
          <p>{t("partner.revenue.usage", { amount: ils(due?.breakdown?.usage, locale) })}</p>
          <p>{t("partner.revenue.addOns", { amount: ils(due?.breakdown?.addOns, locale) })}</p>
          <p>{t("partner.revenue.payments", { amount: ils(due?.breakdown?.payments, locale) })}</p>
          <p>
            {t("partner.revenue.partnerPlanPayments", {
              amount: ils(due?.breakdown?.partnerPlanPayments, locale),
            })}
          </p>
        </div>
      </PartnerCard>
      <PartnerCard className="overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-4 py-3">{t("partner.revenue.type")}</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">{t("partner.revenue.amount")}</th>
              <th className="px-4 py-3">{t("partner.revenue.description")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold">{row.entryType}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{ils(row.amountIls, locale)}</td>
                <td className="px-4 py-3">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PartnerCard>
    </div>
  );
}
