import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPartnerTransactions, partnerApiError } from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import { DateRangeBar } from "./PartnerDashboard";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { PartnerCard } from "../../components/partner/partnerUi";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { formatPartnerDate } from "../../lib/partnerWork";
import { getIntlLocale } from "../../i18n/localeUtils";

const PAYMENT_STATUSES = ["", "paid", "unpaid", "refunded", "chargeback"];
const COMMISSION_STATUSES = [
  "",
  "pending",
  "eligible",
  "withdrawal_requested",
  "approved",
  "paid",
  "reversed",
];

function ils(value?: number) {
  return formatIls(Number(value || 0));
}

function paymentFilterLabel(id: string, t: (key: string) => string) {
  if (!id) return t("partner.transactions.allCustomerPayments");
  if (id === "paid") return t("partner.paid");
  if (id === "unpaid") return t("partner.unpaid");
  return partnerStatusLabel(id, t);
}

function commissionFilterLabel(id: string, t: (key: string) => string) {
  if (!id) return t("partner.transactions.allCommissionStatuses");
  const keyMap: Record<string, string> = {
    pending: "partner.transactions.pending",
    eligible: "partner.transactions.eligible",
    withdrawal_requested: "partner.transactions.requested",
    approved: "partner.transactions.approved",
    paid: "partner.transactions.paid",
    reversed: "partner.transactions.reversed",
  };
  return t(keyMap[id] || `partner.status.${id}`);
}

export default function PartnerTransactions() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [commissionStatus, setCommissionStatus] = useState("");
  const [product, setProduct] = useState("");
  const [client, setClient] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params: Record<string, string> = { preset, limit: "100" };
        if (preset === "custom") {
          if (from) params.from = from;
          if (to) params.to = to;
        }
        if (paymentStatus) params.paymentStatus = paymentStatus;
        if (commissionStatus) params.commissionStatus = commissionStatus;
        if (product) params.sku = product;
        if (client) params.clientId = client;
        const data = await fetchPartnerTransactions(params);
        if (!cancelled) {
          setRows(data.items || []);
          setTotals(data.totals || null);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) setError(partnerApiError(err, t("partner.errors.transactions")));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preset, from, to, paymentStatus, commissionStatus, product, client, t]);

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.transactions.title")}
        title={t("partner.transactions.subtitle")}
        subtitle={t("partner.transactions.intro")}
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      <DateRangeBar
        preset={preset}
        from={from}
        to={to}
        onPreset={setPreset}
        onFrom={setFrom}
        onTo={setTo}
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        >
          {PAYMENT_STATUSES.map((item) => (
            <option key={item || "all-payments"} value={item}>
              {paymentFilterLabel(item, t)}
            </option>
          ))}
        </select>
        <select
          value={commissionStatus}
          onChange={(e) => setCommissionStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        >
          {COMMISSION_STATUSES.map((item) => (
            <option key={item || "all-commission"} value={item}>
              {commissionFilterLabel(item, t)}
            </option>
          ))}
        </select>
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder={t("partner.transactions.clientId")}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        />
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={t("partner.transactions.product")}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
        />
      </div>
      {totals ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label={t("partner.transactions.dealTotal")} value={ils(totals.totalSales)} />
          <Kpi label={t("partner.transactions.yourCommission")} value={ils(totals.partnerCommission)} />
          <Kpi label={t("partner.transactions.pendingCommission")} value={ils(totals.pendingCommission)} />
          <Kpi label={t("partner.transactions.eligible")} value={ils(totals.eligibleCommission)} />
          <Kpi label={t("partner.transactions.oneTime")} value={ils(totals.oneTimeCommission)} />
          <Kpi label={t("partner.transactions.monthly")} value={ils(totals.recurringCommission)} />
          <Kpi label={t("partner.transactions.mrr")} value={ils(totals.commissionMrr)} />
          <Kpi label={t("partner.transactions.referral")} value={ils(totals.referralCommission)} />
        </section>
      ) : null}
      <PartnerCard className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">{t("partner.transactions.date")}</th>
              <th className="px-3 py-3">{t("partner.client")}</th>
              <th className="px-3 py-3">{t("partner.dealLabel")}</th>
              <th className="px-3 py-3">{t("partner.transactions.product")}</th>
              <th className="px-3 py-3">{t("partner.transactions.dealAmount")}</th>
              <th className="px-3 py-3">{t("partner.transactions.commission")}</th>
              <th className="px-3 py-3">{t("partner.transactions.bizuplyShare")}</th>
              <th className="px-3 py-3">{t("partner.transactions.paymentStatus")}</th>
              <th className="px-3 py-3">{t("partner.transactions.commissionStatus")}</th>
              <th className="px-3 py-3">{t("partner.transactions.source")}</th>
              <th className="px-3 py-3">{t("partner.transactions.paymentRef")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id} className="border-t border-slate-100">
                <td className="px-3 py-3">{formatPartnerDate(row.transactionDate, locale)}</td>
                <td className="px-3 py-3 font-bold">{row.clientName || "—"}</td>
                <td className="px-3 py-3">
                  {row.dealId ? (
                    <Link
                      className="font-black text-violet-700 hover:underline"
                      to={`/partner/dashboard/deals/${row.dealId}`}
                    >
                      {row.dealNumber || t("partner.dealLabel")}
                    </Link>
                  ) : (
                    row.dealNumber || "—"
                  )}
                </td>
                <td className="px-3 py-3">{row.product || "—"}</td>
                <td className="px-3 py-3">{ils(row.customerFinalPrice)}</td>
                <td className="px-3 py-3 font-black">{ils(row.partnerCommissionAmount)}</td>
                <td className="px-3 py-3">{ils(row.bizuplyGrossAmount || row.bizuplyMarkupShare)}</td>
                <td className="px-3 py-3">{partnerStatusLabel(row.customerPaymentStatus, t)}</td>
                <td className="px-3 py-3">{partnerStatusLabel(row.commissionStatus, t)}</td>
                <td className="px-3 py-3">
                  {partnerStatusLabel(row.salesSource || row.sourceType || row.commissionType, t)}
                  {row.sourceType === "renewal" ||
                  row.commissionType === "customer_renewal" ||
                  row.commissionType === "customer_sale_recurring"
                    ? ` · ${t("partner.transactions.renewal")}`
                    : ""}
                </td>
                <td className="px-3 py-3 text-xs">
                  {row.stripePaymentIntentId || row.reference || row.transactionId}
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="px-3 py-8 text-center font-bold text-slate-400" colSpan={11}>
                  {t("partner.transactions.empty")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PartnerCard>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
