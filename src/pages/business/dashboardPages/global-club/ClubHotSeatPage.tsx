import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubMemberText, ClubSectionTitle, EmptyState, Field, PrimaryButton, countryFlag, fieldClass, formatWhen } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

type Seat = {
  _id: string;
  status: string;
  createdAt: string;
  mainChallenge?: string;
  member: ClubAuthor;
  mine?: boolean;
};

type SeatDetail = {
  hotSeat: Seat & {
    businessOverview?: string;
    currentMarketing?: string;
    currentSales?: string;
    pricing?: string;
    goals?: string;
    helpNeeded?: string;
    mine: boolean;
  };
  responses: Array<{ _id: string; feedback: string; createdAt: string; author: ClubAuthor }>;
};

export default function ClubHotSeatPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isMember, base } = useClub();
  if (!isMember) return <EmptyState title={t("club.hotSeat.membersOnlyTitle")} text={t("club.hotSeat.membersOnlyText")} />;
  if (id) return <HotSeatDetail id={id} base={base} />;
  return <HotSeatList base={base} />;
}

function HotSeatList({ base }: { base: string }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    clubGet<{ hotSeats: Seat[] }>("/club/hot-seats")
      .then((data) => setSeats(data.hotSeats || []))
      .catch((err) => setError(clubError(err, t)));
  }, [t]);
  return (
    <div className="space-y-4">
      <ClubSectionTitle title={t("club.hotSeat.title")} subtitle={t("club.hotSeat.subtitle")} />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {seats.length === 0 ? <EmptyState title={t("club.hotSeat.emptyTitle")} text={t("club.hotSeat.emptyText")} /> : null}
      {seats.map((seat) => (
        <ClubCard key={seat._id}>
          <p className="text-sm text-slate-500">
            {formatWhen(seat.createdAt, locale)} · {t(`club.hotSeat.status.${seat.status}`, { defaultValue: seat.status })}
          </p>
          <h3 className="mt-1 text-lg font-bold">{seat.member.businessName || seat.member.fullName}</h3>
          <p className="text-sm text-slate-600">
            {seat.member.fullName} · {countryFlag(seat.member.country)} {t(`club.countries.${seat.member.country}`, { defaultValue: seat.member.country })}
          </p>
          {seat.mainChallenge ? <ClubMemberText className="mt-2 text-sm text-slate-700" text={seat.mainChallenge} /> : null}
          <Link to={`${base}/hot-seat/${seat._id}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600">{t("club.hotSeat.openDiscussion")}</Link>
        </ClubCard>
      ))}
    </div>
  );
}

function HotSeatDetail({ id, base }: { id: string; base: string }) {
  const { t } = useTranslation();
  const [data, setData] = useState<SeatDetail | null>(null);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [brief, setBrief] = useState({
    businessOverview: "",
    mainChallenge: "",
    currentMarketing: "",
    currentSales: "",
    pricing: "",
    goals: "",
    helpNeeded: "",
  });

  function load() {
    clubGet<SeatDetail>(`/club/hot-seats/${id}`)
      .then((next) => {
        setData(next);
        const seat = next.hotSeat;
        setBrief({
          businessOverview: seat.businessOverview || "",
          mainChallenge: seat.mainChallenge || "",
          currentMarketing: seat.currentMarketing || "",
          currentSales: seat.currentSales || "",
          pricing: seat.pricing || "",
          goals: seat.goals || "",
          helpNeeded: seat.helpNeeded || "",
        });
      })
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    load();
  }, [id, t]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">{t("club.hotSeat.loading")}</p>;
  const seat = data.hotSeat;

  async function saveBrief(event: FormEvent) {
    event.preventDefault();
    await clubSend("put", `/club/hot-seats/${id}/brief`, brief);
    load();
  }

  return (
    <div className="space-y-4">
      <Link to={`${base}/hot-seat`} className="text-sm font-semibold text-indigo-600">{t("club.hotSeat.all")}</Link>
      <ClubCard>
        <h2 className="text-2xl font-bold">{seat.member.businessName || seat.member.fullName}</h2>
        <p className="text-sm text-slate-500">
          {seat.member.fullName} · {countryFlag(seat.member.country)} {t(`club.countries.${seat.member.country}`, { defaultValue: seat.member.country })}
        </p>
        {seat.mine ? (
          <form onSubmit={saveBrief} className="mt-4 grid gap-3">
            <BriefField label={t("club.hotSeat.fields.overview")} value={brief.businessOverview} onChange={(value) => setBrief({ ...brief, businessOverview: value })} />
            <BriefField label={t("club.hotSeat.fields.challenge")} value={brief.mainChallenge} onChange={(value) => setBrief({ ...brief, mainChallenge: value })} />
            <BriefField label={t("club.hotSeat.fields.marketing")} value={brief.currentMarketing} onChange={(value) => setBrief({ ...brief, currentMarketing: value })} />
            <BriefField label={t("club.hotSeat.fields.sales")} value={brief.currentSales} onChange={(value) => setBrief({ ...brief, currentSales: value })} />
            <BriefField label={t("club.hotSeat.fields.pricing")} value={brief.pricing} onChange={(value) => setBrief({ ...brief, pricing: value })} />
            <BriefField label={t("club.hotSeat.fields.goals")} value={brief.goals} onChange={(value) => setBrief({ ...brief, goals: value })} />
            <BriefField label={t("club.hotSeat.fields.help")} value={brief.helpNeeded} onChange={(value) => setBrief({ ...brief, helpNeeded: value })} />
            <PrimaryButton type="submit">{t("club.hotSeat.saveBrief")}</PrimaryButton>
          </form>
        ) : (
          <div className="mt-4 grid gap-3">
            <Read label={t("club.hotSeat.fields.overview")} text={seat.businessOverview} />
            <Read label={t("club.hotSeat.fields.challenge")} text={seat.mainChallenge} />
            <Read label={t("club.hotSeat.fields.marketing")} text={seat.currentMarketing} />
            <Read label={t("club.hotSeat.fields.sales")} text={seat.currentSales} />
            <Read label={t("club.hotSeat.fields.pricing")} text={seat.pricing} />
            <Read label={t("club.hotSeat.fields.goals")} text={seat.goals} />
            <Read label={t("club.hotSeat.fields.help")} text={seat.helpNeeded} />
          </div>
        )}
      </ClubCard>
      <ClubCard>
        <h3 className="font-bold">{t("club.hotSeat.feedback")}</h3>
        <div className="mt-3 space-y-3">
          {data.responses.map((response) => (
            <div key={response._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p className="font-semibold">{response.author.fullName} · {response.author.businessName}</p>
              <ClubMemberText className="mt-1 text-slate-700" text={response.feedback} />
            </div>
          ))}
        </div>
        {seat.status === "open" ? (
          <form className="mt-3 grid gap-2" onSubmit={(event) => {
            event.preventDefault();
            void clubSend("post", `/club/hot-seats/${id}/feedback`, { feedback }).then(() => {
              setFeedback("");
              load();
            });
          }}>
            <Field label={t("club.hotSeat.suggestion")}><textarea className={fieldClass} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></Field>
            <PrimaryButton type="submit">{t("club.hotSeat.share")}</PrimaryButton>
          </form>
        ) : null}
      </ClubCard>
    </div>
  );
}

function BriefField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><textarea className={fieldClass} rows={3} value={value} onChange={(e) => onChange(e.target.value)} /></Field>;
}

function Read({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <ClubMemberText className="mt-1 text-sm text-slate-700" text={text} />
    </div>
  );
}
