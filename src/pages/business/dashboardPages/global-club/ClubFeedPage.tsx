import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubComment, ClubPost, clubError, clubGet, clubSend, uploadClubImage } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import {
  ClubAvatar,
  ClubCard,
  ClubMemberText,
  EmptyState,
  Field,
  GhostButton,
  POST_TYPE_KEYS,
  PrimaryButton,
  StatusBadge,
  countryFlag,
  fieldClass,
  formatWhen,
} from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

const COMPOSER = ["question", "collaboration", "feedback", "opportunity", "market", "advice", "general"] as const;

export default function ClubFeedPage() {
  const { t } = useTranslation();
  const { isMember } = useClub();
  const [type, setType] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function load() {
    const params: Record<string, string> = {};
    if (type !== "all") params.type = type;
    if (savedOnly) params.saved = "1";
    const data = await clubGet<{ posts: ClubPost[] }>("/club/feed", params);
    setPosts(data.posts || []);
  }

  useEffect(() => {
    if (!isMember) return;
    load().catch((err) => setError(clubError(err, t)));
  }, [isMember, type, savedOnly, t]);

  if (!isMember) return <EmptyState title={t("club.feed.membersOnlyTitle")} text={t("club.feed.membersOnlyText")} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t("club.feed.title")}</h2>
        <PrimaryButton type="button" onClick={() => setOpen(true)}>{t("club.feed.create")}</PrimaryButton>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setType("all")} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${type === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
          {t("club.feed.all")}
        </button>
        {POST_TYPE_KEYS.map((id) => (
          <button key={id} type="button" onClick={() => setType(id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${type === id ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
            {t(`club.postTypes.${id}`)}
          </button>
        ))}
        <button type="button" onClick={() => setSavedOnly((value) => !value)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${savedOnly ? "bg-indigo-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
          {t("club.feed.saved")}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {open ? <Composer onClose={() => setOpen(false)} onCreated={() => { setOpen(false); void load(); }} /> : null}
      {posts.length === 0 ? <EmptyState title={t("club.feed.emptyTitle")} text={t("club.feed.emptyText")} /> : null}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onChange={load} />
      ))}
    </div>
  );
}

function Composer({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { t } = useTranslation();
  const [postType, setPostType] = useState("general");
  const [form, setForm] = useState({ title: "", text: "", country: "", industry: "", lookingFor: "", deadline: "", category: "", imageUrl: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await clubSend("post", "/club/posts", { ...form, postType });
      onCreated();
    } catch (err) {
      setError(clubError(err, t));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ClubCard>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">{t("club.feed.composerTitle")}</h3>
        <GhostButton type="button" onClick={onClose}>{t("club.common.close")}</GhostButton>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {COMPOSER.map((option) => (
          <button key={option} type="button" onClick={() => setPostType(option)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${postType === option ? "bg-indigo-500 text-white" : "bg-slate-50 text-slate-600"}`}>
            {t(`club.composer.${option}`)}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-3">
        {postType === "collaboration" ? (
          <>
            <Field label={t("club.feed.lookingFor")}><input className={fieldClass} value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} required /></Field>
            <Field label={t("club.feed.countryMarket")}><input className={fieldClass} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
            <Field label={t("club.feed.industry")}><input className={fieldClass} value={form.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
            <Field label={t("club.feed.deadline")}><input type="date" className={fieldClass} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
          </>
        ) : null}
        {postType === "opportunity" || postType === "feedback" || postType === "question" || postType === "advice" ? (
          <Field label={t("club.feed.titleField")}><input className={fieldClass} value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        ) : null}
        {(postType === "question" || postType === "advice" || postType === "market") ? (
          <Field label={t("club.feed.topic")}><input className={fieldClass} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder={t("club.feed.topicPlaceholder")} /></Field>
        ) : null}
        <Field label={t("club.feed.description")}><textarea className={fieldClass} rows={4} value={form.text} onChange={(e) => set("text", e.target.value)} required /></Field>
        <Field label={t("club.feed.image")}>
          <input type="file" accept="image/*" onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const url = await uploadClubImage(file);
            set("imageUrl", url);
          }} />
        </Field>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <PrimaryButton type="submit" disabled={saving}>{saving ? t("club.feed.publishing") : t("club.feed.publish")}</PrimaryButton>
      </form>
    </ClubCard>
  );
}

function PostCard({ post, onChange }: { post: ClubPost; onChange: () => Promise<void> }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [text, setText] = useState("");
  const [reporting, setReporting] = useState(false);

  return (
    <ClubCard>
      <div className="flex items-start gap-3">
        <ClubAvatar name={post.author.fullName} photoUrl={post.author.photoUrl} logoUrl={post.author.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{post.author.fullName}</p>
            <StatusBadge>{t(`club.postTypes.${post.postType}`, { defaultValue: post.postType })}</StatusBadge>
          </div>
          <p className="text-sm text-slate-500">
            {post.author.businessName} · {countryFlag(post.author.country)} {t(`club.countries.${post.author.country}`, { defaultValue: post.author.country })} · {formatWhen(post.createdAt, locale)}
          </p>
        </div>
      </div>
      {post.title ? <ClubMemberText className="mt-3 text-lg font-bold" text={post.title} /> : null}
      <ClubMemberText className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700" text={post.text} />
      {post.lookingFor ? <p className="mt-2 text-sm text-slate-600">{t("club.feed.lookingForLabel", { value: post.lookingFor })}</p> : null}
      {post.imageUrl ? <img src={post.imageUrl} alt="" className="mt-3 max-h-80 w-full rounded-2xl object-cover" /> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <GhostButton type="button" onClick={() => clubSend("post", `/club/posts/${post._id}/react`).then(onChange)}>{t("club.feed.like", { count: post.likeCount })}</GhostButton>
        <GhostButton type="button" onClick={() => clubSend("post", `/club/posts/${post._id}/save`).then(onChange)}>{post.savedByMe ? t("club.feed.saved") : t("club.feed.save")}</GhostButton>
        <GhostButton type="button" onClick={() => setReporting((value) => !value)}>{t("club.feed.report")}</GhostButton>
      </div>
      {reporting ? (
        <form className="mt-2 flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          const reason = new FormData(event.currentTarget).get("reason");
          void clubSend("post", `/club/posts/${post._id}/report`, { reason }).then(() => setReporting(false));
        }}>
          <input name="reason" className={fieldClass} placeholder={t("club.feed.reportPlaceholder")} required />
          <PrimaryButton type="submit">{t("club.common.send")}</PrimaryButton>
        </form>
      ) : null}
      <div className="mt-4 space-y-2">
        {post.comments.map((comment: ClubComment) => (
          <div key={comment._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <span className="font-semibold">{comment.author.fullName}</span>
            <span className="text-slate-500"> · {comment.author.businessName}</span>
            <ClubMemberText className="mt-1 text-slate-700" text={comment.text} />
          </div>
        ))}
        <form className="flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/posts/${post._id}/comments`, { text }).then(() => {
            setText("");
            return onChange();
          });
        }}>
          <input className={fieldClass} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("club.feed.commentPlaceholder")} />
          <PrimaryButton type="submit">{t("club.feed.comment")}</PrimaryButton>
        </form>
      </div>
    </ClubCard>
  );
}
