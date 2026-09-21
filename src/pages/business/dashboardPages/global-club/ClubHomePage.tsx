import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClub, ClubNav } from "./GlobalBusinessClubPage";
import { ClubPost, ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import {
  ClubAvatar,
  ClubCard,
  EmptyState,
  GhostButton,
  PrimaryButton,
  StatusBadge,
  clubChipClass,
  countryFlag,
  formatCount,
  formatWhenRelative,
} from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  Briefcase,
  Check,
  Crown,
  Heart,
  MessageCircle,
  MessagesSquare,
  Sun,
  Users,
} from "lucide-react";
import {
  DEMO_EVENTS,
  DEMO_MEMBER_META,
  DEMO_STATS,
  DEMO_TODAY,
  demoOpportunities,
  demoPosts,
  isDemoId,
  localizeDemoMember,
  mergeLive,
} from "./clubDemo";

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
  return <MemberHome base={base} />;
}

function Landing({ status, base }: { status: string; base: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <PremiumHero
        primary={
          status === "not_member" || status === "expired" ? (
            <Link to={`${base}/join`}>
              <PrimaryButton className="rounded-full px-6 py-3 text-sm" data-testid="club-request-join">
                {t("club.landing.cta")}
              </PrimaryButton>
            </Link>
          ) : null
        }
        secondary={
          <a href="#club-benefits">
            <GhostButton type="button" className="rounded-full px-6 py-3">{t("club.landing.secondaryCta")}</GhostButton>
          </a>
        }
      >
        {status === "pending" ? (
          <div className="mt-4 max-w-xl rounded-2xl bg-violet-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold">{t("club.landing.pendingTitle")}</p>
            <p>{t("club.landing.pendingBody")}</p>
          </div>
        ) : null}
        {status === "suspended" ? <p className="mt-4 max-w-xl rounded-2xl bg-amber-50 px-4 py-3 text-sm">{t("club.landing.suspended")}</p> : null}
        {status === "expired" ? <p className="mt-4 max-w-xl rounded-2xl bg-violet-50 px-4 py-3 text-sm">{t("club.landing.expired")}</p> : null}
      </PremiumHero>
      <div id="club-benefits" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFIT_KEYS.map((benefit) => (
          <ClubCard key={benefit} className="py-5">
            <p className="text-sm font-bold text-slate-800">{t(`club.landing.benefits.${benefit}`)}</p>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}

function MemberHome({ base }: { base: string }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { me } = useClub();
  const [data, setData] = useState<DashboardData | null>(null);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [liked, setLiked] = useState<Record<string, number>>({});
  const [todayVote, setTodayVote] = useState<string | null>(null);

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

  const seededPosts = useMemo(() => mergeLive(posts, demoPosts(t), 3), [posts, t]);
  const seededPeople = useMemo(
    () => mergeLive(data?.suggestions || [], DEMO_MEMBER_META.map((member) => localizeDemoMember(member, t)), 3),
    [data, t]
  );
  const seededOpps = useMemo(() => mergeLive(opportunities, demoOpportunities(t), 3), [opportunities, t]);
  const visiblePosts = feedFilter === "all" ? seededPosts : seededPosts.filter((post) => post.postType === feedFilter);
  const livePoll = polls.find((poll) => poll.status === "open");

  if (!data && !error) return <p className="text-sm text-slate-500">{t("club.dashboard.loading")}</p>;

  const stats = [
    { icon: Users, value: Math.max(data?.stats.activeMembers || 0, DEMO_STATS.activeMembers), label: t("club.dashboard.stats.communityMembers") },
    { icon: MessagesSquare, value: Math.max(data?.stats.discussionsThisWeek || 0, DEMO_STATS.discussionsThisWeek), label: t("club.dashboard.stats.discussions") },
    { icon: Briefcase, value: Math.max(data?.stats.newOpportunities || 0, DEMO_STATS.newOpportunities), label: t("club.dashboard.stats.openOpportunities") },
    { icon: BarChart3, value: Math.max(polls.filter((poll) => poll.status === "open").length, DEMO_STATS.openPolls), label: t("club.dashboard.stats.activePolls") },
  ];

  return (
    <div className="space-y-6">
      <PremiumHero
        member={me?.profile}
        primary={
          <Link to={`${base}/feed`}>
            <PrimaryButton className="rounded-full px-6 py-3 text-sm">{t("club.dashboard.createPost")}</PrimaryButton>
          </Link>
        }
        secondary={
          <Link to={`${base}/directory`}>
            <GhostButton type="button" className="rounded-full px-6 py-3">{t("club.dashboard.exploreClub")}</GhostButton>
          </Link>
        }
      />

      <ClubNav base={base} isMember isAdmin={Boolean(me?.isAdmin)} />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(240px,0.9fr)]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_10px_30px_rgba(76,29,149,0.06)] ring-1 ring-violet-100/80">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F3EEFF] text-[#7C4DFF]">
              <stat.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-slate-900">{formatCount(stat.value, locale)}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
        <div className="rounded-[24px] bg-white px-5 py-4 text-sm leading-6 text-slate-600 shadow-[0_10px_30px_rgba(76,29,149,0.06)] ring-1 ring-violet-100/80">
          <span className="text-lg leading-none text-[#7C4DFF]">“</span>
          {t("club.demo.quote")}
          <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#7C4DFF]">{t("club.brand")}</span>
        </div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(270px,0.86fr)_minmax(0,1.35fr)_minmax(270px,0.86fr)]">
        <div className="space-y-5">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] ring-1 ring-violet-100/80">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-slate-900">{t("club.dashboard.todayTitle")}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6E8] px-2.5 py-1 text-[11px] font-bold text-amber-700">
                <Sun className="h-3.5 w-3.5" />
                {t("club.dashboard.questionOfDay")}
              </span>
            </div>
            {livePoll ? (
              <LiveTodayPoll poll={livePoll} onVoted={load} />
            ) : (
              <>
                <p className="text-base font-black leading-6 text-slate-900">{t(DEMO_TODAY.questionKey)}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {DEMO_TODAY.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTodayVote(option.id)}
                      className={`rounded-2xl border px-3 py-3 text-start text-sm font-semibold transition ${
                        todayVote === option.id
                          ? "border-[#7C4DFF] bg-[#F3EEFF] text-[#5B2CFF]"
                          : "border-violet-100 bg-[#FBF9FF] text-slate-700 hover:border-[#7C4DFF]/40"
                      }`}
                    >
                      {t(option.labelKey)}
                    </button>
                  ))}
                </div>
                <PrimaryButton type="button" className="mt-4 w-full rounded-full">{t("club.dashboard.voteNow")}</PrimaryButton>
                <p className="mt-2 text-center text-xs font-semibold text-slate-400">
                  {t("club.dashboard.votes", { count: DEMO_TODAY.votes })}
                </p>
              </>
            )}
          </section>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] ring-1 ring-violet-100/80">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">{t("club.dashboard.upcomingEvents")}</h2>
              <Link to={`${base}/hot-seat`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>
            </div>
            <div className="space-y-3">
              {DEMO_EVENTS.map((event) => (
                <div key={event.id} className="flex gap-3 rounded-2xl bg-[#FBF9FF] p-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-center shadow-sm ring-1 ring-violet-100">
                    <span className="text-lg font-black text-slate-900">{event.day}</span>
                    <span className="text-[10px] font-bold uppercase text-[#7C4DFF]">{t(event.monthKey)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900">{t(event.titleKey)}</p>
                    <p className="text-xs font-semibold text-slate-500">{t(event.timeKey)}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{t(event.textKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] ring-1 ring-violet-100/80">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{t("club.dashboard.communityFeed")}</h2>
            <Link to={`${base}/feed`}>
              <PrimaryButton className="rounded-full px-4 py-2 text-xs">{t("club.feed.create")}</PrimaryButton>
            </Link>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {[
              ["all", "club.feed.all"],
              ["general", "club.feed.updates"],
              ["collaboration", "club.postTypes.collaboration"],
              ["question", "club.feed.questions"],
            ].map(([id, key]) => (
              <button key={id} type="button" onClick={() => setFeedFilter(id)} className={clubChipClass(feedFilter === id)}>
                {t(key)}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {visiblePosts.length === 0 ? <EmptyState title={t("club.feed.emptyTitle")} text={t("club.feed.emptyText")} /> : null}
            {visiblePosts.slice(0, 4).map((post) => (
              <CommunityPost
                key={post._id}
                post={post}
                base={base}
                locale={locale}
                extraLikes={liked[post._id] || 0}
                onLike={() => {
                  if (isDemoId(post._id)) {
                    setLiked((current) => ({ ...current, [post._id]: (current[post._id] || 0) + 1 }));
                    return;
                  }
                  void clubSend("post", `/club/posts/${post._id}/react`).then(load);
                }}
              />
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] ring-1 ring-violet-100/80">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">{t("club.dashboard.peopleToMeet")}</h2>
              <Link to={`${base}/directory`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>
            </div>
            <div className="space-y-3">
              {seededPeople.slice(0, 3).map((member) => (
                <article key={member.userId} className="rounded-[22px] bg-[#FBF9FF] p-4">
                  <div className="flex items-center gap-3">
                    <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} />
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-900">{member.fullName}</p>
                      <p className="truncate text-xs text-slate-500">{member.businessName}</p>
                      <p className="truncate text-xs text-slate-500">
                        {countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <StatusBadge>{t(`club.categories.${member.businessCategory}`, { defaultValue: member.businessCategory || "" })}</StatusBadge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={isDemoId(member.userId) ? `${base}/directory` : `${base}/members/${member.userId}`} className="flex-1">
                      <GhostButton type="button" className="w-full rounded-full py-2 text-xs">{t("club.common.viewProfile")}</GhostButton>
                    </Link>
                    <PrimaryButton
                      type="button"
                      className="flex-1 rounded-full py-2 text-xs"
                      onClick={() => {
                        if (!isDemoId(member.userId)) void clubSend("post", "/club/connections", { userId: member.userId }).then(load);
                      }}
                    >
                      {t("club.common.connect")}
                    </PrimaryButton>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(76,29,149,0.07)] ring-1 ring-violet-100/80">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">{t("club.opportunities.title")}</h2>
              <Link to={`${base}/opportunities`} className="text-sm font-bold text-[#5B2CFF]">{t("club.dashboard.seeAll")}</Link>
            </div>
            <div className="space-y-3">
              {seededOpps.slice(0, 3).map((row) => (
                <article key={row._id} className="rounded-[22px] bg-[#FBF9FF] p-4">
                  <p className="font-black text-slate-900">{row.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {countryFlag(row.country)} {t(`club.countries.${row.country}`, { defaultValue: row.country || "" })}
                    {row.industry ? ` · ${t(`club.categories.${row.industry}`, { defaultValue: row.industry })}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{row.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PremiumHero({
  children,
  primary,
  secondary,
  member,
}: {
  children?: ReactNode;
  primary: ReactNode;
  secondary: ReactNode;
  member?: ClubProfile | null;
}) {
  const { t } = useTranslation();
  const { me, base } = useClub();
  const avatars = DEMO_MEMBER_META.slice(0, 6);
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#ffffff_0%,#f4edff_48%,#ece4ff_100%)] px-5 py-7 shadow-[0_24px_70px_rgba(76,29,149,0.10)] ring-1 ring-white sm:px-8 sm:py-9">
      <div className="pointer-events-none absolute -start-16 top-8 h-64 w-64 rounded-full bg-[#7C4DFF]/10 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)_minmax(240px,280px)]">
        <div className="order-2 lg:order-1">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7C4DFF] shadow-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#7C4DFF] text-[10px] text-white">B</span>
            {t("club.brand")} · {t("club.name")}
          </div>
          <h2 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{t("club.landing.title")}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{t("club.landing.description")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {primary}
            {secondary}
          </div>
          {children}
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <ClubGlobe avatars={avatars} />
        </div>
        {member ? (
          <aside className="order-3 rounded-[28px] bg-white p-5 text-center shadow-[0_18px_40px_rgba(76,29,149,0.12)] ring-1 ring-violet-100">
            <div className="relative mx-auto w-fit">
              <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="lg" />
              <span className="absolute -end-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-[#7C4DFF] text-white shadow-md">
                <Crown className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-4 text-lg font-black text-slate-900">{t("club.dashboard.welcomeName", { name: member.fullName || t("club.common.memberFallback") })}</p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              {t(me?.membership?.billingStatus === "active" ? "club.dashboard.paidMember" : "club.dashboard.activeMember")}
            </p>
            {member.country ? (
              <p className="mt-2 text-sm text-slate-500">
                {countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}
              </p>
            ) : null}
            <Link to={`${base}/members/${member.userId || ""}`} className="mt-4 block">
              <GhostButton type="button" className="w-full rounded-full">{t("club.dashboard.completeProfile")}</GhostButton>
            </Link>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function ClubGlobe({ avatars }: { avatars: DemoMemberLike[] }) {
  const { t } = useTranslation();
  const spots = [
    "start-2 top-10",
    "end-4 top-6",
    "start-0 top-1/2",
    "end-0 top-1/2",
    "start-8 bottom-8",
    "end-6 bottom-6",
  ];
  return (
    <div className="relative h-[270px] w-[270px]">
      <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#efe7ff_42%,#d9c8ff_100%)] shadow-[inset_0_0_40px_rgba(124,77,255,0.12)]" />
      <svg viewBox="0 0 270 270" className="absolute inset-0 h-full w-full">
        <ellipse cx="135" cy="135" rx="78" ry="78" fill="none" stroke="#7C4DFF" strokeOpacity="0.22" strokeWidth="1.5" />
        <ellipse cx="135" cy="135" rx="52" ry="78" fill="none" stroke="#7C4DFF" strokeOpacity="0.16" />
        <ellipse cx="135" cy="135" rx="78" ry="28" fill="none" stroke="#7C4DFF" strokeOpacity="0.16" />
        <ellipse cx="135" cy="135" rx="78" ry="52" fill="none" stroke="#7C4DFF" strokeOpacity="0.12" />
        <line x1="57" y1="135" x2="213" y2="135" stroke="#7C4DFF" strokeOpacity="0.12" />
        <line x1="135" y1="57" x2="135" y2="213" stroke="#7C4DFF" strokeOpacity="0.12" />
      </svg>
      {avatars.map((member, index) => (
        <span key={member.userId} className={`absolute ${spots[index]} rounded-full ring-2 ring-white shadow-md`}>
          <ClubAvatar name={member.fullName || member.userId} photoUrl={member.photoUrl} size="sm" />
        </span>
      ))}
      <div className="absolute inset-0 grid place-items-center px-10 text-center">
        <div>
          <p className="text-sm font-black leading-5 text-[#4c1d95]">{t("club.demo.globeLine1")}</p>
          <p className="text-sm font-black leading-5 text-[#4c1d95]">{t("club.demo.globeLine2")}</p>
        </div>
      </div>
      <p className="absolute bottom-1 left-1/2 w-max -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
        {t("club.demo.globeCaption")}
      </p>
    </div>
  );
}

type DemoMemberLike = { userId: string; fullName?: string; photoUrl?: string };

function CommunityPost({
  post,
  base,
  locale,
  extraLikes,
  onLike,
}: {
  post: ClubPost;
  base: string;
  locale: string;
  extraLikes: number;
  onLike: () => void;
}) {
  const { t } = useTranslation();
  return (
    <article className="rounded-[24px] border border-violet-100/70 bg-[#FCFBFF] p-4">
      <div className="flex items-start gap-3">
        <ClubAvatar name={post.author.fullName} photoUrl={post.author.photoUrl} logoUrl={post.author.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-black text-slate-900">{post.author.fullName}</p>
              <p className="text-xs text-slate-500">
                {post.author.businessName}
                {post.author.country ? ` · ${countryFlag(post.author.country)} ${t(`club.countries.${post.author.country}`, { defaultValue: post.author.country })}` : ""}
              </p>
            </div>
            <StatusBadge>{t(`club.postTypes.${post.postType}`, { defaultValue: post.postType })}</StatusBadge>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{formatWhenRelative(post.createdAt, locale)}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{post.text}</p>
      <div className="mt-3 flex items-center gap-4 text-sm font-semibold text-slate-500">
        <button type="button" onClick={onLike} className="inline-flex items-center gap-1.5 hover:text-[#7C4DFF]">
          <Heart className={`h-4 w-4 ${post.likedByMe || extraLikes ? "fill-[#7C4DFF] text-[#7C4DFF]" : ""}`} />
          {post.likeCount + extraLikes}
        </button>
        <Link to={`${base}/feed`} className="inline-flex items-center gap-1.5 hover:text-[#7C4DFF]">
          <MessageCircle className="h-4 w-4" />
          {post.commentCount || post.comments.length}
        </Link>
      </div>
    </article>
  );
}

function LiveTodayPoll({ poll, onVoted }: { poll: Poll; onVoted: () => void }) {
  const { t } = useTranslation();
  const total = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  return (
    <div>
      <p className="text-base font-black leading-6 text-slate-900">{poll.question || poll.title}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {poll.options.map((option) => (
          <button
            key={option._id}
            type="button"
            disabled={poll.voted || poll.status !== "open"}
            onClick={() => clubSend("post", `/club/polls/${poll._id}/vote`, { optionId: option._id }).then(onVoted)}
            className="rounded-2xl border border-violet-100 bg-[#FBF9FF] px-3 py-3 text-start text-sm font-semibold disabled:opacity-70"
          >
            {option.label}
            {option.votes != null && total > 0 ? <span className="mt-1 block text-xs text-slate-400">{Math.round((option.votes / total) * 100)}%</span> : null}
          </button>
        ))}
      </div>
      <PrimaryButton type="button" className="mt-4 w-full rounded-full" disabled>{t("club.dashboard.voteNow")}</PrimaryButton>
    </div>
  );
}
