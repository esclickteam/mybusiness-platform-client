import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { useWhatsAppHubContext } from "../../../dev/useWhatsAppHubContext";
import { useAuth } from "../../../../context/AuthContext";
import { isWhatsAppApiPortalUser } from "../../../../utils/whatsappApiPortal";
import { useWhatsAppApiSubscription } from "../../../../api/whatsappApiPortal";
import WhatsAppViaMetaCard from "./billing/WhatsAppViaMetaCard";
import WhatsAppApiSubscriptionCard from "./portal/WhatsAppApiSubscriptionCard";

export default function WhatsAppBillingTab() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { connection, businessId } = useWhatsAppHubContext();
  const { user } = useAuth();
  const apiPortal = isWhatsAppApiPortalUser(user);
  const { access, loading } = useWhatsAppApiSubscription(businessId, apiPortal);

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      {apiPortal ? (
        <WhatsAppApiSubscriptionCard access={access} loading={loading} businessId={businessId} />
      ) : null}
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
