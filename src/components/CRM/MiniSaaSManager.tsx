"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Dumbbell,
  Eye,
  Gem,
  Grid3X3,
  HeartPulse,
  LockKeyhole,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Users,
  Wand2,
} from "lucide-react";

type ModuleStatus = "active" | "draft" | "paused";
type BillingType = "free" | "included" | "subscription";

type MiniSaaSModule = {
  id: string;
  name: string;
  type: string;
  description: string;
  clients: number;
  activeClients: number;
  status: ModuleStatus;
  billingType: BillingType;
  price: number;
  currency: string;
  tabs: string[];
  gradient: string;
};

const templates = [
  {
    id: "fitness",
    title: "מערכת למאמני כושר ותזונה",
    subtitle: "מעקב תזונה, תוכניות אימון, מדידות וצ׳ק־אין שבועי",
    icon: Dumbbell,
    gradient: "from-violet-700 via-fuchsia-600 to-indigo-700",
    tabs: ["מעקב תזונה", "תוכנית אימונים", "מדידות והתקדמות", "צ׳ק־אין שבועי"],
  },
  {
    id: "beauty",
    title: "מערכת לקוסמטיקאיות וטיפולים",
    subtitle: "מעקב טיפולים, המלצות לאחר טיפול, כרטיסייה ותזכורות",
    icon: Gem,
    gradient: "from-pink-600 via-rose-500 to-orange-500",
    tabs: ["היסטוריית טיפולים", "המלצות לאחר טיפול", "כרטיסיית טיפולים", "תזכורות"],
  },
  {
    id: "therapy",
    title: "מערכת למטפלים ויועצים",
    subtitle: "משימות ללקוח, שאלונים, קבצים, מעקב פגישות ותהליך ליווי",
    icon: HeartPulse,
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    tabs: ["משימות", "שאלונים", "סיכומי פגישות", "קבצים אישיים"],
  },
  {
    id: "club",
    title: "מועדון לקוחות ומנויים",
    subtitle: "תוכן נעול, הטבות, קופונים, אזור אישי ומנוי חודשי",
    icon: Star,
    gradient: "from-amber-500 via-orange-500 to-rose-600",
    tabs: ["הטבות", "קופונים", "תוכן למנויים", "תשלומים"],
  },
  {
    id: "custom",
    title: "מערכת חופשית בהתאמה אישית",
    subtitle: "העסק בונה כל מערכת שהוא רוצה לפי התחום שלו",
    icon: Wand2,
    gradient: "from-slate-950 via-slate-800 to-violet-800",
    tabs: ["דשבורד לקוח", "טפסים", "קבצים", "מעקב אישי"],
  },
];

const initialModules: MiniSaaSModule[] = [
  {
    id: "1",
    name: "פורטל לקוחות כושר",
    type: "מאמן כושר ותזונה",
    description: "מעקב תזונה, תוכניות אימון, מדידות וצ׳ק־אין שבועי.",
    clients: 24,
    activeClients: 19,
    status: "active",
    billingType: "subscription",
    price: 30,
    currency: "USD",
    tabs: ["תזונה", "אימונים", "התקדמות", "צ׳ק־אין"],
    gradient: "from-violet-700 via-fuchsia-600 to-indigo-700",
  },
  {
    id: "2",
    name: "מעקב טיפולי עור",
    type: "קוסמטיקה וטיפולים",
    description: "תיעוד טיפולים, המלצות, כרטיסיית טיפולים ותזכורות.",
    clients: 8,
    activeClients: 5,
    status: "draft",
    billingType: "included",
    price: 0,
    currency: "USD",
    tabs: ["טיפולים", "המלצות", "כרטיסייה", "תזכורות"],
    gradient: "from-pink-600 via-rose-500 to-orange-500",
  },
];

function statusLabel(status: ModuleStatus) {
  if (status === "active") return "פעיל";
  if (status === "paused") return "מושהה";
  return "טיוטה";
}

function billingLabel(module: MiniSaaSModule) {
  if (module.billingType === "free") return "חינם";
  if (module.billingType === "included") return "כלול בליווי";
  return `$${module.price}/חודש`;
}

export default function MiniSaaSManager() {
  const [modules, setModules] = useState<MiniSaaSModule[]>(initialModules);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [moduleName, setModuleName] = useState("פורטל לקוחות כושר");
  const [price, setPrice] = useState("30");
  const [billingType, setBillingType] = useState<BillingType>("subscription");

  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return modules;

    return modules.filter((module) => {
      return (
        module.name.toLowerCase().includes(q) ||
        module.type.toLowerCase().includes(q) ||
        module.description.toLowerCase().includes(q)
      );
    });
  }, [modules, search]);

  const totalClients = modules.reduce((sum, item) => sum + item.clients, 0);

  const monthlyRevenue = modules.reduce((sum, item) => {
    if (item.billingType !== "subscription") return sum;
    return sum + item.price * item.activeClients;
  }, 0);

  const createModule = () => {
    const nextModule: MiniSaaSModule = {
      id: crypto.randomUUID(),
      name: moduleName.trim() || selectedTemplate.title,
      type: selectedTemplate.title,
      description: selectedTemplate.subtitle,
      clients: 0,
      activeClients: 0,
      status: "draft",
      billingType,
      price: Number(price || 0),
      currency: "USD",
      tabs: selectedTemplate.tabs,
      gradient: selectedTemplate.gradient,
    };

    setModules((prev) => [nextModule, ...prev]);
    setShowCreate(false);
  };

  return (
    <section dir="rtl" className="min-h-screen bg-[#F6F8FC] p-5 text-slate-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
          <div className="relative p-6 md:p-8">
            <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-0 h-40 w-40 rounded-full bg-fuchsia-200/40 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                  <Sparkles size={15} />
                  מיני SaaS / אזור לקוחות
                </div>

                <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                  תן לעסק לבנות מערכת לקוחות
                  <span className="block bg-gradient-to-l from-violet-700 to-fuchsia-600 bg-clip-text text-transparent">
                    לפי התחום שלו.
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-500 md:text-base">
                  בעל העסק יכול ליצור אזור אישי ללקוחות, מעקבים, תוכניות,
                  טפסים, קבצים, מנויים חודשיים ותוכן נעול — בלי קוד ובלי הגבלה
                  לתחום מסוים.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-[0_20px_50px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <Plus size={18} />
                יצירת מערכת לקוחות
              </button>
            </div>

            <div className="relative mt-8 grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<Grid3X3 size={18} />}
                label="מערכות"
                value={modules.length}
                text="מערכות לקוחות שנוצרו"
              />
              <StatCard
                icon={<Users size={18} />}
                label="לקוחות"
                value={totalClients}
                text="משויכים לאזורי לקוחות"
              />
              <StatCard
                icon={<BadgeDollarSign size={18} />}
                label="הכנסה חודשית פוטנציאלית"
                value={`$${monthlyRevenue}`}
                text="ממנויים פעילים"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש מערכת, תבנית, תחום או פורטל לקוחות..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-12 pl-5 text-sm font-bold text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Settings2 size={17} />
            הגדרות אזור לקוחות
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="min-h-[330px] rounded-[34px] border border-dashed border-violet-300 bg-white/70 p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-50/60 hover:shadow-xl"
          >
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-100 text-violet-700">
              <Plus size={28} />
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-950">
              יצירת מערכת חדשה
            </h3>

            <p className="mt-2 max-w-md text-sm font-bold leading-7 text-slate-500">
              אפשר להתחיל מתבנית מוכנה או ליצור מערכת חופשית: טפסים, מעקבים,
              קבצים, משימות, מנויים, תוכן נעול וכל מה שהעסק צריך.
            </p>
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 md:p-6">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  יצירת מערכת לקוחות
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  בחרי תבנית התחלה, או מערכת חופשית שכל עסק יכול להתאים לעצמו.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="grid max-h-[calc(92vh-92px)] overflow-y-auto lg:grid-cols-[1fr_380px]">
              <div className="p-5 md:p-6">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  בחירת תבנית
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => {
                    const Icon = template.icon;
                    const active = selectedTemplate.id === template.id;

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setModuleName(template.title);
                        }}
                        className={`rounded-[28px] border p-5 text-right transition hover:-translate-y-1 hover:shadow-xl ${
                          active
                            ? "border-violet-300 bg-violet-50 shadow-lg"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div
                          className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${template.gradient} text-white shadow-lg`}
                        >
                          <Icon size={24} />
                        </div>

                        <h3 className="mt-4 text-lg font-black text-slate-950">
                          {template.title}
                        </h3>

                        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                          {template.subtitle}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {template.tabs.slice(0, 3).map((tab) => (
                            <span
                              key={tab}
                              className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500 ring-1 ring-slate-200"
                            >
                              {tab}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="border-t border-slate-100 bg-slate-50 p-5 md:p-6 lg:border-r lg:border-t-0">
                <div
                  className={`rounded-[30px] bg-gradient-to-br ${selectedTemplate.gradient} p-5 text-white shadow-2xl`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                      <LockKeyhole size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                        תצוגה מקדימה ללקוח
                      </p>
                      <p className="text-lg font-black">{selectedTemplate.title}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-2">
                    {selectedTemplate.tabs.map((tab) => (
                      <div
                        key={tab}
                        className="flex items-center justify-between rounded-2xl bg-white/12 px-4 py-3 text-sm font-bold"
                      >
                        {tab}
                        <ChevronLeft size={16} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-black text-slate-600">
                      שם המערכת
                    </label>
                    <input
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black text-slate-600">
                      תמחור
                    </label>

                    <div className="grid gap-2">
                      {[
                        ["free", "חינם ללקוחות"],
                        ["included", "כלול בשירות / בליווי"],
                        ["subscription", "מנוי חודשי"],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-2 rounded-2xl border p-3 text-sm font-black ${
                            billingType === value
                              ? "border-violet-300 bg-violet-50 text-violet-700"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={billingType === value}
                            onChange={() => setBillingType(value as BillingType)}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {billingType === "subscription" && (
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-600">
                        מחיר חודשי
                      </label>

                      <div className="grid grid-cols-[1fr_90px] gap-3">
                        <input
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          type="number"
                          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                        />

                        <div className="grid h-12 place-items-center rounded-2xl bg-white text-sm font-black text-slate-600 ring-1 ring-slate-200">
                          USD
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={createModule}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    <CheckCircle2 size={18} />
                    יצירת מערכת
                  </button>
                </div>
              </aside>
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

function ModuleCard({ module }: { module: MiniSaaSModule }) {
  return (
    <article className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(15,23,42,0.14)]">
      <div className={`bg-gradient-to-br ${module.gradient} p-6 text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-2xl font-black">
            {module.name
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </div>

          <div className="flex gap-2">
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 transition hover:bg-white/25">
              <Eye size={17} />
            </button>
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 transition hover:bg-white/25">
              <Settings2 size={17} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
            <Star size={12} />
            {module.type}
          </div>

          <h3 className="mt-3 text-2xl font-black">{module.name}</h3>

          <p className="mt-2 max-w-xl text-sm font-bold leading-7 text-white/75">
            {module.description}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <MiniMetric label="לקוחות" value={module.clients} />
          <MiniMetric label="פעילים" value={module.activeClients} />
          <MiniMetric label="מחיר" value={billingLabel(module)} />
          <MiniMetric label="סטטוס" value={statusLabel(module.status)} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {module.tabs.map((tab) => (
            <span
              key={tab}
              className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600"
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-black text-white transition hover:bg-violet-700">
            עריכת מערכת
            <ArrowLeft size={16} />
          </button>

          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50">
            <Users size={16} />
            לקוחות
          </button>

          <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50">
            <Activity size={16} />
            פעילות
          </button>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}