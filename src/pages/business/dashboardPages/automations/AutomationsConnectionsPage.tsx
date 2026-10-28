import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import IntegrationsMain from "../integrations/IntegrationsMain";
import {
  automationBasePath,
  whatsappSettingsPath,
} from "./automationHostPaths";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
  basePath?: string;
};

/**
 * Phase 2: Connections tab reuses IntegrationsMain for automation-relevant
 * providers (Gmail / Outlook / Google Calendar). No API/contract changes.
 */
export default function AutomationsConnectionsPage() {
  const { t } = useTranslation();
  const { businessId, basePath } = useOutletContext<OutletCtx>();
  const returnPath = `${automationBasePath(businessId, basePath)}/connections`;
  const whatsappPath = whatsappSettingsPath(businessId, basePath) || null;

  return (
    <div className="ax-page">
      <IntegrationsMain
        businessId={businessId || undefined}
        returnPath={returnPath}
        title={t("integrations.connectionsTitle")}
        description={t("integrations.connectionsDescription")}
        embedded
      />

      {whatsappPath ? (
        <section className="ax-connection-note">
          <div>
            <h2>{t("integrations.whatsappNoteTitle")}</h2>
            <p>
              {t("integrations.whatsappNoteText")}
            </p>
          </div>
          <Link to={whatsappPath} className="ax-btn ax-btn--secondary">
            {t("integrations.whatsappSettings")}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
