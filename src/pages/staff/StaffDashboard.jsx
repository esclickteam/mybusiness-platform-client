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
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../hooks/useLocaleDir";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

function StaffDashboard() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "worker") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const stats = [
    {
      label: t("staff.workTimeToday"),
      value: "04:32",
      icon: Clock3,
      tone: "from-violet-500 to-indigo-500",
    },
    {
      label: t("staff.callsMade"),
      value: "18",
      icon: PhoneCall,
      tone: "from-teal-500 to-emerald-500",
    },
    {
      label: t("staff.callsClosed"),
      value: "7",
      icon: CheckCircle2,
      tone: "from-sky-500 to-blue-500",
    },
    {
      label: t("staff.pendingFollowups"),
      value: "3",
      icon: Hourglass,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: t("staff.officeTasks"),
      value: "2",
      icon: FolderKanban,
      tone: "from-fuchsia-500 to-pink-500",
    },
  ];

  if (loading) return <BizuplyLoader fullScreen label={t("staff.loading")} />;

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3eeff_0%,_#f7f8fc_42%,_#eefbf7_100%)] text-slate-800"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center sm:text-start">
          <p className="text-sm font-bold text-[#7C4DFF]">{t("staff.center")}</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            {t("staff.dashboard")}
          </h1>
          <p className="mt-2 text-base font-bold text-slate-500">
            {t("staff.hello", { name: user?.name || user?.email })}
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
                {t("staff.createBusiness")}
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-500">
                {t("staff.createBusinessHint")}
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
              <p className="text-base font-black text-slate-900">
                {t("staff.taskBoard")}
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-500">
                {t("staff.taskBoardHint")}
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;
