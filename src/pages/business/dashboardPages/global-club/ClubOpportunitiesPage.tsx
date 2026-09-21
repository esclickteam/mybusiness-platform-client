import { FormEvent, useEffect, useState } from "react";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, EmptyState, Field, PrimaryButton, StatusBadge, fieldClass, formatWhen } from "./clubUi";

const TYPES = [
  ["client", "Client opportunities"],
  ["project", "Projects"],
  ["partnership", "Partnerships"],
  ["supplier", "Supplier requests"],
  ["expansion", "Market expansion"],
  ["referral", "Business referrals"],
  ["collaboration", "Collaboration"],
];

type Opportunity = {
  _id: string;
  title: string;
  description: string;
  country?: string;
  industry?: string;
  opportunityType: string;
  createdAt: string;
  author: ClubAuthor;
};

export default function ClubOpportunitiesPage() {
  const { isMember } = useClub();
  const [rows, setRows] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState({ country: "", industry: "", type: "", from: "", to: "" });
  const [form, setForm] = useState({ title: "", description: "", country: "", industry: "", opportunityType: "partnership" });
  const [error, setError] = useState("");

  function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    clubGet<{ opportunities: Opportunity[] }>("/club/opportunities", params)
      .then((data) => setRows(data.opportunities || []))
      .catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, filters]);

  if (!isMember) return <EmptyState title="Members only" text="Opportunities are shared with active Club members." />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/opportunities", form);
    setForm({ title: "", description: "", country: "", industry: "", opportunityType: "partnership" });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Business Opportunities</h2>
      <ClubCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Country"><input className={fieldClass} value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} /></Field>
          <Field label="Industry"><input className={fieldClass} value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })} /></Field>
          <Field label="Opportunity type">
            <select className={fieldClass} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All</option>
              {TYPES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </Field>
          <Field label="From"><input type="date" className={fieldClass} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></Field>
          <Field label="To"><input type="date" className={fieldClass} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></Field>
        </div>
      </ClubCard>
      <ClubCard>
        <h3 className="font-semibold">Post an opportunity</h3>
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Title"><input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Type">
            <select className={fieldClass} value={form.opportunityType} onChange={(e) => setForm({ ...form, opportunityType: e.target.value })}>
              {TYPES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </Field>
          <Field label="Country"><input className={fieldClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="Industry"><input className={fieldClass} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><textarea className={fieldClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field></div>
          <PrimaryButton type="submit">Publish opportunity</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {rows.length === 0 ? <EmptyState title="No opportunities yet" text="Client work, partnerships, suppliers, and referrals will show up here." /> : null}
      {rows.map((row) => (
        <ClubCard key={row._id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">{row.title}</h3>
            <StatusBadge>{TYPES.find(([id]) => id === row.opportunityType)?.[1] || row.opportunityType}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{row.author.fullName} · {row.country} · {row.industry} · {formatWhen(row.createdAt)}</p>
          <p className="mt-2 text-sm text-slate-700">{row.description}</p>
        </ClubCard>
      ))}
    </div>
  );
}
