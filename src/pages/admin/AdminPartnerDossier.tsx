import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import {
  adminPatchPartnerCommercial,
  adminSendPartnerInvitation,
  adminReviewPartnerCompliance,
  adminReviewWithdrawal,
  fetchAdminPartnerDossier,
  fetchAdminWithdrawalRequest,
  partnerApiError,
} from "../../lib/partnerApi";
import { fetchAdminPartnerOnboarding } from "../../lib/partnerCenterApi";
import { formatIls } from "../../lib/partnerMoney";
import { partnerStatusLabel } from "../../lib/partnerLabels";

const TABS = [
  ["overview", "Overview"],
  ["legal", "Legal Details"],
  ["agreement", "Agreement"],
  ["territory", "Territory"],
  ["commission", "Commission"],
  ["customers", "Customers"],
  ["payments", "Payments"],
  ["sub-partners", "Sub-Partners"],
  ["progress", "Partner Center Progress"],
  ["audit", "Audit Log"],
];

export default function AdminPartnerDossier() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken?: (nextUser: unknown, token: string, options?: { skipRedirect?: boolean }) => void;
  };
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [kycFeedback, setKycFeedback] = useState("");
  const [commercial, setCommercial] = useState<any>({});
  const [savingCommercial, setSavingCommercial] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  async function refresh() {
    if (!partnerId) return;
    const payload = await fetchAdminPartnerDossier(partnerId);
    setData(payload);
    setKycFeedback(payload.compliance?.adminFeedback || "");
    setCommercial(payload.commercial || {});
    const progress = await fetchAdminPartnerOnboarding(partnerId).catch(() => null);
    setOnboarding(progress);
  }

  useEffect(() => {
    refresh().catch((err) => setError(partnerApiError(err, "שגיאה בתיק פרטנר")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  async function openRequest(id: string) {
    if (!partnerId) return;
    const payload = await fetchAdminWithdrawalRequest(partnerId, id);
    setActiveRequest(payload);
    setFeedback(payload.request?.adminFeedback || "");
  }

  async function act(action: "approve" | "reject" | "pay") {
    if (!partnerId || !activeRequest?.request?._id) return;
    await adminReviewWithdrawal(partnerId, activeRequest.request._id, action, {
      adminFeedback: feedback,
      paymentReference,
      paymentNote,
    });
    await openRequest(activeRequest.request._id);
    await refresh();
  }

  if (!data) {
    return (
      <div dir="rtl">
        <AdminHeader />
        <p className="p-6 font-black">{error || "טוען..."}</p>
      </div>
    );
  }

  const partner = data.partner || {};
  const plan = data.plan || {};
  const snapshot = data.snapshot || {};
  const month = data.monthlyWithdrawals || {};

  return (
    <div dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] px-4 py-6">
        <Link to="/admin/partners" className="text-sm font-black text-slate-500">
          חזרה לפרטנרים
        </Link>
        <h1 className="mt-2 text-3xl font-black">{partner.name}</h1>
        <p className="font-bold text-slate-500">
          {plan.nameHe || partner.planKey} · {partnerStatusLabel(partner.status)}
        </p>
        {error ? <p className="mt-3 font-black text-rose-700">{error}</p> : null}

        <section className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi label="בקשות משיכה החודש" value={String(month.count || 0)} />
          <Kpi label="סכום בקשות" value={formatIls(month.total)} />
          <Kpi label="ממתינות" value={String((month.submitted || 0) + (month.under_review || 0))} />
          <Kpi label="מאושרות" value={String(month.approved || 0)} />
          <Kpi label="נדחו" value={String(month.rejected || 0)} />
          <Kpi label="שולמו" value={String(month.paid || 0)} />
        </section>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={[
                "rounded-2xl px-3 py-2 text-sm font-black",
                tab === id ? "bg-slate-900 text-white" : "border bg-white",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="מסלול" value={plan.nameHe || partner.planKey} />
            <Kpi label="סטטוס" value={partnerStatusLabel(partner.status)} />
            <Kpi label="Setup" value={formatIls(plan.setupIls)} />
            <Kpi label="Monthly subscription" value={formatIls(plan.monthlyIls)} />
            <Kpi label="Customers" value={String((data.clients || []).length)} />
            <Kpi label="MRR" value={formatIls(snapshot.customerMrr || snapshot.currentWholesaleMrr)} />
            <Kpi label="Total sales" value={formatIls(snapshot.totalCustomerSales || data.commissions?.totals?.totalSales)} />
            <Kpi label="Total commissions" value={formatIls(data.commissions?.totals?.partnerCommission)} />
            <Kpi label="Eligible balance" value={formatIls(data.commissions?.totals?.eligibleCommission)} />
            <Kpi label="Pending withdrawals" value={formatIls(data.commissions?.totals?.pendingCommission)} />
            <Kpi label="Paid commissions" value={formatIls(data.commissions?.totals?.paidCommission)} />
            <Kpi label="מסמכים" value={data.compliance?.reviewStatus || "incomplete"} />
            <Kpi label="Agreement" value={data.agreement?.status || "none"} />
            <Kpi label="Territory" value={data.agreement?.territory?.countryName || data.commercial?.territory || "—"} />
            <Kpi label="Exclusivity" value={data.agreement?.exclusivity || data.commercial?.exclusivity || "—"} />
            <Kpi label="Renewal deadline" value={data.agreement?.renewalDeadline || "—"} />
            <Kpi label="Sub-Partner seats" value={`${data.seats?.used || 0} / ${data.seats?.limit || 0}`} />
          </section>
        ) : null}
        {tab === "overview" ? (
          <button
            type="button"
            className="mt-4 rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white"
            onClick={() => {
              void API.post(`/admin/partners/${partnerId}/open-workspace`).then((res) => {
                loginWithToken?.(res.data.user, res.data.token, { skipRedirect: true });
                navigate("/partner/dashboard");
              }).catch((err) => setError(partnerApiError(err, "Could not open the Partner workspace")));
            }}
          >
            Open Partner Workspace
          </button>
        ) : null}

        {tab === "agreement" || tab === "territory" ? (
          <section className="mt-5 rounded-3xl border bg-white p-5">
            <h2 className="text-xl font-black">Agreement</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">Status: {data.agreement?.status || "No agreement"}</p>
            <p className="text-sm font-semibold text-slate-700">Territory: {data.agreement?.territory?.countryName || "—"} {data.agreement?.territory?.territoryName || ""}</p>
            <p className="text-sm font-semibold text-slate-700">Exclusivity: {data.agreement?.exclusivity || "—"}</p>
            <p className="text-sm font-semibold text-slate-700">End date: {data.agreement?.endDate ? String(data.agreement.endDate).slice(0, 10) : "—"}</p>
            <p className="text-sm font-bold text-slate-900">Renewal completion deadline: {data.agreement?.renewalDeadline || "—"}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">The deadline is 90 days before the end date. Missing it does not end the current exclusive term early.</p>
          </section>
        ) : null}

        {tab === "legal" || tab === "commercial" ? (
          <section className="mt-5 rounded-3xl border bg-white p-5" dir="ltr">
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Partner Details / Commercial</p>
            <h2 className="mt-1 text-xl font-black">{partner.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600">
              Public/brand name stays as Partner.name. Legal company name is stored separately and can be edited here after create.
            </p>
            {data.commission ? (
              <p className="mt-3 text-sm font-black">
                Commission: {data.commission.usesCustomCommission ? "custom override" : "plan default"} · effective{" "}
                {Math.round(Number(data.commission.effectiveCommissionRate || 0) * 10000) / 100}% · plan{" "}
                {Math.round(Number(data.commission.planCommissionRate || 0) * 10000) / 100}%
              </p>
            ) : null}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(
                [
                  ["legalCompanyName", "Legal company name", "text"],
                  ["country", "Country", "text"],
                  ["territory", "Territory", "text"],
                  ["contactName", "Main contact name", "text"],
                  ["contactEmail", "Contact email", "email"],
                  ["phone", "Phone", "text"],
                  ["whatsapp", "WhatsApp", "text"],
                  ["exclusivityTerritory", "Exclusivity territory", "text"],
                  ["agreementStartDate", "Agreement start date", "date"],
                  ["agreementEndDate", "Agreement end date", "date"],
                  ["customCommissionPercent", "Custom recurring commission %", "number"],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="block text-sm font-bold">
                  {label}
                  <input
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    max={type === "number" ? 100 : undefined}
                    step={type === "number" ? "0.01" : undefined}
                    value={commercial[key] ?? ""}
                    onChange={(e) => setCommercial({ ...commercial, [key]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                  />
                </label>
              ))}
              <label className="block text-sm font-bold">
                Partner commercial status
                <select
                  value={commercial.commercialStatus || ""}
                  onChange={(e) => setCommercial({ ...commercial, commercialStatus: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                >
                  <option value="">Unset</option>
                  <option value="pending_agreement">Pending agreement</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </select>
              </label>
              <label className="block text-sm font-bold">
                Exclusive / Non-exclusive
                <select
                  value={commercial.exclusivity || ""}
                  onChange={(e) => setCommercial({ ...commercial, exclusivity: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                >
                  <option value="">Unset</option>
                  <option value="exclusive">Exclusive</option>
                  <option value="non_exclusive">Non-exclusive</option>
                </select>
              </label>
              <label className="block text-sm font-bold md:col-span-2">
                Internal Admin notes
                <textarea
                  rows={4}
                  value={commercial.adminNotes || ""}
                  onChange={(e) => setCommercial({ ...commercial, adminNotes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
                />
              </label>
            </div>
            <button
              type="button"
              disabled={savingCommercial}
              onClick={async () => {
                if (!partnerId) return;
                setSavingCommercial(true);
                setError("");
                try {
                  const saved = await adminPatchPartnerCommercial(partnerId, commercial);
                  setCommercial(saved.commercial || commercial);
                  setData({ ...data, commercial: saved.commercial, commission: saved.commission });
                } catch (err: unknown) {
                  setError(partnerApiError(err, "לא ניתן לשמור פרטים מסחריים"));
                } finally {
                  setSavingCommercial(false);
                }
              }}
              className="mt-4 rounded-xl bg-[#7C4DFF] px-5 py-2.5 text-sm font-black text-white disabled:opacity-60"
            >
              {savingCommercial ? "Saving..." : "Save commercial details"}
            </button>
            {(() => {
              const invite = data.invitation || {};
              const status = String(invite.status || "not_sent");
              const label =
                status === "accepted"
                  ? "Accepted"
                  : status === "expired"
                    ? "Expired"
                    : status === "sent"
                      ? "Sent"
                      : "Not sent";
              return (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Invitation</p>
                  <p className="mt-2 text-sm font-black">Status: {label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    Email: {invite.email || "—"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    Expires at: {invite.expiresAt ? new Date(invite.expiresAt).toLocaleString() : "—"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-600">
                    Accepted: {invite.acceptedAt ? new Date(invite.acceptedAt).toLocaleString() : "—"}
                  </p>
                  {status !== "accepted" ? (
                    <button
                      type="button"
                      disabled={sendingInvite}
                      onClick={async () => {
                        if (!partnerId) return;
                        setSendingInvite(true);
                        setError("");
                        try {
                          const mailed = await adminSendPartnerInvitation(partnerId);
                          setData({ ...data, invitation: mailed.invitation });
                          if (!mailed.invitationSent) {
                            setError(
                              mailed.invitationError
                                ? `Invitation not sent (${mailed.invitationError})`
                                : "Invitation not sent. You can retry."
                            );
                          }
                        } catch (err: unknown) {
                          setError(partnerApiError(err, "לא ניתן לשלוח הזמנה"));
                        } finally {
                          setSendingInvite(false);
                        }
                      }}
                      className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                    >
                      {sendingInvite
                        ? "Sending..."
                        : status === "sent"
                          ? "Resend invitation"
                          : "Send invitation"}
                    </button>
                  ) : null}
                </div>
              );
            })()}
          </section>
        ) : null}

        {tab === "progress" || tab === "onboarding" ? (
          <section className="mt-5 rounded-3xl border bg-white p-5" dir="ltr">
            {onboarding ? (
              <>
                <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Partner onboarding</p>
                <h2 className="mt-1 text-xl font-black">{onboarding.nextAction?.title}</h2>
                <p className="mt-1 text-sm font-bold text-slate-600">{onboarding.nextAction?.detail}</p>
                <p className="mt-3 text-sm font-black">
                  {onboarding.modulesCompleted} / {onboarding.modulesTotal} modules · {onboarding.percent}% · {onboarding.salesReadyStatus}
                </p>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  Started: {onboarding.started ? "Yes" : "No"} · Last activity: {onboarding.lastActivityAt ? new Date(onboarding.lastActivityAt).toLocaleString() : "—"} · Training completed: {onboarding.trainingCompletedAt ? new Date(onboarding.trainingCompletedAt).toLocaleString() : "—"}
                </p>
                {onboarding.stuckModule ? (
                  <p className="mt-2 font-black text-amber-800">
                    Stuck on Module {onboarding.stuckModule.n} – {onboarding.stuckModule.title}
                  </p>
                ) : null}
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(onboarding.modules || []).map((mod: any) => (
                    <li key={mod.slug} className="rounded-2xl border px-3 py-2 text-sm font-bold">
                      Module {mod.n}. {mod.title} — {onboarding.completedModuleSlugs?.includes(mod.slug) ? "Done" : "Open"}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="font-black">No onboarding data yet.</p>
            )}
          </section>
        ) : null}

        {tab === "kyc" ? (
          <KycPanel
            compliance={data.compliance || {}}
            feedback={kycFeedback}
            onFeedback={setKycFeedback}
            onReview={async (status) => {
              if (!partnerId) return;
              setError("");
              try {
                const compliance = await adminReviewPartnerCompliance(partnerId, {
                  status,
                  adminFeedback: kycFeedback,
                });
                setData({ ...data, compliance });
              } catch (err: unknown) {
                setError(partnerApiError(err, "לא ניתן לעדכן מסמכים"));
              }
            }}
          />
        ) : null}

        {tab === "customers" || tab === "clients" ? <Table rows={data.clients} cols={clientCols} /> : null}
        {tab === "deals" ? <Table rows={data.deals} cols={dealCols} /> : null}
        {tab === "commission" || tab === "commissions" ? <Table rows={data.commissions?.items || []} cols={commissionCols} /> : null}
        {tab === "subscription" ? (
          <section className="mt-5 rounded-3xl border bg-white p-5">
            <p className="font-black">Setup {formatIls(plan.setupIls)} + {formatIls(plan.monthlyIls)} / חודש</p>
            <p className="mt-2 text-sm font-bold text-slate-500">נפרד מעסקאות לקוחות.</p>
          </section>
        ) : null}
        {tab === "sub-partners" || tab === "team" ? (
          <section className="mt-5 space-y-3">
            <p className="text-sm font-bold text-slate-700">
              Package seats {data.seats?.used || 0} used, limit {data.seats?.limit || 0}. The Primary Partner is not counted as an additional user.
            </p>
            <Table rows={data.team} cols={teamCols} />
          </section>
        ) : null}
        {tab === "audit" || tab === "activity" ? (
          <Table
            rows={data.audit || []}
            cols={[
              ["action", "Action"],
              ["createdAt", "When"],
              ["reason", "Reason"],
            ]}
          />
        ) : null}

        {tab === "payments" || tab === "withdrawals" ? (
          <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_380px]">
            <Table
              rows={data.withdrawals}
              cols={withdrawalCols}
              onRowClick={(row) => openRequest(row._id)}
            />
            {activeRequest?.request ? (
              <aside className="rounded-3xl border bg-white p-4">
                <h3 className="font-black">{activeRequest.request.requestNumber}</h3>
                <p className="text-sm font-bold">סכום {formatIls(activeRequest.request.amount)}</p>
                <p className="text-sm font-bold">
                  יתרה במועד הבקשה {formatIls(activeRequest.request.eligibleBalanceAtRequest)}
                </p>
                <p className="text-sm font-bold">קבלה {activeRequest.request.receiptNumber}</p>
                <p className="text-sm font-bold">סכום קבלה {formatIls(activeRequest.request.receiptAmount)}</p>
                {activeRequest.request.receiptFile ? (
                  <a
                    href={activeRequest.request.receiptFile}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-black text-violet-700"
                  >
                    פתיחת קבלה
                  </a>
                ) : null}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="סיבת הדחייה / משוב לפרטנר"
                  className="mt-3 w-full rounded-2xl border px-3 py-2 text-sm"
                />
                <input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="אסמכתת תשלום"
                  className="mt-2 w-full rounded-2xl border px-3 py-2 text-sm"
                />
                <input
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="הערת תשלום (אופציונלי)"
                  className="mt-2 w-full rounded-2xl border px-3 py-2 text-sm"
                />
                <div className="mt-3 flex flex-col gap-2">
                  <button type="button" onClick={() => act("approve")} className="rounded-2xl bg-slate-900 py-2 text-sm font-black text-white">
                    אישור
                  </button>
                  <button type="button" onClick={() => act("reject")} className="rounded-2xl border border-rose-200 py-2 text-sm font-black text-rose-700">
                    דחייה
                  </button>
                  <button type="button" onClick={() => act("pay")} className="rounded-2xl bg-emerald-700 py-2 text-sm font-black text-white">
                    סמן כשולם
                  </button>
                </div>
                <div className="mt-4 space-y-1 text-xs font-bold text-slate-500">
                  {(activeRequest.commissions || []).map((row: any) => (
                    <p key={row._id}>
                      {row.product} · {formatIls(row.partnerCommissionAmount)} · {row.commissionStatus}
                    </p>
                  ))}
                </div>
              </aside>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}

const clientCols = [
  ["contact.businessName", "לקוח"],
  ["status", "סטטוס"],
  ["mrrCustomer", "MRR"],
];
const dealCols = [
  ["dealNumber", "Deal"],
  ["salesSource", "מקור"],
  ["paymentStatus", "תשלום"],
  ["activationStatus", "הפעלה"],
  ["commissionStatus", "עמלה"],
  ["status", "סטטוס עסקה"],
  ["totals.customerNow", "סכום ללקוח"],
  ["totals.partnerPaysBizuply", "לתשלום ל-Bizuply"],
  ["paidAt", "שולם"],
  ["clientProvisioning.status", "משתמש"],
];
const commissionCols = [
  ["product", "מוצר"],
  ["customerFinalPrice", "מכירה"],
  ["partnerCommissionAmount", "עמלה"],
  ["commissionStatus", "סטטוס עמלה"],
];
const withdrawalCols = [
  ["requestNumber", "בקשה"],
  ["amount", "סכום"],
  ["status", "סטטוס"],
  ["receiptNumber", "קבלה"],
];
const teamCols = [
  ["role", "תפקיד"],
  ["status", "סטטוס"],
];

function valueAt(row: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], row);
}

function Table({
  rows,
  cols,
  onRowClick,
}: {
  rows?: any[];
  cols: string[][];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-3xl border bg-white">
      <table className="min-w-full text-right text-sm">
        <thead className="bg-slate-50 text-xs font-black text-slate-500">
          <tr>
            {cols.map(([_, label]) => (
              <th key={label} className="px-3 py-3">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(rows || []).map((row) => (
            <tr
              key={row._id}
              className="border-t"
              onClick={() => onRowClick?.(row)}
            >
              {cols.map(([path]) => {
                const value = valueAt(row, path);
                const shown =
                  typeof value === "number" && path.toLowerCase().includes("amount")
                    ? formatIls(value)
                    : typeof value === "number" && (path.includes("mrr") || path.includes("Price") || path.includes("totals"))
                      ? formatIls(value)
                    : path.toLowerCase().includes("status") || path === "salesSource"
                      ? partnerStatusLabel(String(value ?? ""))
                      : String(value ?? "—");
                return (
                  <td key={path} className="px-3 py-3">
                    {shown}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-white p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function DocLink({ label, doc }: { label: string; doc?: { url?: string; originalName?: string } | null }) {
  if (!doc?.url) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="text-sm font-black">{label}</p>
        <p className="text-xs font-bold text-amber-800">לא הועלה</p>
      </div>
    );
  }
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 hover:bg-violet-100"
    >
      <p className="text-sm font-black">{label}</p>
      <p className="text-xs font-bold text-violet-800">{doc.originalName || "פתיחת מסמך"}</p>
    </a>
  );
}

function KycPanel({
  compliance,
  feedback,
  onFeedback,
  onReview,
}: {
  compliance: any;
  feedback: string;
  onFeedback: (value: string) => void;
  onReview: (status: "approved" | "rejected") => void;
}) {
  const docs = compliance.documents || {};
  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-3xl border bg-white p-5">
        <h3 className="font-black">פרטי חשבון ות״ז</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="שם בעל החשבון" value={compliance.accountHolderName} />
          <Field label="ת״ז" value={compliance.idNumber} />
          <Field label="ח.פ / עוסק" value={compliance.taxNumber} />
          <Field label="טלפון" value={compliance.phone} />
        </div>
        <h3 className="pt-2 font-black">חשבון בנק</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="בנק" value={compliance.bankName} />
          <Field label="סניף" value={compliance.branch} />
          <Field label="מספר חשבון" value={compliance.account} />
        </div>
        <h3 className="pt-2 font-black">מסמכים</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <DocLink label="אישור ניהול חשבון" doc={docs.accountManagementAuth} />
          <DocLink label="תעודת עוסק" doc={docs.dealerCertificate} />
          <DocLink label="צילום תעודה מזהה" doc={docs.idPhoto} />
        </div>
      </div>
      <aside className="rounded-3xl border bg-white p-5">
        <p className="text-xs font-black text-slate-500">סטטוס בדיקה</p>
        <p className="mt-1 text-xl font-black">{compliance.reviewStatus || "incomplete"}</p>
        {(compliance.missing || []).length ? (
          <p className="mt-2 text-sm font-bold text-amber-700">
            חסר: {(compliance.missing || []).join(", ")}
          </p>
        ) : null}
        <textarea
          value={feedback}
          onChange={(e) => onFeedback(e.target.value)}
          placeholder="משוב לפרטנר / סיבת דחייה"
          className="mt-3 w-full rounded-2xl border px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onReview("approved")}
            className="rounded-2xl bg-emerald-700 py-2 text-sm font-black text-white"
          >
            אישור מסמכים
          </button>
          <button
            type="button"
            onClick={() => onReview("rejected")}
            className="rounded-2xl border border-rose-200 py-2 text-sm font-black text-rose-700"
          >
            דחייה
          </button>
        </div>
      </aside>
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="font-black text-slate-900">{value || "—"}</p>
    </div>
  );
}
