import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import IntegrationsMain from "../integrations/IntegrationsMain";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

/**
 * Phase 2: Connections tab reuses IntegrationsMain for automation-relevant
 * providers (Gmail / Outlook / Google Calendar). No API/contract changes.
 */
export default function AutomationsConnectionsPage() {
  const { businessId } = useOutletContext<OutletCtx>();
  const returnPath = businessId
    ? `/business/${businessId}/dashboard/automations/connections`
    : "/";
  const whatsappPath = businessId
    ? `/business/${businessId}/dashboard/whatsapp/settings`
    : null;

  return (
    <div className="ax-page">
      <IntegrationsMain
        returnPath={returnPath}
        title="חיבורים"
        description="חיבורי שירותים שמשמשים את האוטומציות — Gmail, Outlook ו-Google Calendar."
        embedded
      />

      {whatsappPath ? (
        <section className="ax-connection-note">
          <div>
            <h2>WhatsApp / Meta</h2>
            <p>
              הגדרות WhatsApp מנוהלות באזור WhatsApp הקיים. לא בוצע מיזוג עם
              האוטומציות הישנות.
            </p>
          </div>
          <Link to={whatsappPath} className="ax-btn ax-btn--secondary">
            מעבר להגדרות WhatsApp
          </Link>
        </section>
      ) : null}
    </div>
  );
}
