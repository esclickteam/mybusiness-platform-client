import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    }).catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, t]);

  if (!isMember) return <EmptyState title={t("club.connections.membersOnlyTitle")} text={t("club.connections.membersOnlyText")} />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("club.connections.title")}</h2>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Section title={t("club.connections.pending")}>
        {pending.length === 0 ? <p className="text-sm text-slate-500">{t("club.connections.nonePending")}</p> : null}
        {pending.map((row) => (
          <Row
            key={row._id}
            member={row.member}
            base={base}
            extra={row.direction === "incoming" ? t("club.connections.wantsToConnect") : t("club.common.pending")}
          >
            {row.direction === "incoming" ? (
              <>
                <PrimaryButton type="button" onClick={() => clubSend("post", `/club/connections/${row._id}/accept`).then(load)}>{t("club.connections.accept")}</PrimaryButton>
                <GhostButton type="button" onClick={() => clubSend("post", `/club/connections/${row._id}/decline`).then(load)}>{t("club.connections.decline")}</GhostButton>
              </>
            ) : <GhostButton type="button" disabled>{t("club.common.pending")}</GhostButton>}
          </Row>
        ))}
      </Section>
      <Section title={t("club.connections.mine")}>
        {connections.length === 0 ? <p className="text-sm text-slate-500">{t("club.connections.noneMine")}</p> : null}
        {connections.map((row) => (
          <Row key={row._id} member={row.member} base={base}>
            <GhostButton type="button" disabled>{t("club.common.connected")}</GhostButton>
          </Row>
        ))}
      </Section>
      <Section title={t("club.connections.suggested")}>
        {suggestions.length === 0 ? <p className="text-sm text-slate-500">{t("club.connections.noneSuggested")}</p> : null}
        {suggestions.map((member) => (
          <Row
            key={member.userId}
            member={member}
            base={base}
            extra={member.matchReasons?.[0] ? t(`club.matchReasons.${member.matchReasons[0]}`, { defaultValue: member.matchReasons[0] }) : undefined}
          >
            <PrimaryButton type="button" onClick={() => clubSend("post", "/club/connections", { userId: member.userId }).then(load)}>{t("club.common.connect")}</PrimaryButton>
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
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center">
      <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{member.fullName}</p>
        <p className="text-sm text-slate-500">
          {member.businessName} · {countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}
        </p>
        {extra ? <p className="text-xs text-indigo-600">{extra}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={`${base}/members/${member.userId}`}><GhostButton type="button">{t("club.common.viewProfile")}</GhostButton></Link>
        {children}
      </div>
    </div>
  );
}
