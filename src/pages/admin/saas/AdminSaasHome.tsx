import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api";
import AdminPageHeader from "../shell/AdminPageHeader";
import { SAAS_SYSTEMS, SALE_STATUS } from "./saasSystems";

type Deal = {
  id: string;
  status: string;
  templateSlug?: string;
  customerName?: string;
  businessName?: string;
  audit?: { at?: string; action?: string; note?: string }[];
};

type Tenant = {
  id: string;
  status?: string;
  templateSlug?: string;
  failure?: string;
  businessName?: string;
};

type Ops = {
  logs?: { at?: string; action?: string; message?: string; systemKey?: string }[];
  failing?: { id: string; slug?: string; error?: string }[];
  alerts?: { key: string; severity?: string; title?: string; detail?: string }[];
  watch?: { availability?: { id: string; ok?: boolean; detail?: string }[] };
};

const STATUS_LABEL: Record<string, string> = {
  lead: "ליד",
  in_review: "בטיפול",
  payment_recorded: "תשלום אושר",
  delivery_approved: "ממתינה להקמה",
  provisioned: "הוקמה",
  cancelled: "בוטלה",
};

export default function AdminSaasHome() {
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [tenants, setTenants] = useState<Tenant[] | null>(null);
  const [ops, setOps] = useState<Ops | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      API.get("/admin/saas-deals"),
      API.get("/admin/saas-tenants"),
      API.get("/admin/saas-tenants/ops"),
    ])
      .then(([dealRes, tenantRes, opsRes]) => {
        if (cancelled) return;
        setDeals(dealRes.data.deals || []);
        setTenants(tenantRes.data.tenants || []);
        setOps(opsRes.data || {});
      })
      .catch(() => {
        if (!cancelled) setError("לא ניתן לטעון את נתוני הלוח. המספרים לא יוצגו במקום תשובה מהשרת.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = !error && (deals === null || tenants === null);
  const activeBusinesses = (tenants || []).filter((row) => row.status === "active").length;
  const waitingPayment = (deals || []).filter((row) => row.status === "lead" || row.status === "in_review").length;
  const waitingProvision = (deals || []).filter((row) => row.status === "delivery_approved").length;
  const failedProvision = (tenants || []).filter((row) => row.failure).length + (ops?.failing?.length || 0);
  const activity = [
    ...((ops?.logs || []).map((entry) => ({
      key: `log-${entry.at}-${entry.action}`,
      text: [entry.systemKey, entry.action, entry.message].filter(Boolean).join(" · "),
      at: entry.at || "",
    }))),
    ...((deals || []).flatMap((deal) =>
      (deal.audit || []).slice(-1).map((entry) => ({
        key: `deal-${deal.id}-${entry.at}`,
        text: [deal.businessName || deal.customerName, STATUS_LABEL[deal.status] || deal.status, entry.action, entry.note]
          .filter(Boolean)
          .join(" · "),
        at: entry.at || "",
      }))
    )),
  ]
    .filter((item) => item.text)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
    .slice(0, 8);

  return (
    <div dir="rtl">
      <AdminPageHeader
        title="לוח בקרה"
        description="נתונים שנטענו מהשרת. מערכות זמינות למכירה לפי ההחלטה שכבר אושרה, לא לפי מדידה חדשה."
      />
      {error ? <p className="biz-table-error">{error}</p> : null}
      {loading ? <p className="biz-table-empty">טוען נתונים מהשרת…</p> : null}
      {deals && tenants ? (
        <>
          <section className="biz-stat-grid" aria-label="מדדים">
            <article className="biz-stat-card">
              <p>מערכות</p>
              <strong>{SAAS_SYSTEMS.length}</strong>
            </article>
            <article className="biz-stat-card">
              <p>זמינות למכירה</p>
              <strong>{SAAS_SYSTEMS.length}</strong>
            </article>
            <article className="biz-stat-card">
              <p>עסקים פעילים</p>
              <strong>{activeBusinesses}</strong>
            </article>
            <article className="biz-stat-card">
              <p>עסקאות</p>
              <strong>{deals.length}</strong>
            </article>
            <article className={waitingPayment ? "biz-stat-card is-alert" : "biz-stat-card"}>
              <p>תשלומים שממתינים לאישור</p>
              <strong>{waitingPayment}</strong>
            </article>
            <article className={waitingProvision ? "biz-stat-card is-alert" : "biz-stat-card"}>
              <p>הקמות שממתינות</p>
              <strong>{waitingProvision}</strong>
            </article>
            <article className={failedProvision ? "biz-stat-card is-alert" : "biz-stat-card"}>
              <p>הקמות שנכשלו</p>
              <strong>{failedProvision}</strong>
            </article>
            <article className="biz-stat-card">
              <p>עסקים רשומים</p>
              <strong>{tenants.length}</strong>
            </article>
          </section>

          <h2 className="biz-section-title">סטטוס מערכות</h2>
          {ops?.watch?.availability?.length ? (
            <ul>
              {ops.watch.availability.map((item) => (
                <li key={item.id} className={item.ok ? "biz-status is-ok" : "biz-status"}>
                  <i />
                  {item.id} · {item.ok ? "תקין" : item.detail || "כשל"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="biz-status">לא התקבל דיווח חי על זמינות המערכות.</p>
          )}

          <h2 className="biz-section-title">התראות תפעוליות</h2>
          {ops?.alerts?.length ? (
            <ul>
              {ops.alerts.map((alert) => (
                <li key={alert.key}>
                  {alert.severity === "critical" ? "קריטי" : "אזהרה"} · {alert.title}
                  {alert.detail ? ` · ${alert.detail}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>אין התראה תפעולית פתוחה בתשובת השרת.</p>
          )}

          <h2 className="biz-section-title">פעילות אחרונה</h2>
          {activity.length ? (
            <ul>
              {activity.map((item) => (
                <li key={item.key}>{item.text}</li>
              ))}
            </ul>
          ) : (
            <p>אין רשומות פעילות בתשובת השרת.</p>
          )}

          <h2 className="biz-section-title">מעבר מהיר</h2>
          <div className="biz-shortcut-grid">
            <Link className="biz-shortcut" to="/admin/saas-systems">
              <strong>עשר המערכות</strong>
              <small>{SALE_STATUS}</small>
            </Link>
            <Link className="biz-shortcut" to="/admin/saas-deals">
              <strong>עסקאות והקמה</strong>
              <small>אישור תשלום ומסירה</small>
            </Link>
            <Link className="biz-shortcut" to="/admin/saas-tenants">
              <strong>עסקים על המערכות</strong>
              <small>רישיון, השהיה וסנכרון</small>
            </Link>
            <Link className="biz-shortcut" to="/admin/support-chat">
              <strong>תמיכה</strong>
              <small>פניות פתוחות</small>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
