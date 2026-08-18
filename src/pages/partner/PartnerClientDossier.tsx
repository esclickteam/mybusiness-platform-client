import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckSquare,
  LogIn,
  Mail,
  Phone,
  Shield,
  StickyNote,
  User,
} from "lucide-react";
import {
  addPartnerNote,
  addPartnerTask,
  enterPartnerClient,
  fetchPartnerClient,
  partnerApiError,
  togglePartnerTask,
} from "../../lib/partnerApi";
import { formatIls, formatPct } from "../../lib/partnerMoney";
import type { PartnerClient } from "../../types/partner";
import PartnerMarkupBreakdown from "../../components/partner/PartnerMarkupBreakdown";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { useAuth } from "../../context/AuthContext";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";
import { PARTNER_STATUS_LABEL } from "../../lib/partnerLabels";

const MODE_LABEL: Record<string, string> = {
  partner: "הפרטנר מנהל",
  customer: "הלקוח מנהל",
  shared: "ניהול משותף",
};

function formatWhen(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("he-IL");
}

export default function PartnerClientDossier() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken?: (
      user: unknown,
      token: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };
  const [client, setClient] = useState<PartnerClient | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPartnerClient(clientId);
        if (!cancelled) setClient(data);
      } catch (err: any) {
        if (!cancelled) setError(partnerApiError(err, "לא ניתן לטעון את תיק הלקוח"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId]);

  async function saveNote() {
    if (!client || !note.trim()) return;
    const notes = await addPartnerNote(client._id, note.trim());
    setClient({ ...client, notes });
    setNote("");
  }

  async function saveTask() {
    if (!client || !task.trim()) return;
    const tasks = await addPartnerTask(client._id, task.trim());
    setClient({ ...client, tasks });
    setTask("");
  }

  async function enterClient() {
    if (!client?.canEnterClient) return;
    setEntering(true);
    setError("");
    try {
      const data = await enterPartnerClient(client._id);
      loginWithToken?.(data.user, data.token, { skipRedirect: true });
      navigate(getDefaultDashboardPath(data.user.businessId, data.user.enabledModules), {
        replace: true,
      });
    } catch (err: any) {
      setError(partnerApiError(err, "לא ניתן להיכנס לניהול הלקוח"));
    } finally {
      setEntering(false);
    }
  }

  if (loading) return <BizuplyLoader label="טוען תיק לקוח..." />;
  if (!client) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
        {error || "לקוח לא נמצא"}
      </div>
    );
  }

  const extra = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.markup || line.additionalCommission || 0),
    0
  );
  const partnerShare = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.partnerMarkupShare || 0),
    0
  );
  const bizuplyShare = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.bizuplyMarkupShare || 0),
    0
  );
  const wholesaleTotal = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.partnerWholesalePrice || 0),
    0
  );
  const finalTotal = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.customerFinalPrice || 0),
    0
  );
  const dueTotal = wholesaleTotal + bizuplyShare;

  return (
    <div className="space-y-5">
      <Link
        to="/partner/dashboard/crm"
        className="inline-flex items-center gap-1 text-sm font-black text-slate-500 hover:text-slate-900"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה ללקוחות
      </Link>

      <PartnerPageHeader
        eyebrow="תיק לקוח מלא"
        title={client.contact.businessName}
        subtitle={`${client.contact.contactName} · ${client.contact.email}`}
        actions={
          client.canEnterClient ? (
            <button
              type="button"
              disabled={entering}
              onClick={enterClient}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/15"
            >
              <LogIn className="h-4 w-4" />
              {entering ? "נכנס לניהול..." : "כניסה לניהול הלקוח"}
            </button>
          ) : (
            <span className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-800">
              כניסה לניהול זמינה אחרי הפעלה
            </span>
          )
        }
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="flex flex-wrap gap-2">
        {[
          ["overview", "סקירה"],
          ["details", "פרטי לקוח"],
          ["products", "מוצרים"],
          ["pricing", "תמחור"],
          ["permissions", "הרשאות"],
          ["tasks", "משימות"],
          ["notes", "הערות"],
          ["history", "היסטוריה"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              "rounded-2xl px-3 py-2 text-sm font-black",
              tab === id ? "bg-slate-900 text-white" : "border border-slate-200 bg-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
        <Link
          to="/partner/dashboard/transactions"
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black"
        >
          עסקאות
        </Link>
      </section>

      {tab === "overview" || tab === "details" || tab === "history" ? (
      <section className="grid gap-3 md:grid-cols-4">
        <InfoCard icon={User} label="סטטוס" value={PARTNER_STATUS_LABEL[client.status] || client.status} />
        <InfoCard icon={Shield} label="מצב ניהול" value={MODE_LABEL[client.managementMode] || client.managementMode} />
        <InfoCard icon={Mail} label="אימייל" value={client.contact.email} />
        <InfoCard icon={Phone} label="טלפון" value={client.contact.phone || "—"} />
      </section>
      ) : null}

      <section className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <DateCell label="נוצר" value={formatWhen(client.createdAt)} />
        <DateCell label="הופעל" value={formatWhen(client.activatedAt)} />
        <DateCell label="הצטרף" value={formatWhen(client.joinedAt)} />
        <DateCell label="חיוב הבא" value={formatWhen(client.nextBillingDate)} />
      </section>

      <section className="grid gap-3 rounded-3xl border border-violet-100 bg-gradient-to-l from-[#f7f3ff] to-white p-5 md:grid-cols-4">
        <MoneyCell label="מחיר ללקוח" value={formatIls(client.mrrCustomer)} />
        <MoneyCell label="עמלה נוספת" value={formatIls(extra)} />
        <MoneyCell
          label={`נשאר לפרטנר (${formatPct(client.partnerShareRate)})`}
          value={formatIls(partnerShare)}
        />
        <MoneyCell
          label={`חלק Bizuply (${formatPct(client.bizuplyShareRate)})`}
          value={formatIls(bizuplyShare)}
        />
      </section>

      {client.contact.notes ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="mb-2 font-black">רקע מסחרי</h3>
          <p className="whitespace-pre-wrap text-sm font-bold leading-6 text-slate-600">
            {client.contact.notes}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="font-black">מוצרים, עמלה נוספת ופיצול</h3>
        {(client.selectedSkus || []).map((line) => (
          <div
            key={line.sku}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
          >
            <PartnerMarkupBreakdown line={line} />
          </div>
        ))}
        {!client.selectedSkus?.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-bold text-slate-500">
            עדיין לא נבחרו מוצרים ללקוח זה
          </p>
        ) : (client.selectedSkus?.length || 0) > 1 ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-900 p-5 text-white">
            <p className="text-xs font-black text-white/60">סיכום כל המוצרים</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold text-white/55">מחיר Bizuply עבורך</p>
                <p className="text-lg font-black">{formatIls(wholesaleTotal)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">עמלה נוספת</p>
                <p className="text-lg font-black">{formatIls(extra)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">מחיר סופי ללקוח</p>
                <p className="text-lg font-black">{formatIls(finalTotal)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">החלק שלך</p>
                <p className="text-lg font-black">{formatIls(partnerShare)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">חלק Bizuply</p>
                <p className="text-lg font-black">{formatIls(bizuplyShare)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">הלקוח משלם</p>
                <p className="text-lg font-black">{formatIls(finalTotal)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {client.enabledEntitlements?.length ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="mb-2 font-black">הרשאות שהופעלו בעסק</h3>
          <div className="flex flex-wrap gap-2">
            {client.enabledEntitlements.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-violet-600" />
            <h3 className="font-black">יומן תיעוד</h3>
          </div>
          <div className="space-y-2">
            {(client.notes || []).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-sm font-bold text-slate-800">{item.text}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {formatWhen(item.createdAt)}
                </p>
              </div>
            ))}
            {!client.notes?.length ? (
              <p className="text-sm font-bold text-slate-400">אין עדיין הערות בתיק</p>
            ) : null}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
              placeholder="הוספת תיעוד — שיחה, הסכם, משימה מסחרית"
            />
            <button
              type="button"
              onClick={saveNote}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white"
            >
              שמור
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-violet-600" />
            <h3 className="font-black">משימות מעקב</h3>
          </div>
          <div className="space-y-2">
            {(client.tasks || []).map((item) => (
              <label key={item._id} className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(item.done)}
                  onChange={async (e) => {
                    const tasks = await togglePartnerTask(
                      client._id,
                      String(item._id),
                      e.target.checked
                    );
                    setClient({ ...client, tasks });
                  }}
                  className="mt-1 accent-violet-700"
                />
                <span className={item.done ? "font-bold text-slate-400 line-through" : "font-bold"}>
                  {item.title}
                  <span className="mt-1 block text-[11px] font-bold text-slate-400">
                    {formatWhen(item.createdAt)}
                    {item.dueAt ? ` · יעד ${formatWhen(item.dueAt)}` : ""}
                  </span>
                </span>
              </label>
            ))}
            {!client.tasks?.length ? (
              <p className="text-sm font-bold text-slate-400">אין משימות פתוחות</p>
            ) : null}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
              placeholder="משימה חדשה — שיחת מעקב, גבייה, הקמה"
            />
            <button
              type="button"
              onClick={saveTask}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white"
            >
              הוסף
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-black">{label}</span>
      </div>
      <p className="font-black text-slate-900">{value}</p>
    </div>
  );
}

function DateCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function MoneyCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-violet-700">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}
