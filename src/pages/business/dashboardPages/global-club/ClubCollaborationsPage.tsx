import { FormEvent, useEffect, useState } from "react";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, EmptyState, Field, PrimaryButton, StatusBadge, fieldClass, formatWhen } from "./clubUi";

type Collaboration = {
  _id: string;
  title: string;
  description: string;
  country?: string;
  industry?: string;
  needed?: string;
  status: string;
  createdAt: string;
  author: ClubAuthor;
};

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_discussion: "In Discussion",
  closed: "Closed",
};

export default function ClubCollaborationsPage() {
  const { isMember } = useClub();
  const [rows, setRows] = useState<Collaboration[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", country: "", industry: "", needed: "", deadline: "" });

  function load() {
    clubGet<{ collaborations: Collaboration[] }>("/club/collaborations")
      .then((data) => setRows(data.collaborations || []))
      .catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember]);

  if (!isMember) return <EmptyState title="Members only" text="Collaboration requests are shared inside the Club." />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/collaborations", form);
    setForm({ title: "", description: "", country: "", industry: "", needed: "", deadline: "" });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Collaborations</h2>
      <ClubCard>
        <h3 className="font-semibold">Publish a collaboration request</h3>
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Title"><input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Looking for a local partner" /></Field>
          <Field label="What is needed"><input className={fieldClass} value={form.needed} onChange={(e) => setForm({ ...form, needed: e.target.value })} placeholder="Supplier, developer, referrals…" /></Field>
          <Field label="Country/market"><input className={fieldClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="Industry"><input className={fieldClass} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><textarea className={fieldClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field></div>
          <PrimaryButton type="submit">Publish</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {rows.length === 0 ? <EmptyState title="No open collaborations" text="Members can ask for partners, suppliers, distributors, or a joint project." /> : null}
      {rows.map((row) => <CollaborationCard key={row._id} row={row} />)}
    </div>
  );
}

function CollaborationCard({ row }: { row: Collaboration }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState("");
  return (
    <ClubCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{row.title}</h3>
        <StatusBadge>{STATUS_LABEL[row.status] || row.status}</StatusBadge>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {row.author.fullName} · {row.author.businessName} · {row.country} · {row.industry} · {formatWhen(row.createdAt)}
      </p>
      <p className="mt-2 text-sm text-slate-700">{row.description}</p>
      {row.needed ? <p className="mt-2 text-sm"><span className="font-semibold">Needed: </span>{row.needed}</p> : null}
      {row.status !== "closed" ? (
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/collaborations/${row._id}/responses`, { message }).then(() => {
            setMessage("");
            setSent("Response sent.");
          });
        }}>
          <input className={fieldClass} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Respond to this request" />
          <PrimaryButton type="submit">Respond</PrimaryButton>
        </form>
      ) : null}
      {sent ? <p className="mt-2 text-sm text-emerald-700">{sent}</p> : null}
    </ClubCard>
  );
}
