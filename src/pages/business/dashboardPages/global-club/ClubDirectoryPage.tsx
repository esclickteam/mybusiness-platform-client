import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { CATEGORIES, COUNTRIES, ClubAvatar, ClubCard, EmptyState, Field, GhostButton, PrimaryButton, countryFlag, fieldClass } from "./clubUi";

export default function ClubDirectoryPage() {
  const { base, isMember } = useClub();
  const [filters, setFilters] = useState({ q: "", country: "", industry: "", category: "", offer: "", lookingFor: "" });
  const [members, setMembers] = useState<ClubProfile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isMember) return;
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    clubGet<{ members: ClubProfile[] }>("/club/members", params)
      .then((data) => setMembers(data.members || []))
      .catch((err) => setError(clubError(err)));
  }, [isMember, filters]);

  if (!isMember) return <EmptyState title="Members only" text="The directory is visible to active Club members." />;

  function set(field: string, value: string) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Members</h2>
      <ClubCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Search"><input className={fieldClass} value={filters.q} onChange={(e) => set("q", e.target.value)} placeholder="Name, business, offer" /></Field>
          <Field label="Country">
            <select className={fieldClass} value={filters.country} onChange={(e) => set("country", e.target.value)}>
              <option value="">All countries</option>
              {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
            </select>
          </Field>
          <Field label="Industry"><input className={fieldClass} value={filters.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
          <Field label="Business category">
            <select className={fieldClass} value={filters.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
          <Field label="What they offer"><input className={fieldClass} value={filters.offer} onChange={(e) => set("offer", e.target.value)} /></Field>
          <Field label="What they are looking for"><input className={fieldClass} value={filters.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} /></Field>
        </div>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {members.length === 0 ? <EmptyState title="No members match" text="Try a wider search or another country." /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {members.map((member) => (
          <ClubCard key={member.userId}>
            <div className="flex gap-3">
              <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} />
              <div className="min-w-0">
                <p className="font-bold">{member.fullName}</p>
                <p className="text-sm text-slate-600">{member.businessName}</p>
                <p className="text-sm text-slate-500">{countryFlag(member.country)} {member.country} · {member.businessCategory}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-slate-700">{member.description}</p>
            <p className="mt-2 text-sm"><span className="font-semibold">Offers: </span>{member.offer}</p>
            <p className="text-sm"><span className="font-semibold">Looking for: </span>{member.lookingFor}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`${base}/members/${member.userId}`}><GhostButton type="button">View Profile</GhostButton></Link>
              <PrimaryButton type="button" onClick={() => clubSend("post", "/club/connections", { userId: member.userId })}>Connect</PrimaryButton>
              <Link to={`${base}/messages`} onClick={() => { void clubSend("post", "/club/messages", { userId: member.userId }); }}>
                <GhostButton type="button">Message</GhostButton>
              </Link>
            </div>
          </ClubCard>
        ))}
      </div>
    </div>
  );
}
