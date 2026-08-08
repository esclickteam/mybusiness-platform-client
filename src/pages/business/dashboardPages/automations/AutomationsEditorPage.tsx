import React, { useEffect, useState } from "react";
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
            readAutomationErrorMessage(err, "לא ניתן לטעון את האוטומציה")
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, workflowId]);

  if (!businessId) {
    return <div className="ax-empty">חסר מזהה עסק</div>;
  }

  if (loading) {
    return (
      <div className="ax-empty">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
        טוען אוטומציה...
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="ax-empty ax-empty--card">
        <strong>לא נמצאה אוטומציה</strong>
        <p>{error || "ייתכן שהאוטומציה נמחקה או שאין הרשאה לצפייה."}</p>
        <Link to=".." className="ax-btn ax-btn--primary">
          חזרה לרשימה
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
