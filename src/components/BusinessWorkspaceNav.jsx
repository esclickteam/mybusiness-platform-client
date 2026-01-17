import { NavLink, useParams, useLocation } from "react-router-dom";
import "./BusinessWorkspaceNav.css";

/* =========================
   ICONS
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

/* =========================
   CONFIG
========================= */
export default function BusinessWorkspaceNav({
  messagesCount,
  onNavigate,
}) {
  const { businessId } = useParams();
  const { pathname } = useLocation();

  const items = [
    {
      label: "View Public Profile",
      to: `/business/${businessId}`,
      icon: PublicProfileIcon,
      external: true,
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
  ];

  return (
    <nav className="business-workspace-nav">
      {items.map(({ label, to, icon: Icon, badge, external }) => {
        const isActive = pathname.startsWith(to);

        return external ? (
          <a
            key={label}
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="nav-link"
          >
            <Icon />
            <span>{label}</span>
          </a>
        ) : (
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
