import React, { useEffect, useMemo } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarClock, Layers3, ListOrdered, Sparkles } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";

type SocialScheduleTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: SocialScheduleTab[] = [
  { path: "compose", labelKey: "socialSchedule.nav.compose", icon: CalendarClock },
  { path: "queue", labelKey: "socialSchedule.nav.queue", icon: ListOrdered },
  { path: "bulk", labelKey: "socialSchedule.nav.bulk", icon: Layers3 },
];

export default function SocialScheduleMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const location = useLocation();
  const navigate = useNavigate();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "compose";
  }, [location.pathname]);

  const isKnownTab = useMemo(
    () => tabs.some((tab) => tab.path === currentTab),
    [currentTab]
  );

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const isRoot = lastPart === "social-schedule";

    if (!isRoot && isKnownTab) return;

    const basePath = isRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/compose`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, navigate]);

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sky-50/80 via-blue-50/50 to-indigo-50/40"
            />
            <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("socialSchedule.shell.badge")}
                </p>
                <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t("socialSchedule.shell.title")}
                </h1>
                <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                  {t("socialSchedule.shell.subtitle")}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-sky-600" />
                <span className="text-xs font-black text-sky-700">
                  {t("socialSchedule.shell.channel")}
                </span>
              </div>
            </div>
          </div>

          <nav
            aria-label={t("socialSchedule.shell.title")}
            className="border-t border-slate-100 px-2 sm:px-3"
          >
            <div
              className={[
                "flex items-stretch gap-0.5 overflow-x-auto",
                "[scrollbar-width:none] [-ms-overflow-style:none]",
                "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent",
              ].join(" ")}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-black transition-colors",
                        "focus:outline-none focus-visible:bg-sky-50",
                        isActive
                          ? "text-sky-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={[
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-sky-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          ].join(" ")}
                        />
                        <span className="whitespace-nowrap">
                          {t(tab.labelKey)}
                        </span>
                        <span
                          className={[
                            "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
                            isActive
                              ? "bg-sky-500 opacity-100"
                              : "opacity-0",
                          ].join(" ")}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </header>

        <main className="w-full min-w-0">
          <Outlet context={{ businessId }} />
        </main>
      </div>
    </section>
  );
}
