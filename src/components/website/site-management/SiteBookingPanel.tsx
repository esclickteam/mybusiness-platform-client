import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const basePath = `/business/${businessId}/dashboard`;

  return (
    <div className="space-y-5">
      <SitePanelHero
        icon={CalendarDays}
        accent="#0284C7"
        title={t("leftover.siteBooking.title", "Calendar and appointments")}
        description={t(
          "leftover.siteBooking.description",
          "Set business hours, services, and appointments — customers can book directly from the site."
        )}
        actions={
          <>
            <Link
              to={`${basePath}/crm/appointments`}
              className={btnSecondary + " h-10 text-xs"}
            >
              <CalendarDays size={15} />
              {t("leftover.siteBooking.board", "Appointment board")}
              <ExternalLink size={13} />
            </Link>
            <Link
              to={`${basePath}/crm/services`}
              className={btnSecondary + " h-10 text-xs"}
            >
              <Users size={15} />
              {t("leftover.siteBooking.services", "Services")}
              <ExternalLink size={13} />
            </Link>
          </>
        }
      />

      <SitePanelCard>
        <h3 className="mb-4 text-base font-bold text-slate-900">
          {t("leftover.siteBooking.hours", "Business hours")}
        </h3>
        <WorkHoursTab variant="settings" />
      </SitePanelCard>

      <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 p-4 text-sm leading-relaxed text-slate-600">
        {t("leftover.siteBooking.hintBefore", "Set hours and services here — the")}{" "}
        <strong>
          {t("leftover.siteBooking.calendarSection", "Appointment calendar")}
        </strong>{" "}
        {t("leftover.siteBooking.hintMid", "in the editor (")}
        <Link
          to={`${basePath}/website/sites/${siteId}/edit?addSection=section-booking-showcase-month-centered`}
          className="font-semibold text-teal-700 hover:underline"
        >
          {t("leftover.siteBooking.openMonth", "Open with monthly board")}
        </Link>
        {t(
          "leftover.siteBooking.hintAfter",
          ") connects automatically to the CRM calendar, without a separate plugin."
        )}
      </div>
    </div>
  );
}
