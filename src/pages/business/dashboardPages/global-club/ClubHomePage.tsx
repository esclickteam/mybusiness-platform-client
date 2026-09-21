import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubPost, ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { ClubAvatar, ClubCard, ClubMemberText, ClubSectionTitle, EmptyState, PrimaryButton, countryFlag, formatCount } from "./clubUi";
import { ClubOpportunityCard, ClubPersonCard, ClubPostCard } from "./clubCards";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Globe2, Sparkles } from "lucide-react";

const BENEFIT_KEYS = [
  "connections",
  "collaborations",
  "advice",
  "insights",
  "discussions",
  "polls",
  "hotSeat",
  "directory",
  "opportunities",
  "networking",
  "digital",
] as const;

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

type Poll = {
  _id: string;
  title: string;
  question: string;
  status: string;
  voted: boolean;
  myOptionId: string | null;
  options: Array<{ _id: string; label: string; votes: number | null }>;
};

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  country?: string;
  industry?: string;
  opportunityType: string;
  createdAt: string;
  author: ClubProfile;
};

export default function ClubHomePage() {
  const { me, base, isMember } = useClub();
  if (!me) return null;
  if (!isMember) return <Landing status={me.status} base={base} />;
  return <Dashboard base={base} />;
}

function Landing({ status, base }: { status: string; base: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1e1b4b_0%,#4c1d95_48%,#7C4DFF_100%)] px-6 py-10 text-white sm:px-10 sm:py-14">
        <Globe2 className="pointer-events-none absolute -end-8 -top-8 h-56 w-56 text-white/10" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-100">{t("club.landing.kicker")}</p>
        <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">{t("club.landing.title")}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-100 sm:text-base">{t("club.landing.description")}</p>
        <div className="mt-6">
          {status === "pending" ? (
            <div className="max-w-xl rounded-2xl bg-white/10 px-4 py-3 text-sm">
              <p className="font-semibold">{t("club.landing.pendingTitle")}</p>
              <p>{t("club.landing.pendingBody")}</p>
            </div>
          ) : null}
          {status === "suspended" ? <p className="max-w-xl rounded-2xl bg-amber-400/20 px-4 py-3 text-sm">{t("club.landing.suspended")}</p> : null}
          {status === "expired" ? <p className="max-w-xl rounded-2xl bg-white/10 px-4 py-3 text-sm">{t("club.landing.expired")}</p> : null}
          {status === "not_member" || status === "expired" ? (
            <Link to={`${base}/join`}>
              <PrimaryButton className="mt-2 bg-white text-[#4c1d95] shadow-none hover:bg-violet-50" data-testid="club-request-join">
                {t("club.landing.cta")}
              </PrimaryButton>
            </Link>
          ) : null}
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFIT_KEYS.map((benefit) => (
          <ClubCard key={benefit} className="py-5">
            <p className="text-sm font-bold text-slate-800">{t(`club.landing.benefits.${benefit}`)}</p>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ base }: { base: string }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { me } = useClub();
  const [data, setData] = useState<DashboardData | null>(null);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState("");

  function load() {
    Promise.all([
      clubGet<DashboardData>("/club/dashboard"),
      clubGet<{ posts: ClubPost[] }>("/club/feed"),
      clubGet<{ polls: Poll[] }>("/club/polls").catch(() => ({ polls: [] })),
      clubGet<{ opportunities: Opportunity[] }>("/club/opportunities").catch(() => ({ opportunities: [] })),
    ])
      .then(([dashboard, feed, pollData, opportunityData]) => {
        setData(dashboard);
        setPosts(feed.posts || []);
        setPolls(pollData.polls || []);
        setOpportunities(opportunityData.opportunities || []);
      })
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    load();
  }, [t]);

  const today = useMemo(() => {
    const openPoll = polls.find((poll) => poll.status === "open");
    if (openPoll) return { kind: "poll" as const, poll: openPoll };
    const question = posts.find((post) => post.postType === "question" || post.postType === "advice" || post.postType === "market");
    if (question) return { kind: "question" as const, post: question };
    const activity = data?.activities?.[0];
    if (activity) return { kind: "activity" as const, activity };
    const collaboration = posts.find((post) => post.postType === "collaboration");
    if (collaboration) return { kind: "question" as const, post: collaboration };
    return null;
  }, [polls, posts, data]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">{t("club.dashboard.loading")}</p>;

  const profile = me?.profile;
  const stats = [
    ["club.dashboard.stats.activeMembers", data.stats.activeMembers],
    ["club.dashboard.stats.countries", data.stats.countriesRepresented],
    ["club.dashboard.stats.collaborations", data.stats.openCollaborations],
    ["club.dashboard.stats.opportunities", data.stats.newOpportunities],
    ["club.dashboard.stats.discussions", data.stats.discussionsThisWeek],
  ] as const;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#7C4DFF_100%)] p-6 text-white shadow-[0_30px_80px_rgba(76,29,149,0.28)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35), transparent 32%), radial-gradient(circle at 10% 90%, rgba(20,184,166,0.35), transparent 28%)" }} />
        <Globe2 className="pointer-events-none absolute -end-10 bottom-0 h-48 w-48 text-white/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
          <ClubAvatar name={profile?.fullName} photoUrl={profile?.photoUrl} logoUrl={profile?.logoUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">{t("club.name")}</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{t("club.dashboard.heroWelcome", { name: profile?.fullName || t("club.common.memberFallback") })}</h2>
            <p className="mt-2 text-sm text-violet-100">{t("club.dashboard.subtitle")}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-violet-50">
              {profile?.businessName ? <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">{profile.businessName}</span> : null}
              {profile?.country ? <span className="rounded-full bg-white/10 px-3 py-1">{countryFlag(profile.country)} {t(`club.countries.${profile.country}`, { defaultValue: profile.country })}</span> : null}
              {profile?.businessCategory ? <span className="rounded-full bg-white/10 px-3 py-1">{t(`club.categories.${profile.businessCategory}`, { defaultValue: profile.businessCategory })}</span> : null}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 font-bold text-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                {t(me?.membership?.billingStatus === "active" ? "club.dashboard.paidMember" : "club.dashboard.activeMember")}
              </span>
            </div>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
              <p className="text-2xl font-black">{formatCount(Number(value), locale)}</p>
              <p className="text-[11px] font-medium text-violet-100">{t(label)}</p>
            </div>
          ))}
        </div>
      </section>

      <ClubCard className="border-[#7C4DFF]/20 bg-[linear-gradient(180deg,#ffffff_0%,#F8F5FF_100%)]">
        <ClubSectionTitle kicker={t("club.dashboard.todayKicker")} title={t("club.dashboard.todayTitle")} />
        {!today ? <EmptyState title={t("club.dashboard.todayEmptyTitle")} text={t("club.dashboard.todayEmptyText")} /> : null}
        {today?.kind === "poll" ? <TodayPoll poll={today.poll} onVoted={load} /> : null}
        {today?.kind === "question" ? (
          <div>
            <ClubPostCard post={today.post} base={base} compact onChange={load} />
            <Link to={`${base}/ask`} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#5B2CFF]">
              {t("club.dashboard.participate")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
        {today?.kind === "activity" ? (
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#7C4DFF]">{t(`club.activities.${today.activity.kind}`, { defaultValue: today.activity.kind })}</p>
            <ClubMemberText className="mt-1 text-xl font-black" text={today.activity.title} />
            <ClubMemberText className="mt-2 text-sm text-slate-600" text={today.activity.description} />
            <Link to={`${base}/feed`} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#5B2CFF]">
              {t("club.dashboard.participate")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </ClubCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)]">
        <div>
          <ClubSectionTitle
            kicker={t("club.dashboard.feedKicker")}
            title={t("club.dashboard.activityFeed")}
            action={<Link to={`${base}/feed`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>}
          />
          <div className="space-y-4">
            {posts.length === 0 ? <EmptyState title={t("club.feed.emptyTitle")} text={t("club.feed.emptyText")} /> : null}
            {posts.slice(0, 5).map((post) => (
              <ClubPostCard key={post._id} post={post} base={base} compact onChange={load} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <ClubSectionTitle
              title={t("club.opportunities.title")}
              action={<Link to={`${base}/opportunities`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>}
            />
            <div className="space-y-3">
              {opportunities.length === 0 ? <p className="text-sm text-slate-500">{t("club.opportunities.emptyText")}</p> : null}
              {opportunities.slice(0, 3).map((row) => <ClubOpportunityCard key={row._id} row={row} base={base} />)}
            </div>
          </div>
          {data.spotlight ? (
            <ClubCard>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7C4DFF]">{t("club.dashboard.spotlight")}</p>
              <div className="mt-3 flex items-center gap-3">
                <ClubAvatar name={data.spotlight.fullName} photoUrl={data.spotlight.photoUrl} logoUrl={data.spotlight.logoUrl} />
                <div className="min-w-0">
                  <h3 className="font-black">{data.spotlight.businessName}</h3>
                  <p className="text-sm text-slate-500">{data.spotlight.fullName} · {countryFlag(data.spotlight.country)} {t(`club.countries.${data.spotlight.country}`, { defaultValue: data.spotlight.country })}</p>
                </div>
              </div>
              <ClubMemberText className="mt-3 line-clamp-3 text-sm text-slate-700" text={data.spotlight.description} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to={`${base}/members/${data.spotlight.userId}`} className="rounded-2xl border border-violet-100 px-3 py-2 text-sm font-semibold">{t("club.common.viewProfile")}</Link>
                <PrimaryButton type="button" className="px-3 py-2" onClick={() => clubSend("post", "/club/connections", { userId: data.spotlight?.userId })}>{t("club.common.connect")}</PrimaryButton>
              </div>
            </ClubCard>
          ) : null}
          <ClubCard>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-black">{t("club.dashboard.peopleToMeet")}</h3>
              <Link to={`${base}/connections`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>
            </div>
            <div className="space-y-3">
              {data.suggestions.length === 0 ? <p className="text-sm text-slate-500">{t("club.dashboard.noSuggestions")}</p> : null}
              {data.suggestions.slice(0, 4).map((member) => (
                <ClubPersonCard
                  key={member.userId}
                  member={member}
                  base={base}
                  extra={member.matchReasons?.[0] ? t(`club.matchReasons.${member.matchReasons[0]}`, { defaultValue: member.matchReasons[0] }) : undefined}
                  onConnect={() => clubSend("post", "/club/connections", { userId: member.userId }).then(load)}
                />
              ))}
            </div>
          </ClubCard>
        </div>
      </div>
    </div>
  );
}

function TodayPoll({ poll, onVoted }: { poll: Poll; onVoted: () => void }) {
  const { t } = useTranslation();
  const total = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  return (
    <div>
      <ClubMemberText className="text-xl font-black text-slate-900" text={poll.title} />
      <ClubMemberText className="mt-1 text-sm text-slate-600" text={poll.question} />
      <div className="mt-4 space-y-2">
        {poll.options.map((option) => {
          const width = option.votes == null || total === 0 ? 0 : Math.round((option.votes / total) * 100);
          return (
            <button
              key={option._id}
              type="button"
              disabled={poll.voted || poll.status !== "open"}
              onClick={() => clubSend("post", `/club/polls/${poll._id}/vote`, { optionId: option._id }).then(onVoted)}
              className="relative w-full overflow-hidden rounded-2xl border border-violet-100 bg-white px-3 py-3 text-start text-sm disabled:cursor-default"
            >
              {option.votes != null ? <span className="absolute inset-y-0 start-0 bg-[#F3EEFF]" style={{ width: `${width}%` }} /> : null}
              <span className="relative flex items-center justify-between gap-3">
                <span className={poll.myOptionId === option._id ? "font-black text-[#5B2CFF]" : "font-medium"}>{option.label}</span>
                {option.votes != null ? <span className="text-xs font-bold text-slate-500">{width}%</span> : <span className="text-xs font-semibold text-[#7C4DFF]">{t("club.dashboard.participate")}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
