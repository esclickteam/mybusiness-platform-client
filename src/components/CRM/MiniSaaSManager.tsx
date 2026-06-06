"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Copy,
  Eye,
  FileText,
  Globe2,
  KeyRound,
  Layers3,
  LockKeyhole,
  Mail,
  MonitorSmartphone,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

type PortalStatus = "active" | "draft" | "paused";
type PortalPageType =
  | "client_page"
  | "client_form"
  | "business_to_client"
  | "files"
  | "tracking"
  | "paid_content";

type ClientInviteStatus = "not_sent" | "invited" | "active" | "paused";
type SubscriptionStatus = "free" | "included" | "paid" | "unpaid";

type PortalPage = {
  id: string;
  title: string;
  description: string;
  type: PortalPageType;
  path: string;
  whoUpdates: "client" | "business" | "both";
  dataMode: "per_client" | "shared";
  fields: string[];
  isPaid: boolean;
};

type WebsitePortalSystem = {
  id: string;
  name: string;
  description: string;
  websitePath: string;
  status: PortalStatus;
  monthlyPrice: number;
  currency: string;
  pages: PortalPage[];
};

type ClientPortalAccess = {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  status: ClientInviteStatus;
  subscriptionStatus: SubscriptionStatus;
  assignedPageIds: string[];
  lastActivity: string;
  monthlyPrice: number;
};

const initialSystem: WebsitePortalSystem = {
  id: "portal-main",
  name: "אזור לקוחות אישי",
  description:
    "העמודים נבנים באתר של העסק. כאן ב־CRM מנהלים מי מהלקוחות יכול להיכנס, אילו עמודים פתוחים לו ומה הנתונים האישיים שלו.",
  websitePath: "/client-portal",
  status: "active",
  monthlyPrice: 30,
  currency: "USD",
  pages: [
    {
      id: "nutrition",
      title: "מעקב תזונה",
      description: "עמוד שהלקוח ממלא בעצמו, וכל לקוח רואה רק את הנתונים שלו.",
      type: "client_form",
      path: "/client-portal/nutrition",
      whoUpdates: "client",
      dataMode: "per_client",
      fields: ["ארוחת בוקר", "ארוחת צהריים", "ארוחת ערב", "מים", "תמונה", "הערות"],
      isPaid: true,
    },
    {
      id: "workout-plan",
      title: "תוכנית אימונים",
      description: "עמוד שבעל העסק ממלא לכל לקוח בנפרד.",
      type: "business_to_client",
      path: "/client-portal/workouts",
      whoUpdates: "business",
      dataMode: "per_client",
      fields: ["שם תרגיל", "סטים", "חזרות", "סרטון", "הערת מאמן"],
      isPaid: true,
    },
    {
      id: "files",
      title: "קבצים והמלצות",
      description: "קבצים, המלצות, מסמכים או תוכן אישי לפי לקוח.",
      type: "files",
      path: "/client-portal/files",
      whoUpdates: "business",
      dataMode: "per_client",
      fields: ["קובץ", "כותרת", "הערה", "תאריך"],
      isPaid: false,
    },
    {
      id: "progress",
      title: "מדידות והתקדמות",
      description: "מעקב אישי של מדדים, תמונות, סטטוס והתקדמות.",
      type: "tracking",
      path: "/client-portal/progress",
      whoUpdates: "both",
      dataMode: "per_client",
      fields: ["משקל", "היקפים", "תמונת התקדמות", "סיכום שבועי"],
      isPaid: true,
    },
  ],
};

const initialClients: ClientPortalAccess[] = [
  {
    id: "client-1",
    clientName: "בן אשת",
    email: "ben@example.com",
    phone: "0500000000",
    status: "active",
    subscriptionStatus: "paid",
    assignedPageIds: ["nutrition", "workout-plan", "progress"],
    lastActivity: "היום",
    monthlyPrice: 30,
  },
  {
    id: "client-2",
    clientName: "דנה כהן",
    email: "dana@example.com",
    phone: "0520000000",
    status: "invited",
    subscriptionStatus: "included",
    assignedPageIds: ["files", "progress"],
    lastActivity: "טרם התחברה",
    monthlyPrice: 0,
  },
];

function pageTypeLabel(type: PortalPageType) {
  if (type === "client_form") return "טופס שהלקוח ממלא";
  if (type === "business_to_client") return "נתונים שהעסק ממלא";
  if (type === "files") return "קבצים ותוכן";
  if (type === "tracking") return "מעקב אישי";
  if (type === "paid_content") return "תוכן בתשלום";
  return "עמוד לקוחות";
}

function whoUpdatesLabel(value: PortalPage["whoUpdates"]) {
  if (value === "client") return "הלקוח";
  if (value === "business") return "בעל העסק";
  return "הלקוח והעסק";
}

function statusLabel(status: ClientInviteStatus) {
  if (status === "active") return "פעיל";
  if (status === "invited") return "הוזמן";
  if (status === "paused") return "מושהה";
  return "לא נשלחה הזמנה";
}

function subscriptionLabel(status: SubscriptionStatus) {
  if (status === "paid") return "מנוי בתשלום";
  if (status === "included") return "כלול בשירות";
  if (status === "unpaid") return "ממתין לתשלום";
  return "חינם";
}

function portalStatusLabel(status: PortalStatus) {
  if (status === "active") return "פעיל באתר";
  if (status === "paused") return "מושהה";
  return "טיוטה";
}

export default function MiniSaaSManager() {
  const [portalSystem] = useState<WebsitePortalSystem>(initialSystem);
  const [clients, setClients] = useState<ClientPortalAccess[]>(initialClients);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    initialClients[0]?.id || null
  );
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientMonthlyPrice, setNewClientMonthlyPrice] = useState(
    String(portalSystem.monthlyPrice)
  );
  const [newClientSubscription, setNewClientSubscription] =
    useState<SubscriptionStatus>("paid");
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
    portalSystem.pages.map((page) => page.id)
  );

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return clients;

    return clients.filter((client) => {
      return (
        client.clientName.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        client.phone.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  const selectedClient = useMemo(() => {
    return clients.find((client) => client.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const activeClients = clients.filter((client) => client.status === "active").length;
  const invitedClients = clients.filter((client) => client.status === "invited").length;

  const monthlyRevenue = clients.reduce((sum, client) => {
    if (client.subscriptionStatus !== "paid") return sum;
    return sum + Number(client.monthlyPrice || 0);
  }, 0);

  const selectedClientPages = useMemo(() => {
    if (!selectedClient) return [];

    return portalSystem.pages.filter((page) =>
      selectedClient.assignedPageIds.includes(page.id)
    );
  }, [portalSystem.pages, selectedClient]);

  const toggleNewClientPage = (pageId: string) => {
    setSelectedPageIds((prev) => {
      if (prev.includes(pageId)) {
        return prev.filter((id) => id !== pageId);
      }

      return [...prev, pageId];
    });
  };

  const createClientInvite = () => {
    const cleanName = newClientName.trim();
    const cleanEmail = newClientEmail.trim();

    if (!cleanName || !cleanEmail) return;

    const nextClient: ClientPortalAccess = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      clientName: cleanName,
      email: cleanEmail,
      phone: newClientPhone.trim(),
      status: "invited",
      subscriptionStatus: newClientSubscription,
      assignedPageIds: selectedPageIds,
      lastActivity: "נשלחה הזמנה עכשיו",
      monthlyPrice:
        newClientSubscription === "paid" ? Number(newClientMonthlyPrice || 0) : 0,
    };

    setClients((prev) => [nextClient, ...prev]);
    setSelectedClientId(nextClient.id);
    setShowInviteModal(false);

    setNewClientName("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientMonthlyPrice(String(portalSystem.monthlyPrice));
    setNewClientSubscription("paid");
    setSelectedPageIds(portalSystem.pages.map((page) => page.id));
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[#F6F8FC] p-4 text-slate-950 md:p-7"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
          <div className="relative p-6 md:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-violet-200/50 blur-3xl" />
            <div className="pointer-events-none absolute left-10 top-0 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                  <Sparkles size={15} />
                  מיני SaaS / אזור לקוחות אישי
                </div>

                <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                  המערכת נבנית באתר.
                  <span className="block bg-gradient-to-l from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
                    כאן מנהלים גישה ונתונים לכל לקוח.
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-500 md:text-base">
                  בעל העסק בונה באתר עמודים כמו מעקב תזונה, תוכנית אימונים,
                  קבצים או כל עמוד אחר. ב־CRM הוא מחבר לקוחות, פותח להם גישה
                  לעמודים, שולח מייל להגדרת סיסמה ומנהל את הנתונים האישיים שלהם.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                    <Globe2 size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                      מערכת מהאתר
                    </p>
                    <h2 className="text-lg font-black">{portalSystem.name}</h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 text-sm font-bold text-white/80">
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                    <span>נתיב באתר</span>
                    <span className="ltr text-left">{portalSystem.websitePath}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                    <span>סטטוס</span>
                    <span>{portalStatusLabel(portalSystem.status)}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                    <span>עמודי לקוחות</span>
                    <span>{portalSystem.pages.length}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-violet-50"
                >
                  <MonitorSmartphone size={17} />
                  פתיחה בבונה האתר
                </button>
              </div>
            </div>

            <div className="relative mt-7 grid gap-4 md:grid-cols-4">
              <StatCard
                icon={<Layers3 size={18} />}
                label="עמודים באתר"
                value={portalSystem.pages.length}
                text="עמודי אזור אישי"
              />
              <StatCard
                icon={<Users size={18} />}
                label="לקוחות עם גישה"
                value={clients.length}
                text={`${activeClients} פעילים`}
              />
              <StatCard
                icon={<Mail size={18} />}
                label="הזמנות"
                value={invitedClients}
                text="ממתינים להגדרת סיסמה"
              />
              <StatCard
                icon={<BadgeDollarSign size={18} />}
                label="הכנסה חודשית"
                value={`$${monthlyRevenue}`}
                text="מלקוחות בתשלום"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_430px]">
          <div className="space-y-6">
            <section className="rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] md:p-6">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    עמודים שהוגדרו באתר
                  </h2>
                  <p className="mt-1 text-sm font-bold leading-6 text-slate-500">
                    אלו העמודים שבעל העסק בנה באתר וסימן כאזור אישי ללקוחות.
                    כל לקוח יקבל את אותם עמודים, אבל עם הנתונים האישיים שלו בלבד.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  <Plus size={17} />
                  הוספת עמוד באתר
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {portalSystem.pages.map((page) => (
                  <PortalPageCard key={page.id} page={page} />
                ))}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] md:p-6">
              <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    לקוחות עם גישה למערכת
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    כאן מוסיפים לקוח, מגדירים לאילו עמודים הוא נחשף ושולחים לו
                    מייל להגדרת סיסמה.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-black text-white shadow-[0_18px_50px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-800"
                >
                  <UserPlus size={17} />
                  הוספת לקוח לאזור אישי
                </button>
              </div>

              <div className="relative mb-5">
                <Search
                  size={18}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="חיפוש לפי שם, מייל או טלפון..."
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-12 pl-4 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="grid gap-3">
                {filteredClients.map((client) => {
                  const active = client.id === selectedClientId;

                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => setSelectedClientId(client.id)}
                      className={[
                        "rounded-[24px] border p-4 text-right transition",
                        active
                          ? "border-violet-300 bg-violet-50 shadow-lg"
                          : "border-slate-200 bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "grid h-12 w-12 place-items-center rounded-2xl text-sm font-black",
                              active
                                ? "bg-violet-700 text-white"
                                : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {client.clientName
                              .split(" ")
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="text-base font-black text-slate-950">
                              {client.clientName}
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-500">
                              {client.email} · {client.phone || "אין טלפון"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-4">
                          <ClientMiniMetric
                            label="סטטוס"
                            value={statusLabel(client.status)}
                          />
                          <ClientMiniMetric
                            label="תשלום"
                            value={subscriptionLabel(client.subscriptionStatus)}
                          />
                          <ClientMiniMetric
                            label="עמודים"
                            value={client.assignedPageIds.length}
                          />
                          <ClientMiniMetric
                            label="פעילות"
                            value={client.lastActivity}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] md:p-6 xl:sticky xl:top-6">
              {selectedClient ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                        <ShieldCheck size={14} />
                        {statusLabel(selectedClient.status)}
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-slate-950">
                        {selectedClient.clientName}
                      </h2>

                      <p className="mt-1 text-sm font-bold text-slate-500">
                        {selectedClient.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                    >
                      <Settings2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ActionButton icon={<Send size={16} />}>
                      שליחת מייל להגדרת סיסמה
                    </ActionButton>

                    <ActionButton icon={<KeyRound size={16} />}>
                      איפוס סיסמה ללקוח
                    </ActionButton>

                    <ActionButton icon={<Eye size={16} />}>
                      תצוגה כמו שהלקוח רואה
                    </ActionButton>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      עמודים פתוחים ללקוח
                    </h3>

                    <div className="mt-4 grid gap-3">
                      {selectedClientPages.map((page) => (
                        <div
                          key={page.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-slate-950">
                                {page.title}
                              </p>

                              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                                {pageTypeLabel(page.type)} ·{" "}
                                {whoUpdatesLabel(page.whoUpdates)}
                              </p>
                            </div>

                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-emerald-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[26px] bg-slate-950 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                        <LockKeyhole size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
                          קישור כניסה
                        </p>
                        <p className="text-sm font-black">
                          {portalSystem.websitePath}/login
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-slate-950 transition hover:bg-violet-50"
                    >
                      <Copy size={15} />
                      העתקת קישור
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <Users size={34} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">
                    לא נבחר לקוח
                  </h3>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    בחרי לקוח מהרשימה כדי לנהל את הגישה שלו.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[34px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-6">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  הוספת לקוח לאזור אישי
                </h2>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  הלקוח יקבל מייל להגדרת סיסמה וייכנס לאתר עם הנתונים האישיים
                  שלו בלבד.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-5 md:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <InputBlock
                  label="שם הלקוח"
                  value={newClientName}
                  onChange={setNewClientName}
                  placeholder="לדוגמה: דנה כהן"
                />

                <InputBlock
                  label="מייל להתחברות"
                  value={newClientEmail}
                  onChange={setNewClientEmail}
                  placeholder="client@email.com"
                />

                <InputBlock
                  label="טלפון"
                  value={newClientPhone}
                  onChange={setNewClientPhone}
                  placeholder="0500000000"
                />

                <div>
                  <label className="mb-2 block text-xs font-black text-slate-600">
                    סוג גישה / תשלום
                  </label>

                  <select
                    value={newClientSubscription}
                    onChange={(event) =>
                      setNewClientSubscription(
                        event.target.value as SubscriptionStatus
                      )
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="paid">מנוי בתשלום</option>
                    <option value="included">כלול בשירות / בליווי</option>
                    <option value="free">חינם</option>
                    <option value="unpaid">ממתין לתשלום</option>
                  </select>
                </div>

                {newClientSubscription === "paid" && (
                  <InputBlock
                    label="מחיר חודשי"
                    value={newClientMonthlyPrice}
                    onChange={setNewClientMonthlyPrice}
                    placeholder="30"
                    type="number"
                  />
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-black text-slate-950">
                  אילו עמודים לפתוח ללקוח?
                </h3>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  אפשר לפתוח את כל המערכת או רק חלק מהעמודים.
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {portalSystem.pages.map((page) => {
                    const checked = selectedPageIds.includes(page.id);

                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => toggleNewClientPage(page.id)}
                        className={[
                          "rounded-2xl border p-4 text-right transition",
                          checked
                            ? "border-violet-300 bg-violet-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-950">
                              {page.title}
                            </p>

                            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                              {pageTypeLabel(page.type)}
                            </p>
                          </div>

                          <span
                            className={[
                              "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
                              checked
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-slate-300 bg-white text-transparent",
                            ].join(" ")}
                          >
                            ✓
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <Clock3 size={18} className="mt-0.5 shrink-0 text-amber-700" />
                  <p className="text-xs font-bold leading-6 text-amber-800">
                    בשלב הבא נחבר את זה לשרת: יצירת משתמש לקוח, יצירת inviteToken,
                    שליחת מייל להגדרת סיסמה, ושמירת הרשאות לפי עמודים.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={createClientInvite}
                  disabled={!newClientName.trim() || !newClientEmail.trim()}
                  className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} />
                  שמירה ושליחת הזמנה
                </button>

                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="inline-flex h-13 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          {icon}
        </div>
        <p className="text-3xl font-black text-slate-950">{value}</p>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}

function PortalPageCard({ page }: { page: PortalPage }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-13 w-13 place-items-center rounded-2xl bg-slate-950 text-white">
          <FileText size={20} />
        </div>

        <span
          className={[
            "rounded-full px-3 py-1 text-[11px] font-black",
            page.isPaid
              ? "bg-violet-50 text-violet-700"
              : "bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {page.isPaid ? "בתשלום" : "פתוח"}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-950">{page.title}</h3>

      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
        {page.description}
      </p>

      <div className="mt-4 grid gap-2 text-xs font-bold text-slate-500">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>סוג עמוד</span>
          <span className="font-black text-slate-800">{pageTypeLabel(page.type)}</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>מי מעדכן</span>
          <span className="font-black text-slate-800">
            {whoUpdatesLabel(page.whoUpdates)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span>נתונים</span>
          <span className="font-black text-slate-800">אישיים לפי לקוח</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {page.fields.slice(0, 4).map((field) => (
          <span
            key={field}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600"
          >
            {field}
          </span>
        ))}

        {page.fields.length > 4 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
            +{page.fields.length - 4}
          </span>
        )}
      </div>
    </article>
  );
}

function ClientMiniMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-slate-200">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-black text-slate-950">{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
    >
      {icon}
      {children}
    </button>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}