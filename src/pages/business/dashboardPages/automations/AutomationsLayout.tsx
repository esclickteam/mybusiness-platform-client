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
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  createAutomationWorkflow,
  isAutomationsReadOnly,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
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
    const recipeKey = searchParams.get("recipe");
    if (!businessId || !recipeKey || isEditorRoute) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      const next = new URLSearchParams(searchParams);
      next.delete("recipe");
      setSearchParams(next, { replace: true });
      return;
    }
    if (autoCreateHandled.current === recipeKey) return;
    autoCreateHandled.current = recipeKey;

    void (async () => {
      try {
        const created = await createAutomationWorkflow(businessId, {
          recipe: recipeKey,
        });
        const next = new URLSearchParams(searchParams);
        next.delete("recipe");
        setSearchParams(next, { replace: true });
        navigate(`${basePath}/${created._id}`, { replace: true });
        toast.success("האוטומציה מוכנה לעריכה על הבד");
      } catch (error: unknown) {
        toast.error(readAutomationErrorMessage(error, "שגיאה ביצירת אוטומציה"));
        const next = new URLSearchParams(searchParams);
        next.delete("recipe");
        setSearchParams(next, { replace: true });
      }
    })();
  }, [
    basePath,
    businessId,
    isEditorRoute,
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
