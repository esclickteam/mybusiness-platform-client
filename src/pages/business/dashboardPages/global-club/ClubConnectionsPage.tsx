import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClubAuthor, ClubProfile, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubAvatar, ClubCard, EmptyState, GhostButton, PrimaryButton, countryFlag } from "./clubUi";

type ConnectionRow = {
  _id: string;
  status: string;
  direction: "incoming" | "outgoing";
  member: ClubAuthor;
};

export default function ClubConnectionsPage() {
  const { base, isMember } = useClub();
  const [connections, setConnections] = useState<ConnectionRow[]>([]);
  const [pending, setPending] = useState<ConnectionRow[]>([]);
  const [suggestions, setSuggestions] = useState<ClubProfile[]>([]);
  const [error, setError] = useState("");

  function load() {
    Promise.all([
      clubGet<{ connections: ConnectionRow[]; pending: ConnectionRow[] }>("/club/connections"),
      clubGet<{ suggestions: ClubProfile[] }>("/club/suggestions"),
    ]).then(([links, ideas]) => {
      setConnections(links.connections || []);
      setPending(links.pending || []);
      setSuggestions(ideas.suggestions || []);
    }).catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember]);

  if (!isMember) return <EmptyState title="Members only" text="Connections are private to active Club members." />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Connections</h2>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Section title="Pending Requests">
        {pending.length === 0 ? <p className="text-sm text-slate-500">No pending requests.</p> : null}
        {pending.map((row) => (
          <Row key={row._id} member={row.member} base={base} extra={row.direction === "incoming" ? "Wants to connect" : "Pending"}>
            {row.direction === "incoming" ? (
              <>
                <PrimaryButton type="button" onClick={() => clubSend("post", `/club/connections/${row._id}/accept`).then(load)}>Accept</PrimaryButton>
                <GhostButton type="button" onClick={() => clubSend("post", `/club/connections/${row._id}/decline`).then(load)}>Decline</GhostButton>
              </>
            ) : <GhostButton type="button" disabled>Pending</GhostButton>}
          </Row>
        ))}
      </Section>
      <Section title="My Connections">
        {connections.length === 0 ? <p className="text-sm text-slate-500">You have not connected with anyone yet.</p> : null}
        {connections.map((row) => (
          <Row key={row._id} member={row.member} base={base}>
            <GhostButton type="button" disabled>Connected</GhostButton>
          </Row>
        ))}
      </Section>
      <Section title="Suggested Connections">
        {suggestions.length === 0 ? <p className="text-sm text-slate-500">Suggestions use industry, markets, and what members offer.</p> : null}
        {suggestions.map((member) => (
          <Row key={member.userId} member={member} base={base} extra={member.matchReasons?.[0]}>
            <PrimaryButton type="button" onClick={() => clubSend("post", "/club/connections", { userId: member.userId }).then(load)}>Connect</PrimaryButton>
          </Row>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <ClubCard>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </ClubCard>
  );
}

function Row({
  member,
  base,
  extra,
  children,
}: {
  member: ClubAuthor;
  base: string;
  extra?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
      <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{member.fullName}</p>
        <p className="text-sm text-slate-500">{member.businessName} · {countryFlag(member.country)} {member.country}</p>
        {extra ? <p className="text-xs text-indigo-600">{extra}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={`${base}/members/${member.userId}`}><GhostButton type="button">View Profile</GhostButton></Link>
        {children}
      </div>
    </div>
  );
}
