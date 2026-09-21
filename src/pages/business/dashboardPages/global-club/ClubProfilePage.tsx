import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClubPost, ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubAvatar, ClubCard, ClubMemberText, EmptyState, Field, GhostButton, PrimaryButton, countryFlag, fieldClass, formatWhen } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

type ProfileResponse = {
  member: ClubProfile | null;
  posts: ClubPost[];
  connection: "none" | "pending" | "incoming" | "connected";
};

const PROFILE_FIELDS = ["fullName", "businessName", "country", "industry", "businessCategory", "website", "logoUrl", "photoUrl"] as const;

export default function ClubProfilePage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { userId } = useParams();
  const navigate = useNavigate();
  const { base, isMember, me } = useClub();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);

  function load() {
    if (!userId) return;
    clubGet<ProfileResponse>(`/club/members/${userId}`)
      .then(setData)
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, userId, t]);

  if (!isMember) return <EmptyState title={t("club.profile.membersOnlyTitle")} text={t("club.profile.membersOnlyText")} />;
  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data?.member) return <p className="text-sm text-slate-500">{t("club.profile.loading")}</p>;

  const member = data.member;
  const mine = me?.profile?.userId === member.userId;
  const connectionLabel =
    data.connection === "connected"
      ? t("club.common.connected")
      : data.connection === "pending"
        ? t("club.common.pending")
        : t("club.common.connect");

  return (
    <div className="space-y-4">
      <ClubCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="lg" />
          {member.logoUrl && member.photoUrl ? <img src={member.logoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-violet-100" /> : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{member.fullName}</h2>
            <p className="text-slate-600">{member.businessName}</p>
            <p className="text-sm text-slate-500">{countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })} · {t(`club.categories.${member.industry || member.businessCategory}`, { defaultValue: member.industry || member.businessCategory })}</p>
            {member.website ? <a className="text-sm font-semibold text-indigo-600" href={member.website} target="_blank" rel="noreferrer">{member.website}</a> : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {!mine ? (
            <PrimaryButton type="button" disabled={data.connection === "connected" || data.connection === "pending"} onClick={() => clubSend("post", "/club/connections", { userId: member.userId }).then(load)}>
              {connectionLabel}
            </PrimaryButton>
          ) : null}
          {!mine ? (
            <GhostButton type="button" onClick={() => clubSend<{ threadId?: string }>("post", "/club/messages", { userId: member.userId }).then((result) => {
              navigate(`${base}/messages/${result.threadId || ""}`);
            })}>{t("club.common.sendMessage")}</GhostButton>
          ) : null}
          {!mine ? <GhostButton type="button" onClick={() => setSuggestOpen(true)}>{t("club.profile.suggest")}</GhostButton> : null}
        </div>
        <ProfileBlock title={t("club.profile.description")} text={member.description} />
        <ProfileBlock title={t("club.profile.services")} text={(member.services || []).join(", ")} />
        <ProfileBlock title={t("club.profile.marketsOperate")} text={(member.marketsOperate || []).join(", ")} />
        <ProfileBlock title={t("club.profile.marketsEnter")} text={(member.marketsEnter || []).join(", ")} />
        <ProfileBlock title={t("club.profile.offer")} text={member.offer} />
        <ProfileBlock title={t("club.profile.lookingFor")} text={member.lookingFor} />
      </ClubCard>
      {mine ? <ProfileEditor member={member} onSaved={load} /> : null}
      {suggestOpen ? <SuggestForm userId={member.userId} onDone={() => setSuggestOpen(false)} /> : null}
      <h3 className="text-lg font-bold">{t("club.profile.recentPosts")}</h3>
      {data.posts.length === 0 ? <EmptyState title={t("club.profile.noPostsTitle")} text={t("club.profile.noPostsText")} /> : null}
      {data.posts.map((post) => (
        <ClubCard key={post._id}>
          <p className="text-xs font-semibold text-indigo-600">{t(`club.postTypes.${post.postType}`, { defaultValue: post.postType })}</p>
          <ClubMemberText className="mt-1 text-sm text-slate-700" text={post.text} />
          <p className="mt-2 text-xs text-slate-400">{formatWhen(post.createdAt, locale)}</p>
        </ClubCard>
      ))}
      <Link to={`${base}/directory`} className="text-sm font-semibold text-indigo-600">{t("club.profile.back")}</Link>
    </div>
  );
}

function ProfileBlock({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <ClubMemberText className="mt-1 text-sm leading-6 text-slate-700" text={text} />
    </div>
  );
}

function ProfileEditor({ member, onSaved }: { member: ClubProfile; onSaved: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    ...member,
    services: (member.services || []).join(", "),
    marketsOperate: (member.marketsOperate || []).join(", "),
    marketsEnter: (member.marketsEnter || []).join(", "),
    interests: (member.interests || []).join(", "),
    collaborationNeeds: (member.collaborationNeeds || []).join(", "),
  });
  const [saved, setSaved] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("put", "/club/profile", form);
    setSaved(t("club.profile.saved"));
    onSaved();
  }

  return (
    <ClubCard>
      <h3 className="text-lg font-bold">{t("club.profile.edit")}</h3>
      <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
        {PROFILE_FIELDS.map((field) => (
          <Field key={field} label={t(`club.profile.fields.${field}`)}>
            <input className={fieldClass} value={String(form[field] || "")} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </Field>
        ))}
        <div className="sm:col-span-2"><Field label={t("club.profile.fields.description")}><textarea className={fieldClass} rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
        <Field label={t("club.profile.fields.offer")}><textarea className={fieldClass} rows={3} value={form.offer || ""} onChange={(e) => setForm({ ...form, offer: e.target.value })} /></Field>
        <Field label={t("club.profile.fields.lookingFor")}><textarea className={fieldClass} rows={3} value={form.lookingFor || ""} onChange={(e) => setForm({ ...form, lookingFor: e.target.value })} /></Field>
        <Field label={t("club.profile.fields.marketsOperate")}><input className={fieldClass} value={form.marketsOperate} onChange={(e) => setForm({ ...form, marketsOperate: e.target.value })} /></Field>
        <Field label={t("club.profile.fields.marketsEnter")}><input className={fieldClass} value={form.marketsEnter} onChange={(e) => setForm({ ...form, marketsEnter: e.target.value })} /></Field>
        {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
        <PrimaryButton type="submit">{t("club.profile.save")}</PrimaryButton>
      </form>
    </ClubCard>
  );
}

function SuggestForm({ userId, onDone }: { userId: string; onDone: () => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <ClubCard>
      <h3 className="font-bold">{t("club.profile.suggest")}</h3>
      <form className="mt-3 grid gap-3" onSubmit={(event) => {
        event.preventDefault();
        void clubSend("post", "/club/collaborations", { title, description, targetUserId: userId, needed: title }).then(onDone);
      }}>
        <Field label={t("club.profile.suggestTitle")}><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
        <Field label={t("club.profile.suggestDescription")}><textarea className={fieldClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required /></Field>
        <div className="flex gap-2">
          <PrimaryButton type="submit">{t("club.profile.sendSuggestion")}</PrimaryButton>
          <GhostButton type="button" onClick={onDone}>{t("club.common.cancel")}</GhostButton>
        </div>
      </form>
    </ClubCard>
  );
}
