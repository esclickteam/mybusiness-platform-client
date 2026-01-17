import { NavLink, useParams, useLocation } from "react-router-dom";
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

const PublicProfileIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 14.5-4 16 0" />
  </svg>
);

const EditBusinessIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 20l4-1 10-10-3-3L5 16l-1 4z" />
  </svg>
);

const MessagesIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 5h16v10H7l-3 3V5z" />
  </svg>
);

const CollaborationsIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 21c1.5-4 9.5-4 11 0M11 21c1.5-4 9.5-4 11 0" />
  </svg>
);

const CRMIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="6" rx="2" />
    <rect x="4" y="10" width="16" height="6" rx="2" />
    <rect x="4" y="17" width="16" height="4" rx="2" />
  </svg>
);

const BillingIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
  </svg>
);

const AdvisorIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l2.5 5L20 9l-4 4 .8 5-4.8-2.5L7.2 18 8 13 4 9l5.5-2z" />
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
   COMPONENT
========================= */

export default function BusinessWorkspaceNav({
  messagesCount = 0,
  onNavigate,
}) {
  const { businessId } = useParams();
  const { pathname } = useLocation();

  const items = [
    {
      label: "View Public Profile",
      to: `/business/${businessId}`,
      icon: PublicProfileIcon,
    },
    {
      label: "Dashboard",
      to: `/business/${businessId}/dashboard/dashboard`,
      icon: DashboardIcon,
    },
    {
      label: "Edit Business Page",
      to: `/business/${businessId}/dashboard/build`,
      icon: EditBusinessIcon,
    },
    {
      label: "Customer Messages",
      to: `/business/${businessId}/dashboard/messages`,
      icon: MessagesIcon,
      badge: messagesCount,
    },
    {
      label: "Collaborations",
      to: `/business/${businessId}/dashboard/collab`,
      icon: CollaborationsIcon,
    },
    {
      label: "CRM System",
      to: `/business/${businessId}/dashboard/crm`,
      icon: CRMIcon,
    },
    {
      label: "Billing & Subscription",
      to: `/business/${businessId}/dashboard/billing`,
      icon: BillingIcon,
    },
    {
      label: "BizUply Advisor",
      to: `/business/${businessId}/dashboard/BizUply`,
      icon: AdvisorIcon,
    },
    {
      label: "Help Center",
      to: `/business/${businessId}/dashboard/help-center`,
      icon: HelpIcon,
    },
  ];

  return (
    <nav className="business-workspace-nav">
      {items.map(({ label, to, icon: Icon, badge }) => {
        const isActive = pathname.startsWith(to);

        return (
          <NavLink
            key={label}
            to={to}
            onClick={onNavigate}
            className={`nav-link ${isActive ? "active" : ""}`}
          >
            <Icon />
            <span>{label}</span>
            {badge > 0 && <span className="badge">{badge}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}
