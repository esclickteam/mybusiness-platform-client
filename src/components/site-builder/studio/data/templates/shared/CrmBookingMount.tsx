import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

type Props = {
  className?: string;
  minHeight?: number;
  accent?: string;
};

/**
 * Shared CRM booking calendar mount used by template booking sections.
 * PublicVisualSiteRenderer hydrates this via mountBookingWidgets.
 */
export function CrmBookingMount({
  className = "mt-6 w-full",
  minHeight = 420,
  accent,
}: Props) {
  const { i18n } = useTranslation();
  return (
    <div
      className={className}
      dir={getTextDirection(i18n.language)}
      data-bizuply-widget="booking"
      data-bizuply-booking-mount="true"
      data-bizuply-crm-calendar="true"
      data-bizuply-booking-variant="month"
      data-bizuply-booking-chrome="embedded"
      data-bizuply-booking-frame="true"
      {...(accent
        ? { "data-bizuply-booking-accent": accent }
        : {})}
      style={{
        position: "relative",
        minHeight,
        background: "transparent",
        width: "100%",
        maxWidth: 720,
      }}
      title={tx("יומן פגישות מה-CRM")}
      aria-label={tx("יומן פגישות מה-CRM")}
    />
  );
}
