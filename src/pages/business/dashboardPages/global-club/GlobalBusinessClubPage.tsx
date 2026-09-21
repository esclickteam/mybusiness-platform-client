import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Globe2 } from "lucide-react";
import { getTextDirection } from "../../../../i18n/localeUtils";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { ClubMe, clubError, clubGet, clubSend } from "./clubApi";
import ClubHomePage from "./ClubHomePage";
import ClubJoinPage from "./ClubJoinPage";
import ClubFeedPage from "./ClubFeedPage";
import ClubDirectoryPage from "./ClubDirectoryPage";
import ClubProfilePage from "./ClubProfilePage";
import ClubCollaborationsPage from "./ClubCollaborationsPage";
import ClubAskPage from "./ClubAskPage";
import ClubPollsPage from "./ClubPollsPage";
import ClubHotSeatPage from "./ClubHotSeatPage";
import ClubOpportunitiesPage from "./ClubOpportunitiesPage";
import ClubConnectionsPage from "./ClubConnectionsPage";
import ClubMessagesPage from "./ClubMessagesPage";

type ClubContextValue = {
  me: ClubMe | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  base: string;
  isMember: boolean;
};

const ClubContext = createContext<ClubContextValue | null>(null);

export function useClub() {
  const value = useContext(ClubContext);
  if (!value) throw new Error("Club context missing");
  return value;
}

const MEMBER_LINKS = [
  ["", "club.nav.dashboard"],
  ["feed", "club.nav.feed"],
  ["directory", "club.nav.directory"],
  ["collaborations", "club.nav.collaborations"],
  ["ask", "club.nav.ask"],
  ["polls", "club.nav.polls"],
  ["hot-seat", "club.nav.hotSeat"],
  ["opportunities", "club.nav.opportunities"],
  ["connections", "club.nav.connections"],
  ["messages", "club.nav.messages"],
];

export default function GlobalBusinessClubPage() {
  const { businessId } = useParams();
  const { t, i18n } = useTranslation();
  const dir = getTextDirection(i18n.language);
  const base = `/business/${businessId}/dashboard/global-club`;
  const [me, setMe] = useState<ClubMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const data = await clubGet<ClubMe>("/club/me");
      setMe(data);
      setError("");
    } catch (err) {
      setError(clubError(err, t));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [i18n.language]);

  const value = useMemo<ClubContextValue>(
    () => ({
      me,
      loading,
      error,
      refresh,
      base,
      isMember: me?.status === "active",
    }),
    [me, loading, error, base]
  );

  return (
    <ClubContext.Provider value={value}>
      <div
        dir={dir}
        className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,#f1e8ff_0,#f8f6ff_32%,#f6f7fb_68%,#ffffff_100%)] text-slate-800"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-5 sm:py-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500 text-white shadow-md shadow-indigo-200">
                <Globe2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500">{t("club.brand")}</p>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{t("club.name")}</h1>
              </div>
            </div>
            {me?.status === "active" ? <ClubNotifications base={base} initialUnread={me.unreadNotifications} /> : null}
          </header>
          <ClubNav base={base} isMember={me?.status === "active"} isAdmin={Boolean(me?.isAdmin)} />
          {loading ? (
            <div className="grid min-h-64 place-items-center">
              <BizuplyLoader />
            </div>
          ) : error ? (
            <p className="rounded-2xl bg-white px-4 py-6 text-sm text-rose-600">{error}</p>
          ) : (
            <Routes>
              <Route index element={<ClubHomePage />} />
              <Route path="join" element={<ClubJoinPage />} />
              <Route path="feed" element={<ClubFeedPage />} />
              <Route path="directory" element={<ClubDirectoryPage />} />
              <Route path="members/:userId" element={<ClubProfilePage />} />
              <Route path="collaborations" element={<ClubCollaborationsPage />} />
              <Route path="ask" element={<ClubAskPage />} />
              <Route path="polls" element={<ClubPollsPage />} />
              <Route path="hot-seat" element={<ClubHotSeatPage />} />
              <Route path="hot-seat/:id" element={<ClubHotSeatPage />} />
              <Route path="opportunities" element={<ClubOpportunitiesPage />} />
              <Route path="connections" element={<ClubConnectionsPage />} />
              <Route path="messages" element={<ClubMessagesPage />} />
              <Route path="messages/:threadId" element={<ClubMessagesPage />} />
            </Routes>
          )}
        </div>
      </div>
    </ClubContext.Provider>
  );
}

function ClubNav({ base, isMember, isAdmin }: { base: string; isMember?: boolean; isAdmin: boolean }) {
  const { t } = useTranslation();
  const links = isMember
    ? MEMBER_LINKS
    : [
        ["", "club.nav.overview"],
        ["join", "club.nav.join"],
      ];
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map(([path, labelKey]) => (
        <NavLink
          key={labelKey}
          to={path ? `${base}/${path}` : base}
          end={path === ""}
          className={({ isActive }) =>
            `shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold ${
              isActive ? "bg-indigo-500 text-white" : "bg-white text-slate-600 ring-1 ring-violet-100"
            }`
          }
        >
          {t(labelKey)}
        </NavLink>
      ))}
      {isAdmin ? (
        <a href="/admin/club" className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 ring-1 ring-violet-100">
          {t("club.nav.admin")}
        </a>
      ) : null}
    </nav>
  );
}

type ClubNotice = {
  _id: string;
  type?: string;
  title: string;
  text: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

function ClubNotifications({ base, initialUnread }: { base: string; initialUnread: number }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialUnread);
  const [items, setItems] = useState<ClubNotice[]>([]);

  async function load() {
    const data = await clubGet<{ notifications: ClubNotice[] }>("/club/notifications");
    setItems(data.notifications || []);
    setUnread((data.notifications || []).filter((item) => !item.read).length);
  }

  function copy(item: ClubNotice) {
    if (!item.type) return { title: item.title, text: item.text };
    const titleKey = `club.notifications.types.${item.type}.title`;
    const textKey = `club.notifications.types.${item.type}.text`;
    const title = t(titleKey);
    const text = t(textKey);
    return {
      title: title === titleKey ? item.title : title,
      text: item.type === "message" ? item.text : text === textKey ? item.text : text,
    };
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("club.notifications.aria")}
        onClick={() => {
          setOpen((value) => !value);
          void load();
        }}
        className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700 ring-1 ring-violet-100"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute end-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-violet-100 bg-white p-2 shadow-xl">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-sm font-semibold">{t("club.notifications.title")}</p>
            <button
              type="button"
              className="text-xs font-semibold text-indigo-600"
              onClick={() => {
                void clubSend("put", "/club/notifications/read-all").then(() => setUnread(0));
              }}
            >
              {t("club.notifications.markAll")}
            </button>
          </div>
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {items.length === 0 ? <p className="px-2 py-4 text-sm text-slate-500">{t("club.notifications.empty")}</p> : null}
            {items.map((item) => {
              const notice = copy(item);
              return (
                <a
                  key={item._id}
                  href={item.link ? `${base.split("/global-club")[0]}/${item.link}` : base}
                  className={`block rounded-xl px-2 py-2 text-start text-sm ${item.read ? "text-slate-500" : "bg-indigo-50/70 text-slate-800"}`}
                  onClick={() => {
                    void clubSend("put", `/club/notifications/${item._id}/read`);
                  }}
                >
                  <span className="block font-semibold">{notice.title}</span>
                  <span className="block text-xs">{notice.text}</span>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
