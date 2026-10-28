import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../api";
import AutomationsLayout from "../business/dashboardPages/automations/AutomationsLayout";
import AutomationsHomePage from "../business/dashboardPages/automations/AutomationsHomePage";
import AutomationsTemplatesPage from "../business/dashboardPages/automations/AutomationsTemplatesPage";
import AutomationsRunsPage from "../business/dashboardPages/automations/AutomationsRunsPage";
import AutomationsAiResultsPage from "../business/dashboardPages/automations/AutomationsAiResultsPage";
import AutomationsConnectionsPage from "../business/dashboardPages/automations/AutomationsConnectionsPage";
import AutomationsEditorPage from "../business/dashboardPages/automations/AutomationsEditorPage";
import { ADMIN_AUTOMATIONS_BASE } from "../business/dashboardPages/automations/automationHostPaths";

type PlatformContext = {
  businessId?: string;
  connectionId?: string;
  ready?: boolean;
  displayPhoneMasked?: string;
};

const COPY = {
  he: {
    ready: "מוכן לשליחה",
    notReady: "החיבור אינו מוכן",
    connection: "חיבור אמריקאי",
    simulation:
      "סימולציה מלאה זמינה בעורך ואינה שולחת הודעות. כל שלב מופיע בתוצאת הבדיקה.",
    prepareSend: "הכנת בדיקת שליחה",
    dialogTitle: "בדיקת שליחה אמיתית",
    dialogBody:
      "שליחת WhatsApp אמיתית למספר בדיקה מורשה אינה מתבצעת ממסך זה. לא נשלחה הודעה.",
    close: "סגירה",
    loadError: "טעינת אוטומציות הפלטפורמה נכשלה",
    loading: "טוען את מערכת האוטומציות…",
  },
  en: {
    ready: "Ready to send",
    notReady: "Connection is not ready",
    connection: "US connection",
    simulation:
      "A full simulation is available in the editor and does not send messages. Every step appears in the test result.",
    prepareSend: "Prepare a real send test",
    dialogTitle: "Real send test",
    dialogBody:
      "A real WhatsApp send to an authorized test number is not performed from this screen. No message was sent.",
    close: "Close",
    loadError: "Could not load platform automations",
    loading: "Loading the automation system…",
  },
} as const;

export default function AdminAutomations() {
  const { i18n } = useTranslation();
  const english = String(i18n.resolvedLanguage || i18n.language || "").startsWith(
    "en"
  );
  const copy = english ? COPY.en : COPY.he;
  const [context, setContext] = useState<PlatformContext | null>(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    API.get("/admin/platform-automations/context")
      .then((response: { data?: PlatformContext }) => {
        if (!cancelled) setContext(response.data || null);
      })
      .catch(() => {
        if (!cancelled) setError(copy.loadError);
      });
    return () => {
      cancelled = true;
    };
  }, [copy.loadError]);

  const businessId = String(context?.businessId || "");

  return (
    <div className="admin-platform-automations">
      <div className="ax-page" style={{ paddingBottom: 0 }}>
        <div className="ax-connection-note">
          <div>
            <h2>{copy.connection}</h2>
            <p>
              {context?.ready ? copy.ready : copy.notReady}
              {context?.displayPhoneMasked
                ? ` · ${context.displayPhoneMasked}`
                : ""}
              {context?.connectionId ? ` · ${context.connectionId}` : ""}
            </p>
            <p>{copy.simulation}</p>
          </div>
          <button
            type="button"
            className="ax-btn ax-btn--secondary"
            onClick={() => setConfirmOpen(true)}
          >
            {copy.prepareSend}
          </button>
        </div>
      </div>

      {confirmOpen ? (
        <div className="ax-modal-backdrop" role="presentation">
          <div className="ax-create-modal" role="dialog" aria-modal="true">
            <h2>{copy.dialogTitle}</h2>
            <p>{copy.dialogBody}</p>
            <button
              type="button"
              className="ax-btn ax-btn--primary"
              onClick={() => setConfirmOpen(false)}
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="ax-empty">{error}</p> : null}
      {!error && !businessId ? <p className="ax-empty">{copy.loading}</p> : null}
      {businessId ? (
        <Routes>
          <Route
            element={
              <AutomationsLayout
                hostBusinessId={businessId}
                hostBasePath={ADMIN_AUTOMATIONS_BASE}
              />
            }
          >
            <Route index element={<AutomationsHomePage />} />
            <Route path="templates" element={<AutomationsTemplatesPage />} />
            <Route path="runs" element={<AutomationsRunsPage />} />
            <Route path="ai-results" element={<AutomationsAiResultsPage />} />
            <Route path="connections" element={<AutomationsConnectionsPage />} />
            <Route path=":workflowId" element={<AutomationsEditorPage />} />
          </Route>
        </Routes>
      ) : null}
    </div>
  );
}
