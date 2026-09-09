import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  FileText,
  Plus,
  UserPlus,
  Users,
  Bell,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../i18n/localeUtils";
import { fetchPartnerClients, fetchPartnerDashboard, fetchPartnerMe, partnerApiError } from "../../lib/partnerApi";
import type {
  PartnerClient,
  PartnerDashboardPayload,
  PartnerMe,
  PartnerSubscriptionSnapshot,
} from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { formatIls } from "../../lib/partnerMoney";
import { PARTNER_STATUS_TONE, partnerStatusLabel } from "../../lib/partnerLabels";
import {
  PartnerCard,
  PartnerMetricCard,
  PartnerQuickAction,
} from "../../components/partner/partnerUi";
import {
  eventTypeLabel,
  formatPartnerDate,
  formatPartnerDateTime,
  nextTaskDue,
  openTaskCount,
  upcomingReminders,
} from "../../lib/partnerWork";
import { partnerPlanDisplayName } from "../../i18n/partnerCatalogCopy";
import {
  localizePartnerDemoName,
  localizePartnerDemoText,
  partnerDemoTaskTitle,
} from "../../i18n/partnerDemoCopy";

const PRESETS = [
  { id: "today" },
  { id: "week" },
  { id: "month" },
  { id: "last_month" },
  { id: "3m" },
  { id: "6m" },
  { id: "year" },
  { id: "custom" },
];

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

function ils(value: number | null | undefined) {
  if (value == null) return "—";
  return formatIls(value);
}

export default function PartnerDashboard() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<PartnerDashboardPayload | null>(null);
  const [clients, setClients] = useState<PartnerClient[]>([]);
  const [personalUrl, setPersonalUrl] = useState("");
  const [plansUrl, setPlansUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [preset, setPreset] = useState("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { preset };
        if (preset === "custom") {
          if (from) params.from = from;
          if (to) params.to = to;
        }
        const [payload, clientPage] = await Promise.all([
          fetchPartnerDashboard(params),
          fetchPartnerClients({ page: 1, limit: 50 }).catch(() => ({ items: [] as PartnerClient[] })),
        ]);
        if (!cancelled) {
          setData(payload);
          setClients(clientPage.items || []);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setData(null);
          setError(partnerApiError(err, t("partner.errors.dashboard")));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preset, from, to, t]);

  useEffect(() => {
    fetchPartnerMe()
      .then((me) => {
        setPersonalUrl(me.urls?.personalUrl || me.urls?.slugUrl || (me.slug ? `${window.location.origin}/p/${me.slug}` : ""));
        setPlansUrl(me.urls?.plansUrl || (me.slug ? `${window.location.origin}/p/${me.slug}/plans` : ""));
      })
      .catch(() => {});
  }, []);

  if (loading && !data) return <BizuplyLoader fullScreen label={t("partner.dashboard.loading")} />;

  const partner = data?.partner as PartnerMe | undefined;
  const subscription = data?.partnerSubscription || null;
  const counts = data?.clients;
  const metrics = data?.metrics;
  const tableRows = clients.length ? clients.slice(0, 8) : data?.recentClients || [];
  const reminders = upcomingReminders(clients.length ? clients : tableRows, 4);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      {!data ? (
        <p className="text-sm font-bold text-slate-500">
          {t("partner.dashboard.unavailable")}
        </p>
      ) : (
        <>
          <DateRangeBar
            preset={preset}
            from={from}
            to={to}
            onPreset={setPreset}
            onFrom={setFrom}
            onTo={setTo}
            t={t}
          />

          {personalUrl ? (
            <PartnerCard className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">{t("partner.dashboard.personalLink")}</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-700">{personalUrl}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
                  onClick={async () => {
                    await navigator.clipboard.writeText(personalUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? t("partner.copied") : t("partner.copy")}
                </button>
                <a href={personalUrl} target="_blank" rel="noreferrer" className="rounded-2xl border px-4 py-2 text-sm font-black">
                  {t("partner.open")}
                </a>
                {plansUrl ? (
                  <a href={plansUrl} target="_blank" rel="noreferrer" className="rounded-2xl border px-4 py-2 text-sm font-black">
                    {t("partner.dashboard.plansPage")}
                  </a>
                ) : null}
                <Link to="/partner/dashboard/settings" className="rounded-2xl border px-4 py-2 text-sm font-black">
                  {t("partner.dashboard.branding")}
                </Link>
              </div>
            </PartnerCard>
          ) : null}

          {data.attentionDeals?.length ? (
            <PartnerCard className="space-y-3 border border-amber-200 bg-amber-50 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">
                  {t("partner.dashboard.attentionTitle")}
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900">
                  {t("partner.dashboard.attentionText", { count: data.attentionDeals.length })}
                </p>
              </div>
              <ul className="space-y-2">
                {data.attentionDeals.map((deal) => (
                  <li key={deal._id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-800">Deal #{deal.dealNumber}</span>
                    <Link
                      to={`/partner/dashboard/deals/${deal._id}`}
                      className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
                    >
                      {t("partner.dashboard.handleActivation")}
                    </Link>
                  </li>
                ))}
              </ul>
            </PartnerCard>
          ) : null}

          {data.referrals?.qualifying?.length ? (
            <PartnerCard className="space-y-3 border border-violet-200 bg-violet-50 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-800">
                  {t("partner.dashboard.referralTitle")}
                </p>
                <p className="mt-1 text-sm font-bold text-violet-900">
                  {t("partner.dashboard.referralText")}
                </p>
              </div>
              <ul className="space-y-2">
                {data.referrals.qualifying.map((row) => (
                  <li key={row._id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-800">
                      {row.referredName || t("partner.dashboard.referredPartner")} —{" "}
                      {t("partner.dashboard.referralDay", {
                        current: row.daysActive ?? 0,
                        total: row.qualificationDays || 40,
                      })}
                    </span>
                    <Link
                      to="/partner/dashboard/referrals"
                      className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
                    >
                      {t("partner.dashboard.trackReferrals")}
                    </Link>
                  </li>
                ))}
              </ul>
            </PartnerCard>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <PartnerMetricCard
                  label={t("partner.dashboard.activeClients")}
                  value={String(counts?.active ?? 0)}
                  hint={t("partner.dashboard.totalInPortfolio", { count: counts?.total ?? 0 })}
                  href="/partner/dashboard/crm?status=active"
                  icon={<Users className="h-5 w-5" />}
                  iconClassName="bg-violet-100 text-violet-700"
                />
                <PartnerMetricCard
                  label={t("partner.dashboard.openDeals")}
                  value={String(metrics?.transactionCount ?? 0)}
                  hint={t("partner.dashboard.inSelectedRange")}
                  href="/partner/dashboard/transactions"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  iconClassName="bg-emerald-100 text-emerald-700"
                />
                <PartnerMetricCard
                  label={t("partner.dashboard.openTasks")}
                  value={String(metrics?.openTasks ?? 0)}
                  hint={t("partner.dashboard.clientFollowup")}
                  href="/partner/dashboard/tasks"
                  icon={<CalendarCheck className="h-5 w-5" />}
                  iconClassName="bg-rose-100 text-rose-600"
                />
              </div>
                  {metrics?.pendingCommission != null || metrics?.eligibleCommission != null ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <PartnerMetricCard
                    label={t("partner.dashboard.pendingCommission")}
                    value={ils(metrics?.pendingCommission)}
                    hint={t("partner.dashboard.pendingHint")}
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-amber-100 text-amber-700"
                  />
                  <PartnerMetricCard
                    label={t("partner.dashboard.eligibleCommission")}
                    value={ils(metrics?.eligibleCommission)}
                    hint={t("partner.dashboard.eligibleHint")}
                    href="/partner/dashboard/withdrawals"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-emerald-100 text-emerald-700"
                  />
                  <PartnerMetricCard
                    label={t("partner.dashboard.paidCommission")}
                    value={ils(metrics?.paidCommission)}
                    hint={t("partner.dashboard.paidHint")}
                    href="/partner/dashboard/withdrawals"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-slate-100 text-slate-700"
                  />
                </div>
              ) : null}
              {metrics?.oneTimeCommission != null || metrics?.recurringCommission != null ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <PartnerMetricCard
                    label={t("partner.dashboard.oneTimeCommission")}
                    value={ils(metrics?.oneTimeCommission)}
                    hint={t("partner.dashboard.oneTimeHint")}
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-violet-100 text-violet-700"
                  />
                  <PartnerMetricCard
                    label={t("partner.dashboard.commissionMrr")}
                    value={ils(metrics?.commissionMrr)}
                    hint={t("partner.dashboard.mrrHint")}
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-sky-100 text-sky-700"
                  />
                  <PartnerMetricCard
                    label={t("partner.dashboard.referralCommission")}
                    value={ils(metrics?.referralCommission)}
                    hint={t("partner.dashboard.referralHint")}
                    href="/partner/dashboard/referrals"
                    icon={<UserPlus className="h-5 w-5" />}
                    iconClassName="bg-amber-100 text-amber-800"
                  />
                </div>
              ) : null}

              <PartnerCard className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <h2 className="text-lg font-black text-slate-900">{t("partner.clients")}</h2>
                  <Link
                    to="/partner/dashboard/clients/new"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-2.5 text-sm font-black text-white"
                  >
                    <Plus className="h-4 w-4" />
                    {t("partner.newClient")}
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-right text-sm">
                    <thead className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-5 py-3">{t("partner.client")}</th>
                        <th className="px-3 py-3">{t("common.status")}</th>
                        <th className="px-3 py-3">{t("partner.contact")}</th>
                        <th className="px-3 py-3">{t("partner.phone")}</th>
                        <th className="px-3 py-3">{t("partner.dashboard.eventType")}</th>
                        <th className="px-3 py-3">{t("partner.dashboard.dueDate")}</th>
                        <th className="px-3 py-3">{t("partner.tasks")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr
                          key={row._id}
                          className="cursor-pointer border-t border-slate-100 transition hover:bg-violet-50/40"
                          onClick={() => navigate(`/partner/dashboard/crm/${row._id}`)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-black text-violet-800">
                                {(
                                  localizePartnerDemoName(t, row.contact?.businessName, {
                                    personaKey: row.personaKey,
                                    field: "businessName",
                                  }) || "?"
                                ).slice(0, 1)}
                              </span>
                              <p className="font-black text-slate-900">
                                {localizePartnerDemoName(t, row.contact?.businessName, {
                                  personaKey: row.personaKey,
                                  field: "businessName",
                                }) || "—"}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                                PARTNER_STATUS_TONE[row.status] || "bg-slate-100"
                              }`}
                            >
                              {partnerStatusLabel(row.status, t)}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-700">
                            {localizePartnerDemoName(t, row.contact?.contactName, {
                              personaKey: row.personaKey,
                              field: "contactName",
                            }) || "—"}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600" dir="ltr">
                            {row.contact?.phone || "—"}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600">
                            {eventTypeLabel(row, t)}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600">
                            {formatPartnerDate(nextTaskDue(row) || row.nextBillingDate, locale)}
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                              {openTaskCount(row)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!tableRows.length ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center font-bold text-slate-400">
                            {t("partner.dashboard.emptyClients")}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500">
                  <span>
                    {t("partner.dashboard.showingClients", {
                      shown: tableRows.length,
                      total: counts?.total ?? tableRows.length,
                    })}
                  </span>
                  <Link to="/partner/dashboard/crm" className="font-black text-violet-700">
                    {t("partner.dashboard.allClients")}
                  </Link>
                </div>
              </PartnerCard>
            </div>

            <div className="space-y-4">
              <PartnerCard className="p-4">
                <h3 className="mb-2 px-1 text-sm font-black text-slate-900">{t("partner.dashboard.quickActions")}</h3>
                <PartnerQuickAction
                  to="/partner/dashboard/clients/new"
                  label={t("partner.newClient")}
                  icon={<UserPlus className="h-4 w-4" />}
                  tone="violet"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/tasks?new=1"
                  label={t("partner.dashboard.newTask")}
                  icon={<CalendarCheck className="h-4 w-4" />}
                  tone="emerald"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/reminders?new=1"
                  label={t("partner.dashboard.newReminder")}
                  icon={<Bell className="h-4 w-4" />}
                  tone="orange"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/clients/new"
                  label={t("partner.quote")}
                  icon={<FileText className="h-4 w-4" />}
                  tone="sky"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/withdrawals"
                  label={t("partner.dashboard.withdrawCommission")}
                  icon={<Wallet className="h-4 w-4" />}
                  tone="sky"
                />
              </PartnerCard>

              <PartnerCard className="p-4">
                <h3 className="mb-3 px-1 text-sm font-black text-slate-900">{t("partner.dashboard.upcomingReminders")}</h3>
                <div className="space-y-2">
                  {reminders.map((item) => (
                    <Link
                      key={item.taskId}
                      to={`/partner/dashboard/crm/${item.clientId}`}
                      className="block rounded-2xl bg-slate-50 px-3 py-3 hover:bg-violet-50"
                    >
                      <p className="text-sm font-black text-slate-900">
                        {partnerDemoTaskTitle(t, item)}
                      </p>
                      <p className="text-[11px] font-bold text-slate-500">
                        {localizePartnerDemoName(t, item.clientName, {
                          personaKey: item.personaKey,
                          field: "businessName",
                        })}{" "}
                        · {formatPartnerDateTime(item.dueAt, locale)}
                      </p>
                    </Link>
                  ))}
                  {!reminders.length ? (
                    <p className="px-1 text-sm font-bold text-slate-400">{t("partner.dashboard.noReminders")}</p>
                  ) : null}
                </div>
                <Link
                  to="/partner/dashboard/reminders"
                  className="mt-3 inline-flex items-center gap-1 px-1 text-xs font-black text-violet-700"
                >
                  {t("partner.dashboard.allReminders")}
                </Link>
              </PartnerCard>

              <MyPartnerSubscriptionCard partner={partner} subscription={subscription} t={t} locale={locale} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DateRangeBar({
  preset,
  from,
  to,
  onPreset,
  onFrom,
  onTo,
  t: tProp,
}: {
  preset: string;
  from: string;
  to: string;
  onPreset: (value: string) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  t?: TranslateFn;
}) {
  const { t: tHook } = useTranslation();
  const t = tProp || tHook;
  return (
    <section className="rounded-[16px] border border-slate-100 bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPreset(item.id)}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-black",
              preset === item.id
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {t(`partner.${item.id}`)}
          </button>
        ))}
      </div>
      {preset === "custom" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-black text-slate-500">
            {t("partner.from")}
            <input
              type="date"
              value={from}
              onChange={(e) => onFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          </label>
          <label className="text-xs font-black text-slate-500">
            {t("partner.to")}
            <input
              type="date"
              value={to}
              onChange={(e) => onTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}

function paymentLabel(value: string | null | undefined, t: TranslateFn) {
  if (value === "paid" || value === "waived") return t("partner.paid");
  if (value === "unpaid") return t("partner.unpaid");
  return "—";
}

function statusLabel(value: string | null | undefined, t: TranslateFn) {
  if (value === "active") return t("partner.active");
  if (value === "inactive") return t("partner.inactive");
  return value || "—";
}

function MyPartnerSubscriptionCard({
  partner,
  subscription,
  t,
  locale,
}: {
  partner?: PartnerMe;
  subscription: PartnerSubscriptionSnapshot | null;
  t: TranslateFn;
  locale: string;
}) {
  const planName =
    partnerPlanDisplayName(t, {
      planKey: partner?.planKey || subscription?.planKey || partner?.plan?.planKey,
      nameHe: partner?.plan?.nameHe,
      nameEn: partner?.plan?.nameEn,
    }) ||
    localizePartnerDemoText(t, subscription?.planName) ||
    partner?.planKey ||
    t("partner.dashboard.partnerPlan");
  const monthly = subscription?.monthlyFeeIls ?? partner?.plan?.monthlyIls ?? null;
  const renewal = partner?.nextRenewalAt || partner?.currentPeriodEnd;
  return (
    <PartnerCard className="overflow-hidden p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C3AED]">
        {t("partner.dashboard.mySubscription")}
      </p>
      <p className="mt-1 text-lg font-black text-slate-900">{planName}</p>
      <p className="text-sm font-black text-slate-700">
        {monthly != null ? t("partner.dashboard.perMonthPlain", { amount: ils(monthly) }) : "—"}
      </p>
      <p className="mt-2 text-xs font-bold text-slate-500">
        {statusLabel(subscription?.monthlyStatus, t)} / {paymentLabel(subscription?.currentMonthPayment, t)}
      </p>
      <p className="text-xs font-bold text-slate-500">
        {t("partner.dashboard.renewal", { date: renewal ? formatPartnerDate(renewal, locale) : "—" })}
      </p>
    </PartnerCard>
  );
}

export { DateRangeBar, PRESETS };
