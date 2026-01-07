import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from "../../utils/lazyWithPreload";

/* =========================
   Lazy imports
========================= */
const BuildBusinessPage = lazy(() => import("./dashboardPages/build/Build"));
const DashboardPage = lazyWithPreload(() =>
  import("./dashboardPages/DashboardPage")
);

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
const BusinessChatPage = lazy(() =>
  import("../../components/BusinessChatPage")
);
const CollabChat = lazy(() =>
  import("./dashboardPages/collabtabs/CollabChat")
);
const AffiliatePage = lazy(() => import("./dashboardPages/AffiliatePage"));
const BizUplyAdvisor = lazy(() =>
  import("./dashboardPages/BizUplyAdvisor")
);

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
  import("./dashboardPages/crmpages/WorkHoursTab.jsx")
);

const GoalsPage = lazy(() => import("./dashboardPages/GoalsPage"));
const HelpCenter = lazy(() => import("../HelpCenter"));
const BusinessProfilePage = lazy(() =>
  import("../BusinessProfilePage")
);
const BillingPage = lazy(() => import("../BillingPage"));

/* =========================
   Component
========================= */
const BusinessDashboardRoutes = () => {
  const { businessId } = useParams(); // ✅ מקור האמת
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /* =========================
     Prefetch
  ========================= */
  useEffect(() => {
    if (!businessId) return;

    queryClient.prefetchQuery(["businessProfile", businessId], () =>
      fetch(`/api/business/${businessId}`).then((res) => res.json())
    );

    queryClient.prefetchQuery(["businessServices", businessId], () =>
      fetch(`/api/business/my/services`).then((res) => res.json())
    );

    queryClient.prefetchQuery(["businessAppointments", businessId], () =>
      fetch(`/api/appointments?businessId=${businessId}`).then((res) =>
        res.json()
      )
    );
  }, [businessId, queryClient]);

  /* =========================
     Guard
  ========================= */
  if (!businessId) {
    return <div>Loading business info...</div>;
  }

  return (
    <Suspense fallback={<div>🔄 Loading dashboard...</div>}>
      <Routes>
        <Route element={<BusinessDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/profile" element={<BusinessProfilePage />} />

          {/* Collaborations */}
          <Route path="collab" element={<Collab />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<CollabBusinessProfileTab />} />
            <Route path="find-partner" element={<CollabFindPartnerTab />} />
            <Route
              path="messages"
              element={
                <CollabMessagesTab userBusinessId={businessId} />
              }
            />
            <Route path="market" element={<CollabMarketTab />} />
          </Route>

          {/* Build / Edit */}
          <Route path="edit" element={<BuildBusinessPage />} />
          <Route path="build" element={<BuildBusinessPage />} />

          {/* CRM */}
          <Route path="crm" element={<CRMMain />}>
            <Route index element={<Navigate to="appointments" replace />} />
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

          {/* Other */}
          <Route path="messages" element={<BusinessChatPage />} />
          <Route path="business-messages" element={<CollabChat />} />
          <Route path="affiliate" element={<AffiliatePage />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="help-center" element={<HelpCenter />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BusinessDashboardRoutes;
