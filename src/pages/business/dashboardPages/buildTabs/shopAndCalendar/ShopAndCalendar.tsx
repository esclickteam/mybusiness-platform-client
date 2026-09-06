"use client";

import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { CalendarClock, Settings, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useBusinessServices } from "@context/BusinessServicesContext";
import { getTextDirection } from "../../../../../i18n/localeUtils";

type ServiceItem = {
  _id?: string;
  id?: string;
  name?: string;
  price?: number;
  duration?: number;
  [key: string]: unknown;
};

type BusinessDetails = {
  services?: ServiceItem[];
  [key: string]: unknown;
};

type ShopAndCalendarProps = {
  isPreview?: boolean;
  workHours?: Record<string, unknown>;
  setWorkHours?: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  setBusinessDetails?: React.Dispatch<React.SetStateAction<BusinessDetails>>;
};

export default function ShopAndCalendar({
  isPreview = false,
  workHours = {},
  setWorkHours = () => {},
  setBusinessDetails,
}: ShopAndCalendarProps) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const { services } = useBusinessServices();
  const safeServices = Array.isArray(services) ? services : [];

  const { businessId } = useParams<{ businessId: string }>();

  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails((prev) => ({
        ...prev,
        services: safeServices,
      }));
    }
  }, [safeServices, isPreview, setBusinessDetails]);

  if (!businessId) return null;

  if (isPreview) {
    return (
      <div
        dir={pageDir}
        className={[
          "rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur",
          pageDir === "rtl" ? "text-right" : "text-left",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <CalendarClock size={22} />
          </div>

          <div>
            <h3 className="text-lg font-black">{t("leftover.shopCal.title", "Calendar and services")}</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">
              {t(
                "leftover.shopCal.previewHint",
                "Customers will see your availability and book services directly from the public business profile."
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              {t("leftover.shopCal.services", "Services")}
            </p>
            <p className="mt-1 text-2xl font-black">{safeServices.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              {t("leftover.shopCal.hours", "Business hours")}
            </p>
            <p className="mt-1 text-lg font-black">
              {Object.keys(workHours || {}).length > 0
                ? t("leftover.shopCal.active", "Active")
                : t("leftover.shopCal.notSet", "Not set")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={pageDir}
      className={[
        "rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5 shadow-sm",
        pageDir === "rtl" ? "text-right" : "text-left",
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
            <Sparkles size={14} />
            {t("leftover.shopCal.settingsBadge", "Calendar settings")}
          </div>

          <h3 className="mt-4 text-xl font-black tracking-tight text-slate-800">
            {t("leftover.shopCal.manageTitle", "Manage calendar and services")}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {t(
              "leftover.shopCal.manageHint",
              "Update your availability and the services customers can book from the public business profile."
            )}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          <NavLink
            to={`/business/${businessId}/dashboard/crm/work-hours`}
            className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition group-hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100">
              <CalendarClock size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                {t("leftover.shopCal.editHours", "Edit business hours")}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {t("leftover.shopCal.editHoursHint", "Set days and availability")}
              </p>
            </div>
          </NavLink>

          <NavLink
            to={`/business/${businessId}/dashboard/crm/services`}
            className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition group-hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100">
              <Settings size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                {t("leftover.shopCal.editServices", "Edit services")}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {t("leftover.shopCal.editServicesHint", "Manage prices and service duration")}
              </p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}