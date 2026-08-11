import React, { useEffect, useMemo, useRef } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import {
  getAutomationBillingUsage,
  hasActiveAutomationPlan,
} from "../../../../api/automationBillingApi";
import {
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  isAutomationsReadOnly,
  publishAutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import {
  LOCAL_SYSTEM_TEMPLATES,
  buildLocalAutomationGraph,
} from "./localTemplateGraphs";
import { WORKING_TEMPLATES } from "./workingTemplates";
import { getAiTemplateByKey } from "./aiAutomationCatalog";
import { useAutomationsRealtime } from "./useAutomationsRealtime";
import "./automationFlow.css";
import "./automationsHome.css";

export default function AutomationsLayout() {
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth() as {
    user?: { businessId?: string | null } | null;
  };
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  useAutomationsRealtime(businessId);

  const basePath = businessId
    ? `/business/${businessId}/dashboard/automations`
    : "/";

  const tabs = [
    { to: basePath, end: true, label: "האוטומציות שלי" },
    { to: `${basePath}/templates`, end: false, label: "תבניות" },
    { to: `${basePath}/runs`, end: false, label: "הרצות" },
    { to: `${basePath}/connections`, end: false, label: "חיבורים" },
  ] as const;

  const readOnly = isAutomationsReadOnly();
  const autoCreateHandled = useRef<string | null>(null);

  const isEditorRoute = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const automationsIdx = parts.lastIndexOf("automations");
    if (automationsIdx < 0) return false;
    const segment = parts[automationsIdx + 1];
    if (!segment) return false;
    return !["templates", "runs", "connections"].includes(segment);
  }, [location.pathname]);

  useEffect(() => {
    const onTemplatesPath = location.pathname.includes("/templates");
    // Discovery/highlight links land on Templates — never auto-create there.
    if (onTemplatesPath) return;

    const requestedTemplate = searchParams.get("template");
    const requestedRecipe = searchParams.get("recipe");
    const aiRequestKey =
      requestedTemplate ||
      (searchParams.get("configureAi") === "1" ? requestedRecipe : "");
    const aiTemplate = aiRequestKey
      ? getAiTemplateByKey(String(aiRequestKey))
      : undefined;
    const recipeKey = requestedRecipe || aiTemplate?.recipeKey;
    if (!businessId || isEditorRoute) return;
    if (
      aiRequestKey &&
      (!aiTemplate || aiTemplate.supported.endToEnd !== true)
    ) {
      toast.error("תבנית AI זו אינה זמינה להפעלה");
      const next = new URLSearchParams(searchParams);
      next.delete("recipe");
      next.delete("template");
      next.delete("configureAi");
      setSearchParams(next, { replace: true });
      navigate(`${basePath}/templates`, { replace: true });
      return;
    }
    if (!recipeKey) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      const next = new URLSearchParams(searchParams);
      next.delete("recipe");
      next.delete("template");
      setSearchParams(next, { replace: true });
      return;
    }
    if (autoCreateHandled.current === recipeKey) return;
    autoCreateHandled.current = recipeKey;

    void (async () => {
      const clearRecipeParam = () => {
        const next = new URLSearchParams(searchParams);
        next.delete("recipe");
        next.delete("template");
        next.delete("configureAi");
        setSearchParams(next, { replace: true });
      };
      try {
        const usage = await getAutomationBillingUsage(businessId).catch(
          () => null
        );
        if (!hasActiveAutomationPlan(usage)) {
          toast.error("כדי להפעיל אוטומציה יש לבחור חבילת פעולות");
          clearRecipeParam();
          const highlight =
            aiTemplate?.templateKey || requestedTemplate || recipeKey;
          const params = new URLSearchParams({
            focus: "ai",
            pickPlan: "1",
          });
          if (highlight) params.set("highlight", String(highlight));
          navigate(`${basePath}/templates?${params.toString()}`, {
            replace: true,
          });
          return;
        }

        const openCreated = async (
          createdId: string,
          successMessage: string
        ) => {
          if (aiTemplate) {
            toast.success("האוטומציה נוצרה — השלימו את הגדרות ה-AI לפני פרסום");
          } else try {
            await publishAutomationWorkflow(businessId, createdId);
            toast.success(successMessage);
          } catch (error: unknown) {
            toast.error(
              readAutomationErrorMessage(
                error,
                "נוצרה אבל לא הופעלה — השלימו הגדרות ופרסמו בבונה"
              )
            );
          }
          clearRecipeParam();
          navigate(`${basePath}/${createdId}${aiTemplate ? "?configureAi=1" : ""}`, { replace: true });
        };

        try {
          const created = await createAutomationWorkflow(businessId, {
            recipe: recipeKey,
          });
          await openCreated(created._id, "האוטומציה נוצרה והופעלה");
          return;
        } catch {
          const working = WORKING_TEMPLATES.find(
            (row) => row.recipeKey === recipeKey
          );
          const local = LOCAL_SYSTEM_TEMPLATES.find(
            (row) => row.recipeKey === recipeKey || row.catalogId === recipeKey
          );
          if (working?.buildGraph && working.requiredTriggerKeys?.[0]) {
            const graph = working.buildGraph({
              triggerKey: working.requiredTriggerKeys[0],
            });
            const created = await createAutomationWorkflow(businessId, {
              useStarter: false,
              name: working.name,
              description: working.description,
              nodes: graph.nodes,
              edges: graph.edges,
            });
            await openCreated(created._id, "האוטומציה נוצרה מהתבנית העובדת");
            return;
          }
          if (!local) throw new Error("no_local_fallback");
          const graph = buildLocalAutomationGraph(local);
          const created = await createAutomationWorkflow(businessId, {
            useStarter: false,
            name: local.name,
            description: local.description,
            nodes: graph.nodes,
            edges: graph.edges,
          });
          await openCreated(
            created._id,
            "האוטומציה נוצרה מהתבנית המערכתית (טריגר ← תוצאה)"
          );
        }
      } catch (error: unknown) {
        toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
        clearRecipeParam();
        autoCreateHandled.current = null;
      }
    })();
  }, [
    basePath,
    businessId,
    isEditorRoute,
    location.pathname,
    navigate,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    if (searchParams.get("tier") !== "ai") return;
    if (location.pathname.includes("/templates")) return;
    navigate(`${basePath}/templates?focus=ai`, { replace: true });
  }, [basePath, location.pathname, navigate, searchParams]);

  return (
    <section
      dir={dir}
      className={`ax-shell ${isEditorRoute ? "ax-shell--editor" : ""}`}
    >
      <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {readOnly ? (
        <div
          className="af-preview-banner"
          role="status"
          data-testid="automations-preview-banner"
        >
          סביבת תצוגה מקדימה — פעולות עריכה והפעלה חסומות
        </div>
      ) : null}

      {!isEditorRoute ? (
        <nav className="ax-tabs" aria-label="ניווט אוטומציות">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `ax-tabs__item${isActive ? " ax-tabs__item--active" : ""}`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <Outlet context={{ businessId, readOnly }} />
    </section>
  );
}
