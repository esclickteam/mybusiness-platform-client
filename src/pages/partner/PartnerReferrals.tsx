import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchPartnerReferrals,
  partnerApiError,
  submitPartnerReferral,
} from "../../lib/partnerApi";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { formatIls } from "../../lib/partnerMoney";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
  PartnerTextarea,
} from "../../components/partner/partnerUi";
import { formatPartnerDate } from "../../lib/partnerWork";
import { getIntlLocale } from "../../i18n/localeUtils";

export default function PartnerReferrals() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    referredName: "",
    referredBusinessName: "",
    referredPhone: "",
    referredEmail: "",
    referredIndustry: "",
    notes: "",
  });

  function load() {
    fetchPartnerReferrals()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(partnerApiError(err, t("partner.errors.referrals"))));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved("");
    try {
      await submitPartnerReferral(form);
      setForm({
        referredName: "",
        referredBusinessName: "",
        referredPhone: "",
        referredEmail: "",
        referredIndustry: "",
        notes: "",
      });
      setSaved(t("partner.referrals.sent"));
      load();
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.sendReferral")));
    } finally {
      setSaving(false);
    }
  }

  const qualifying = items.filter(
    (row) => row.rewardStatus === "pending" && row.qualificationStartDate
  );
  const awaitingPaid = items.filter(
    (row) => row.rewardStatus === "pending" && row.rewardBlockedReason === "awaiting_paid_package"
  );

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.referrals.title")}
        title={t("partner.referrals.title")}
        subtitle={t("partner.referrals.intro")}
      />
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      <PartnerCard className="space-y-3 p-6 text-sm font-bold leading-6 text-slate-600">
        <p>{t("partner.referrals.rules")}</p>
        <ul className="list-disc pr-5">
          <li>{t("partner.referrals.oneTime")}</li>
          <li>{t("partner.referrals.paidOnly")}</li>
          <li>{t("partner.referrals.fortyDays")}</li>
          <li>{t("partner.referrals.formNotEnough")}</li>
          <li>{t("partner.referrals.approval")}</li>
          <li>{t("partner.referrals.cancelled")}</li>
        </ul>
      </PartnerCard>

      {awaitingPaid.length ? (
        <PartnerCard className="space-y-3 border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">
            {t("partner.referrals.waitingPaid")}
          </p>
          <ul className="space-y-2">
            {awaitingPaid.map((row) => (
              <li key={row._id} className="text-sm font-black text-slate-800">
                {t("partner.referrals.awaitingPaidItem", {
                  name: row.referredName || t("partner.referrals.referred"),
                })}
              </li>
            ))}
          </ul>
        </PartnerCard>
      ) : null}
      {qualifying.length ? (
        <PartnerCard className="space-y-3 border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-800">
            {t("partner.referrals.track40")}
          </p>
          <ul className="space-y-2">
            {qualifying.map((row) => (
              <li key={row._id} className="text-sm font-black text-slate-800">
                {row.referredName || t("partner.referrals.referred")} —{" "}
                {t("partner.dashboard.referralDay", {
                  current: row.daysActive ?? 0,
                  total: row.qualificationDays || 40,
                })}
              </li>
            ))}
          </ul>
        </PartnerCard>
      ) : null}

      <PartnerCard className="overflow-x-auto">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-lg font-black">{t("partner.referrals.tracking")}</h2>
          <p className="text-xs font-bold text-slate-500">{t("partner.referrals.trackingHint")}</p>
        </div>
        <table className="min-w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-3">{t("partner.referrals.referred")}</th>
              <th className="px-3 py-3">{t("partner.date")}</th>
              <th className="px-3 py-3">{t("common.status")}</th>
              <th className="px-3 py-3">{t("partner.referrals.reward")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-t">
                <td className="px-3 py-3 font-bold">
                  {row.referredName}
                  <span className="block text-xs text-slate-500">{row.referredBusinessName}</span>
                </td>
                <td className="px-3 py-3">{formatPartnerDate(row.createdAt, locale)}</td>
                <td className="px-3 py-3">
                  {partnerStatusLabel(row.status, t)}
                  {row.qualificationStartDate && row.rewardStatus === "pending" ? (
                    <span className="block text-xs text-slate-500">
                      {t("partner.referrals.activeDay", {
                        current: row.daysActive,
                        total: row.qualificationDays || 40,
                      })}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  {row.rewardStatus === "cancelled" || row.status === "rejected"
                    ? "—"
                    : row.rewardStatus === "eligible" || row.rewardStatus === "approved" || row.rewardStatus === "paid"
                      ? formatIls(row.rewardAmount || 500)
                      : t("partner.referrals.pendingEligibility")}
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                  {t("partner.referrals.empty")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </PartnerCard>

      <form onSubmit={submit}>
        <PartnerCard className="space-y-4 p-6">
          <h2 className="text-lg font-black">{t("partner.referrals.formTitle")}</h2>
          {saved ? <p className="text-sm font-bold text-emerald-700">{saved}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-black">
              {t("partner.referrals.fullName")}
              <PartnerInput
                required
                className="mt-1"
                value={form.referredName}
                onChange={(e) => setForm({ ...form, referredName: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              {t("partner.referrals.businessName")}
              <PartnerInput
                required
                className="mt-1"
                value={form.referredBusinessName}
                onChange={(e) => setForm({ ...form, referredBusinessName: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              {t("partner.phone")}
              <PartnerInput
                className="mt-1"
                value={form.referredPhone}
                onChange={(e) => setForm({ ...form, referredPhone: e.target.value })}
              />
            </label>
            <label className="text-sm font-black">
              {t("partner.email")}
              <PartnerInput
                required
                type="email"
                className="mt-1"
                value={form.referredEmail}
                onChange={(e) => setForm({ ...form, referredEmail: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-sm font-black">
            {t("partner.referrals.field")}
            <PartnerInput
              className="mt-1"
              value={form.referredIndustry}
              onChange={(e) => setForm({ ...form, referredIndustry: e.target.value })}
            />
          </label>
          <label className="block text-sm font-black">
            {t("partner.referrals.noteOptional")}
            <PartnerTextarea
              className="mt-1"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <PartnerPrimaryButton type="submit" disabled={saving}>
            {saving ? t("partner.referrals.sending") : t("partner.referrals.send")}
          </PartnerPrimaryButton>
        </PartnerCard>
      </form>
    </div>
  );
}
