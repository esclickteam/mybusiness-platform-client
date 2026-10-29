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
};

const COPY = {
  he: {
    loadError: "טעינת אוטומציות הפלטפורמה נכשלה",
    loading: "טוען את מערכת האוטומציות…",
  },
  en: {
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
