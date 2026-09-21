import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, EmptyState, Field, PrimaryButton, countryFlag, fieldClass, formatWhen } from "./clubUi";

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
  const { id } = useParams();
  const { isMember, base } = useClub();
  if (!isMember) return <EmptyState title="Members only" text="The Business Hot Seat is a private Club session." />;
  if (id) return <HotSeatDetail id={id} base={base} />;
  return <HotSeatList base={base} />;
}

function HotSeatList({ base }: { base: string }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    clubGet<{ hotSeats: Seat[] }>("/club/hot-seats")
      .then((data) => setSeats(data.hotSeats || []))
      .catch((err) => setError(clubError(err)));
  }, []);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Business Hot Seat</h2>
        <p className="text-sm text-slate-500">One member business is in the chair. Everyone else brings practical feedback.</p>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {seats.length === 0 ? <EmptyState title="No Hot Seat yet" text="An admin selects the next business for the chair." /> : null}
      {seats.map((seat) => (
        <ClubCard key={seat._id}>
          <p className="text-sm text-slate-500">{formatWhen(seat.createdAt)} · {seat.status}</p>
          <h3 className="mt-1 text-lg font-bold">{seat.member.businessName || seat.member.fullName}</h3>
          <p className="text-sm text-slate-600">{seat.member.fullName} · {countryFlag(seat.member.country)} {seat.member.country}</p>
          {seat.mainChallenge ? <p className="mt-2 text-sm text-slate-700">{seat.mainChallenge}</p> : null}
          <Link to={`${base}/hot-seat/${seat._id}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600">Open discussion</Link>
        </ClubCard>
      ))}
    </div>
  );
}

function HotSeatDetail({ id, base }: { id: string; base: string }) {
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
      .catch((err) => setError(clubError(err)));
  }

  useEffect(() => {
    load();
  }, [id]);

  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading Hot Seat…</p>;
  const seat = data.hotSeat;

  async function saveBrief(event: FormEvent) {
    event.preventDefault();
    await clubSend("put", `/club/hot-seats/${id}/brief`, brief);
    load();
  }

  return (
    <div className="space-y-4">
      <Link to={`${base}/hot-seat`} className="text-sm font-semibold text-indigo-600">All Hot Seats</Link>
      <ClubCard>
        <h2 className="text-2xl font-bold">{seat.member.businessName || seat.member.fullName}</h2>
        <p className="text-sm text-slate-500">{seat.member.fullName} · {countryFlag(seat.member.country)} {seat.member.country}</p>
        {seat.mine ? (
          <form onSubmit={saveBrief} className="mt-4 grid gap-3">
            <BriefField label="Business overview" value={brief.businessOverview} onChange={(value) => setBrief({ ...brief, businessOverview: value })} />
            <BriefField label="Main challenge" value={brief.mainChallenge} onChange={(value) => setBrief({ ...brief, mainChallenge: value })} />
            <BriefField label="Current marketing" value={brief.currentMarketing} onChange={(value) => setBrief({ ...brief, currentMarketing: value })} />
            <BriefField label="Current sales process" value={brief.currentSales} onChange={(value) => setBrief({ ...brief, currentSales: value })} />
            <BriefField label="Pricing" value={brief.pricing} onChange={(value) => setBrief({ ...brief, pricing: value })} />
            <BriefField label="Goals" value={brief.goals} onChange={(value) => setBrief({ ...brief, goals: value })} />
            <BriefField label="What they need help with" value={brief.helpNeeded} onChange={(value) => setBrief({ ...brief, helpNeeded: value })} />
            <PrimaryButton type="submit">Save brief</PrimaryButton>
          </form>
        ) : (
          <div className="mt-4 grid gap-3">
            <Read label="Business overview" text={seat.businessOverview} />
            <Read label="Main challenge" text={seat.mainChallenge} />
            <Read label="Current marketing" text={seat.currentMarketing} />
            <Read label="Current sales process" text={seat.currentSales} />
            <Read label="Pricing" text={seat.pricing} />
            <Read label="Goals" text={seat.goals} />
            <Read label="What they need help with" text={seat.helpNeeded} />
          </div>
        )}
      </ClubCard>
      <ClubCard>
        <h3 className="font-bold">Member feedback</h3>
        <div className="mt-3 space-y-3">
          {data.responses.map((response) => (
            <div key={response._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <p className="font-semibold">{response.author.fullName} · {response.author.businessName}</p>
              <p className="mt-1 text-slate-700">{response.feedback}</p>
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
            <Field label="Your suggestion"><textarea className={fieldClass} rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} /></Field>
            <PrimaryButton type="submit">Share feedback</PrimaryButton>
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
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm text-slate-700">{text}</p></div>;
}
