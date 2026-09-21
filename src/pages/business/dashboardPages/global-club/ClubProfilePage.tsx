import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClubPost, ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubAvatar, ClubCard, EmptyState, Field, GhostButton, POST_LABELS, PrimaryButton, countryFlag, fieldClass, formatWhen } from "./clubUi";

type ProfileResponse = {
  member: ClubProfile | null;
  posts: ClubPost[];
  connection: "none" | "pending" | "incoming" | "connected";
};

export default function ClubProfilePage() {
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
      .catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, userId]);

  if (!isMember) return <EmptyState title="Members only" text="Profiles are private to the Club." />;
  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data?.member) return <p className="text-sm text-slate-500">Loading profile…</p>;

  const member = data.member;
  const mine = me?.profile?.userId === member.userId;
  const connectionLabel = data.connection === "connected" ? "Connected" : data.connection === "pending" ? "Pending" : "Connect";

  return (
    <div className="space-y-4">
      <ClubCard>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="lg" />
          {member.logoUrl && member.photoUrl ? <img src={member.logoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-violet-100" /> : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{member.fullName}</h2>
            <p className="text-slate-600">{member.businessName}</p>
            <p className="text-sm text-slate-500">{countryFlag(member.country)} {member.country} · {member.industry || member.businessCategory}</p>
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
            })}>Send Message</GhostButton>
          ) : null}
          {!mine ? <GhostButton type="button" onClick={() => setSuggestOpen(true)}>Suggest Collaboration</GhostButton> : null}
        </div>
        <ProfileBlock title="Business description" text={member.description} />
        <ProfileBlock title="Services and products" text={(member.services || []).join(", ")} />
        <ProfileBlock title="Markets they operate in" text={(member.marketsOperate || []).join(", ")} />
        <ProfileBlock title="Markets they want to enter" text={(member.marketsEnter || []).join(", ")} />
        <ProfileBlock title="What they can offer other members" text={member.offer} />
        <ProfileBlock title="What they are currently looking for" text={member.lookingFor} />
      </ClubCard>
      {mine ? <ProfileEditor member={member} onSaved={load} /> : null}
      {suggestOpen ? (
        <SuggestForm userId={member.userId} onDone={() => setSuggestOpen(false)} />
      ) : null}
      <h3 className="text-lg font-bold">Recent Club posts</h3>
      {data.posts.length === 0 ? <EmptyState title="No posts yet" text="This member has not published in the Club." /> : null}
      {data.posts.map((post) => (
        <ClubCard key={post._id}>
          <p className="text-xs font-semibold text-indigo-600">{POST_LABELS[post.postType] || post.postType}</p>
          <p className="mt-1 text-sm text-slate-700">{post.text}</p>
          <p className="mt-2 text-xs text-slate-400">{formatWhen(post.createdAt)}</p>
        </ClubCard>
      ))}
      <Link to={`${base}/directory`} className="text-sm font-semibold text-indigo-600">Back to directory</Link>
    </div>
  );
}

function ProfileBlock({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function ProfileEditor({ member, onSaved }: { member: ClubProfile; onSaved: () => void }) {
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
    setSaved("Profile saved.");
    onSaved();
  }

  return (
    <ClubCard>
      <h3 className="text-lg font-bold">Edit your Club profile</h3>
      <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
        {(["fullName", "businessName", "country", "industry", "businessCategory", "website", "logoUrl", "photoUrl"] as const).map((field) => (
          <Field key={field} label={field}>
            <input className={fieldClass} value={String(form[field] || "")} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </Field>
        ))}
        <div className="sm:col-span-2"><Field label="Description"><textarea className={fieldClass} rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
        <Field label="What you offer"><textarea className={fieldClass} rows={3} value={form.offer || ""} onChange={(e) => setForm({ ...form, offer: e.target.value })} /></Field>
        <Field label="What you are looking for"><textarea className={fieldClass} rows={3} value={form.lookingFor || ""} onChange={(e) => setForm({ ...form, lookingFor: e.target.value })} /></Field>
        <Field label="Markets you operate in"><input className={fieldClass} value={form.marketsOperate} onChange={(e) => setForm({ ...form, marketsOperate: e.target.value })} /></Field>
        <Field label="Markets you want to enter"><input className={fieldClass} value={form.marketsEnter} onChange={(e) => setForm({ ...form, marketsEnter: e.target.value })} /></Field>
        {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}
        <PrimaryButton type="submit">Save profile</PrimaryButton>
      </form>
    </ClubCard>
  );
}

function SuggestForm({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <ClubCard>
      <h3 className="font-bold">Suggest a collaboration</h3>
      <form className="mt-3 grid gap-3" onSubmit={(event) => {
        event.preventDefault();
        void clubSend("post", "/club/collaborations", { title, description, targetUserId: userId, needed: title }).then(onDone);
      }}>
        <Field label="Title"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
        <Field label="Description"><textarea className={fieldClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required /></Field>
        <div className="flex gap-2">
          <PrimaryButton type="submit">Send suggestion</PrimaryButton>
          <GhostButton type="button" onClick={onDone}>Cancel</GhostButton>
        </div>
      </form>
    </ClubCard>
  );
}
