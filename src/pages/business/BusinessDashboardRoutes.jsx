import React, { useEffect, lazy, Suspense, useRef } from "react";
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { getLastDashboardRoute } from "../../utils/dashboardRoutePersistence";
import { normalizeBusinessId } from "../../utils/notificationNavigation";

import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from "../../utils/lazyWithPreload";

/* Dashboard pages */
const BuildBusinessPage = lazy(() => import("./dashboardPages/build/Build"));

/* OLD Website Builder - keep only for compatibility routes */
const BusinessMiniSiteBuilder = lazy(() =>
  import("../BusinessMiniSiteBuilder")
);

/* NEW Website Studio */
const WebsiteStudioPage = lazy(() =>
  import("../../components/site-builder/studio/WebsiteStudioPage")
);
const MySitesPage = lazy(() => import("../MySitesPage"));
const CreateWebsiteMethodPage = lazy(() =>
  import("../CreateWebsiteMethodPage")
);
const AiSiteWizardPage = lazy(() => import("../AiSiteWizardPage"));

/* Website Templates */
const WebsiteTemplatesPage = lazy(() => import("../WebsiteTemplatesPage"));
const WebsiteTemplatePreviewPage = lazy(() =>
  import("../WebsiteTemplatePreviewPage.tsx")
);

const DashboardPage = lazyWithPreload(() =>
  import("./dashboardPages/DashboardPage")
);

/* Collaborations */
const Collab = lazy(() => import("./dashboardPages/Collab"));
const CollabBusinessProfileTab = lazy(() =>
  import("./dashboardPages/collabtabs/CollabBusinessProfileTab")
);
const CollabFindPartnerTab = lazy(() =>
  import("./dashboardPages/collabtabs/CollabFindPartnerTab")
);
const CollabMessagesTab = lazy(() =>
  import("./dashboardPages/collabtabs/CollabMessagesTab")
);
const CollabMarketTab = lazy(() =>
  import("./dashboardPages/collabtabs/CollabMarketTab")
);

const Upgrade = lazy(() => import("./dashboardPages/Upgrade"));
const CartPage = lazy(() =>
  import("./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage")
);
const BusinessChatPage = lazy(() => import("../../components/BusinessChatPage"));
const AffiliatePage = lazy(() => import("./dashboardPages/AffiliatePage"));
const BizUplyAdvisor = lazy(() => import("./dashboardPages/BizUplyAdvisor"));
const GoalsPage = lazy(() => import("./dashboardPages/GoalsPage"));

/* CRM */
const CRMMain = lazy(() => import("./dashboardPages/crmpages/CRMMain"));
const CRMAppointmentsTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMAppointmentsTab")
);
const CRMClientsTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMClientsTab")
);
const CRMServicesTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMServicesTab")
);
const CRMSettingsTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMSettingsTab")
);
const WorkHoursTab = lazy(() =>
  import("./dashboardPages/crmpages/WorkHoursTab")
);

const CRMLeadsTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMLeadsTab")
);

/* Mini SaaS / Client Portal */
const MiniSaaSManager = lazy(() =>
  import("../../components/CRM/MiniSaaSManager")
);

const HelpCenter = lazy(() => import("../HelpCenter"));

/* Guide pages */
const BuildBusinessGuidePage = lazy(() => import("../BuildBusinessPage"));
const WebsiteBuildingGuidePage = lazy(() =>
  import("../WebsiteBuildingGuidePage")
);
const DashboardGuidePage = lazy(() => import("../DashboardGuidePage"));
const AppointmentCRMGuidePage = lazy(() =>
  import("../AppointmentCRMGuidePage")
);
const BusinessCollaborationGuidePage = lazy(() =>
  import("../BusinessCollaborationGuidePage")
);
const AICompanionGuidePage = lazy(() => import("../AICompanionGuidePage"));
const BillingPage = lazy(() => import("../BillingPage"));

/* FAQ pages */
import ProfileFAQ from "../ProfileFAQ";
import DashboardFAQ from "../DashboardFAQ";
import WebsiteBuildingFAQ from "../WebsiteBuildingFAQ";
import CollaborationsFAQ from "../CollaborationsFAQ";
import CrmFAQ from "../CrmFAQ";
import BizUplyAdvisorFAQ from "../BizUplyAdvisorFAQ";
import SystemSettings from "../SystemSettings";
import TechnicalSupport from "../technicalSupportFAQs";
import TroubleshootingFAQ from "../troubleshootingFAQs";

/* Business profile */
const BusinessProfilePage = lazy(() => import("../BusinessProfilePage"));

function WebsiteStudioRoute({ businessId }) {
  const params = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const templateFromParams =
    params.templateId ||
    params.templateKey ||
    params.template ||
    "";

  const templateFromQuery =
    query.get("template") ||
    query.get("templateId") ||
    query.get("templateKey") ||
    "";

  const initialTemplateId = String(templateFromParams || templateFromQuery || "")
    .trim()
    .toLowerCase();

  const siteId = String(params.siteId || query.get("siteId") || "").trim();

  return (
    <WebsiteStudioPage
      businessId={businessId}
      siteId={siteId || undefined}
      initialSlug="your-business"
      initialTemplateId={initialTemplateId}
      forceTemplateLoad={Boolean(initialTemplateId)}
    />
  );
}

/** Restore last in-session dashboard page when landing on bare /dashboard */
function DashboardIndexRedirect({ businessId }) {
  const saved = getLastDashboardRoute(businessId);

  if (saved) {
    const marker = `/business/${businessId}/dashboard/`;
    if (saved.startsWith(marker)) {
      const relative = saved.slice(marker.length);
      // Keep users on deep pages; overview is already the default
      if (relative && relative !== "dashboard" && !relative.startsWith("?")) {
        return <Navigate to={relative} replace />;
      }
    }
  }

  return <Navigate to="dashboard" replace />;
}

const BusinessDashboardRoutes = () => {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const { businessId: urlBusinessId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lastBusinessRedirectRef = useRef("");

  useEffect(() => {
    const currentBusinessId = normalizeBusinessId(businessId);
    const routeBusinessId = normalizeBusinessId(urlBusinessId);

    if (!currentBusinessId || !routeBusinessId) return;

    if (currentBusinessId === routeBusinessId) {
      lastBusinessRedirectRef.current = "";
      return;
    }

    const nextPath = `${location.pathname.replace(
      `/business/${routeBusinessId}`,
      `/business/${currentBusinessId}`
    )}${location.search}`;

    if (lastBusinessRedirectRef.current === nextPath) return;

    lastBusinessRedirectRef.current = nextPath;

    navigate(nextPath, {
      replace: true,
      state: location.state,
    });
  }, [
    businessId,
    urlBusinessId,
    location.pathname,
    location.search,
    navigate,
  ]);

  useEffect(() => {
    if (!businessId) return;

    queryClient.prefetchQuery({
      queryKey: ["businessProfile", businessId],
      queryFn: () =>
        fetch(`/api/business/${businessId}`).then((res) => res.json()),
    });

    queryClient.prefetchQuery({
      queryKey: ["businessServices", businessId],
      queryFn: () =>
        fetch("/api/business/my/services").then((res) => res.json()),
    });

    queryClient.prefetchQuery({
      queryKey: ["businessAppointments", businessId],
      queryFn: () =>
        fetch(`/api/appointments?businessId=${businessId}`).then((res) =>
          res.json()
        ),
    });
  }, [businessId, queryClient]);

  if (!businessId) {
    return <div>Loading business info...</div>;
  }

  return (
    <Suspense fallback={<div>🔄 Loading dashboard...</div>}>
      <Routes>
        <Route path="" element={<BusinessDashboardLayout />}>
          <Route index element={<DashboardIndexRedirect businessId={businessId} />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/profile" element={<BusinessProfilePage />} />

          <Route path="collab" element={<Collab />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<CollabBusinessProfileTab />} />
            <Route path="find-partner" element={<CollabFindPartnerTab />} />

            <Route path="messages" element={<CollabMessagesTab />} />

            <Route path="market" element={<CollabMarketTab />} />
          </Route>

          {/* Business public profile builder */}
          <Route path="edit" element={<BuildBusinessPage />} />
          <Route path="build" element={<BuildBusinessPage />} />

          {/* Website Templates */}
          <Route path="website/templates" element={<WebsiteTemplatesPage />} />

          <Route
            path="website/templates/:templateId/preview"
            element={<WebsiteTemplatePreviewPage />}
          />

          {/* חשוב: עריכה מתבנית ספציפית דרך React renderer */}
          <Route
            path="website/templates/:templateId/edit"
            element={<WebsiteStudioRoute businessId={businessId} />}
          />

          {/* אופציונלי: גם אם בטעות נכנסים ל־builder מתוך preview, עדיין נטען renderer */}
          <Route
            path="website/templates/:templateId/builder"
            element={<WebsiteStudioRoute businessId={businessId} />}
          />

          {/* My Sites hub + create flows */}
          <Route path="website" element={<MySitesPage />} />
          <Route
            path="website/create"
            element={<CreateWebsiteMethodPage />}
          />
          <Route path="website/create/ai" element={<AiSiteWizardPage />} />
          <Route
            path="website/sites/:siteId/edit"
            element={<WebsiteStudioRoute businessId={businessId} />}
          />

          {/* Old route - keep for compatibility only */}
          <Route path="site-builder" element={<BusinessMiniSiteBuilder />} />

          <Route
            path="articles/build-business-page"
            element={<BuildBusinessGuidePage />}
          />

          <Route
            path="articles/website-building-guide"
            element={<WebsiteBuildingGuidePage />}
          />

          <Route
            path="articles/dashboard-guide"
            element={<DashboardGuidePage />}
          />

          <Route
            path="articles/appointment-crm-guide"
            element={<AppointmentCRMGuidePage />}
          />

          <Route
            path="articles/business-collaboration"
            element={<BusinessCollaborationGuidePage />}
          />

          <Route
            path="articles/ai-companion"
            element={<AICompanionGuidePage />}
          />

          <Route path="faq/profile" element={<ProfileFAQ />} />
          <Route path="faq/dashboard" element={<DashboardFAQ />} />
          <Route path="faq/website-building" element={<WebsiteBuildingFAQ />} />
          <Route path="faq/collaborations" element={<CollaborationsFAQ />} />
          <Route path="faq/crm" element={<CrmFAQ />} />
          <Route path="faq/BizUply-advisor" element={<BizUplyAdvisorFAQ />} />
          <Route path="faq/system-settings" element={<SystemSettings />} />
          <Route path="faq/technical-support" element={<TechnicalSupport />} />
          <Route path="faq/troubleshooting" element={<TroubleshootingFAQ />} />

          <Route path="cart" element={<CartPage />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="BizUply" element={<BizUplyAdvisor />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="messages" element={<BusinessChatPage />} />
          <Route
            path="business-messages"
            element={<Navigate to="../collab/messages?tab=chat" replace />}
          />
          <Route path="affiliate" element={<AffiliatePage />} />
          <Route path="billing" element={<BillingPage />} />

          {/* CRM internal pages */}
          <Route path="crm" element={<CRMMain />}>
            <Route index element={<Navigate to="appointments" replace />} />

            <Route
              path="leads"
              element={<CRMLeadsTab businessId={businessId} />}
            />

            <Route
              path="appointments"
              element={<CRMAppointmentsTab businessId={businessId} />}
            />

            <Route
              path="clients"
              element={<CRMClientsTab businessId={businessId} />}
            />

            <Route
              path="services"
              element={<CRMServicesTab businessId={businessId} />}
            />

            <Route
              path="settings"
              element={<CRMSettingsTab businessId={businessId} />}
            />

            <Route
              path="work-hours"
              element={<WorkHoursTab businessId={businessId} />}
            />

            {/* Mini SaaS / Client Portal */}
            <Route path="mini-saas" element={<MiniSaaSManager />} />

            {/* fallback פנימי בתוך CRM */}
            <Route path="*" element={<Navigate to="appointments" replace />} />
          </Route>

          <Route path="help-center" element={<HelpCenter />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BusinessDashboardRoutes;