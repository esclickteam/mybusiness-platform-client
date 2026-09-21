import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubPost, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubMemberText, EmptyState, Field, PrimaryButton, StatusBadge, fieldClass, formatWhen } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

const TOPICS = ["Marketing", "Sales", "Pricing", "Websites", "CRM", "Automations", "AI", "International markets", "Business strategy", "Operations", "Technology"];

export default function ClubAskPage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { isMember } = useClub();
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function load() {
    clubGet<{ posts: ClubPost[] }>("/club/feed", { type: "question" })
      .then(async (questions) => {
        const advice = await clubGet<{ posts: ClubPost[] }>("/club/feed", { type: "advice" });
        const market = await clubGet<{ posts: ClubPost[] }>("/club/feed", { type: "market" });
        const merged = [...(questions.posts || []), ...(advice.posts || []), ...(market.posts || [])];
        merged.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        setPosts(merged);
      })
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, t]);

  if (!isMember) return <EmptyState title={t("club.ask.membersOnlyTitle")} text={t("club.ask.membersOnlyText")} />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/posts", { postType: "question", category: topic, title: topic, text });
    setText("");
    load();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{t("club.ask.title")}</h2>
        <p className="text-sm text-slate-500">{t("club.ask.subtitle")}</p>
      </div>
      <ClubCard>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Field label={t("club.ask.topic")}>
            <select className={fieldClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.map((item) => <option key={item} value={item}>{t(`club.topics.${item}`)}</option>)}
            </select>
          </Field>
          <Field label={t("club.ask.question")}><textarea className={fieldClass} rows={4} value={text} onChange={(e) => setText(e.target.value)} required /></Field>
          <PrimaryButton type="submit">{t("club.ask.submit")}</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {posts.length === 0 ? <EmptyState title={t("club.ask.emptyTitle")} text={t("club.ask.emptyText")} /> : null}
      {posts.map((post) => (
        <QuestionCard key={post._id} post={post} locale={locale} onChange={load} />
      ))}
    </div>
  );
}

function QuestionCard({ post, locale, onChange }: { post: ClubPost; locale: string; onChange: () => void }) {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState("");
  return (
    <ClubCard>
      <StatusBadge>{t(`club.topics.${post.category}`, { defaultValue: post.category || post.postType })}</StatusBadge>
      <h3 className="mt-2 text-lg font-bold">{post.title ? t(`club.topics.${post.title}`, { defaultValue: post.title }) : t("club.ask.questionFallback")}</h3>
      <p className="mt-1 text-sm text-slate-500">{post.author.fullName} · {post.author.businessName} · {formatWhen(post.createdAt, locale)}</p>
      <ClubMemberText className="mt-2 whitespace-pre-wrap text-sm text-slate-700" text={post.text} />
      <div className="mt-3 space-y-2">
        {post.comments.map((comment) => (
          <div key={comment._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <p className="font-semibold">{comment.author.fullName}</p>
            <ClubMemberText text={comment.text} />
          </div>
        ))}
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/posts/${post._id}/comments`, { text: answer }).then(() => {
            setAnswer("");
            onChange();
          });
        }}>
          <input className={fieldClass} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={t("club.ask.answerPlaceholder")} />
          <PrimaryButton type="submit">{t("club.ask.answer")}</PrimaryButton>
        </form>
      </div>
    </ClubCard>
  );
}
