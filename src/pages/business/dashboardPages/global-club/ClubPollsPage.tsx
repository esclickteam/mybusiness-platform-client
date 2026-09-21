import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubCard, ClubMemberText, EmptyState, Field, PrimaryButton, fieldClass, formatWhen } from "./clubUi";
import { getIntlLocale } from "../../../../i18n/localeUtils";

type PollOption = { _id: string; label: string; votes: number | null };
type Poll = {
  _id: string;
  title: string;
  question: string;
  status: string;
  createdAt: string;
  voted: boolean;
  myOptionId: string | null;
  options: PollOption[];
};
type Comment = { _id: string; text: string; createdAt: string; author: ClubAuthor };

export default function ClubPollsPage() {
  const { t } = useTranslation();
  const { isMember } = useClub();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState("");

  function load() {
    clubGet<{ polls: Poll[] }>("/club/polls")
      .then((data) => setPolls(data.polls || []))
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) load();
  }, [isMember, t]);

  if (!isMember) return <EmptyState title={t("club.polls.membersOnlyTitle")} text={t("club.polls.membersOnlyText")} />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{t("club.polls.title")}</h2>
        <p className="text-sm text-slate-500">{t("club.polls.subtitle")}</p>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {polls.length === 0 ? <EmptyState title={t("club.polls.emptyTitle")} text={t("club.polls.emptyText")} /> : null}
      {polls.map((poll) => <PollCard key={poll._id} poll={poll} onVoted={load} />)}
    </div>
  );
}

function PollCard({ poll, onVoted }: { poll: Poll; onVoted: () => void }) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const total = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);

  useEffect(() => {
    clubGet<{ comments: Comment[] }>(`/club/polls/${poll._id}/comments`).then((data) => setComments(data.comments || [])).catch(() => {});
  }, [poll._id]);

  return (
    <ClubCard>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{formatWhen(poll.createdAt, locale)}</p>
      <ClubMemberText className="mt-1 text-lg font-bold" text={poll.title} />
      <ClubMemberText className="mt-1 text-sm text-slate-600" text={poll.question} />
      <div className="mt-4 space-y-2">
        {poll.options.map((option) => {
          const width = option.votes == null || total === 0 ? 0 : Math.round((option.votes / total) * 100);
          return (
            <button
              key={option._id}
              type="button"
              disabled={poll.voted || poll.status !== "open"}
              onClick={() => clubSend("post", `/club/polls/${poll._id}/vote`, { optionId: option._id }).then(onVoted)}
              className="relative w-full overflow-hidden rounded-xl border border-slate-200 px-3 py-2 text-start text-sm disabled:cursor-default"
            >
              {option.votes != null ? <span className="absolute inset-y-0 start-0 bg-indigo-50" style={{ width: `${width}%` }} /> : null}
              <span className="relative flex items-center justify-between gap-3">
                <span className={poll.myOptionId === option._id ? "font-bold" : ""}>{option.label}</span>
                {option.votes != null ? <span>{width}%</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event: FormEvent) => {
        event.preventDefault();
        void clubSend("post", `/club/polls/${poll._id}/comments`, { text }).then(() => {
          setText("");
          return clubGet<{ comments: Comment[] }>(`/club/polls/${poll._id}/comments`);
        }).then((data) => setComments(data.comments || []));
      }}>
        <Field label={t("club.polls.comment")}>
          <input className={fieldClass} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <PrimaryButton type="submit" className="sm:self-end">{t("club.polls.comment")}</PrimaryButton>
      </form>
      <div className="mt-3 space-y-2">
        {comments.map((comment) => (
          <div key={comment._id} className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{comment.author.fullName}: </span>
            <ClubMemberText className="inline" text={comment.text} />
          </div>
        ))}
      </div>
    </ClubCard>
  );
}
