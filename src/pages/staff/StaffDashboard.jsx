import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  FolderKanban,
  Hourglass,
  PhoneCall,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

function StaffDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "worker") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const stats = [
    {
      label: "זמן עבודה היום",
      value: "04:32",
      icon: Clock3,
      tone: "from-violet-500 to-indigo-500",
    },
    {
      label: "שיחות שבוצעו",
      value: "18",
      icon: PhoneCall,
      tone: "from-teal-500 to-emerald-500",
    },
    {
      label: "שיחות שנסגרו",
      value: "7",
      icon: CheckCircle2,
      tone: "from-sky-500 to-blue-500",
    },
    {
      label: "מעקבים ממתינים",
      value: "3",
      icon: Hourglass,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: "משימות משרד",
      value: "2",
      icon: FolderKanban,
      tone: "from-fuchsia-500 to-pink-500",
    },
  ];

  if (loading) return <BizuplyLoader fullScreen label="טוען דשבורד..." />;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3eeff_0%,_#f7f8fc_42%,_#eefbf7_100%)] text-slate-800"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center sm:text-right">
          <p className="text-sm font-bold text-[#7C4DFF]">מרכז עובדים</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            דשבורד עובד
          </h1>
          <p className="mt-2 text-base font-bold text-slate-500">
            שלום {user?.name || user?.email}
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <span
                  className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.tone} text-white shadow-md`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/staff/create-user"
            className="group flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/30">
              <UserPlus className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-black text-slate-900">
                יצירת בעל עסק
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-500">
                טופס מקצועי עם חבילה, שיוך ותשלום
              </p>
            </div>
          </Link>

          <Link
            to="/staff/tasks"
            className="group flex items-center gap-4 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-md shadow-teal-500/30">
              <ClipboardList className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-black text-slate-900">לוח משימות</p>
              <p className="mt-0.5 text-sm font-bold text-slate-500">
                מעקב אחרי משימות ומעקבים
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;
