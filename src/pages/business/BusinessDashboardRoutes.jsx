import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from "../../utils/lazyWithPreload";

/* Dashboard pages */
const BuildBusinessPage = lazy(() => import("./dashboardPages/build/Build"));

const BusinessMiniSiteClub = lazy(() =>
  import("../BusinessMiniSiteClub")
);

const BusinessMiniSiteBuilder = lazy(() =>
  import("../BusinessMiniSiteBuilder")
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
const CollabChat = lazy(() => import("./dashboardPages/collabtabs/CollabChat"));
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

/* ✅ חדש — Leads page */
const CRMLeadsTab = lazy(() =>
  import("./dashboardPages/crmpages/CRMLeadsTab")
);

const HelpCenter = lazy(() => import("../HelpCenter"));

/* Guide pages */
const BuildBusinessGuidePage = lazy(() => import("../BuildBusinessPage"));
const ChatGuidePage = lazy(() => import("../ChatGuidePage"));
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
import CustomerMessagesFAQ from "../CustomerMessagesFAQ";
import CollaborationsFAQ from "../CollaborationsFAQ";
import CrmFAQ from "../CrmFAQ";
import BizUplyAdvisorFAQ from "../BizUplyAdvisorFAQ";
import SystemSettings from "../SystemSettings";
import TechnicalSupport from "../technicalSupportFAQs";
import TroubleshootingFAQ from "../troubleshootingFAQs";

/* Business profile */
const BusinessProfilePage = lazy(() => import("../BusinessProfilePage"));

function FAQPage({ faqs }) {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>Questions & Answers</h1>

      {faqs.map(({ question, answer }, idx) => (
        <section key={idx} style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#3a0ca3" }}>{question}</h2>
          <div>{answer}</div>
        </section>
      ))}
    </div>
  );
}

const BusinessDashboardRoutes = () => {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!businessId) return;

    queryClient.prefetchQuery({
      queryKey: ["businessProfile", businessId],
      queryFn: () => fetch(`/api/business/${businessId}`).then((res) => res.json()),
    });

    queryClient.prefetchQuery({
      queryKey: ["businessServices", businessId],
      queryFn: () => fetch("/api/business/my/services").then((res) => res.json()),
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
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/profile" element={<BusinessProfilePage />} />

          <Route path="collab" element={<Collab />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<CollabBusinessProfileTab />} />
            <Route path="find-partner" element={<CollabFindPartnerTab />} />
            <Route
              path="messages"
              element={<CollabMessagesTab userBusinessId={user?.businessId} />}
            />
            <Route path="market" element={<CollabMarketTab />} />
          </Route>

          <Route path="edit" element={<BuildBusinessPage />} />
          <Route path="build" element={<BuildBusinessPage />} />

<Route path="site-builder" element={<BusinessMiniSiteBuilder />} />
<Route path="mini-site-club" element={<BusinessMiniSiteClub />} />

          <Route
            path="articles/build-business-page"
            element={<BuildBusinessGuidePage />}
          />
          <Route path="articles/chat-guide" element={<ChatGuidePage />} />
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
          <Route path="faq/customer-messages" element={<CustomerMessagesFAQ />} />
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
          <Route path="business-messages" element={<CollabChat />} />
          <Route path="affiliate" element={<AffiliatePage />} />
          <Route path="billing" element={<BillingPage />} />

          {/* CRM internal pages */}
          <Route path="crm" element={<CRMMain />}>
            <Route index element={<Navigate to="appointments" replace />} />

            {/* ✅ חדש — לחיצה על Leads תפתח את הדף הזה */}
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
          </Route>

          <Route path="help-center" element={<HelpCenter />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BusinessDashboardRoutes;