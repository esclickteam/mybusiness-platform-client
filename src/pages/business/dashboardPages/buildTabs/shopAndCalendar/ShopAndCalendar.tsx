"use client";

import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { CalendarClock, Settings, Sparkles } from "lucide-react";

import { useBusinessServices } from "@context/BusinessServicesContext";

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
        dir="rtl"
        className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-right text-white shadow-2xl backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <CalendarClock size={22} />
          </div>

          <div>
            <h3 className="text-lg font-black">יומן ושירותים</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">
              לקוחות יוכלו לראות את הזמינות שלך ולקבוע שירותים ישירות
              מהפרופיל הציבורי של העסק.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              שירותים
            </p>
            <p className="mt-1 text-2xl font-black">{safeServices.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              שעות פעילות
            </p>
            <p className="mt-1 text-lg font-black">
              {Object.keys(workHours || {}).length > 0 ? "פעיל" : "לא הוגדר"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5 text-right shadow-sm"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
            <Sparkles size={14} />
            הגדרות יומן
          </div>

          <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
            ניהול יומן ושירותים
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            עדכן את הזמינות שלך ואת השירותים שהלקוחות יכולים להזמין דרך
            הפרופיל הציבורי של העסק.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
          <NavLink
            to={`/business/${businessId}/dashboard/crm/work-hours`}
            className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-violet-700">
              <CalendarClock size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                עריכת שעות פעילות
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                הגדרת ימים וזמינות
              </p>
            </div>
          </NavLink>

          <NavLink
            to={`/business/${businessId}/dashboard/crm/services`}
            className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-violet-700">
              <Settings size={21} />
            </div>

            <div>
              <p className="text-sm font-black text-slate-950">
                עריכת שירותים
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                ניהול מחירים וזמני שירות
              </p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}