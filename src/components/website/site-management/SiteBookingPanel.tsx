import React from "react";
import { CalendarDays, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";

import WorkHoursTab from "../../../pages/business/dashboardPages/crmpages/WorkHoursTab";

type SiteBookingPanelProps = {
  businessId: string;
  siteId: string;
};

export default function SiteBookingPanel({
  businessId,
  siteId,
}: SiteBookingPanelProps) {
  const basePath = `/business/${businessId}/dashboard`;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-sky-100 bg-gradient-to-l from-sky-50 via-white to-white p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-600 text-white shadow-lg">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">יומן ותורים</h2>
              <p className="mt-1 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                הגדירו שעות פעילות, שירותים ותורים — הלקוחות יוכלו להזמין תור
                ישירות מהאתר.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`${basePath}/crm/appointments`}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            >
              <CalendarDays size={16} />
              לוח תורים מלא
              <ExternalLink size={14} />
            </Link>
            <Link
              to={`${basePath}/crm/services`}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            >
              <Users size={16} />
              ניהול שירותים
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-4 text-lg font-black text-slate-950">שעות פעילות</h3>
        <WorkHoursTab variant="settings" />
      </div>

      <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 p-5 text-sm font-bold leading-7 text-slate-500">
        לאחר הגדרת שעות הפעילות והשירותים, ודאו שבעורך האתר (
        <Link
          to={`${basePath}/website/sites/${siteId}/edit`}
          className="font-black text-violet-700 hover:underline"
        >
          פתיחה בעורך
        </Link>
        ) קיים בלוק "תורים" או "יומן" — כך הלקוחות יוכלו להזמין תור.
      </div>
    </div>
  );
}
