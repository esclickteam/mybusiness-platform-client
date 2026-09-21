import { FormEvent, useEffect, useState } from "react";
import AdminHeader from "./AdminsHeader";
import API from "../../api";

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

const TABS = ["Overview", "Requests", "Members", "Posts", "Reports", "Polls", "Hot Seats", "Opportunities", "Spotlight", "Collaborations", "Activity"];

async function get<T>(path: string) {
  const { data } = await API.get<T>(path);
  return data;
}

async function send(path: string, body?: unknown, method: "post" | "delete" = "post") {
  const { data } = await API.request({ url: path, method, data: body });
  return data;
}

export default function AdminClubPage() {
  const [tab, setTab] = useState(TABS[0]);
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
    load().catch(() => setNotice("Could not load Club admin."));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f2fb] text-slate-800" dir="ltr">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Global Business Club</h1>
        <p className="mt-1 text-sm text-slate-500">Membership is separate from a Bizuply subscription. Paid Club plans can be attached later.</p>
        {notice ? <p className="mt-3 text-sm text-emerald-700">{notice}</p> : null}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${tab === item ? "bg-indigo-500 text-white" : "bg-white text-slate-600"}`}>
              {item}
            </button>
          ))}
        </div>
        {tab === "Overview" && stats ? <Overview stats={stats} /> : null}
        {tab === "Requests" ? <Requests rows={requests} onDone={load} setNotice={setNotice} /> : null}
        {tab === "Members" ? <Members rows={members} onDone={load} setNotice={setNotice} /> : null}
        {tab === "Posts" ? <Posts rows={posts} onDone={load} /> : null}
        {tab === "Reports" ? <Reports rows={reports} onDone={load} /> : null}
        {tab === "Polls" ? <PollForm setNotice={setNotice} /> : null}
        {tab === "Hot Seats" ? <UserAction label="Create Hot Seat" path="/club/admin/hot-seats" setNotice={setNotice} /> : null}
        {tab === "Opportunities" ? <OpportunityForm setNotice={setNotice} /> : null}
        {tab === "Spotlight" ? <UserAction label="Feature member" path="/club/admin/members" feature setNotice={setNotice} /> : null}
        {tab === "Collaborations" ? <Collaborations rows={collaborations} onDone={load} /> : null}
        {tab === "Activity" ? <ActivityForm setNotice={setNotice} /> : null}
      </main>
    </div>
  );
}

function Overview({ stats }: { stats: Stats }) {
  const cards = [
    ["Total Club members", stats.totalMembers],
    ["Active members", stats.activeMembers],
    ["Pending applications", stats.pendingApplications],
    ["Countries represented", stats.countriesRepresented],
    ["Posts this month", stats.postsThisMonth],
    ["Comments", stats.comments],
    ["Active collaborations", stats.activeCollaborations],
    ["Opportunities", stats.opportunities],
    ["New connections", stats.newConnections],
  ];
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-4">
        <h2 className="font-bold">Most active members</h2>
        {stats.mostActiveMembers.map((member) => (
          <p key={member.userId} className="mt-2 text-sm">{member.fullName} · {member.businessName} · {member.posts} posts</p>
        ))}
      </div>
    </section>
  );
}

function Requests({ rows, onDone, setNotice }: { rows: any[]; onDone: () => Promise<void>; setNotice: (value: string) => void }) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-slate-500">No pending applications.</p> : null}
      {rows.map((row) => (
        <article key={row._id} className="rounded-2xl bg-white p-4 text-sm">
          <p className="font-bold">{row.fullName} · {row.businessName}</p>
          <p className="text-slate-500">{row.country} · {row.businessCategory} · {row.website}</p>
          <p className="mt-2">{row.shortDescription}</p>
          <p className="mt-1"><span className="font-semibold">Offers: </span>{row.offer}</p>
          <p><span className="font-semibold">Looking for: </span>{row.lookingFor}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="rounded-xl bg-indigo-500 px-3 py-2 font-semibold text-white" onClick={() => send(`/club/admin/requests/${row._id}/approve`).then(() => { setNotice("Membership approved."); return onDone(); })}>Approve membership</button>
            <button type="button" className="rounded-xl border px-3 py-2 font-semibold" onClick={() => send(`/club/admin/requests/${row._id}/reject`).then(() => { setNotice("Request rejected."); return onDone(); })}>Reject membership</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Members({ rows, onDone, setNotice }: { rows: any[]; onDone: () => Promise<void>; setNotice: (value: string) => void }) {
  const groups = ["active", "pending", "suspended", "expired"];
  return (
    <div className="space-y-4">
      {groups.map((status) => (
        <section key={status}>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{status}</h2>
          {rows.filter((row) => row.status === status).map((row) => (
            <div key={row.userId} className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
              <div>
                <p className="font-semibold">{row.profile?.fullName || row.userId}</p>
                <p className="text-slate-500">{row.profile?.businessName} · {row.profile?.country}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["active", "suspended", "expired"].map((next) => (
                  <button key={next} type="button" className="rounded-lg border px-2 py-1 capitalize" onClick={() => send(`/club/admin/members/${row.userId}/status`, { status: next }).then(() => { setNotice(`Membership set to ${next}.`); return onDone(); })}>
                    {next === "active" ? "Activate" : next === "suspended" ? "Suspend" : "Expire"}
                  </button>
                ))}
                <button type="button" className="rounded-lg bg-indigo-500 px-2 py-1 text-white" onClick={() => send(`/club/admin/members/${row.userId}/feature`).then(() => setNotice("Member featured."))}>Feature member</button>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function Posts({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  return (
    <div className="space-y-2">
      {rows.map((post) => (
        <div key={post._id} className="rounded-2xl bg-white p-3 text-sm">
          <p className="font-semibold">{post.postType} · {post.status}</p>
          <p className="mt-1">{post.text}</p>
          {post.status !== "removed" ? <button type="button" className="mt-2 text-rose-600" onClick={() => send(`/club/admin/posts/${post._id}`, undefined, "delete").then(onDone)}>Delete post</button> : null}
        </div>
      ))}
    </div>
  );
}

function Reports({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  return (
    <div className="space-y-2">
      {rows.length === 0 ? <p className="text-sm text-slate-500">No open reports.</p> : null}
      {rows.map((report) => (
        <div key={report._id} className="rounded-2xl bg-white p-3 text-sm">
          <p>{report.reason}</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => send(`/club/admin/reports/${report._id}/resolve`, { action: "dismiss" }).then(onDone)}>Dismiss</button>
            <button type="button" className="text-rose-600" onClick={() => send(`/club/admin/reports/${report._id}/resolve`, { action: "remove" }).then(onDone)}>Remove content</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PollForm({ setNotice }: { setNotice: (value: string) => void }) {
  const [title, setTitle] = useState("What is your biggest business challenge this month?");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("Leads\nPricing\nHiring\nCash flow");
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await send("/club/admin/polls", { title, question, options: options.split("\n") });
    setNotice("Poll published.");
  }
  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3 rounded-2xl bg-white p-4">
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="rounded-xl border px-3 py-2" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" required />
      <textarea className="rounded-xl border px-3 py-2" rows={4} value={options} onChange={(e) => setOptions(e.target.value)} />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">Create poll</button>
    </form>
  );
}

function UserAction({ label, path, feature, setNotice }: { label: string; path: string; feature?: boolean; setNotice: (value: string) => void }) {
  const [userId, setUserId] = useState("");
  return (
    <form className="flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row" onSubmit={(event) => {
      event.preventDefault();
      const url = feature ? `${path}/${userId}/feature` : path;
      void send(url, feature ? undefined : { userId }).then(() => setNotice(`${label} saved.`));
    }}>
      <input className="flex-1 rounded-xl border px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Member user id" required />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">{label}</button>
    </form>
  );
}

function OpportunityForm({ setNotice }: { setNotice: (value: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form className="grid max-w-xl gap-3 rounded-2xl bg-white p-4" onSubmit={(event) => {
      event.preventDefault();
      void send("/club/admin/opportunities", { title, description, opportunityType: "partnership" }).then(() => setNotice("Opportunity created."));
    }}>
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea className="rounded-xl border px-3 py-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">Create opportunity</button>
    </form>
  );
}

function Collaborations({ rows, onDone }: { rows: any[]; onDone: () => Promise<void> }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row._id} className="rounded-2xl bg-white p-3 text-sm">
          <p className="font-semibold">{row.title} · {row.status}</p>
          <p>{row.description}</p>
          {row.status !== "closed" ? <button type="button" className="mt-2 text-rose-600" onClick={() => send(`/club/admin/collaborations/${row._id}/close`).then(onDone)}>Close collaboration</button> : null}
        </div>
      ))}
    </div>
  );
}

function ActivityForm({ setNotice }: { setNotice: (value: string) => void }) {
  const [kind, setKind] = useState("poll");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const kinds = ["poll", "collaboration_day", "feedback_day", "ask", "hot_seat", "spotlight", "market"];
  return (
    <form className="grid max-w-xl gap-3 rounded-2xl bg-white p-4" onSubmit={(event) => {
      event.preventDefault();
      void send("/club/admin/activities", { kind, title, description }).then(() => setNotice("Club activity created."));
    }}>
      <select className="rounded-xl border px-3 py-2" value={kind} onChange={(e) => setKind(e.target.value)}>
        {kinds.map((item) => <option key={item}>{item}</option>)}
      </select>
      <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea className="rounded-xl border px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white" type="submit">Create activity</button>
    </form>
  );
}
