import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClubAuthor, clubError, clubGet, clubSend } from "./clubApi";
import { useClub } from "./GlobalBusinessClubPage";
import { ClubAvatar, ClubCard, ClubMemberText, EmptyState, PrimaryButton, fieldClass } from "./clubUi";

type Thread = { _id: string; lastMessageText?: string; member: ClubAuthor };
type Message = { _id: string; text: string; createdAt: string; mine: boolean };

export default function ClubMessagesPage() {
  const { t } = useTranslation();
  const { threadId } = useParams();
  const { base, isMember } = useClub();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [member, setMember] = useState<ClubAuthor | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function loadThreads() {
    clubGet<{ threads: Thread[] }>("/club/messages")
      .then((data) => setThreads(data.threads || []))
      .catch((err) => setError(clubError(err, t)));
  }

  useEffect(() => {
    if (isMember) loadThreads();
  }, [isMember, t]);

  useEffect(() => {
    if (!isMember || !threadId) return;
    clubGet<{ thread: { member: ClubAuthor }; messages: Message[] }>(`/club/messages/${threadId}`)
      .then((data) => {
        setMember(data.thread.member);
        setMessages(data.messages || []);
      })
      .catch((err) => setError(clubError(err, t)));
  }, [isMember, threadId, t]);

  if (!isMember) return <EmptyState title={t("club.messages.membersOnlyTitle")} text={t("club.messages.membersOnlyText")} />;

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!threadId) return;
    const result = await clubSend<{ message: Message }>("post", `/club/messages/${threadId}`, { text });
    setMessages((current) => [...current, result.message]);
    setText("");
    loadThreads();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <ClubCard className={threadId ? "hidden lg:block" : ""}>
        <h2 className="mb-3 text-lg font-bold">{t("club.messages.title")}</h2>
        {threads.length === 0 ? <p className="text-sm text-slate-500">{t("club.messages.emptyList")}</p> : null}
        <div className="space-y-2">
          {threads.map((thread) => (
            <Link key={thread._id} to={`${base}/messages/${thread._id}`} className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-slate-50">
              <ClubAvatar name={thread.member.fullName} photoUrl={thread.member.photoUrl} logoUrl={thread.member.logoUrl} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{thread.member.fullName}</span>
                <span className="block truncate text-xs text-slate-500">{thread.lastMessageText}</span>
              </span>
            </Link>
          ))}
        </div>
      </ClubCard>
      <ClubCard className={!threadId ? "hidden lg:block" : ""}>
        {!threadId ? <EmptyState title={t("club.messages.selectTitle")} text={t("club.messages.selectText")} /> : null}
        {threadId && member ? (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Link to={`${base}/messages`} className="text-sm font-semibold text-indigo-600 lg:hidden">{t("club.messages.back")}</Link>
              <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
              <div>
                <p className="font-semibold">{member.fullName}</p>
                <p className="text-xs text-slate-500">{member.businessName}</p>
              </div>
            </div>
            <div className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto">
              {messages.map((message) => (
                <div key={message._id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${message.mine ? "self-end bg-indigo-500 text-white" : "self-start bg-slate-100 text-slate-800"}`}>
                  {message.mine ? message.text : <ClubMemberText className="inline" text={message.text} />}
                </div>
              ))}
            </div>
            <form onSubmit={send} className="mt-3 flex gap-2">
              <input className={fieldClass} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("club.messages.placeholder")} />
              <PrimaryButton type="submit">{t("club.messages.send")}</PrimaryButton>
            </form>
          </div>
        ) : null}
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      </ClubCard>
    </div>
  );
}
