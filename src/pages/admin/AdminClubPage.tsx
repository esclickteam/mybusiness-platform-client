import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminHeader from "./AdminsHeader";
import API from "../../api";
import { useLocaleDir } from "../../hooks/useLocaleDir";
import { ClubMemberText, formatCount } from "../business/dashboardPages/global-club/clubUi";
import { getIntlLocale } from "../../i18n/localeUtils";

type Stats = {
  totalMembers: number;
  activeMembers: number;
  pendingApplications: number;
  countriesRepresented: number;
  postsThisMonth: number;
  comments: number;
  activeCollaborations: number;
  opportunities: number;
  newConnections: number;
  mostActiveMembers: Array<{ userId: string; posts: number; fullName: string; businessName: string }>;
};

const TAB_KEYS = ["overview", "requests", "members", "posts", "reports", "polls", "hotSeats", "opportunities", "spotlight", "collaborations", "activity"] as const;
const ACTIVITY_KINDS = ["poll", "collaboration_day", "feedback_day", "ask", "hot_seat", "spotlight", "market"] as const;

async function get<T>(path: string) {
  const { data } = await API.get<T>(path);
  return data;
}

async function send(path: string, body?: unknown, method: "post" | "delete" = "post") {
  const { data } = await API.request({ url: path, method, data: body });
  return data;
}

export default function AdminClubPage() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = getIntlLocale(i18n.language);
  const [tab, setTab] = useState<(typeof TAB_KEYS)[number]>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [notice, setNotice] = useState("");

  async function load() {
    const [nextStats, nextRequests, nextMembers, nextPosts, nextReports, nextCollabs] = await Promise.all([
      get<Stats>("/club/admin/stats"),
      get<{ requests: any[] }>("/club/admin/requests?status=pending"),
      get<{ members: any[] }>("/club/admin/members"),
      get<{ posts: any[] }>("/club/admin/posts"),
      get<{ reports: any[] }>("/club/admin/reports"),
      get<{ collaborations: any[] }>("/club/admin/collaborations"),
    ]);
    setStats(nextStats);
    setRequests(nextRequests.requests || []);
    setMembers(nextMembers.members || []);
    setPosts(nextPosts.posts || []);
    setReports(nextReports.reports || []);
    setCollaborations(nextCollabs.collaborations || []);
  }

  useEffect(() => {
    load().catch(() => setNotice(t("club.admin.loadError")));
  }, [t]);

  return (
    <div className="min-h-screen bg-[#f6f2fb] text-slate-800" dir={dir}>
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">{t("club.admin.title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("club.admin.subtitle")}</p>
        {notice ? <p className="mt-3 text-sm text-emerald-700">{notice}</p> : null}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TAB_KEYS.map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${tab === item ? "bg-indigo-500 text-white" : "bg-white text-slate-600"}`}>
              {t(`club.admin.tabs.${item}`)}
            </button>
          ))}
        </div>
        {tab === "overview" && stats ? <Overview stats={stats} locale={locale} /> : null}
        {tab === "requests" ? <Requests rows={requests} onDone={load} setNotice={setNotice} /> : null}
        {tab === "members" ? <Members rows={members} onDone={load} setNotice={setNotice} /> : null}
        {tab === "posts" ? <Posts rows={posts} onDone={load} /> : null}
        {tab === "reports" ? <Reports rows={reports} onDone={load} /> : null}
        {tab === "polls" ? <PollForm setNotice={setNotice} /> : null}
        {tab === "hotSeats" ? <UserAction label={t("club.admin.createHotSeat")} path="/club/admin/hot-seats" setNotice={setNotice} /> : null}
        {tab === "opportunities" ? <OpportunityForm setNotice={setNotice} /> : null}
        {tab === "spotlight" ? <UserAction label={t("club.admin.feature")} path="/club/admin/members" feature setNotice={setNotice} /> : null}
        {tab === "collaborations" ? <Collaborations rows={collaborations} onDone={load} /> : null}
        {tab === "activity" ? <ActivityForm setNotice={setNotice} /> : null}
      </main>
    </div>
  );
}

function Overview({ stats, locale }: { stats: Stats; locale: string }) {
  const { t } = useTranslation();
  const cards = [
    ["club.admin.stats.total", stats.totalMembers],
    ["club.admin.stats.active", stats.activeMembers],
    ["club.admin.stats.pending", stats.pendingApplications],
    ["club.admin.stats.countries", stats.countriesRepresented],
    ["club.admin.stats.posts", stats.postsThisMonth],
    ["club.admin.stats.comments", stats.comments],
    ["club.admin.stats.collaborations", stats.activeCollaborations],
    ["club.admin.stats.opportunities", stats.opportunities],
    ["club.admin.stats.connections", stats.newConnections],
  ] as const;
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold">{formatCount(Number(value), locale)}</p>
            <p className="text-sm text-slate-500">{t(label)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-4">
        <h2 className="font-bold">{t("club.admin.mostActive")}</h2>
        {stats.mostActiveMembers.map((member) => (
          <p key={member.userId} className="mt-2 text-sm">{member.fullName} · {member.businessName} · {t("club.admin.postsCount", { count: member.posts })}</p>
        ))}
      </div>
    </section>
  );
}

function Requests({ rows, onDone, setNotice }: { rows: any[]; onDone: () => Promise<void>; setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-slate-500">{t("club.admin.noRequests")}</p> : null}
      {rows.map((row) => (
        <article key={row._id} className="rounded-2xl bg-white p-4 text-sm">
          <p className="font-bold">{row.fullName} · {row.businessName}</p>
          <p className="text-slate-500">
            {t(`club.countries.${row.country}`, { defaultValue: row.country })} · {t(`club.categories.${row.businessCategory}`, { defaultValue: row.businessCategory })} · {row.website}
          </p>
          <ClubMemberText className="mt-2" text={row.shortDescription} />
          <p className="mt-1"><span className="font-semibold">{t("club.admin.offers")}</span>{row.offer}</p>
          <p><span className="font-semibold">{t("club.admin.lookingFor")}</span>{row.lookingFor}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="rounded-xl bg-indigo-500 px-3 py-2 font-semibold text-white" onClick={() => send(`/club/admin/requests/${row._id}/approve`).then(() => { setNotice(t("club.admin.approved")); return onDone(); })}>{t("club.admin.approve")}</button>
            <button type="button" className="rounded-xl border px-3 py-2 font-semibold" onClick={() => send(`/club/admin/requests/${row._id}/reject`).then(() => { setNotice(t("club.admin.rejected")); return onDone(); })}>{t("club.admin.reject")}</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Members({ rows, onDone, setNotice }: { rows: any[]; onDone: () => Promise<void>; setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  const groups = ["active", "pending", "suspended", "expired"] as const;
  return (
    <div className="space-y-4">
      {groups.map((status) => (
        <section key={status}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{t(`club.admin.groups.${status}`)}</h2>
          {rows.filter((row) => row.status === status).map((row) => (
            <div key={row.userId} className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
              <div>
                <p className="font-semibold">{row.profile?.fullName || row.userId}</p>
                <p className="text-slate-500">{row.profile?.businessName} · {t(`club.countries.${row.profile?.country}`, { defaultValue: row.profile?.country })}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["active", "suspended", "expired"] as const).map((next) => (
                  <button key={next} type="button" className="rounded-lg border px-2 py-1" onClick={() => send(`/club/admin/members/${row.userId}/status`, { status: next }).then(() => { setNotice(t("club.admin.statusSet", { status: t(`club.admin.groups.${next}`) })); return onDone(); })}>
                    {next === "active" ? t("club.admin.activate") : next === "suspended" ? t("club.admin.suspend") : t("club.admin.expire")}
                  </button>
                ))}
                <button type="button" className="rounded-lg bg-indigo-500 px-2 py-1 text-white" onClick={() => send(`/club/admin/members/${row.userId}/feature`).then(() => setNotice(t("club.admin.featured")))}>{t("club.admin.feature")}</button>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function Posts({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="text-sm text-slate-500">{t("club.admin.noPosts")}</p> : null}
      {rows.map((post) => (
        <div key={post._id} className="rounded-2xl bg-white p-3 text-sm">
          <p className="font-semibold">{t(`club.postTypes.${post.postType}`, { defaultValue: post.postType })} · {t(`club.admin.contentStatus.${post.status}`, { defaultValue: post.status })}</p>
          <ClubMemberText className="mt-1" text={post.text} />
          {post.status !== "removed" ? <button type="button" className="mt-2 text-rose-600" onClick={() => send(`/club/admin/posts/${post._id}`, undefined, "delete").then(onDone)}>{t("club.admin.deletePost")}</button> : null}
        </div>
      ))}
    </div>
  );
}

function Reports({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="text-sm text-slate-500">{t("club.admin.noReports")}</p> : null}
      {rows.map((report) => (
        <div key={report._id} className="rounded-2xl bg-white p-3 text-sm">
          <ClubMemberText text={report.reason} />
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => send(`/club/admin/reports/${report._id}/resolve`, { action: "dismiss" }).then(onDone)}>{t("club.admin.dismiss")}</button>
            <button type="button" className="text-rose-600" onClick={() => send(`/club/admin/reports/${report._id}/resolve`, { action: "remove" }).then(onDone)}>{t("club.admin.remove")}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PollForm({ setNotice }: { setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await send("/club/admin/polls", { title, question, options: options.split("\n").map((item) => item.trim()).filter(Boolean) });
    setNotice(t("club.admin.pollCreated"));
  }
  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3 rounded-2xl bg-white p-4">
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("club.admin.pollTitle")} />
      <input className="rounded-xl border px-3 py-2" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t("club.admin.question")} required />
      <textarea className="rounded-xl border px-3 py-2" rows={4} value={options} onChange={(e) => setOptions(e.target.value)} placeholder={t("club.admin.pollOptions")} />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">{t("club.admin.createPoll")}</button>
    </form>
  );
}

function UserAction({ label, path, feature, setNotice }: { label: string; path: string; feature?: boolean; setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState("");
  return (
    <form className="flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row" onSubmit={(event) => {
      event.preventDefault();
      const url = feature ? `${path}/${userId}/feature` : path;
      void send(url, feature ? undefined : { userId }).then(() => setNotice(t("club.admin.saved", { label })));
    }}>
      <input className="flex-1 rounded-xl border px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder={t("club.admin.memberUserId")} required />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">{label}</button>
    </form>
  );
}

function OpportunityForm({ setNotice }: { setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form className="grid max-w-xl gap-3 rounded-2xl bg-white p-4" onSubmit={(event) => {
      event.preventDefault();
      void send("/club/admin/opportunities", { title, description, opportunityType: "partnership" }).then(() => setNotice(t("club.admin.opportunityCreated")));
    }}>
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("club.admin.titleField")} required />
      <textarea className="rounded-xl border px-3 py-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("club.admin.descriptionField")} required />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">{t("club.admin.createOpportunity")}</button>
    </form>
  );
}

function Collaborations({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="text-sm text-slate-500">{t("club.admin.noCollaborations")}</p> : null}
      {rows.map((row) => (
        <div key={row._id} className="rounded-2xl bg-white p-3 text-sm">
          <p className="font-semibold">{row.title} · {t(`club.collaborations.status.${row.status}`, { defaultValue: row.status })}</p>
          <ClubMemberText text={row.description} />
          {row.status !== "closed" ? <button type="button" className="mt-2 text-rose-600" onClick={() => send(`/club/admin/collaborations/${row._id}/close`).then(onDone)}>{t("club.admin.closeCollaboration")}</button> : null}
        </div>
      ))}
    </div>
  );
}

function ActivityForm({ setNotice }: { setNotice: (value: string) => void }) {
  const { t } = useTranslation();
  const [kind, setKind] = useState("poll");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form className="grid max-w-xl gap-3 rounded-2xl bg-white p-4" onSubmit={(event) => {
      event.preventDefault();
      void send("/club/admin/activities", { kind, title, description }).then(() => setNotice(t("club.admin.activityCreated")));
    }}>
      <select className="rounded-xl border px-3 py-2" value={kind} onChange={(e) => setKind(e.target.value)}>
        {ACTIVITY_KINDS.map((item) => <option key={item} value={item}>{t(`club.activities.${item}`)}</option>)}
      </select>
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("club.admin.titleField")} required />
      <textarea className="rounded-xl border px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("club.admin.descriptionField")} />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">{t("club.admin.createActivity")}</button>
    </form>
  );
}
