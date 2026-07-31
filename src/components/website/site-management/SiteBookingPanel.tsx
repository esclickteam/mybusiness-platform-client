import React from "react";
import { CalendarDays, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";

import WorkHoursTab from "../../../pages/business/dashboardPages/crmpages/WorkHoursTab";
import { SitePanelCard, SitePanelHero } from "./SitePanelShell";
import { btnSecondary } from "./siteManagementUi";

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
    <div className="space-y-5">
      <SitePanelHero
        icon={CalendarDays}
        accent="#0284C7"
        title="יומן ותורים"
        description="הגדירו שעות פעילות, שירותים ותורים — הלקוחות יוכלו להזמין תור ישירות מהאתר."
        actions={
          <>
            <Link
              to={`${basePath}/crm/appointments`}
              className={btnSecondary + " h-10 text-xs"}
            >
              <CalendarDays size={15} />
              לוח תורים
              <ExternalLink size={13} />
            </Link>
            <Link
              to={`${basePath}/crm/services`}
              className={btnSecondary + " h-10 text-xs"}
            >
              <Users size={15} />
              שירותים
              <ExternalLink size={13} />
            </Link>
          </>
        }
      />

      <SitePanelCard>
        <h3 className="mb-4 text-base font-bold text-slate-900">שעות פעילות</h3>
        <WorkHoursTab variant="settings" />
      </SitePanelCard>

      <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/40 p-4 text-sm leading-relaxed text-slate-600">
        לאחר הגדרת שעות הפעילות והשירותים, הוסיפו בעורך האתר סקשן{" "}
        <strong>יומן פגישות</strong> (
        <Link
          to={`${basePath}/website/sites/${siteId}/edit?addPlugin=booking&addSection=section-booking-showcase-calendar-split`}
          className="font-semibold text-sky-700 hover:underline"
        >
          פתיחה בעורך עם סקשן מוכן
        </Link>
        ). הסקשן מתחבר אוטומטית לתוסף — בלי קישור ידני.
      </div>
    </div>
  );
}
