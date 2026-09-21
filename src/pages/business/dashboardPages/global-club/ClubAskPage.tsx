import { FormEvent, useEffect, useState } from "react";
import { ClubPost, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, EmptyState, Field, PrimaryButton, StatusBadge, fieldClass, formatWhen } from "./clubUi";

const TOPICS = ["Marketing", "Sales", "Pricing", "Websites", "CRM", "Automations", "AI", "International markets", "Business strategy", "Operations", "Technology"];

export default function ClubAskPage() {
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
      .catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember]);

  if (!isMember) return <EmptyState title="Members only" text="Business questions stay inside the Club." />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/posts", { postType: "question", category: topic, title: topic, text });
    setText("");
    load();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Ask the Community</h2>
        <p className="text-sm text-slate-500">Practical questions on marketing, sales, pricing, operations, and new markets.</p>
      </div>
      <ClubCard>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Field label="Topic">
            <select className={fieldClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Your question"><textarea className={fieldClass} rows={4} value={text} onChange={(e) => setText(e.target.value)} required /></Field>
          <PrimaryButton type="submit">Ask the Club</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {posts.length === 0 ? <EmptyState title="No questions yet" text="Be the first to ask the community." /> : null}
      {posts.map((post) => (
        <QuestionCard key={post._id} post={post} onChange={load} />
      ))}
    </div>
  );
}

function QuestionCard({ post, onChange }: { post: ClubPost; onChange: () => void }) {
  const [answer, setAnswer] = useState("");
  return (
    <ClubCard>
      <StatusBadge>{post.category || post.postType}</StatusBadge>
      <h3 className="mt-2 text-lg font-bold">{post.title || "Business question"}</h3>
      <p className="mt-1 text-sm text-slate-500">{post.author.fullName} · {post.author.businessName} · {formatWhen(post.createdAt)}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{post.text}</p>
      <div className="mt-3 space-y-2">
        {post.comments.map((comment) => (
          <div key={comment._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <p className="font-semibold">{comment.author.fullName}</p>
            <p>{comment.text}</p>
          </div>
        ))}
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/posts/${post._id}/comments`, { text: answer }).then(() => {
            setAnswer("");
            onChange();
          });
        }}>
          <input className={fieldClass} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Share an answer" />
          <PrimaryButton type="submit">Answer</PrimaryButton>
        </form>
      </div>
    </ClubCard>
  );
}
