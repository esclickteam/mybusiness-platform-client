import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

import AdminDialButton from "../../components/AdminDialButton";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import AdminRowMenu from "./shell/AdminRowMenu";
import AdminSendGuidedDemoModal, {
  AdminSendDemoButton,
} from "./AdminSendGuidedDemoModal";
import { listGuidedDemos } from "../../api/guidedDemoApi";
import { resolveAdminSupportChat } from "../../api/supportChatAdminApi";

type EarlyAccessStatus = "new" | "contacted" | "joined_group" | "not_relevant";
type StatusFilter = "all" | EarlyAccessStatus;

type EarlyAccessLead = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  interest?: string;
  interests?: string[];
  monthlyBudget?: string;
  source?: string;
  status?: EarlyAccessStatus;
  ip?: string;
  userAgent?: string;
  createdAt?: string;
  updatedAt?: string;
};

const RAW_API_BASE =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const API_BASE = RAW_API_BASE.replace(/\/api\/?$/, "").replace(/\/$/, "");

const statusLabels: Record<EarlyAccessStatus, string> = {
  new: "חדש",
  contacted: "טופל",
  joined_group: "צורף לקבוצה",
  not_relevant: "לא רלוונטי",
};

const DEMO_STATUS_LABEL: Record<string, string> = {
  created: "נוצר",
  sent: "נשלח",
  opened: "נפתח",
  in_progress: "התחיל",
  completed: "הושלם",
  expired: "פג תוקף",
  revoked: "בוטל",
  delivery_failed: "שגיאת שליחה",
};

const DELIVERY_LABEL: Record<string, string> = {
  pending: "ממתין",
  sent: "נשלח",
  failed: "נכשל",
  skipped: "לא נשלח",
};

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Request failed");
  }

  return data as T;
}

function getLeadId(item: EarlyAccessLead) {
  return String(item._id || item.id || "");
}

function formatDate(value?: string) {
  if (!value) return "לא צוין";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "לא צוין";

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeWhatsappPhone(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;

  return digits;
}

function getRegistrationValue(item: EarlyAccessLead, key: string) {
  if (key === "fullName") {
    return item.name || "לא צוין";
  }

  if (key === "email") {
    return item.email || "לא צוין";
  }

  if (key === "phone") {
    return item.phone || "לא צוין";
  }

  if (key === "businessName") {
    return item.business || "לא צוין";
  }

  if (key === "interest") {
    if (Array.isArray(item.interests) && item.interests.length > 0) {
      return item.interests.filter(Boolean).join(", ");
    }

    return item.interest || "לא צוין";
  }

  if (key === "monthlyBudget") {
    return item.monthlyBudget || "לא צוין";
  }

  return "לא צוין";
}

async function fetchEarlyAccessLeads() {
  const data = await apiRequest<{
    success: boolean;
    leads: EarlyAccessLead[];
  }>("/api/early-access");

  if (!data?.success) {
    throw new Error("שגיאה בטעינת הנרשמים");
  }

  return Array.isArray(data.leads) ? data.leads : [];
}

async function updateEarlyAccessLeadStatus(
  leadId: string,
  status: EarlyAccessStatus,
) {
  const data = await apiRequest<{
    success: boolean;
    lead: EarlyAccessLead;
  }>(`/api/early-access/${leadId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!data?.success) {
    throw new Error("שגיאה בעדכון הסטטוס");
  }

  return data.lead;
}

async function deleteEarlyAccessLead(leadId: string) {
  const data = await apiRequest<{
    success: boolean;
    message?: string;
  }>(`/api/early-access/${leadId}`, {
    method: "DELETE",
  });

  if (!data?.success) {
    throw new Error(data?.message || "שגיאה במחיקת הנרשם");
  }

  return data;
}

function StatusBadge({ status }: { status: EarlyAccessStatus }) {
  const className =
    status === "new"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : status === "contacted"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : status === "joined_group"
          ? "bg-purple-50 text-purple-700 ring-purple-200"
          : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "purple" | "amber" | "green" | "pink";
}) {
  return (
    <article className={color === "amber" || color === "pink" ? "biz-stat-card is-alert" : "biz-stat-card"}>
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

function AdminEarlyAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [registrations, setRegistrations] = useState<EarlyAccessLead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string>("");
  const [demoLead, setDemoLead] = useState<EarlyAccessLead | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string>("");
  const [demoHistoryByLead, setDemoHistoryByLead] = useState<Record<string, any[]>>({});
  const [demoHistoryLoadingId, setDemoHistoryLoadingId] = useState<string>("");
  const [chatOpeningId, setChatOpeningId] = useState<string>("");

  const highlightLeadId = String(searchParams.get("lead") || "").trim();

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function loadRegistrations() {
    try {
      setLoading(true);

      const leads = await fetchEarlyAccessLeads();

      setRegistrations(leads);
    } catch (error: any) {
      console.error("LOAD EARLY ACCESS LEADS ERROR:", error);
      alert(error?.message || "שגיאה בטעינת רשימת הנרשמים");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    if (!highlightLeadId || loading) return;
    setExpandedLeadId(highlightLeadId);
    void loadLeadDemoHistory(highlightLeadId);
    window.setTimeout(() => {
      document
        .getElementById(`early-access-lead-${highlightLeadId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, [highlightLeadId, loading]);

  async function loadLeadDemoHistory(leadId: string) {
    if (!leadId || demoHistoryByLead[leadId]) return;
    setDemoHistoryLoadingId(leadId);
    try {
      const list = await listGuidedDemos({ sourceLeadId: leadId, limit: 20 });
      setDemoHistoryByLead((current) => ({
        ...current,
        [leadId]: list.items || [],
      }));
    } catch {
      setDemoHistoryByLead((current) => ({ ...current, [leadId]: [] }));
    } finally {
      setDemoHistoryLoadingId("");
    }
  }

  async function toggleLeadDetails(item: EarlyAccessLead) {
    const id = getLeadId(item);
    if (!id) return;
    const next = expandedLeadId === id ? "" : id;
    setExpandedLeadId(next);
    if (next) await loadLeadDemoHistory(next);
  }

  async function openWhatsAppSupportChat(item: EarlyAccessLead) {
    const id = getLeadId(item);
    const phone = getRegistrationValue(item, "phone");
    if (!id && (!phone || phone === "לא צוין")) return;
    setChatOpeningId(id);
    try {
      const resolved = await resolveAdminSupportChat({
        sourceLeadId: id,
        phone: phone !== "לא צוין" ? phone : "",
      });
      if (resolved.conversationId) {
        navigate(`/admin/support-chat?c=${resolved.conversationId}`);
        return;
      }
      alert("לא נמצאה שיחת WhatsApp לליד זה. שליחת דמו תיצור שיחה כש-WhatsApp מחובר.");
    } catch (error: any) {
      alert(error?.message || "לא ניתן לפתוח את השיחה");
    } finally {
      setChatOpeningId("");
    }
  }

  function LeadDetailPanel({ item }: { item: EarlyAccessLead }) {
    const id = getLeadId(item);
    const fullName = getRegistrationValue(item, "fullName");
    const email = getRegistrationValue(item, "email");
    const phone = getRegistrationValue(item, "phone");
    const businessName = getRegistrationValue(item, "businessName");
    const interest = getRegistrationValue(item, "interest");
    const monthlyBudget = getRegistrationValue(item, "monthlyBudget");
    const itemStatus = item.status || "new";
    const history = demoHistoryByLead[id] || [];
    const historyLoading = demoHistoryLoadingId === id;

    return (
      <div className="mt-4 rounded-[20px] border border-purple-100 bg-purple-50/40 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-[11px] font-black text-purple-400">שם</p>
            <p className="text-sm font-black text-purple-950">{fullName}</p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">עסק</p>
            <p className="text-sm font-bold text-purple-900">{businessName}</p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">טלפון</p>
            <p className="text-sm font-bold text-purple-900" dir="ltr">
              {phone}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">מייל</p>
            <p className="text-sm font-bold text-purple-900" dir="ltr">
              {email}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">מקור</p>
            <p className="text-sm font-bold text-purple-900">
              {item.source || "לא צוין"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">סטטוס</p>
            <StatusBadge status={itemStatus} />
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">נרשם</p>
            <p className="text-sm font-bold text-purple-900">
              {formatDate(item.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-black text-purple-400">עודכן</p>
            <p className="text-sm font-bold text-purple-900">
              {formatDate(item.updatedAt)}
            </p>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-[11px] font-black text-purple-400">תחומי עניין / תקציב</p>
            <p className="text-sm font-bold text-purple-900">
              {interest} · {monthlyBudget}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={chatOpeningId === id}
            onClick={() => void openWhatsAppSupportChat(item)}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-[#7C4DFF] px-4 text-xs font-black text-white disabled:opacity-50"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {chatOpeningId === id ? "פותח..." : "פתיחת השיחה ב-WhatsApp"}
          </button>
          <AdminSendDemoButton onClick={() => setDemoLead(item)} />
        </div>

        <div className="mt-4">
          <p className="text-sm font-black text-purple-950">היסטוריית דמואים</p>
          {historyLoading ? (
            <p className="mt-2 text-xs font-bold text-purple-700/70">טוען...</p>
          ) : history.length === 0 ? (
            <p className="mt-2 text-xs font-bold text-purple-700/70">
              עדיין לא נשלח דמו לליד זה
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {history.map((row) => (
                <button
                  key={row._id || row.id}
                  type="button"
                  onClick={() => navigate(`/admin/guided-demos/${row._id || row.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-white px-3 py-2 text-right"
                >
                  <div>
                    <p className="text-xs font-black text-purple-950">
                      {formatDate(row.createdAt)} ·{" "}
                      {DEMO_STATUS_LABEL[row.status] || row.status}
                    </p>
                    <p className="text-[11px] font-semibold text-purple-700/70">
                      {DELIVERY_LABEL[row.deliveryStatus] || row.deliveryStatus}
                      {row.businessName ? ` · ${row.businessName}` : ""}
                    </p>
                  </div>
                  <span className="text-[11px] font-black text-violet-700">צפייה</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredRegistrations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return registrations.filter((item) => {
      const itemStatus = item.status || "new";

      const matchesStatus =
        statusFilter === "all" ? true : itemStatus === statusFilter;

      const fullName = getRegistrationValue(item, "fullName");
      const email = getRegistrationValue(item, "email");
      const phone = getRegistrationValue(item, "phone");
      const businessName = getRegistrationValue(item, "businessName");
      const interest = getRegistrationValue(item, "interest");
      const monthlyBudget = getRegistrationValue(item, "monthlyBudget");

      const values = [
        fullName,
        email,
        phone,
        businessName,
        interest,
        monthlyBudget,
        item.source,
        statusLabels[itemStatus],
        item.ip,
        item.userAgent,
      ];

      const matchesSearch = !term
        ? true
        : values.some((value) =>
            String(value || "").toLowerCase().includes(term),
          );

      return matchesStatus && matchesSearch;
    });
  }, [registrations, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    const today = new Date();

    const todayCount = registrations.filter((item) => {
      const createdAt = new Date(item.createdAt || "");

      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      total: registrations.length,
      today: todayCount,
      newCount: registrations.filter((item) => (item.status || "new") === "new")
        .length,
      contacted: registrations.filter((item) => item.status === "contacted")
        .length,
    };
  }, [registrations]);

  async function handleStatusChange(id: string, status: EarlyAccessStatus) {
    if (!id) return;

    try {
      setActionLoadingId(id);

      const updatedLead = await updateEarlyAccessLeadStatus(id, status);

      setRegistrations((current) =>
        current.map((item) =>
          getLeadId(item) === id ? { ...item, ...updatedLead } : item,
        ),
      );
    } catch (error: any) {
      console.error("UPDATE EARLY ACCESS STATUS ERROR:", error);
      alert(error?.message || "שגיאה בעדכון הסטטוס");
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleDelete(id: string) {
    if (!id) return;

    const approved = window.confirm("למחוק את ההרשמה מהרשימה?");

    if (!approved) return;

    try {
      setActionLoadingId(id);

      await deleteEarlyAccessLead(id);

      setRegistrations((current) =>
        current.filter((item) => getLeadId(item) !== id),
      );
    } catch (error: any) {
      console.error("DELETE EARLY ACCESS LEAD ERROR:", error);
      alert(error?.message || "שגיאה במחיקת הנרשם");
    } finally {
      setActionLoadingId("");
    }
  }

  function exportCsv() {
    const headers = [
      "שם מלא",
      "מייל",
      "טלפון",
      "תחום העסק",
      "תחומי עניין",
      "תקציב חודשי",
      "סטטוס",
      "מקור",
      "IP",
      "תאריך הרשמה",
    ];

    const rows = filteredRegistrations.map((item) => {
      const itemStatus = item.status || "new";

      return [
        getRegistrationValue(item, "fullName"),
        getRegistrationValue(item, "email"),
        getRegistrationValue(item, "phone"),
        getRegistrationValue(item, "businessName"),
        getRegistrationValue(item, "interest"),
        getRegistrationValue(item, "monthlyBudget"),
        statusLabels[itemStatus],
        item.source || "לא צוין",
        item.ip || "לא צוין",
        formatDate(item.createdAt),
      ];
    });

    const safeValue = (value: string) => {
      return `"${String(value || "").replace(/"/g, '""')}"`;
    };

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map((cell) => safeValue(String(cell))).join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "bizuply-early-access.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminHeader />

      <main
        dir="rtl"
        className="min-h-screen bg-[#f7f2ff] px-3 py-5 text-right text-purple-950 sm:px-4 sm:py-7 md:px-8"
      >
        <section className="mx-auto max-w-[1480px]">
          <AdminPageHeader
            title="הרשמה מוקדמת"
            description="שם, מייל, טלפון, תחום, תחומי עניין ותקציב חודשי משוער."
            actions={
              <>
                <button
                  type="button"
                  className="biz-btn biz-btn-secondary"
                  onClick={exportCsv}
                  disabled={!filteredRegistrations.length}
                >
                  ייצוא CSV
                </button>
                <button
                  type="button"
                  className="biz-btn"
                  onClick={loadRegistrations}
                  disabled={loading}
                >
                  {loading ? "טוען..." : "רענון"}
                </button>
              </>
            }
          />

          <div className="biz-stat-grid">
            <SummaryCard
              title="סה״כ נרשמים"
              value={summary.total}
              color="purple"
            />
            <SummaryCard title="נרשמו היום" value={summary.today} color="pink" />
            <SummaryCard
              title="חדשים לטיפול"
              value={summary.newCount}
              color="amber"
            />
            <SummaryCard
              title="כבר טופלו"
              value={summary.contacted}
              color="green"
            />
          </div>

          <div className="mt-5 rounded-[28px] border border-purple-200 bg-white p-4 shadow-lg shadow-purple-950/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50/50 px-4">
                <span>🔎</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="חיפוש לפי שם, מייל, טלפון, תחום עסק, תחומי עניין או תקציב"
                  className="h-14 w-full bg-transparent text-right text-sm font-bold text-purple-950 outline-none placeholder:text-purple-950/35"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  { value: "all", label: "הכל" },
                  { value: "new", label: "חדשים" },
                  { value: "contacted", label: "טופלו" },
                  { value: "joined_group", label: "צורפו לקבוצה" },
                  { value: "not_relevant", label: "לא רלוונטי" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value as StatusFilter)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition ${
                      statusFilter === item.value
                        ? "bg-purple-700 text-white shadow-lg shadow-purple-700/20"
                        : "bg-white text-purple-900 ring-1 ring-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[30px] border border-purple-200 bg-white shadow-xl shadow-purple-950/8">
            {loading ? (
              <div className="grid min-h-[280px] place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 animate-pulse place-items-center rounded-3xl bg-purple-50 text-3xl">
                    ⏳
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-purple-950">
                    טוען הרשמות ממונגו
                  </h3>

                  <p className="mt-2 max-w-md text-sm font-bold leading-7 text-purple-950/55">
                    הרשימה נמשכת עכשיו מהשרת.
                  </p>
                </div>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="grid min-h-[280px] place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-purple-50 text-3xl">
                    ✨
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-purple-950">
                    אין הרשמות להצגה
                  </h3>

                  <p className="mt-2 max-w-md text-sm font-bold leading-7 text-purple-950/55">
                    ברגע שמישהו ימלא את הטופס והטופס ישמור את הנתונים במונגו,
                    הפרטים שלו יופיעו כאן בטבלה כולל תחומי עניין ותקציב חודשי.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="space-y-3 p-3 md:hidden">
                  {filteredRegistrations.map((item) => {
                    const id = getLeadId(item);
                    const fullName = getRegistrationValue(item, "fullName");
                    const email = getRegistrationValue(item, "email");
                    const phone = getRegistrationValue(item, "phone");
                    const businessName = getRegistrationValue(
                      item,
                      "businessName",
                    );
                    const whatsappPhone = normalizeWhatsappPhone(
                      phone !== "לא צוין" ? phone : "",
                    );
                    const itemStatus = item.status || "new";
                    const isActionLoading = actionLoadingId === id;
                    const hasPhone = phone && phone !== "לא צוין";

                    return (
                      <article
                        key={`m-${id}`}
                        id={`early-access-lead-${id}`}
                        className={`rounded-[24px] border bg-white p-4 shadow-sm ${
                          highlightLeadId === id
                            ? "border-violet-400 ring-2 ring-violet-200"
                            : "border-purple-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-black text-purple-950">
                              {fullName}
                            </h3>
                            <p
                              className="mt-1 truncate text-xs font-bold text-slate-400"
                              dir="ltr"
                            >
                              {email}
                            </p>
                            <p className="mt-1 truncate text-sm font-bold text-slate-600">
                              {businessName}
                            </p>
                            <p className="mt-1 truncate text-xs font-bold text-slate-500" dir="ltr">
                              {email !== "לא צוין" ? email : ""}
                            </p>
                            <div className="mt-2">
                              <StatusBadge status={itemStatus} />
                            </div>
                          </div>
                          {hasPhone ? (
                            <AdminDialButton
                              phone={phone}
                              name={fullName}
                              source="early-access"
                              refId={id}
                            />
                          ) : null}
                        </div>

                        {hasPhone ? (
                          <p
                            className="mt-3 text-sm font-bold text-slate-600"
                            dir="ltr"
                          >
                            {phone}
                          </p>
                        ) : null}

                        <div className="biz-row-actions mt-3">
                          <button
                            type="button"
                            className="biz-btn biz-btn-secondary"
                            onClick={() => void toggleLeadDetails(item)}
                          >
                            {expandedLeadId === id ? "הסתר" : "פרטים"}
                          </button>
                          <AdminRowMenu
                            items={[
                              {
                                label: chatOpeningId === id ? "פותח..." : "פתיחת שיחת WhatsApp",
                                disabled: chatOpeningId === id,
                                onClick: () => void openWhatsAppSupportChat(item),
                              },
                              {
                                label: "וואטסאפ",
                                hidden: !whatsappPhone,
                                onClick: () =>
                                  window.open(`https://wa.me/${whatsappPhone}`, "_blank", "noopener,noreferrer"),
                              },
                              { label: "שליחת דמו", onClick: () => setDemoLead(item) },
                              { label: "סמן כטופל", disabled: isActionLoading, onClick: () => handleStatusChange(id, "contacted") },
                              { label: "צורף לקבוצה", disabled: isActionLoading, onClick: () => handleStatusChange(id, "joined_group") },
                              { label: "לא רלוונטי", disabled: isActionLoading, onClick: () => handleStatusChange(id, "not_relevant") },
                              { label: "מחיקה", danger: true, disabled: isActionLoading, onClick: () => handleDelete(id) },
                            ]}
                          />
                        </div>

                        {expandedLeadId === id ? <LeadDetailPanel item={item} /> : null}
                      </article>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table
                    dir="rtl"
                    className="w-full min-w-[1420px] border-collapse text-right"
                  >
                    <thead>
                      <tr className="border-b border-purple-200 bg-purple-50">
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          שם מלא
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          מייל
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          טלפון
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          תחום העסק
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          תחומי עניין
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          תקציב חודשי
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          מקור
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          תאריך הרשמה
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          סטטוס
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-black text-purple-950">
                          פעולות
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRegistrations.map((item) => {
                        const id = getLeadId(item);
                        const fullName = getRegistrationValue(item, "fullName");
                        const email = getRegistrationValue(item, "email");
                        const phone = getRegistrationValue(item, "phone");
                        const businessName = getRegistrationValue(
                          item,
                          "businessName",
                        );
                        const interest = getRegistrationValue(item, "interest");
                        const monthlyBudget = getRegistrationValue(
                          item,
                          "monthlyBudget",
                        );
                        const whatsappPhone = normalizeWhatsappPhone(phone);
                        const itemStatus = item.status || "new";
                        const isActionLoading = actionLoadingId === id;

                        return (
                          <React.Fragment key={id}>
                          <tr
                            id={`early-access-lead-${id}`}
                            className={`border-b border-purple-100 transition hover:bg-purple-50/60 ${
                              highlightLeadId === id ? "bg-violet-50/80" : ""
                            }`}
                          >
                            <td className="px-5 py-4 text-right">
                              <strong className="block text-sm font-black text-purple-950">
                                {fullName}
                              </strong>
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                              {email}
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                              {phone && phone !== "לא צוין" ? (
                                <div className="flex items-center justify-start gap-2">
                                  <span>{phone}</span>
                                  <AdminDialButton
                                    phone={phone}
                                    name={fullName}
                                    source="early-access"
                                    refId={id}
                                  />
                                </div>
                              ) : (
                                phone
                              )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-700">
                              {businessName}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex max-w-[360px] flex-wrap gap-2">
                                {(Array.isArray(item.interests) &&
                                item.interests.length > 0
                                  ? item.interests
                                  : interest !== "לא צוין"
                                    ? interest
                                        .split(",")
                                        .map((value) => value.trim())
                                        .filter(Boolean)
                                    : ["לא צוין"]
                                ).map((value) => (
                                  <span
                                    key={value}
                                    className="inline-flex rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-black text-fuchsia-800 ring-1 ring-fuchsia-200"
                                  >
                                    {value}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-black text-purple-900">
                              {monthlyBudget}
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-500">
                              {item.source || "לא צוין"}
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-500">
                              {formatDate(item.createdAt)}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <StatusBadge status={itemStatus} />
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="biz-row-actions">
                                <button
                                  type="button"
                                  className="biz-btn biz-btn-ghost"
                                  onClick={() => void toggleLeadDetails(item)}
                                >
                                  {expandedLeadId === id ? "הסתר" : "פרטים"}
                                </button>
                                {phone && phone !== "לא צוין" ? (
                                  <AdminDialButton
                                    phone={phone}
                                    name={fullName}
                                    source="early-access"
                                    refId={id}
                                    size="md"
                                    label="חייג"
                                  />
                                ) : null}
                                <AdminRowMenu
                                  items={[
                                    {
                                      label: "פתיחת שיחת WhatsApp",
                                      onClick: () => void openWhatsAppSupportChat(item),
                                    },
                                    {
                                      label: "וואטסאפ",
                                      hidden: !whatsappPhone,
                                      onClick: () =>
                                        window.open(`https://wa.me/${whatsappPhone}`, "_blank", "noopener,noreferrer"),
                                    },
                                    { label: "שליחת דמו", onClick: () => setDemoLead(item) },
                                    { label: "סמן כטופל", disabled: isActionLoading, onClick: () => handleStatusChange(id, "contacted") },
                                    { label: "צורף לקבוצה", disabled: isActionLoading, onClick: () => handleStatusChange(id, "joined_group") },
                                    { label: "לא רלוונטי", disabled: isActionLoading, onClick: () => handleStatusChange(id, "not_relevant") },
                                    { label: "מחיקה", danger: true, disabled: isActionLoading, onClick: () => handleDelete(id) },
                                  ]}
                                />
                              </div>
                            </td>
                          </tr>
                          {expandedLeadId === id ? (
                            <tr className="border-b border-purple-100 bg-purple-50/30">
                              <td colSpan={10} className="px-5 py-4">
                                <LeadDetailPanel item={item} />
                              </td>
                            </tr>
                          ) : null}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <AdminSendGuidedDemoModal
        open={Boolean(demoLead)}
        onClose={() => setDemoLead(null)}
        context={{
          customerName:
            demoLead?.name && demoLead.name !== "לא צוין" ? demoLead.name : "",
          phone: demoLead?.phone || "",
          businessName: demoLead?.business || "",
          sourceType: "early_access",
          sourceLeadId: demoLead ? getLeadId(demoLead) : "",
          needCandidates: [
            ...(Array.isArray(demoLead?.interests) ? demoLead.interests : []),
            demoLead?.interest || "",
          ],
        }}
      />
    </>
  );
}

export default AdminEarlyAccess;