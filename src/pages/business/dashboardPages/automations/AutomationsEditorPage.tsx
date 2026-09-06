import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  getAutomationWorkflow,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import AutomationFlowEditor from "./AutomationFlowEditor";
import { readAutomationErrorMessage } from "./automationUiHelpers";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

export default function AutomationsEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workflowId = "" } = useParams<{ workflowId: string }>();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [workflow, setWorkflow] = useState<AutomationWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId || !workflowId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    void getAutomationWorkflow(businessId, workflowId)
      .then((data) => {
        if (!cancelled) setWorkflow(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setWorkflow(null);
          setError(
            readAutomationErrorMessage(
              err,
              t("automations.editorPage.loadError", "Could not load the automation")
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, workflowId, t]);

  if (!businessId) {
    return (
      <div className="ax-empty">
        {t(
          "automations.editorPage.unidentified",
          "We could not identify the business. Refresh the page."
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ax-empty">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
        {t("automations.editorPage.loading", "Loading automation...")}
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="ax-empty ax-empty--card">
        <strong>
          {t("automations.editorPage.notFound", "Automation not found")}
        </strong>
        <p>
          {error ||
            t(
              "automations.editorPage.notFoundHint",
              "The automation may have been deleted or you do not have permission to view it."
            )}
        </p>
        <Link to=".." className="ax-btn ax-btn--primary">
          {t("automations.editorPage.backToList", "Back to the list")}
        </Link>
      </div>
    );
  }

  return (
    <AutomationFlowEditor
      businessId={businessId}
      workflow={workflow}
      readOnly={readOnly}
      onBack={() => navigate("..")}
      onSaved={(saved) => setWorkflow(saved)}
    />
  );
}
