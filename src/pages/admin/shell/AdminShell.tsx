import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Building2,
  ChevronDown,
  CreditCard,
  Globe,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  X,
  Zap,
} from "lucide-react";

import logo from "../../../images/logo_final.svg";
import API from "../../../api";
import AdminNotifications from "../../../components/AdminNotifications";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { useAuth } from "../../../context/AuthContext";
import { useLocaleDir } from "../../../hooks/useLocaleDir";
import {
  getAdminSoftphoneState,
  subscribeAdminSoftphone,
  toggleSoftphoneOpen,
} from "../../../utils/adminSoftphoneStore";
import { ensureMicrophoneAccess } from "../../../utils/softphoneMicrophone";
import { NAV_GROUPS, findNavMatch, isNavItemActive, type NavItem } from "./adminNav";
import "./admin-system.css";

const GROUP_ICONS = {
  dashboard: LayoutDashboard,
  platform: Layers,
  businesses: Building2,
  crm: Users,
  whatsapp: MessageSquare,
  campaigns: Megaphone,
  automations: Zap,
  websites: Globe,
  billing: CreditCard,
  partners: HeartHandshake,
  users: Users,
  settings: Settings,
} as const;

const OPEN_GROUPS_KEY = "bizuply-admin-nav-groups";

function readOpenGroups() {
  try {
    const raw = localStorage.getItem(OPEN_GROUPS_KEY);
    if (!raw) return { dashboard: true } as Record<string, boolean>;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { dashboard: true };
  } catch {
    return { dashboard: true };
  }
}

function itemLabel(item: NavItem, t: (key: string, options?: { defaultValue?: string }) => string) {
  if (!item.labelKey) return item.label;
  return t(item.labelKey, { defaultValue: item.label });
}

function openSoftphone() {
  toggleSoftphoneOpen();
  void ensureMicrophoneAccess().catch(() => {});
}

export default function AdminShell() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, socket } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout: (opts?: { callServer?: boolean; redirect?: boolean }) => Promise<void>;
    socket: {
      emit?: (event: string, room?: string) => void;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      off?: (event: string, handler?: (...args: unknown[]) => void) => void;
    } | null;
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(readOpenGroups);
  const [supportBadge, setSupportBadge] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const softphone = useSyncExternalStore(
    subscribeAdminSoftphone,
    getAdminSoftphoneState,
    getAdminSoftphoneState
  );

  const displayName = user?.name || user?.email || "מנהל";
  const initials =
    String(displayName)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "A";

  const match = findNavMatch(location.pathname);
  const liveCall =
    Boolean(softphone.activeCall) &&
    ["connecting", "ringing", "incoming", "in-progress"].includes(
      softphone.activeCall?.status || ""
    );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return NAV_GROUPS.flatMap((group) =>
      group.items
        .filter((item) => {
          const label = itemLabel(item, t).toLowerCase();
          return label.includes(term) || group.label.toLowerCase().includes(term);
        })
        .map((item) => ({ ...item, groupLabel: group.label, labelText: itemLabel(item, t) }))
    ).slice(0, 8);
  }, [query, t]);

  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (!match) return;
    setOpenGroups((current) => ({ ...current, [match.group.id]: true }));
  }, [match?.group.id]);

  useEffect(() => {
    localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(openGroups));
  }, [openGroups]);

  useEffect(() => {
    let cancelled = false;

    async function loadUnread() {
      try {
        const { data } = await API.get("/support-chat/admin/unread-count");
        if (!cancelled) setSupportBadge(Number(data?.unread || 0));
      } catch {
        /* keep the last known badge */
      }
    }

    void loadUnread();
    const interval = window.setInterval(() => {
      void loadUnread();
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!socket?.on || !socket?.off) return undefined;

    const refresh = () => {
      API.get("/support-chat/admin/unread-count")
        .then(({ data }) => setSupportBadge(Number(data?.unread || 0)))
        .catch(() => {});
    };

    socket.emit?.("joinRoom", "admin-support");
    socket.on("support:notify", refresh);
    socket.on("support:waiting", refresh);
    socket.on("support:newMessage", (payload: unknown) => {
      const message = (payload as { message?: { senderType?: string; direction?: string } })?.message;
      if (message?.senderType === "visitor" || message?.direction === "inbound") refresh();
    });
    window.addEventListener("bizuply:adminSupportRead", refresh);

    return () => {
      socket.off?.("support:notify", refresh);
      socket.off?.("support:waiting", refresh);
      socket.off?.("support:newMessage");
      window.removeEventListener("bizuply:adminSupportRead", refresh);
    };
  }, [socket]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!searchRef.current?.contains(target)) setSearchOpen(false);
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function goToResult(index: number) {
    const item = results[index];
    if (!item) return;
    navigate(item.path);
  }

  return (
    <div className="biz-admin" dir={dir}>
      <header className="biz-admin-topbar">
        <button
          type="button"
          className="biz-admin-menu-btn"
          aria-label={sidebarOpen ? "סגירת תפריט" : "פתיחת תפריט"}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <NavLink to="/admin/dashboard" className="biz-admin-logo" aria-label="Bizuply">
          <img src={logo} alt="Bizuply" />
        </NavLink>

        <div className="biz-admin-search" ref={searchRef}>
          <Search className="biz-admin-search-icon" size={15} />
          <input
            type="search"
            value={query}
            placeholder="חיפוש"
            aria-label="חיפוש במסכי הניהול"
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
              setActiveResult(0);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveResult((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveResult((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                goToResult(activeResult);
              }
            }}
          />
          {searchOpen && results.length > 0 ? (
            <div className="biz-admin-search-panel" role="listbox">
              {results.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  className={index === activeResult ? "is-active" : undefined}
                  onMouseEnter={() => setActiveResult(index)}
                  onClick={() => goToResult(index)}
                >
                  <span>{item.labelText}</span>
                  <small>{item.groupLabel}</small>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="biz-admin-tools">
          {liveCall ? (
            <button type="button" className="biz-call-chip" onClick={openSoftphone}>
              {softphone.activeCall?.status === "incoming" ? "שיחה נכנסת" : "שיחה פעילה"}
            </button>
          ) : null}
          <AdminNotifications />
          <LanguageSwitcher />
          <div className="biz-admin-profile" ref={profileRef}>
            <button
              type="button"
              className="biz-admin-profile-btn"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="biz-admin-avatar">{initials}</span>
              <span className="biz-admin-profile-name">{displayName}</span>
            </button>
            {profileOpen ? (
              <div className="biz-admin-profile-menu" role="menu">
                <div className="biz-admin-profile-meta">
                  <strong>{displayName}</strong>
                  <small>מנהל מערכת</small>
                </div>
                <button type="button" onClick={() => navigate("/admin/settings")}>
                  הגדרות
                </button>
                <button type="button" onClick={openSoftphone}>
                  סופטפון
                </button>
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => {
                    void logout({ redirect: true });
                  }}
                >
                  התנתקות
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="biz-admin-body">
        {sidebarOpen ? (
          <button
            type="button"
            className="biz-admin-backdrop"
            aria-label="סגירת תפריט"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <aside className={sidebarOpen ? "biz-admin-sidebar is-open" : "biz-admin-sidebar"}>
          <nav aria-label="ניווט אדמין">
            {NAV_GROUPS.map((group) => {
              const Icon = GROUP_ICONS[group.id as keyof typeof GROUP_ICONS] || LayoutDashboard;
              const open = Boolean(openGroups[group.id]);
              return (
                <div
                  key={group.id}
                  className={open ? "biz-admin-group is-open" : "biz-admin-group"}
                >
                  <button
                    type="button"
                    className="biz-admin-group-btn"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenGroups((current) => ({
                        ...current,
                        [group.id]: !current[group.id],
                      }))
                    }
                  >
                    <Icon size={16} strokeWidth={1.75} />
                    <span>{group.label}</span>
                    <ChevronDown className="biz-admin-chevron" size={14} />
                  </button>
                  {open ? (
                    <div className="biz-admin-sub">
                      {group.items.map((item) => {
                        const active = isNavItemActive(item.path, location.pathname);
                        const showBadge = item.path === "/admin/support-chat" && supportBadge > 0;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={active ? "biz-admin-link is-active" : "biz-admin-link"}
                            aria-current={active ? "page" : undefined}
                          >
                            <span>{itemLabel(item, t)}</span>
                            {showBadge ? (
                              <span className="biz-admin-badge" data-testid="admin-support-unread-badge">
                                {supportBadge > 9 ? "9+" : supportBadge}
                              </span>
                            ) : null}
                          </NavLink>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="biz-admin-maincol">
          <div className="biz-admin-crumb" aria-label="מיקום">
            <NavLink to="/admin/dashboard">אדמין</NavLink>
            {match ? (
              <>
                <span aria-hidden="true">/</span>
                <span>{match.group.label}</span>
                <span aria-hidden="true">/</span>
                <strong>{itemLabel(match.item, t)}</strong>
              </>
            ) : null}
          </div>
          <div className="biz-admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
