import { FormEvent, useEffect, useState } from "react";
import { ClubComment, ClubPost, clubError, clubGet, clubSend, uploadClubImage } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import {
  ClubAvatar,
  ClubCard,
  EmptyState,
  Field,
  GhostButton,
  POST_LABELS,
  PrimaryButton,
  StatusBadge,
  countryFlag,
  fieldClass,
  formatWhen,
} from "./clubUi";

const COMPOSER = [
  { id: "question", label: "Ask the Community" },
  { id: "collaboration", label: "Find a Collaboration" },
  { id: "feedback", label: "Request Feedback" },
  { id: "opportunity", label: "Share an Opportunity" },
  { id: "market", label: "Market Question" },
  { id: "advice", label: "Need Advice" },
  { id: "general", label: "General Discussion" },
];

const FILTERS = [{ id: "all", label: "All" }, ...Object.entries(POST_LABELS).map(([id, label]) => ({ id, label }))];

export default function ClubFeedPage() {
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
    load().catch((err) => setError(clubError(err)));
  }, [isMember, type, savedOnly]);

  if (!isMember) return <EmptyState title="Members only" text="Join the Club to read and publish in the feed." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Club feed</h2>
        <PrimaryButton type="button" onClick={() => setOpen(true)}>Create Post</PrimaryButton>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setType(filter.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${type === filter.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {filter.label}
          </button>
        ))}
        <button type="button" onClick={() => setSavedOnly((value) => !value)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${savedOnly ? "bg-indigo-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
          Saved
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {open ? <Composer onClose={() => setOpen(false)} onCreated={() => { setOpen(false); void load(); }} /> : null}
      {posts.length === 0 ? <EmptyState title="No posts yet" text="Start a discussion, ask for advice, or share an opportunity." /> : null}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onChange={load} />
      ))}
    </div>
  );
}

function Composer({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
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
      setError(clubError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ClubCard>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">What would you like to post?</h3>
        <GhostButton type="button" onClick={onClose}>Close</GhostButton>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {COMPOSER.map((option) => (
          <button key={option.id} type="button" onClick={() => setPostType(option.id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${postType === option.id ? "bg-indigo-500 text-white" : "bg-slate-50 text-slate-600"}`}>
            {option.label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-3">
        {postType === "collaboration" ? (
          <>
            <Field label="What are you looking for?"><input className={fieldClass} value={form.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} required /></Field>
            <Field label="Country/market"><input className={fieldClass} value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
            <Field label="Industry"><input className={fieldClass} value={form.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
            <Field label="Optional deadline"><input type="date" className={fieldClass} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
          </>
        ) : null}
        {postType === "opportunity" || postType === "feedback" || postType === "question" || postType === "advice" ? (
          <Field label="Title"><input className={fieldClass} value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        ) : null}
        {(postType === "question" || postType === "advice" || postType === "market") ? (
          <Field label="Topic"><input className={fieldClass} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Marketing, pricing, AI…" /></Field>
        ) : null}
        <Field label="Description"><textarea className={fieldClass} rows={4} value={form.text} onChange={(e) => set("text", e.target.value)} required /></Field>
        <Field label="Optional image">
          <input type="file" accept="image/*" onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const url = await uploadClubImage(file);
            set("imageUrl", url);
          }} />
        </Field>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <PrimaryButton type="submit" disabled={saving}>{saving ? "Publishing…" : "Publish"}</PrimaryButton>
      </form>
    </ClubCard>
  );
}

function PostCard({ post, onChange }: { post: ClubPost; onChange: () => Promise<void> }) {
  const [text, setText] = useState("");
  const [reporting, setReporting] = useState(false);

  return (
    <ClubCard>
      <div className="flex items-start gap-3">
        <ClubAvatar name={post.author.fullName} photoUrl={post.author.photoUrl} logoUrl={post.author.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{post.author.fullName}</p>
            <StatusBadge>{POST_LABELS[post.postType] || post.postType}</StatusBadge>
          </div>
          <p className="text-sm text-slate-500">
            {post.author.businessName} · {countryFlag(post.author.country)} {post.author.country} · {formatWhen(post.createdAt)}
          </p>
        </div>
      </div>
      {post.title ? <h3 className="mt-3 text-lg font-bold">{post.title}</h3> : null}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.text}</p>
      {post.lookingFor ? <p className="mt-2 text-sm text-slate-600">Looking for: {post.lookingFor}</p> : null}
      {post.imageUrl ? <img src={post.imageUrl} alt="" className="mt-3 max-h-80 w-full rounded-2xl object-cover" /> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <GhostButton type="button" onClick={() => clubSend("post", `/club/posts/${post._id}/react`).then(onChange)}>Like · {post.likeCount}</GhostButton>
        <GhostButton type="button" onClick={() => clubSend("post", `/club/posts/${post._id}/save`).then(onChange)}>{post.savedByMe ? "Saved" : "Save"}</GhostButton>
        <GhostButton type="button" onClick={() => setReporting((value) => !value)}>Report</GhostButton>
      </div>
      {reporting ? (
        <form className="mt-2 flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          const reason = new FormData(event.currentTarget).get("reason");
          void clubSend("post", `/club/posts/${post._id}/report`, { reason }).then(() => setReporting(false));
        }}>
          <input name="reason" className={fieldClass} placeholder="Why are you reporting this?" required />
          <PrimaryButton type="submit">Send</PrimaryButton>
        </form>
      ) : null}
      <div className="mt-4 space-y-2">
        {post.comments.map((comment: ClubComment) => (
          <div key={comment._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <span className="font-semibold">{comment.author.fullName}</span>
            <span className="text-slate-500"> · {comment.author.businessName}</span>
            <p className="mt-1 text-slate-700">{comment.text}</p>
          </div>
        ))}
        <form className="flex gap-2" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/posts/${post._id}/comments`, { text }).then(() => {
            setText("");
            return onChange();
          });
        }}>
          <input className={fieldClass} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment" />
          <PrimaryButton type="submit">Comment</PrimaryButton>
        </form>
      </div>
    </ClubCard>
  );
}
