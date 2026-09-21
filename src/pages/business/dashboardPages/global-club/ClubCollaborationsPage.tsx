import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubMemberText, EmptyState, Field, PrimaryButton, StatusBadge, fieldClass, formatWhen } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

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

export default function ClubCollaborationsPage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { isMember } = useClub();
  const [rows, setRows] = useState<Collaboration[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", country: "", industry: "", needed: "", deadline: "" });

  function load() {
    clubGet<{ collaborations: Collaboration[] }>("/club/collaborations")
      .then((data) => setRows(data.collaborations || []))
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, t]);

  if (!isMember) return <EmptyState title={t("club.collaborations.membersOnlyTitle")} text={t("club.collaborations.membersOnlyText")} />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/collaborations", form);
    setForm({ title: "", description: "", country: "", industry: "", needed: "", deadline: "" });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("club.collaborations.title")}</h2>
      <ClubCard>
        <h3 className="font-semibold">{t("club.collaborations.publishTitle")}</h3>
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={t("club.collaborations.titleField")}><input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder={t("club.collaborations.titlePlaceholder")} /></Field>
          <Field label={t("club.collaborations.needed")}><input className={fieldClass} value={form.needed} onChange={(e) => setForm({ ...form, needed: e.target.value })} placeholder={t("club.collaborations.neededPlaceholder")} /></Field>
          <Field label={t("club.collaborations.country")}><input className={fieldClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label={t("club.collaborations.industry")}><input className={fieldClass} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label={t("club.collaborations.description")}><textarea className={fieldClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field></div>
          <PrimaryButton type="submit">{t("club.collaborations.publish")}</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {rows.length === 0 ? <EmptyState title={t("club.collaborations.emptyTitle")} text={t("club.collaborations.emptyText")} /> : null}
      {rows.map((row) => <CollaborationCard key={row._id} row={row} locale={locale} />)}
    </div>
  );
}

function CollaborationCard({ row, locale }: { row: Collaboration; locale: string }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState("");
  return (
    <ClubCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ClubMemberText className="text-lg font-bold" text={row.title} />
        <StatusBadge>{t(`club.collaborations.status.${row.status}`, { defaultValue: row.status })}</StatusBadge>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {row.author.fullName} · {row.author.businessName} · {t(`club.countries.${row.country}`, { defaultValue: row.country })} · {row.industry} · {formatWhen(row.createdAt, locale)}
      </p>
      <ClubMemberText className="mt-2 text-sm text-slate-700" text={row.description} />
      {row.needed ? <p className="mt-2 text-sm"><span className="font-semibold">{t("club.collaborations.neededLabel")}</span>{row.needed}</p> : null}
      {row.status !== "closed" ? (
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
          event.preventDefault();
          void clubSend("post", `/club/collaborations/${row._id}/responses`, { message }).then(() => {
            setMessage("");
            setSent(t("club.collaborations.sent"));
          });
        }}>
          <input className={fieldClass} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("club.collaborations.respondPlaceholder")} />
          <PrimaryButton type="submit">{t("club.collaborations.respond")}</PrimaryButton>
        </form>
      ) : null}
      {sent ? <p className="mt-2 text-sm text-emerald-700">{sent}</p> : null}
    </ClubCard>
  );
}
