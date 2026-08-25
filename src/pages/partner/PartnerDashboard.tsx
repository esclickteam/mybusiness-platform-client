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
import { fetchPartnerClients, fetchPartnerDashboard, fetchPartnerMe, partnerApiError } from "../../lib/partnerApi";
import type {
  PartnerClient,
  PartnerDashboardPayload,
  PartnerMe,
  PartnerSubscriptionSnapshot,
} from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { formatIls } from "../../lib/partnerMoney";
import { PARTNER_STATUS_LABEL, PARTNER_STATUS_TONE } from "../../lib/partnerLabels";
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

const PRESETS = [
  { id: "today", label: "היום" },
  { id: "week", label: "השבוע" },
  { id: "month", label: "החודש" },
  { id: "last_month", label: "החודש הקודם" },
  { id: "3m", label: "3 חודשים" },
  { id: "6m", label: "6 חודשים" },
  { id: "year", label: "השנה" },
  { id: "custom", label: "טווח מותאם אישית" },
];

function ils(value: number | null | undefined) {
  if (value == null) return "—";
  return formatIls(value);
}

export default function PartnerDashboard() {
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
          setError(partnerApiError(err, "שגיאה בטעינת הדשבורד"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preset, from, to]);

  useEffect(() => {
    fetchPartnerMe()
      .then((me) => {
        setPersonalUrl(me.urls?.personalUrl || me.urls?.slugUrl || (me.slug ? `${window.location.origin}/p/${me.slug}` : ""));
        setPlansUrl(me.urls?.plansUrl || (me.slug ? `${window.location.origin}/p/${me.slug}/plans` : ""));
      })
      .catch(() => {});
  }, []);

  if (loading && !data) return <BizuplyLoader fullScreen label="טוען לוח פרטנר..." />;

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
          לא ניתן להציג מדדים עד שהדשבורד נטען בהצלחה.
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
          />

          {personalUrl ? (
            <PartnerCard className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">הקישור האישי שלי</p>
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
                  {copied ? "הועתק" : "העתק קישור"}
                </button>
                <a href={personalUrl} target="_blank" rel="noreferrer" className="rounded-2xl border px-4 py-2 text-sm font-black">
                  הצג עמוד
                </a>
                {plansUrl ? (
                  <a href={plansUrl} target="_blank" rel="noreferrer" className="rounded-2xl border px-4 py-2 text-sm font-black">
                    עמוד חבילות
                  </a>
                ) : null}
                <Link to="/partner/dashboard/page" className="rounded-2xl border px-4 py-2 text-sm font-black">
                  מיתוג
                </Link>
              </div>
            </PartnerCard>
          ) : null}

          {data.attentionDeals?.length ? (
            <PartnerCard className="space-y-3 border border-amber-200 bg-amber-50 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">
                  שולם – דורש טיפול
                </p>
                <p className="mt-1 text-sm font-bold text-amber-900">
                  יש {data.attentionDeals.length} עסקאות ששולמו אך הלקוח עדיין לא הופעל. העמלה ממתינה
                  עד השלמת ההפעלה.
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
                      טיפול בהפעלה
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
                  צירוף פרטנר – ₪500
                </p>
                <p className="mt-1 text-sm font-bold text-violet-900">
                  התגמול נזקף אוטומטית אחרי 40 ימי פעילות. כניסה ללוח זה מריצה את הבדיקה.
                </p>
              </div>
              <ul className="space-y-2">
                {data.referrals.qualifying.map((row) => (
                  <li key={row._id} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-black text-slate-800">
                      {row.referredName || "פרטנר שהופנה"} — יום {row.daysActive ?? 0} מתוך{" "}
                      {row.qualificationDays || 40}
                    </span>
                    <Link
                      to="/partner/dashboard/referrals"
                      className="rounded-2xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
                    >
                      מעקב הפניות
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
                  label="לקוחות פעילים"
                  value={String(counts?.active ?? 0)}
                  hint={`${counts?.total ?? 0} סה״כ בתיק`}
                  href="/partner/dashboard/crm?status=active"
                  icon={<Users className="h-5 w-5" />}
                  iconClassName="bg-violet-100 text-violet-700"
                />
                <PartnerMetricCard
                  label="עסקאות פתוחות"
                  value={String(metrics?.transactionCount ?? 0)}
                  hint="בטווח שנבחר"
                  href="/partner/dashboard/transactions"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  iconClassName="bg-emerald-100 text-emerald-700"
                />
                <PartnerMetricCard
                  label="משימות פתוחות"
                  value={String(metrics?.openTasks ?? 0)}
                  hint="מעקב בתיקי הלקוחות"
                  href="/partner/dashboard/tasks"
                  icon={<CalendarCheck className="h-5 w-5" />}
                  iconClassName="bg-rose-100 text-rose-600"
                />
              </div>
                  {metrics?.pendingCommission != null || metrics?.eligibleCommission != null ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <PartnerMetricCard
                    label="עמלה ממתינה"
                    value={ils(metrics?.pendingCommission)}
                    hint="מחכה להפעלת הלקוח והמוצרים"
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-amber-100 text-amber-700"
                  />
                  <PartnerMetricCard
                    label="זמינה למשיכה"
                    value={ils(metrics?.eligibleCommission)}
                    hint="רק אחרי שהעסקה הושלמה"
                    href="/partner/dashboard/withdrawals"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-emerald-100 text-emerald-700"
                  />
                  <PartnerMetricCard
                    label="עמלה ששולמה"
                    value={ils(metrics?.paidCommission)}
                    hint="כבר הועברה"
                    href="/partner/dashboard/withdrawals"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-slate-100 text-slate-700"
                  />
                </div>
              ) : null}
              {metrics?.oneTimeCommission != null || metrics?.recurringCommission != null ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <PartnerMetricCard
                    label="עמלות חד-פעמיות"
                    value={ils(metrics?.oneTimeCommission)}
                    hint="מכירות לקוח חד-פעמיות בטווח"
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-violet-100 text-violet-700"
                  />
                  <PartnerMetricCard
                    label="MRR מעמלות"
                    value={ils(metrics?.commissionMrr)}
                    hint="עמלות חודשיות בטווח"
                    href="/partner/dashboard/transactions"
                    icon={<Wallet className="h-5 w-5" />}
                    iconClassName="bg-sky-100 text-sky-700"
                  />
                  <PartnerMetricCard
                    label="עמלות צירוף פרטנרים"
                    value={ils(metrics?.referralCommission)}
                    hint="₪500 אחרי 40 ימים — לא חלק מ-MRR"
                    href="/partner/dashboard/referrals"
                    icon={<UserPlus className="h-5 w-5" />}
                    iconClassName="bg-amber-100 text-amber-800"
                  />
                </div>
              ) : null}

              <PartnerCard className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <h2 className="text-lg font-black text-slate-900">לקוחות</h2>
                  <Link
                    to="/partner/dashboard/clients/new"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0F172A] px-4 py-2.5 text-sm font-black text-white"
                  >
                    <Plus className="h-4 w-4" />
                    לקוח חדש
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-right text-sm">
                    <thead className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-5 py-3">לקוח</th>
                        <th className="px-3 py-3">סטטוס</th>
                        <th className="px-3 py-3">איש קשר</th>
                        <th className="px-3 py-3">טלפון</th>
                        <th className="px-3 py-3">סוג אירוע</th>
                        <th className="px-3 py-3">תאריך יעד</th>
                        <th className="px-3 py-3">משימות</th>
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
                                {(row.contact?.businessName || "?").slice(0, 1)}
                              </span>
                              <p className="font-black text-slate-900">
                                {row.contact?.businessName || "—"}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                                PARTNER_STATUS_TONE[row.status] || "bg-slate-100"
                              }`}
                            >
                              {PARTNER_STATUS_LABEL[row.status] || row.status}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-700">
                            {row.contact?.contactName || "—"}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600" dir="ltr">
                            {row.contact?.phone || "—"}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600">
                            {eventTypeLabel(row)}
                          </td>
                          <td className="px-3 py-3.5 font-bold text-slate-600">
                            {formatPartnerDate(nextTaskDue(row) || row.nextBillingDate)}
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
                            אין לקוחות עדיין — התחילו בלקוח חדש
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500">
                  <span>
                    מציג {tableRows.length} מתוך {counts?.total ?? tableRows.length} לקוחות
                  </span>
                  <Link to="/partner/dashboard/crm" className="font-black text-violet-700">
                    לכל הלקוחות
                  </Link>
                </div>
              </PartnerCard>
            </div>

            <div className="space-y-4">
              <PartnerCard className="p-4">
                <h3 className="mb-2 px-1 text-sm font-black text-slate-900">פעולות מהירות</h3>
                <PartnerQuickAction
                  to="/partner/dashboard/clients/new"
                  label="לקוח חדש"
                  icon={<UserPlus className="h-4 w-4" />}
                  tone="violet"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/tasks?new=1"
                  label="משימה חדשה"
                  icon={<CalendarCheck className="h-4 w-4" />}
                  tone="emerald"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/reminders?new=1"
                  label="תזכורת חדשה"
                  icon={<Bell className="h-4 w-4" />}
                  tone="orange"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/clients/new"
                  label="הצעת מחיר"
                  icon={<FileText className="h-4 w-4" />}
                  tone="sky"
                />
                <PartnerQuickAction
                  to="/partner/dashboard/withdrawals"
                  label="משיכת עמלה"
                  icon={<Wallet className="h-4 w-4" />}
                  tone="sky"
                />
              </PartnerCard>

              <PartnerCard className="p-4">
                <h3 className="mb-3 px-1 text-sm font-black text-slate-900">תזכורות קרובות</h3>
                <div className="space-y-2">
                  {reminders.map((item) => (
                    <Link
                      key={item.taskId}
                      to={`/partner/dashboard/crm/${item.clientId}`}
                      className="block rounded-2xl bg-slate-50 px-3 py-3 hover:bg-violet-50"
                    >
                      <p className="text-sm font-black text-slate-900">{item.title}</p>
                      <p className="text-[11px] font-bold text-slate-500">
                        {item.clientName} · {formatPartnerDateTime(item.dueAt)}
                      </p>
                    </Link>
                  ))}
                  {!reminders.length ? (
                    <p className="px-1 text-sm font-bold text-slate-400">אין תזכורות קרובות</p>
                  ) : null}
                </div>
                <Link
                  to="/partner/dashboard/reminders"
                  className="mt-3 inline-flex items-center gap-1 px-1 text-xs font-black text-violet-700"
                >
                  לכל התזכורות
                </Link>
              </PartnerCard>

              <MyPartnerSubscriptionCard partner={partner} subscription={subscription} />
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
}: {
  preset: string;
  from: string;
  to: string;
  onPreset: (value: string) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
}) {
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
            {item.label}
          </button>
        ))}
      </div>
      {preset === "custom" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-black text-slate-500">
            מ
            <input
              type="date"
              value={from}
              onChange={(e) => onFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold"
            />
          </label>
          <label className="text-xs font-black text-slate-500">
            עד
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

function paymentLabel(value?: string | null) {
  if (value === "paid" || value === "waived") return "שולם";
  if (value === "unpaid") return "לא שולם";
  return "—";
}

function statusLabel(value?: string | null) {
  if (value === "active") return "פעיל";
  if (value === "inactive") return "לא פעיל";
  return value || "—";
}

function MyPartnerSubscriptionCard({
  partner,
  subscription,
}: {
  partner?: PartnerMe;
  subscription: PartnerSubscriptionSnapshot | null;
}) {
  const planName = subscription?.planName || partner?.plan?.nameHe || partner?.planKey || "מנוי Partner";
  const monthly = subscription?.monthlyFeeIls ?? partner?.plan?.monthlyIls ?? null;
  const renewal = partner?.nextRenewalAt || partner?.currentPeriodEnd;
  return (
    <PartnerCard className="overflow-hidden p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C3AED]">
        המנוי שלי
      </p>
      <p className="mt-1 text-lg font-black text-slate-900">{planName}</p>
      <p className="text-sm font-black text-slate-700">
        {monthly != null ? `${ils(monthly)} לחודש` : "—"}
      </p>
      <p className="mt-2 text-xs font-bold text-slate-500">
        {statusLabel(subscription?.monthlyStatus)} / {paymentLabel(subscription?.currentMonthPayment)}
      </p>
      <p className="text-xs font-bold text-slate-500">
        חידוש: {renewal ? new Date(renewal).toLocaleDateString("he-IL") : "—"}
      </p>
    </PartnerCard>
  );
}

export { DateRangeBar, PRESETS };
