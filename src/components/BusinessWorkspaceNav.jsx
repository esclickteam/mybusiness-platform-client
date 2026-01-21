import { NavLink, useParams } from "react-router-dom";
import "./BusinessWorkspaceNav.css";

/* =========================
   ICONS (SVG)
========================= */

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </svg>
);

const MessagesIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 5h16v10H7l-3 3V5z" />
  </svg>
);

const CRMIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="6" rx="2" />
    <rect x="4" y="10" width="16" height="6" rx="2" />
    <rect x="4" y="17" width="16" height="4" rx="2" />
  </svg>
);

const CollaborationsIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 21c1.5-4 9.5-4 11 0M11 21c1.5-4 9.5-4 11 0" />
  </svg>
);

const AdvisorIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l2.5 5L20 9l-4 4 .8 5-4.8-2.5L7.2 18 8 13 4 9l5.5-2z" />
  </svg>
);

const EditBusinessIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
  </svg>
);

const PublicProfileIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 14.5-4 16 0" />
  </svg>
);

const BillingIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.3-1.5 1-1.5 1.7" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);

/* =========================
   NAV ITEM
========================= */

function NavItem({ label, to, icon: Icon, badge, exact, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={!!exact}
      onClick={onNavigate}
      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
    >
      <Icon />
      <span>{label}</span>
      {badge > 0 && <span className="badge">{badge}</span>}
    </NavLink>
  );
}

/* =========================
   COMPONENT
========================= */

export default function BusinessWorkspaceNav({
  messagesCount = 0,
  onNavigate,
}) {
  const { businessId } = useParams();

  return (
    <nav className="business-workspace-nav">

      {/* ===== WORK ===== */}
      <div className="nav-section">
        <NavItem
          label="Dashboard"
          to={`/business/${businessId}/dashboard/dashboard`}
          icon={DashboardIcon}
          onNavigate={onNavigate}
        />

        <NavItem
          label="Customer Messages"
          to={`/business/${businessId}/dashboard/messages`}
          icon={MessagesIcon}
          badge={messagesCount}
          onNavigate={onNavigate}
        />

        <NavItem
          label="CRM System"
          to={`/business/${businessId}/dashboard/crm`}
          icon={CRMIcon}
          onNavigate={onNavigate}
        />
      </div>

      {/* ===== GROW ===== */}
      <div className="nav-section">
        <NavItem
          label="Collaborations"
          to={`/business/${businessId}/dashboard/collab`}
          icon={CollaborationsIcon}
          onNavigate={onNavigate}
        />

        <NavItem
          label="BizUply Advisor"
          to={`/business/${businessId}/dashboard/BizUply`}
          icon={AdvisorIcon}
          onNavigate={onNavigate}
        />
      </div>

      {/* ===== MANAGE ===== */}
      <div className="nav-section">
        <NavItem
          label="Edit Business Page"
          to={`/business/${businessId}/dashboard/build`}
          icon={EditBusinessIcon}
          onNavigate={onNavigate}
        />

        <NavItem
          label="View Public Profile"
          to={`/business/${businessId}`}
          icon={PublicProfileIcon}
          exact
          onNavigate={onNavigate}
        />
      </div>

      {/* ===== ACCOUNT ===== */}
      <div className="nav-section nav-section-bottom">
        <NavItem
          label="Billing & Subscription"
          to={`/business/${businessId}/dashboard/billing`}
          icon={BillingIcon}
          onNavigate={onNavigate}
        />

        <NavItem
          label="Help Center"
          to={`/business/${businessId}/dashboard/help-center`}
          icon={HelpIcon}
          onNavigate={onNavigate}
        />
      </div>
    </nav>
  );
}
