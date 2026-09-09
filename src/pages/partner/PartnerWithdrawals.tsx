import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchPartnerWithdrawals,
  partnerApiError,
  submitPartnerWithdrawal,
} from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import { formatPartnerDate } from "../../lib/partnerWork";
import { getIntlLocale } from "../../i18n/localeUtils";

const STATUS_KEY: Record<string, string> = {
  submitted: "submitted",
  under_review: "review",
  approved: "approved",
  rejected: "rejected",
  paid: "paid",
  cancelled: "cancelled",
};

export default function PartnerWithdrawals() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [items, setItems] = useState<any[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [cycle, setCycle] = useState<any>(null);
  const [kyc, setKyc] = useState<{ approved?: boolean; reviewStatus?: string } | null>(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptAmount, setReceiptAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const data = await fetchPartnerWithdrawals();
    setItems(data.items || []);
    setBalances(data.balances);
    setCycle(data.cycle);
    setKyc(data.kyc || null);
    if (!amount && data.balances?.eligible) setAmount(String(data.balances.eligible));
  }

  useEffect(() => {
    refresh().catch((err) => setError(partnerApiError(err, t("partner.errors.withdrawals"))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  async function submit() {
    if (!file) {
      setError(t("partner.errors.receiptRequired"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const form = new FormData();
      form.append("amount", amount);
      form.append("receiptNumber", receiptNumber);
      form.append("receiptAmount", receiptAmount || amount);
      form.append("receipt", file);
      await submitPartnerWithdrawal(form);
      setFile(null);
      setReceiptNumber("");
      await refresh();
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.sendRequest")));
    } finally {
      setSaving(false);
    }
  }

  const kycBlocked = kyc && kyc.approved === false;
  const canSubmit = Boolean(file && receiptNumber.trim() && Number(amount) > 0 && !kycBlocked);

  function statusLabel(status: string) {
    const key = STATUS_KEY[status] || status;
    return t(`partner.withdrawals.status.${key}`, { defaultValue: status });
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.withdrawals.title")}
        title={t("partner.withdrawals.requestTitle")}
        subtitle={t("partner.withdrawals.policy")}
      />
      <p className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-600">
        {t("partner.withdrawals.settingsReminder")}{" "}
        <Link to="/partner/dashboard/settings" className="font-black text-violet-700">
          {t("partner.settings.subtitle")}
        </Link>
        .
      </p>
      {kycBlocked ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
          {t("partner.withdrawals.completeKyc")}
        </p>
      ) : null}
      {cycle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-800">
          {cycle.afterCutoff
            ? t("partner.withdrawals.cycleAfterCutoff")
            : t("partner.withdrawals.policy")}
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-3">
        <Kpi label={t("partner.withdrawals.requestsUntil")} value={t("partner.withdrawals.twentieth")} />
        <Kpi label={t("partner.withdrawals.paidBy")} value={t("partner.withdrawals.first")} />
        <Kpi label={t("partner.withdrawals.afterTwentieth")} value={t("partner.withdrawals.nextMonth")} />
      </section>
      {error ? <p className="font-black text-rose-700">{error}</p> : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t("partner.withdrawals.available")} value={formatIls(balances?.eligible, locale)} />
        <Kpi label={t("partner.withdrawals.pending")} value={formatIls(balances?.pending, locale)} />
        <Kpi label={t("partner.withdrawals.inRequests")} value={formatIls(balances?.requested, locale)} />
        <Kpi label={t("partner.withdrawals.status.paid")} value={formatIls(balances?.paid, locale)} />
      </section>

      <section className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <h3 className="mb-4 font-black">{t("partner.withdrawals.requestTitle")}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-black">
            {t("partner.withdrawals.amount")}
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            {t("partner.withdrawals.receiptNumber")}
            <input
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            {t("partner.withdrawals.receiptAmount")}
            <input
              type="number"
              value={receiptAmount}
              onChange={(e) => setReceiptAmount(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2"
            />
          </label>
          <label className="text-sm font-black">
            {t("partner.withdrawals.receiptFile")}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={!canSubmit || saving}
          onClick={submit}
          className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
        >
          {saving ? t("partner.withdrawals.sending") : t("partner.withdrawals.requestTitle")}
        </button>
      </section>

      <section className="overflow-x-auto rounded-[16px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">{t("partner.withdrawals.requestNumber")}</th>
              <th className="px-3 py-3">{t("partner.date")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.amount")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.receipt")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.expectedPayment")}</th>
              <th className="px-3 py-3">{t("common.status")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.feedback")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.paidAt")}</th>
              <th className="px-3 py-3">{t("partner.withdrawals.reference")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="px-3 py-3 font-black">{row.requestNumber}</td>
                <td className="px-3 py-3">{formatPartnerDate(row.submittedAt, locale)}</td>
                <td className="px-3 py-3">{formatIls(row.amount, locale)}</td>
                <td className="px-3 py-3">{row.receiptNumber}</td>
                <td className="px-3 py-3">{formatPartnerDate(row.expectedPaymentBy, locale)}</td>
                <td className="px-3 py-3">{statusLabel(row.status)}</td>
                <td className="px-3 py-3">{row.adminFeedback || "—"}</td>
                <td className="px-3 py-3">{formatPartnerDate(row.paidAt, locale)}</td>
                <td className="px-3 py-3">{row.paymentReference || "—"}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center font-bold text-slate-400">
                  {t("partner.withdrawals.empty")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
