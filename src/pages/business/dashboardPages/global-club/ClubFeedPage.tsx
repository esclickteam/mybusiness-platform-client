import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubPost, clubError, clubGet, clubSend, uploadClubImage } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubSectionTitle, EmptyState, Field, GhostButton, POST_TYPE_KEYS, PrimaryButton, clubChipClass, fieldClass } from "./clubUi";
import { ClubPostCard } from "./clubCards";

const COMPOSER = ["question", "collaboration", "feedback", "opportunity", "market", "advice", "general"] as const;

export default function ClubFeedPage() {
  const { t } = useTranslation();
  const { isMember, base } = useClub();
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
      <ClubSectionTitle
        kicker={t("club.dashboard.feedKicker")}
        title={t("club.feed.title")}
        action={<PrimaryButton type="button" onClick={() => setOpen(true)}>{t("club.feed.create")}</PrimaryButton>}
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setType("all")} className={clubChipClass(type === "all")}>
          {t("club.feed.all")}
        </button>
        {POST_TYPE_KEYS.map((id) => (
          <button key={id} type="button" onClick={() => setType(id)} className={clubChipClass(type === id)}>
            {t(`club.postTypes.${id}`)}
          </button>
        ))}
        <button type="button" onClick={() => setSavedOnly((value) => !value)} className={clubChipClass(savedOnly)}>
          {t("club.feed.saved")}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {open ? <Composer onClose={() => setOpen(false)} onCreated={() => { setOpen(false); void load(); }} /> : null}
      {posts.length === 0 ? <EmptyState title={t("club.feed.emptyTitle")} text={t("club.feed.emptyText")} /> : null}
      {posts.map((post) => (
        <ClubPostCard key={post._id} post={post} base={base} onChange={load} />
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
        <h3 className="text-lg font-black">{t("club.feed.composerTitle")}</h3>
        <GhostButton type="button" onClick={onClose}>{t("club.common.close")}</GhostButton>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {COMPOSER.map((option) => (
          <button key={option} type="button" onClick={() => setPostType(option)} className={clubChipClass(postType === option)}>
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
