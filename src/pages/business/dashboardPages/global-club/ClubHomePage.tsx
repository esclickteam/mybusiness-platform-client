import { Link } from "react-router-dom";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubProfile, clubGet, clubSend } from "./clubApi";
import { ClubAvatar, ClubCard, PrimaryButton, countryFlag } from "./clubUi";
import { useEffect, useState } from "react";

const BENEFITS = [
  "Global business connections",
  "Collaboration opportunities",
  "Business advice and feedback",
  "Market insights",
  "Weekly business discussions",
  "Business polls",
  "Business Hot Seat",
  "Member directory",
  "Business opportunities",
  "Networking across countries",
  "Digital collaboration",
];

type DashboardData = {
  stats: {
    activeMembers: number;
    countriesRepresented: number;
    openCollaborations: number;
    newOpportunities: number;
    discussionsThisWeek: number;
  };
  spotlight: ClubProfile | null;
  suggestions: ClubProfile[];
  activities: Array<{ _id: string; title: string; kind: string; description?: string; startsAt?: string }>;
};

export default function ClubHomePage() {
  const { me, base, isMember } = useClub();
  if (!me) return null;
  if (!isMember) return <Landing status={me.status} base={base} />;
  return <Dashboard base={base} />;
}

function Landing({ status, base }: { status: string; base: string }) {
  return (
    <div className="space-y-4">
      <ClubCard className="overflow-hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-500">Global Business Club</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Connect. Collaborate. Grow.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          A global community for business owners and entrepreneurs to create international connections,
          exchange ideas, receive feedback, discover opportunities and build digital collaborations.
        </p>
        <div className="mt-5">
          {status === "pending" ? (
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
              <p className="font-semibold">Your request has been received.</p>
              <p>The Bizuply team will review your application.</p>
            </div>
          ) : null}
          {status === "suspended" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Your Club membership is suspended. Contact the Bizuply team if you need this reviewed.
            </p>
          ) : null}
          {status === "expired" ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Your Club membership has expired. You can request to join again.
            </p>
          ) : null}
          {status === "not_member" || status === "expired" ? (
            <Link to={`${base}/join`}>
              <PrimaryButton className="mt-4" data-testid="club-request-join">Request to Join</PrimaryButton>
            </Link>
          ) : null}
        </div>
      </ClubCard>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <ClubCard key={benefit} className="py-4">
            <p className="text-sm font-semibold text-slate-800">{benefit}</p>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ base }: { base: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    clubGet<DashboardData>("/club/dashboard")
      .then(setData)
      .catch(() => setError("The Club dashboard could not be loaded."));
  }, []);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading the Club…</p>;

  const stats = [
    ["Active members", data.stats.activeMembers],
    ["Countries represented", data.stats.countriesRepresented],
    ["Open collaborations", data.stats.openCollaborations],
    ["New opportunities", data.stats.newOpportunities],
    ["Discussions this week", data.stats.discussionsThisWeek],
  ];

  return (
    <div className="space-y-4">
      <ClubCard>
        <h2 className="text-2xl font-bold text-slate-900">Welcome to the Global Business Club</h2>
        <p className="mt-1 text-sm text-slate-500">A private room for owners building across borders.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {stats.map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </ClubCard>

      {data.spotlight ? (
        <ClubCard>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Member Spotlight</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ClubAvatar name={data.spotlight.fullName} photoUrl={data.spotlight.photoUrl} logoUrl={data.spotlight.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold">{data.spotlight.businessName}</h3>
              <p className="text-sm text-slate-600">
                {data.spotlight.fullName} · {countryFlag(data.spotlight.country)} {data.spotlight.country}
              </p>
              <p className="mt-1 text-sm text-slate-500">{data.spotlight.businessCategory}</p>
              <p className="mt-2 text-sm text-slate-700">{data.spotlight.description}</p>
              <p className="mt-1 text-sm text-slate-600">Looking for: {data.spotlight.lookingFor}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`${base}/members/${data.spotlight.userId}`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Profile
              </Link>
              <button
                type="button"
                className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white"
                onClick={() => clubSend("post", "/club/connections", { userId: data.spotlight?.userId })}
              >
                Connect
              </button>
              {data.spotlight.website ? (
                <a href={data.spotlight.website} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                  Website
                </a>
              ) : null}
            </div>
          </div>
        </ClubCard>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <ClubCard>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">People You Should Meet</h3>
            <Link to={`${base}/connections`} className="text-sm font-semibold text-indigo-600">See all</Link>
          </div>
          <div className="space-y-3">
            {data.suggestions.length === 0 ? (
              <p className="text-sm text-slate-500">Suggestions appear as more members complete their profiles.</p>
            ) : null}
            {data.suggestions.map((member) => (
              <div key={member.userId} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{member.fullName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {member.businessName} · {countryFlag(member.country)} {member.country}
                  </p>
                  <p className="truncate text-xs text-indigo-600">{member.matchReasons?.[0]}</p>
                </div>
                <Link to={`${base}/members/${member.userId}`} className="text-sm font-semibold text-indigo-600">View Profile</Link>
              </div>
            ))}
          </div>
        </ClubCard>
        <ClubCard>
          <h3 className="text-lg font-bold">This week in the Club</h3>
          <div className="mt-3 space-y-3">
            {data.activities.length === 0 ? <p className="text-sm text-slate-500">No scheduled Club activity yet.</p> : null}
            {data.activities.map((activity) => (
              <div key={activity._id} className="rounded-xl border border-slate-100 px-3 py-2">
                <p className="text-sm font-semibold">{activity.title}</p>
                <p className="text-xs capitalize text-slate-500">{activity.kind.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
          <Link to={`${base}/feed`} className="mt-4 inline-flex text-sm font-semibold text-indigo-600">Open the Club feed</Link>
        </ClubCard>
      </div>
    </div>
  );
}
