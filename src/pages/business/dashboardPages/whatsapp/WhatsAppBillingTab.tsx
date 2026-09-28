import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import WhatsAppViaMetaCard from "./billing/WhatsAppViaMetaCard";

export default function WhatsAppBillingTab() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { connection, businessId } = useWhatsAppHubContext();

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <WhatsAppViaMetaCard
        connection={connection}
        onConnect={
          businessId
            ? () =>
                navigate(
                  `/business/${businessId}/dashboard/whatsapp/connection`
                )
            : undefined
        }
      />
    </div>
  );
}
