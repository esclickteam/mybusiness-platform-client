import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { ClubAvatar, ClubCard, ClubMemberText, PrimaryButton, countryFlag, formatCount } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { useEffect, useState } from "react";

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

export default function ClubHomePage() {
  const { me, base, isMember } = useClub();
  if (!me) return null;
  if (!isMember) return <Landing status={me.status} base={base} />;
  return <Dashboard base={base} />;
}

function Landing({ status, base }: { status: string; base: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <ClubCard className="overflow-hidden">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-500">{t("club.landing.kicker")}</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t("club.landing.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          {t("club.landing.description")}
        </p>
        <div className="mt-5">
          {status === "pending" ? (
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
              <p className="font-semibold">{t("club.landing.pendingTitle")}</p>
              <p>{t("club.landing.pendingBody")}</p>
            </div>
          ) : null}
          {status === "suspended" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {t("club.landing.suspended")}
            </p>
          ) : null}
          {status === "expired" ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {t("club.landing.expired")}
            </p>
          ) : null}
          {status === "not_member" || status === "expired" ? (
            <Link to={`${base}/join`}>
              <PrimaryButton className="mt-4" data-testid="club-request-join">{t("club.landing.cta")}</PrimaryButton>
            </Link>
          ) : null}
        </div>
      </ClubCard>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFIT_KEYS.map((benefit) => (
          <ClubCard key={benefit} className="py-4">
            <p className="text-sm font-semibold text-slate-800">{t(`club.landing.benefits.${benefit}`)}</p>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ base }: { base: string }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    clubGet<DashboardData>("/club/dashboard")
      .then(setData)
      .catch((err) => setError(clubError(err, t)));
  }, [t]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">{t("club.dashboard.loading")}</p>;

  const stats = [
    ["club.dashboard.stats.activeMembers", data.stats.activeMembers],
    ["club.dashboard.stats.countries", data.stats.countriesRepresented],
    ["club.dashboard.stats.collaborations", data.stats.openCollaborations],
    ["club.dashboard.stats.opportunities", data.stats.newOpportunities],
    ["club.dashboard.stats.discussions", data.stats.discussionsThisWeek],
  ] as const;

  return (
    <div className="space-y-4">
      <ClubCard>
        <h2 className="text-2xl font-bold text-slate-900">{t("club.dashboard.welcome")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("club.dashboard.subtitle")}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-2xl font-bold text-slate-900">{formatCount(Number(value), locale)}</p>
              <p className="text-xs font-medium text-slate-500">{t(label)}</p>
            </div>
          ))}
        </div>
      </ClubCard>

      {data.spotlight ? (
        <ClubCard>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{t("club.dashboard.spotlight")}</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ClubAvatar name={data.spotlight.fullName} photoUrl={data.spotlight.photoUrl} logoUrl={data.spotlight.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold">{data.spotlight.businessName}</h3>
              <p className="text-sm text-slate-600">
                {data.spotlight.fullName} · {countryFlag(data.spotlight.country)} {t(`club.countries.${data.spotlight.country}`, { defaultValue: data.spotlight.country })}
              </p>
              <p className="mt-1 text-sm text-slate-500">{t(`club.categories.${data.spotlight.businessCategory}`, { defaultValue: data.spotlight.businessCategory })}</p>
              <ClubMemberText className="mt-2 text-sm text-slate-700" text={data.spotlight.description} />
              {data.spotlight.lookingFor ? (
                <p className="mt-1 text-sm text-slate-600">{t("club.dashboard.lookingFor", { value: data.spotlight.lookingFor })}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`${base}/members/${data.spotlight.userId}`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                {t("club.common.viewProfile")}
              </Link>
              <button
                type="button"
                className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white"
                onClick={() => clubSend("post", "/club/connections", { userId: data.spotlight?.userId })}
              >
                {t("club.common.connect")}
              </button>
              {data.spotlight.website ? (
                <a href={data.spotlight.website} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                  {t("club.common.website")}
                </a>
              ) : null}
            </div>
          </div>
        </ClubCard>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <ClubCard>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t("club.dashboard.peopleToMeet")}</h3>
            <Link to={`${base}/connections`} className="text-sm font-semibold text-indigo-600">{t("club.dashboard.seeAll")}</Link>
          </div>
          <div className="space-y-3">
            {data.suggestions.length === 0 ? (
              <p className="text-sm text-slate-500">{t("club.dashboard.noSuggestions")}</p>
            ) : null}
            {data.suggestions.map((member) => (
              <div key={member.userId} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{member.fullName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {member.businessName} · {countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}
                  </p>
                  <p className="truncate text-xs text-indigo-600">
                    {member.matchReasons?.[0]
                      ? t(`club.matchReasons.${member.matchReasons[0]}`, { defaultValue: member.matchReasons[0] })
                      : null}
                  </p>
                </div>
                <Link to={`${base}/members/${member.userId}`} className="text-sm font-semibold text-indigo-600">{t("club.common.viewProfile")}</Link>
              </div>
            ))}
          </div>
        </ClubCard>
        <ClubCard>
          <h3 className="text-lg font-bold">{t("club.dashboard.thisWeek")}</h3>
          <div className="mt-3 space-y-3">
            {data.activities.length === 0 ? <p className="text-sm text-slate-500">{t("club.dashboard.noActivity")}</p> : null}
            {data.activities.map((activity) => (
              <div key={activity._id} className="rounded-xl border border-slate-100 px-3 py-2">
                <ClubMemberText className="text-sm font-semibold" text={activity.title} />
                <p className="text-xs text-slate-500">{t(`club.activities.${activity.kind}`, { defaultValue: activity.kind.replace(/_/g, " ") })}</p>
              </div>
            ))}
          </div>
          <Link to={`${base}/feed`} className="mt-4 inline-flex text-sm font-semibold text-indigo-600">{t("club.dashboard.openFeed")}</Link>
        </ClubCard>
      </div>
    </div>
  );
}
