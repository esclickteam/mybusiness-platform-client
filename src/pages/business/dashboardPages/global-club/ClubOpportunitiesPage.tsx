import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubSectionTitle, EmptyState, Field, PrimaryButton, fieldClass } from "./clubUi";
import { ClubOpportunityCard } from "./clubCards";

const TYPES = ["client", "project", "partnership", "supplier", "expansion", "referral", "collaboration"] as const;

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
  const { t } = useTranslation();
  const { isMember, base } = useClub();
  const [rows, setRows] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState({ country: "", industry: "", type: "", from: "", to: "" });
  const [form, setForm] = useState({ title: "", description: "", country: "", industry: "", opportunityType: "partnership" });
  const [error, setError] = useState("");

  function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    clubGet<{ opportunities: Opportunity[] }>("/club/opportunities", params)
      .then((data) => setRows(data.opportunities || []))
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, filters, t]);

  if (!isMember) return <EmptyState title={t("club.opportunities.membersOnlyTitle")} text={t("club.opportunities.membersOnlyText")} />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await clubSend("post", "/club/opportunities", form);
    setForm({ title: "", description: "", country: "", industry: "", opportunityType: "partnership" });
    load();
  }

  return (
    <div className="space-y-4">
      <ClubSectionTitle title={t("club.opportunities.title")} />
      <ClubCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("club.opportunities.country")}><input className={fieldClass} value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} /></Field>
          <Field label={t("club.opportunities.industry")}><input className={fieldClass} value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })} /></Field>
          <Field label={t("club.opportunities.type")}>
            <select className={fieldClass} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">{t("club.opportunities.all")}</option>
              {TYPES.map((id) => <option key={id} value={id}>{t(`club.opportunities.types.${id}`)}</option>)}
            </select>
          </Field>
          <Field label={t("club.opportunities.from")}><input type="date" className={fieldClass} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></Field>
          <Field label={t("club.opportunities.to")}><input type="date" className={fieldClass} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></Field>
        </div>
      </ClubCard>
      <ClubCard>
        <h3 className="font-semibold">{t("club.opportunities.postTitle")}</h3>
        <form onSubmit={onSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={t("club.opportunities.titleField")}><input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label={t("club.opportunities.typeField")}>
            <select className={fieldClass} value={form.opportunityType} onChange={(e) => setForm({ ...form, opportunityType: e.target.value })}>
              {TYPES.map((id) => <option key={id} value={id}>{t(`club.opportunities.types.${id}`)}</option>)}
            </select>
          </Field>
          <Field label={t("club.opportunities.country")}><input className={fieldClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label={t("club.opportunities.industry")}><input className={fieldClass} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label={t("club.opportunities.description")}><textarea className={fieldClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field></div>
          <PrimaryButton type="submit">{t("club.opportunities.publish")}</PrimaryButton>
        </form>
      </ClubCard>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {rows.length === 0 ? <EmptyState title={t("club.opportunities.emptyTitle")} text={t("club.opportunities.emptyText")} /> : null}
      {rows.map((row) => (
        <ClubOpportunityCard key={row._id} row={row} base={base} />
      ))}
    </div>
  );
}
