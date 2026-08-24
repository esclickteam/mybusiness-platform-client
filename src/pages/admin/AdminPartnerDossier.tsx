import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import {
  adminReviewPartnerCompliance,
  adminReviewWithdrawal,
  fetchAdminPartnerDossier,
  fetchAdminWithdrawalRequest,
  partnerApiError,
} from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";

const TABS = [
  ["overview", "סקירה"],
  ["kyc", "מסמכים וחשבון בנק"],
  ["clients", "לקוחות"],
  ["deals", "עסקאות"],
  ["commissions", "עמלות"],
  ["withdrawals", "בקשות משיכה"],
  ["subscription", "מנוי Partner"],
  ["team", "צוות"],
  ["activity", "Activity / history"],
];

export default function AdminPartnerDossier() {
  const { partnerId } = useParams();
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [kycFeedback, setKycFeedback] = useState("");

  async function refresh() {
    if (!partnerId) return;
    const payload = await fetchAdminPartnerDossier(partnerId);
    setData(payload);
    setKycFeedback(payload.compliance?.adminFeedback || "");
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
          {plan.nameHe || partner.planKey} · {partner.status}
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
            <Kpi label="Plan" value={plan.nameHe || partner.planKey} />
            <Kpi label="Status" value={partner.status} />
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

        {tab === "clients" ? <Table rows={data.clients} cols={clientCols} /> : null}
        {tab === "deals" ? <Table rows={data.deals} cols={dealCols} /> : null}
        {tab === "commissions" ? <Table rows={data.commissions?.items || []} cols={commissionCols} /> : null}
        {tab === "subscription" ? (
          <section className="mt-5 rounded-3xl border bg-white p-5">
            <p className="font-black">Setup {formatIls(plan.setupIls)} + {formatIls(plan.monthlyIls)} / חודש</p>
            <p className="mt-2 text-sm font-bold text-slate-500">נפרד מעסקאות לקוחות.</p>
          </section>
        ) : null}
        {tab === "team" ? <Table rows={data.team} cols={teamCols} /> : null}
        {tab === "activity" ? (
          <Table rows={data.commissions?.items || []} cols={commissionCols} />
        ) : null}

        {tab === "withdrawals" ? (
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
  ["status", "סטטוס"],
  ["totals.customerNow", "סכום ללקוח"],
  ["totals.partnerPaysBizuply", "לתשלום ל-Bizuply"],
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
