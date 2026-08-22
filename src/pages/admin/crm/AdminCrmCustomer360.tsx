import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AdminDialButton from "../../../components/AdminDialButton";
import { useAuth } from "../../../context/AuthContext";
import { getDefaultDashboardPath } from "../../../utils/moduleAccess";
import API from "../../../api";
import adminCrmApi from "../../../api/adminCrmApi";
import {
  ACTIVITY_LABELS,
  Badge,
  FIELD_LABELS,
  FOLLOW_UP_TYPE_LABELS,
  HEALTH_LABELS,
  LIFECYCLE_LABELS,
  LOST_REASON_LABELS,
  NOTE_TYPE_LABELS,
  PACKAGE_LABELS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
  STAGE_LABELS,
  TASK_STATUS_LABELS,
  TIMELINE_LABELS,
  WHATSAPP_INBOX_STATUS_LABELS,
  formatIsraelDate,
  healthTone,
  lifecycleTone,
  stageTone,
  statusTone,
} from "./adminCrmLabels";
import {
  CrmCard,
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
} from "./AdminCrmUi";
import { AdminModal } from "./AdminModal";
import AdminCrmWhatsAppPanel from "./AdminCrmWhatsAppPanel";
import {
  AdminBizuplyBookFlow,
  AppointmentDetails,
  CustomerAppointmentActions,
  israelWeekday,
} from "../AdminBizuplyBookFlow";

const TABS = [
  ["overview", "סקירה"],
  ["meetings", "תיאומים"],
  ["activity", "פעילות"],
  ["tasks", "משימות ומעקבים"],
  ["communication", "תקשורת"],
  ["products", "חבילה וגישה"],
  ["billing", "חיובים"],
  ["websites", "אתרים"],
  ["automations", "אוטומציות"],
  ["support", "תמיכה"],
  ["info", "עריכת CRM"],
];

export default function AdminCrmCustomer360() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as { loginWithToken: Function };
  const [tab, setTab] = useState(
    searchParams.get("tab") === "whatsapp" || searchParams.get("tab") === "timeline"
      ? searchParams.get("tab") === "whatsapp"
        ? "communication"
        : "activity"
      : searchParams.get("tab") || "overview"
  );
  const [perms, setPerms] = useState<any>({});
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [tabData, setTabData] = useState<any>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [edit, setEdit] = useState<any>({});
  const [noteType, setNoteType] = useState("normal");
  const [taskTitle, setTaskTitle] = useState("");
  const [followAt, setFollowAt] = useState("");
  const [followNote, setFollowNote] = useState("");
  const [followType, setFollowType] = useState("call_back");
  const [waIntent, setWaIntent] = useState<"message" | "follow_up" | "demo" | "payment">("message");
  const [activity, setActivity] = useState({ type: "note", description: "" });
  const [planSku, setPlanSku] = useState("monthly");
  const [preview, setPreview] = useState<any>(null);
  const [lostOpen, setLostOpen] = useState(false);
  const [lostReason, setLostReason] = useState("no_response");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [calendarServices, setCalendarServices] = useState<any[]>([]);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.customer(id);
      setCustomer(data.customer);
      if (data.customer.nextFollowUpType) setFollowType(data.customer.nextFollowUpType);
      setEdit({
        contactName: data.customer.contactName || "",
        companyName: data.customer.companyName || "",
        phone: data.customer.phone || "",
        email: data.customer.email || "",
        salesNotes: data.customer.salesNotes || "",
        lifecycle: data.customer.lifecycle,
        salesStage: data.customer.salesStage,
        leadSource: data.customer.leadSource,
        priority: data.customer.priority,
        tags: (data.customer.tags || []).join(", "),
      });
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הלקוח נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    adminCrmApi.meta().then(({ data }) => setPerms(data.permissions || {})).catch(() => null);
  }, [id]);

  useEffect(() => {
    if (!id || !customer) return;
    let cancelled = false;
    async function loadTab() {
      setTabLoading(true);
      try {
        let data: any = null;
        if (tab === "activity") {
          const [timeline, notes] = await Promise.all([
            adminCrmApi.timeline(id),
            adminCrmApi.notes(id).catch(() => ({ data: { notes: [] } })),
          ]);
          data = { items: timeline.data.items, notes: notes.data.notes };
        }
        if (tab === "products") data = (await adminCrmApi.products(id)).data;
        if (tab === "websites") data = (await adminCrmApi.websites(id)).data;
        if (tab === "automations") data = (await adminCrmApi.automations(id)).data;
        if (tab === "billing") data = (await adminCrmApi.billing(id)).data;
        if (tab === "tasks") data = (await adminCrmApi.customerTasks(id)).data;
        if (tab === "support") {
          const [notes, tasks, audit] = await Promise.all([
            adminCrmApi.notes(id),
            adminCrmApi.customerTasks(id),
            adminCrmApi.audit(id).catch(() => ({ data: { items: [] } })),
          ]);
          data = {
            notes: notes.data.notes,
            tasks: tasks.data.tasks,
            audit: audit.data.items || audit.data.logs || [],
          };
        }
        if (tab === "meetings") {
          const [appointments, calendar] = await Promise.all([
            adminCrmApi.customerAppointments(id),
            adminCrmApi.calendar({ days: 1 }).catch(() => ({ data: {} })),
          ]);
          data = appointments.data;
          if (!cancelled) setCalendarServices(calendar.data.services || []);
        }
        if (tab === "overview") {
          const [notes, tasks, sub, products, appointments] = await Promise.all([
            adminCrmApi.notes(id),
            adminCrmApi.customerTasks(id),
            adminCrmApi.subscription(id).catch(() => ({ data: {} })),
            adminCrmApi.products(id).catch(() => ({ data: {} })),
            adminCrmApi.customerAppointments(id).catch(() => ({ data: {} })),
          ]);
          data = {
            notes: notes.data.notes,
            tasks: tasks.data.tasks,
            subscription: sub.data.subscription,
            products: products.data,
            nextAppointment: appointments.data.nextAppointment || null,
            appointments: appointments.data.appointments || [],
          };
        }
        if (!cancelled) setTabData(data);
      } catch (err: any) {
        if (!cancelled) setBanner(err?.response?.data?.error || "טעינת הלשונית נכשלה");
      } finally {
        if (!cancelled) setTabLoading(false);
      }
    }
    loadTab();
    return () => {
      cancelled = true;
    };
  }, [tab, id, customer?.adminCustomerId]);

  async function saveInfo() {
    try {
      await adminCrmApi.updateCustomer(id!, {
        ...edit,
        tags: String(edit.tags || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
      });
      setBanner("פרטי CRM עודכנו. נתוני חשבון/חיוב לא שונו.");
      load();
    } catch (err: any) {
      setBanner(err?.response?.data?.error || "השמירה נכשלה");
    }
  }

  async function confirmPermanentDelete() {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await adminCrmApi.deleteCustomer(id);
      navigate("/admin/crm/customers", { state: { deletedLeadToast: true } });
    } catch (err: any) {
      setBanner(err?.response?.data?.error || "מחיקת הליד נכשלה");
      setDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function openBusiness() {
    if (!customer?.businessId) return;
    try {
      if (perms.customerEnter === false) {
        setBanner("אין הרשאה לכניסה לעסק");
        return;
      }
      await adminCrmApi.enterBusiness(id!, { reason: "כניסה מתיק לקוח CRM" });
      const { data } = await API.post("/admin/impersonate-business", {
        businessId: customer.businessId,
      });
      loginWithToken(data.user, data.token, { skipRedirect: true });
      navigate(getDefaultDashboardPath(data.user, customer.businessId));
    } catch (err: any) {
      setBanner(err?.response?.data?.error || "כניסה לעסק נכשלה");
    }
  }

  function openCommunication(intent: "message" | "follow_up" | "demo" | "payment" = "message") {
    setWaIntent(intent);
    setTab("communication");
  }

  async function openNewAppointment() {
    if (!calendarServices.length) {
      try {
        const { data } = await adminCrmApi.calendar({ days: 1 });
        setCalendarServices(data.services || []);
      } catch {
        setCalendarServices([{ key: "intro_call", nameHe: "שיחה ראשונית", durationMinutes: 15, active: true }]);
      }
    }
    setBookOpen(true);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!customer) return <EmptyState title="לקוח לא נמצא" />;

  const waUnread = Number(customer.whatsappUnreadCount || 0);
  const waConversation = customer.whatsappConversation || {};
  const waActive = Boolean(waConversation.active || customer.whatsappConversationStartedAt);
  const waWaiting = waConversation.status === "waiting_for_staff";

  return (
    <div className="space-y-4">
      {banner ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-bold text-emerald-800">
          {banner}
        </div>
      ) : null}
      <CrmCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-purple-950">
              {customer.contactName || customer.companyName || "לקוח"}
            </h1>
            <p className="mt-1 font-bold text-slate-600">{customer.businessName || customer.companyName}</p>
            <p className="mt-1 font-bold" dir="ltr">{customer.phone} · {customer.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={lifecycleTone(customer.lifecycle)}>{LIFECYCLE_LABELS[customer.lifecycle]}</Badge>
              <Badge tone={stageTone(customer.salesStage)}>{STAGE_LABELS[customer.salesStage]}</Badge>
              {customer.health?.health ? (
                <Badge tone={healthTone(customer.health.health)}>
                  {HEALTH_LABELS[customer.health.health]}
                </Badge>
              ) : null}
              <Badge tone={statusTone(customer.account?.subscriptionStatus)}>
                {customer.account?.subscriptionPlan
                  ? PACKAGE_LABELS[customer.account.subscriptionPlan] || customer.account.subscriptionPlan
                  : "אין מנוי"}
              </Badge>
              {waActive ? (
                <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">שיחת WhatsApp פעילה</Badge>
              ) : null}
              {waWaiting ? (
                <Badge tone="bg-amber-50 text-amber-800 border-amber-200">
                  {waConversation.statusLabel || WHATSAPP_INBOX_STATUS_LABELS.waiting_for_staff}
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 text-sm font-bold text-slate-500">
              אחראי: {customer.assignedAdminName || "לא משויך"} · חבילה נוכחית{" "}
              {PACKAGE_LABELS[customer.account?.subscriptionPlan] || "אין"} · MRR ₪
              {Number(customer.mrr || 0).toLocaleString("he-IL")} · הצטרפות{" "}
              {formatIsraelDate(customer.convertedAt || customer.createdAt)} · פעילות אחרונה{" "}
              {formatIsraelDate(customer.lastActivityAt, true)}
            </p>
            {customer.nextFollowUpAt ? (
              <p className="mt-1 text-sm font-black text-[#7C4DFF]">
                מעקב הבא: {formatIsraelDate(customer.nextFollowUpAt, true)}
                {customer.nextFollowUpType
                  ? ` · ${FOLLOW_UP_TYPE_LABELS[customer.nextFollowUpType] || customer.nextFollowUpType}`
                  : ""}{" "}
                {customer.nextFollowUpNote}
              </p>
            ) : (
              <p className="mt-1 text-sm font-bold text-slate-400">אין מעקב הבא</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              className="relative min-h-11 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700"
              onClick={() => openCommunication("message")}
            >
              WhatsApp
              {waUnread ? (
                <span className="absolute -top-1 -left-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] text-white">
                  {waUnread}
                </span>
              ) : null}
            </button>
            <AdminDialButton phone={customer.phone} name={customer.contactName} source="admin-crm" refId={customer.adminCustomerId} size="md" label="שיחה" />
            {customer.phone ? (
              <a className="min-h-11 rounded-2xl bg-slate-50 px-3 py-2 text-center text-sm font-black text-slate-700" href={`sms:${customer.phone}`}>SMS</a>
            ) : null}
            {customer.email ? (
              <a className="min-h-11 rounded-2xl bg-sky-50 px-3 py-2 text-center text-sm font-black text-sky-700" href={`mailto:${customer.email}`}>מייל</a>
            ) : null}
            {perms.demoSend !== false ? (
              <SecondaryButton onClick={() => openCommunication("demo")}>שליחת דמו</SecondaryButton>
            ) : null}
            <SecondaryButton onClick={() => setTab("tasks")}>משימה חדשה</SecondaryButton>
            <SecondaryButton onClick={() => setTab("activity")}>הוספת תיעוד</SecondaryButton>
            <SecondaryButton onClick={() => setTab("tasks")}>קביעת מעקב</SecondaryButton>
            {customer.businessId ? (
              perms.customerEnter !== false ? (
                <PrimaryButton onClick={openBusiness}>כניסה לעסק</PrimaryButton>
              ) : (
                <SecondaryButton disabled>אין הרשאת כניסה</SecondaryButton>
              )
            ) : (
              <PrimaryButton
                onClick={() =>
                  navigate(
                    `/admin/create-user?fromCrm=${encodeURIComponent(id || "")}&name=${encodeURIComponent(customer.contactName || "")}&email=${encodeURIComponent(customer.email || "")}&phone=${encodeURIComponent(customer.phone || "")}&businessName=${encodeURIComponent(customer.companyName || "")}`
                  )
                }
              >
                הפוך ללקוח / צור חשבון BizUply
              </PrimaryButton>
            )}
            <PrimaryButton onClick={() => openNewAppointment()}>+ תיאום חדש</PrimaryButton>
            <SecondaryButton onClick={() => setTab("meetings")}>כל התיאומים</SecondaryButton>
            <SecondaryButton onClick={() => setTab("billing")}>ניהול חבילה</SecondaryButton>
            <SecondaryButton onClick={() => setTab("billing")}>שדרוג</SecondaryButton>
            <SecondaryButton onClick={() => setTab("products")}>ניהול תוספים</SecondaryButton>
            <PrimaryButton onClick={() => adminCrmApi.markWon(id!).then(load)}>נסגר</PrimaryButton>
            <SecondaryButton onClick={() => setLostOpen(true)}>לא נסגר</SecondaryButton>
            {perms.delete !== false && customer.canDeleteLead ? (
              <DangerButton onClick={() => setDeleteOpen(true)}>מחיקת ליד</DangerButton>
            ) : null}
            {perms.delete !== false && customer.suggestArchive ? (
              <SecondaryButton
                onClick={async () => {
                  try {
                    await adminCrmApi.archiveCustomer(id!);
                    setBanner("הלקוח אורכב");
                    load();
                  } catch (err: any) {
                    setBanner(err?.response?.data?.error || "ארכוב נכשל");
                  }
                }}
              >
                ארכוב לקוח
              </SecondaryButton>
            ) : null}
          </div>
        </div>
      </CrmCard>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={[
              "min-h-11 shrink-0 rounded-2xl px-4 text-sm font-black",
              tab === key ? "bg-[#7C4DFF] text-white" : "bg-white border border-purple-100 text-slate-600",
            ].join(" ")}
          >
            {label}
            {key === "communication" && waUnread ? ` (${waUnread})` : ""}
          </button>
        ))}
      </div>

      {tabLoading && tab !== "communication" ? <LoadingState /> : null}

      {tab === "overview" && tabData ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CrmCard>
            <h3 className="font-black">פרטי הלקוח</h3>
            <p>שם: {customer.contactName || "—"}</p>
            <p>עסק: {customer.businessName || customer.companyName || "—"}</p>
            <p>סטטוס CRM: {LIFECYCLE_LABELS[customer.lifecycle]}</p>
            <p>שלב מכירה: {STAGE_LABELS[customer.salesStage]}</p>
            <p>אחראי: {customer.assignedAdminName || "לא משויך"}</p>
            <p>מקור ליד: {SOURCE_LABELS[customer.leadSource] || customer.leadSource}</p>
            {(customer.leadSourceHistory || []).length > 1 ? (
              <p className="text-sm font-bold text-slate-500">
                מקורות נוספים: {(customer.leadSourceHistory || [])
                  .map((row: any) => SOURCE_LABELS[row.source] || row.source)
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            <p>חבילה נוכחית: {PACKAGE_LABELS[customer.account?.subscriptionPlan] || "—"}</p>
            <p>סטטוס מנוי: {customer.account?.subscriptionStatus || "—"}</p>
          </CrmCard>
          <CrmCard>
            <h3 className="font-black">מצב הלקוח</h3>
            <Badge tone={healthTone(customer.health?.health)}>{HEALTH_LABELS[customer.health?.health] || "—"}</Badge>
            <ul className="mt-2 list-disc pr-5 text-sm font-bold text-slate-600">
              {(customer.health?.reasons || ["אין התראות"]).map((r: string) => <li key={r}>{r}</li>)}
            </ul>
          </CrmCard>
          <CrmCard>
            <h3 className="font-black">משימות פתוחות</h3>
            {(tabData.tasks || []).filter((t: any) => ["open", "in_progress"].includes(t.status)).length === 0
              ? <p className="text-slate-500">אין משימות פתוחות</p>
              : (tabData.tasks || []).filter((t: any) => ["open", "in_progress"].includes(t.status)).map((t: any) => (
                <p key={t._id}>{t.title} · {formatIsraelDate(t.dueAt, true)}</p>
              ))}
          </CrmCard>
          <CrmCard className="!border-[#7C4DFF]/20 !bg-gradient-to-l !from-[#7C4DFF]/5 !to-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#7C4DFF]">התיאום הבא</p>
                {tabData.nextAppointment ? (
                  <>
                    <p className="mt-1 text-lg font-bold text-slate-900">{tabData.nextAppointment.serviceName}</p>
                    <p className="text-sm font-medium text-slate-700">{israelWeekday(tabData.nextAppointment.startAt)}</p>
                    <p className="text-sm font-semibold text-[#7C4DFF]">
                      {new Intl.DateTimeFormat("he-IL", {
                        timeZone: "Asia/Jerusalem",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(new Date(tabData.nextAppointment.startAt))}
                      {" · "}
                      {tabData.nextAppointment.durationMinutes} דקות
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm font-medium text-slate-500">אין תיאום עתידי</p>
                )}
              </div>
              <PrimaryButton compact onClick={() => openNewAppointment()}>+ תיאום חדש</PrimaryButton>
            </div>
            {tabData.nextAppointment ? (
              <div className="mt-3 border-t border-[#7C4DFF]/10 pt-3">
                <CustomerAppointmentActions
                  row={tabData.nextAppointment}
                  customerId={id!}
                  onChanged={() => setTab("meetings")}
                  onBookAnother={() => openNewAppointment()}
                  onError={setBanner}
                />
              </div>
            ) : (
              <div className="mt-3">
                <PrimaryButton compact onClick={() => openNewAppointment()}>קביעת שיחה ראשונה</PrimaryButton>
              </div>
            )}
          </CrmCard>
          <CrmCard>
            <h3 className="font-black">גישה נוכחית</h3>
            {(tabData.products?.features || []).filter((f: any) => f.enabled).map((f: any) => (
              <span key={f.key} className="mb-2 ml-2 inline-flex rounded-full bg-purple-50 px-2 py-1 text-xs font-black text-[#7C4DFF]">{f.name}</span>
            ))}
          </CrmCard>
        </div>
      ) : null}

      {tab === "meetings" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">תיאומים</h3>
              <p className="text-xs text-slate-500">כל פגישות יומן BizUply של הלקוח</p>
            </div>
            <PrimaryButton compact onClick={() => openNewAppointment()}>+ תיאום חדש</PrimaryButton>
          </div>
          {(tabData?.upcoming || []).length ? (
            <div className="rounded-xl border border-[#7C4DFF]/20 bg-[#7C4DFF]/5 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7C4DFF]">קרובים</h3>
              {(tabData.upcoming || []).map((row: any) => (
                <div key={row.id} className="border-t border-[#7C4DFF]/10 py-2 first:border-t-0 first:pt-0">
                  <AppointmentDetails row={row} compact />
                  <CustomerAppointmentActions
                    row={row}
                    customerId={id!}
                    onChanged={async () => {
                      const { data } = await adminCrmApi.customerAppointments(id!);
                      setTabData(data);
                    }}
                    onBookAnother={() => openNewAppointment()}
                    onError={setBanner}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="אין תיאום עתידי"
              action={<PrimaryButton compact onClick={() => openNewAppointment()}>+ תיאום חדש</PrimaryButton>}
            />
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">היסטוריה</h3>
            {(tabData?.history || []).length ? (
              (tabData.history || []).map((row: any) => (
                <div key={row.id} className="border-t border-slate-100 py-2 first:border-t-0 first:pt-0">
                  <AppointmentDetails row={row} compact />
                  {row.cancelledAt ? (
                    <p className="text-[11px] text-slate-500">
                      בוטל ב-{formatIsraelDate(row.cancelledAt, true)}
                      {row.cancelledByName ? ` · ${row.cancelledByName}` : ""}
                    </p>
                  ) : null}
                  <CustomerAppointmentActions
                    row={row}
                    customerId={id!}
                    onChanged={async () => {
                      const { data } = await adminCrmApi.customerAppointments(id!);
                      setTabData(data);
                    }}
                    onBookAnother={() => openNewAppointment()}
                    onError={setBanner}
                  />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">אין היסטוריית תיאומים</p>
            )}
          </div>
        </div>
      ) : null}

      {tab === "activity" && (
        <div className="space-y-3">
          <CrmCard>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await adminCrmApi.createActivity(id!, activity);
                if (activity.description.trim()) {
                  await adminCrmApi.createNote(id!, {
                    content: activity.description,
                    type: noteType,
                  });
                }
                setActivity({ type: "note", description: "" });
                setBanner("התיעוד נשמר");
                const { data } = await adminCrmApi.timeline(id!);
                setTabData((prev: any) => ({ ...prev, items: data.items }));
              }}
            >
              <select value={activity.type} onChange={(e) => setActivity({ ...activity, type: e.target.value })} className="min-h-11 w-full rounded-2xl border px-3">
                {Object.entries(ACTIVITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="min-h-11 w-full rounded-2xl border px-3">
                {Object.entries(NOTE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <textarea className="min-h-28 w-full rounded-2xl border p-3" placeholder="תיעוד פנימי — לא נחשף ללקוח" value={activity.description} onChange={(e) => setActivity({ ...activity, description: e.target.value })} />
              <PrimaryButton type="submit">שמירת תיעוד</PrimaryButton>
            </form>
          </CrmCard>
          {(tabData?.items || []).map((item: any) => (
            <article key={item.id} className="rounded-2xl border border-purple-100 bg-white p-4">
              <div className="text-xs font-black text-[#7C4DFF]">{TIMELINE_LABELS[item.type] || item.type} · {formatIsraelDate(item.occurredAt, true)}</div>
              <p className="font-bold">{item.description}</p>
              <p className="text-xs text-slate-500">{item.actorName}</p>
              {item.deepLink ? <a className="text-xs font-black text-[#7C4DFF]" href={item.deepLink}>פתיחה</a> : null}
            </article>
          ))}
          {!tabData?.items?.length ? <EmptyState title="אין אירועים בציר הזמן" /> : null}
        </div>
      )}

      {tab === "info" && (
        <CrmCard>
          <p className="mb-3 text-sm font-bold text-amber-700">עריכה זו משנה רק נתוני Admin CRM. חשבון, חיוב והרשאות נשארים במקור האמת שלהם.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["contactName", "companyName", "phone", "email"].map((field) => (
              <input key={field} className="min-h-11 rounded-2xl border px-3" value={edit[field] || ""} onChange={(e) => setEdit({ ...edit, [field]: e.target.value })} placeholder={FIELD_LABELS[field] || field} />
            ))}
            <select className="min-h-11 rounded-2xl border px-3" value={edit.lifecycle} onChange={(e) => setEdit({ ...edit, lifecycle: e.target.value })}>
              {Object.entries(LIFECYCLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="min-h-11 rounded-2xl border px-3" value={edit.salesStage} onChange={(e) => setEdit({ ...edit, salesStage: e.target.value })}>
              {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="min-h-11 rounded-2xl border px-3" value={edit.leadSource} onChange={(e) => setEdit({ ...edit, leadSource: e.target.value })}>
              {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="min-h-11 rounded-2xl border px-3" value={edit.priority} onChange={(e) => setEdit({ ...edit, priority: e.target.value })}>
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className="min-h-11 rounded-2xl border px-3 sm:col-span-2" value={edit.tags || ""} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} placeholder="תגיות מופרדות בפסיק" />
            <textarea className="min-h-28 rounded-2xl border p-3 sm:col-span-2" value={edit.salesNotes || ""} onChange={(e) => setEdit({ ...edit, salesNotes: e.target.value })} placeholder="הערות מכירה" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <PrimaryButton onClick={saveInfo}>שמירת פרטי CRM</PrimaryButton>
            {customer.businessId ? (
              <SecondaryButton onClick={() => navigate("/admin/businesses")}>עריכת העסק במסך הקיים</SecondaryButton>
            ) : null}
          </div>
        </CrmCard>
      )}

      {tab === "products" && (
        <div className="space-y-3">
          {(tabData?.features || []).map((row: any) => (
            <CrmCard key={row.key}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-black">{row.name}</div>
                  <div className="text-xs text-slate-500">
                    {row.included ? "כלול בחבילה" : row.paid ? "תוסף בתשלום" : "לא פעיל"}
                    {row.enabled ? " · פעיל" : " · לא פעיל"}
                  </div>
                </div>
                <Badge tone={statusTone(row.enabled ? "active" : "inactive")}>{row.status}</Badge>
              </div>
            </CrmCard>
          ))}
          {(tabData?.plugins || []).map((row: any) => (
            <CrmCard key={row.key}>
              <div className="font-black">{row.name}</div>
              <div className="text-xs text-slate-500">{row.status} · {row.source}</div>
            </CrmCard>
          ))}
        </div>
      )}

      {tab === "websites" && (
        <div className="space-y-3">
          {(tabData?.items || []).map((site: any) => (
            <CrmCard key={site.id}>
              <div className="font-black">{site.name}</div>
              <p className="text-sm">{site.domain || "ללא דומיין"} · {site.published ? "מפורסם" : "טיוטה"}</p>
              <p className="text-xs text-slate-500">נוצר {formatIsraelDate(site.createdAt)} · פורסם {formatIsraelDate(site.lastPublish)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {customer.businessId ? <SecondaryButton onClick={openBusiness}>תצוגת אדמין / עורך</SecondaryButton> : null}
                {site.publicUrl ? <a className="min-h-11 rounded-2xl bg-purple-50 px-3 py-2 text-sm font-black text-[#7C4DFF]" href={site.publicUrl} target="_blank" rel="noreferrer">אתר מפורסם</a> : null}
              </div>
            </CrmCard>
          ))}
          {!tabData?.items?.length ? <EmptyState title="אין אתרים ללקוח זה" /> : null}
        </div>
      )}

      {tab === "communication" && (
        <div className="space-y-3">
          {waActive || waWaiting || waConversation.handoffAckStatus === "failed" ? (
            <CrmCard>
              <div className="flex flex-wrap items-center gap-2">
                {waActive ? (
                  <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">שיחת WhatsApp פעילה</Badge>
                ) : null}
                {waWaiting ? (
                  <Badge tone="bg-amber-50 text-amber-800 border-amber-200">
                    {waConversation.statusLabel || WHATSAPP_INBOX_STATUS_LABELS.waiting_for_staff}
                  </Badge>
                ) : null}
              </div>
              {waConversation.assignedStaffName ? (
                <p className="mt-2 text-sm font-bold text-slate-600">
                  נציג משויך: {waConversation.assignedStaffName}
                </p>
              ) : waWaiting ? (
                <p className="mt-2 text-sm font-bold text-slate-500">בתור לנציג BizUply</p>
              ) : null}
              {waConversation.handoffAckStatus === "failed" && waConversation.handoffAckError ? (
                <p className="mt-2 text-sm font-bold text-rose-700">
                  אישור אוטומטי לא נשלח: {waConversation.handoffAckError}
                </p>
              ) : null}
            </CrmCard>
          ) : null}
          <AdminCrmWhatsAppPanel
            customerId={id!}
            canSend={Boolean(perms.whatsappSend || perms.conversationsReply)}
            canTemplates={Boolean(perms.whatsappTemplates)}
            canDemo={Boolean(perms.demoSend)}
            onBanner={setBanner}
            initialIntent={waIntent}
          />
        </div>
      )}

      {tab === "automations" && (
        <CrmCard>
          <p>תוכנית: {tabData?.overview?.plan?.name || tabData?.overview?.plan?.key || "—"}</p>
          <p>שימוש: {tabData?.overview?.usage ? `${tabData.overview.usage.used}/${tabData.overview.usage.limit}` : "—"}</p>
          <p>וורקפלואים פעילים: {tabData?.activeWorkflows ?? "—"}</p>
          <p>כשלונות: {tabData?.failedWorkflows ?? "—"}</p>
          {customer.businessId ? <SecondaryButton onClick={openBusiness}>פתיחת הקשר העסקי</SecondaryButton> : null}
        </CrmCard>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <CrmCard>
            <h3 className="font-black">מנוי נוכחי</h3>
            <p>{tabData?.overview?.primaryPlan?.name || "אין חבילה"}</p>
            <p>סטטוס: {tabData?.overview?.summary?.primaryPlanStatus || "—"}</p>
            <p>חיוב הבא: {formatIsraelDate(tabData?.overview?.summary?.nextChargeDate)} · {tabData?.overview?.summary?.nextChargeAmount ?? "—"}</p>
          </CrmCard>
          <CrmCard>
            <h3 className="mb-2 font-black">שינוי חבילה</h3>
            <p className="mb-2 text-sm text-slate-500">משתמש בתשתית החיוב הקיימת בלבד. חבילות נסתרות לא מוצגות.</p>
            <select value={planSku} onChange={(e) => setPlanSku(e.target.value)} className="min-h-11 rounded-2xl border px-3">
              <option value="monthly">חודשי</option>
              <option value="yearly">שנתי</option>
              <option value="website_only">אתר בלבד</option>
            </select>
            <div className="mt-2 flex gap-2">
              <SecondaryButton onClick={async () => {
                const { data } = await adminCrmApi.previewPlan(id!, { packageSku: planSku, executionMode: "admin_override" });
                setPreview(data.preview);
              }}>תצוגה מקדימה</SecondaryButton>
            </div>
            {preview ? (
              <div className="mt-3 rounded-2xl bg-purple-50 p-3 text-sm">
                <p>מ-{preview.current?.package} אל {preview.requested?.packageSku}</p>
                {(preview.accessChanges || []).map((c: any) => (
                  <p key={c.key}>{c.label}: {String(c.from)} → {String(c.to)}</p>
                ))}
                <PrimaryButton className="mt-2" onClick={async () => {
                  const { data } = await adminCrmApi.confirmPlan(id!, { packageSku: planSku, confirm: true, executionMode: "admin_override" });
                  setBanner("החבילה עודכנה דרך תשתית החיוב הקיימת");
                  if (data.checkout?.url) window.location.href = data.checkout.url;
                  load();
                }}>אישור שינוי</PrimaryButton>
              </div>
            ) : null}
          </CrmCard>
        </div>
      )}

      {tab === "tasks" && (
        <CrmCard>
          <form
            className="mb-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              await adminCrmApi.createTask(id!, { title: taskTitle });
              setTaskTitle("");
              const { data } = await adminCrmApi.customerTasks(id!);
              setTabData(data);
            }}
          >
            <input className="min-h-11 flex-1 rounded-2xl border px-3" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="משימה חדשה" />
            <PrimaryButton type="submit">הוספה</PrimaryButton>
          </form>
          <form
            className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              await adminCrmApi.followUp(id!, { at: followAt, note: followNote, type: followType });
              setBanner("מעקב עודכן");
              load();
            }}
          >
            <input type="datetime-local" className="min-h-11 rounded-2xl border px-3" value={followAt} onChange={(e) => setFollowAt(e.target.value)} required />
            <select className="min-h-11 rounded-2xl border px-3" value={followType} onChange={(e) => setFollowType(e.target.value)}>
              {Object.entries(FOLLOW_UP_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input className="min-h-11 rounded-2xl border px-3 sm:col-span-2" value={followNote} onChange={(e) => setFollowNote(e.target.value)} placeholder="הערת מעקב" />
            <PrimaryButton type="submit">קביעת מעקב</PrimaryButton>
            {customer.nextFollowUpAt ? (
              <SecondaryButton
                type="button"
                onClick={async () => {
                  await adminCrmApi.completeFollowUp(id!, followAt ? { at: followAt, note: followNote, type: followType } : {});
                  setBanner(followAt ? "המעקב הושלם ונקבע מעקב הבא" : "המעקב הושלם");
                  load();
                }}
              >
                סיום מעקב
              </SecondaryButton>
            ) : null}
          </form>
          {(tabData?.tasks || []).map((task: any) => (
            <div key={task._id} className="mb-2 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <div>
                <div className="font-black">{task.title}</div>
                <div className="text-xs">{TASK_STATUS_LABELS[task.status]} · {formatIsraelDate(task.dueAt, true)}</div>
              </div>
              {task.status !== "done" ? (
                <SecondaryButton onClick={async () => {
                  await adminCrmApi.updateTask(task._id, { status: "done" });
                  const { data } = await adminCrmApi.customerTasks(id!);
                  setTabData(data);
                }}>הושלם</SecondaryButton>
              ) : null}
            </div>
          ))}
        </CrmCard>
      )}

      {tab === "support" && (
        <div className="space-y-4">
          <CrmCard>
            <h3 className="font-black">פניות ותיעוד תמיכה</h3>
            <p className="mb-3 text-sm font-bold text-slate-500">הערות פנימיות בלבד. לא נחשפות ללקוח.</p>
            {(tabData?.notes || []).filter((n: any) => n.type === "support_summary" || n.pinned).length === 0 ? (
              <p className="text-slate-500">אין תיעוד תמיכה פתוח</p>
            ) : (
              (tabData?.notes || [])
                .filter((n: any) => n.type === "support_summary" || n.pinned)
                .map((n: any) => (
                  <p key={n._id} className="mb-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold">
                    {NOTE_TYPE_LABELS[n.type] || n.type} · {formatIsraelDate(n.createdAt, true)}
                    <br />
                    {n.content}
                  </p>
                ))
            )}
          </CrmCard>
          <CrmCard>
            <h3 className="mb-2 font-black">משימות פתוחות</h3>
            {(tabData?.tasks || []).filter((t: any) => ["open", "in_progress"].includes(t.status)).map((t: any) => (
              <p key={t._id}>{t.title} · {formatIsraelDate(t.dueAt, true)}</p>
            ))}
            {(tabData?.tasks || []).filter((t: any) => ["open", "in_progress"].includes(t.status)).length === 0 ? (
              <p className="text-slate-500">אין משימות פתוחות</p>
            ) : null}
          </CrmCard>
          <SecondaryButton onClick={() => setTab("activity")}>הוספת סיכום תמיכה</SecondaryButton>
        </div>
      )}

      {bookOpen ? (
        <AdminBizuplyBookFlow
          lockedCustomer={{
            id: id!,
            contactName: customer.contactName,
            phone: customer.phone,
            email: customer.email,
            companyName: customer.companyName,
          }}
          services={calendarServices}
          title="+ תיאום חדש"
          onClose={() => setBookOpen(false)}
          onBooked={async () => {
            setBookOpen(false);
            setBanner("התיאום נקבע ושויך ללקוח זה");
            const { data } = await adminCrmApi.customerAppointments(id!);
            setTabData(data);
            setTab("meetings");
          }}
        />
      ) : null}

      {lostOpen ? (
        <AdminModal
          open
          onClose={() => setLostOpen(false)}
          title="סיבת הפסד"
          size="sm"
          footer={
            <PrimaryButton
              compact
              onClick={async () => {
                await adminCrmApi.markLost(id!, { reason: lostReason });
                setLostOpen(false);
                load();
              }}
            >
              שמירה
            </PrimaryButton>
          }
        >
          <select value={lostReason} onChange={(e) => setLostReason(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 px-2 text-sm">
            {Object.entries(LOST_REASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </AdminModal>
      ) : null}

      {deleteOpen ? (
        <AdminModal
          open
          onClose={() => !deleteLoading && setDeleteOpen(false)}
          title="למחוק את הליד לצמיתות?"
          subtitle="הפעולה תמחק את הליד ואת נתוני ה-Admin CRM המשויכים אליו ולא ניתן יהיה לשחזר אותם."
          size="sm"
          footer={
            <div className="flex flex-wrap gap-2">
              <SecondaryButton compact disabled={deleteLoading} onClick={() => setDeleteOpen(false)}>
                ביטול
              </SecondaryButton>
              <DangerButton compact disabled={deleteLoading} onClick={confirmPermanentDelete}>
                {deleteLoading ? "מוחק..." : "מחיקה לצמיתות"}
              </DangerButton>
            </div>
          }
        >
          <p className="text-sm font-bold text-slate-600">
            לאחר המחיקה לא יישלחו הודעות אוטומציה נוספות לליד זה, וקישורי תיאום קיימים יבוטלו.
          </p>
        </AdminModal>
      ) : null}
    </div>
  );
}
