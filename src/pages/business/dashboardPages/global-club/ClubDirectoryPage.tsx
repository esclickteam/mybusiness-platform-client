import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { CATEGORIES, COUNTRIES, ClubAvatar, ClubCard, ClubMemberText, ClubSectionTitle, EmptyState, Field, GhostButton, PrimaryButton, StatusBadge, countryFlag, fieldClass } from "./clubUi";

export default function ClubDirectoryPage() {
  const { t } = useTranslation();
  const { base, isMember } = useClub();
  const [filters, setFilters] = useState({ q: "", country: "", industry: "", category: "", offer: "", lookingFor: "" });
  const [members, setMembers] = useState<ClubProfile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isMember) return;
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    clubGet<{ members: ClubProfile[] }>("/club/members", params)
      .then((data) => setMembers(data.members || []))
      .catch((err) => setError(clubError(err, t)));
  }, [isMember, filters, t]);

  if (!isMember) return <EmptyState title={t("club.directory.membersOnlyTitle")} text={t("club.directory.membersOnlyText")} />;

  function set(field: string, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="space-y-4">
      <ClubSectionTitle title={t("club.directory.title")} />
      <ClubCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={t("club.directory.search")}><input className={fieldClass} value={filters.q} onChange={(e) => set("q", e.target.value)} placeholder={t("club.directory.searchPlaceholder")} /></Field>
          <Field label={t("club.directory.country")}>
            <select className={fieldClass} value={filters.country} onChange={(e) => set("country", e.target.value)}>
              <option value="">{t("club.directory.allCountries")}</option>
              {COUNTRIES.map((country) => <option key={country} value={country}>{t(`club.countries.${country}`)}</option>)}
            </select>
          </Field>
          <Field label={t("club.directory.industry")}><input className={fieldClass} value={filters.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
          <Field label={t("club.directory.category")}>
            <select className={fieldClass} value={filters.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">{t("club.directory.allCategories")}</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{t(`club.categories.${category}`)}</option>)}
            </select>
          </Field>
          <Field label={t("club.directory.offer")}><input className={fieldClass} value={filters.offer} onChange={(e) => set("offer", e.target.value)} /></Field>
          <Field label={t("club.directory.lookingFor")}><input className={fieldClass} value={filters.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} /></Field>
        </div>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {members.length === 0 ? <EmptyState title={t("club.directory.emptyTitle")} text={t("club.directory.emptyText")} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <ClubCard key={member.userId} className="bg-[linear-gradient(180deg,#ffffff_0%,#FBF9FF_100%)]">
            <div className="flex gap-3">
              <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} />
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-900">{member.fullName}</p>
                <p className="text-sm font-semibold text-slate-600">{member.businessName}</p>
                <p className="mt-1 text-sm text-slate-500">{countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}</p>
                {member.businessCategory ? <StatusBadge>{t(`club.categories.${member.businessCategory}`, { defaultValue: member.businessCategory })}</StatusBadge> : null}
              </div>
            </div>
            <ClubMemberText className="mt-3 line-clamp-3 text-sm text-slate-700" text={member.description} />
            <p className="mt-2 text-sm"><span className="font-semibold">{t("club.directory.offers")}</span>{member.offer}</p>
            <p className="text-sm"><span className="font-semibold">{t("club.directory.lookingForLabel")}</span>{member.lookingFor}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`${base}/members/${member.userId}`}><GhostButton type="button">{t("club.common.viewProfile")}</GhostButton></Link>
              <PrimaryButton type="button" onClick={() => clubSend("post", "/club/connections", { userId: member.userId })}>{t("club.common.connect")}</PrimaryButton>
              <Link to={`${base}/messages`} onClick={() => { void clubSend("post", "/club/messages", { userId: member.userId }); }}>
                <GhostButton type="button">{t("club.common.message")}</GhostButton>
              </Link>
            </div>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}
