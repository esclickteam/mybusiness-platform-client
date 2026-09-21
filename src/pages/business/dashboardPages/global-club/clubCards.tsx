import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { getIntlLocale } from "../../../../i18n/localeUtils";
import { ClubAuthor, ClubComment, ClubPost, ClubProfile, clubSend } from "./clubApi";
import { ClubAvatar, ClubMemberText, GhostButton, PrimaryButton, StatusBadge, countryFlag, fieldClass, formatWhenRelative } from "./clubUi";

export function ClubMeta({
  author,
  createdAt,
  category,
}: {
  author: ClubAuthor;
  createdAt?: string;
  category?: string;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  return (
    <p className="text-sm text-slate-500">
      <span className="font-semibold text-slate-700">{author.fullName}</span>
      {author.businessName ? ` · ${author.businessName}` : ""}
      {author.country ? ` · ${countryFlag(author.country)} ${t(`club.countries.${author.country}`, { defaultValue: author.country })}` : ""}
      {category ? ` · ${t(`club.categories.${category}`, { defaultValue: category })}` : ""}
      {createdAt ? ` · ${formatWhenRelative(createdAt, locale)}` : ""}
    </p>
  );
}

export function ClubPostCard({
  post,
  base,
  compact,
  onChange,
}: {
  post: ClubPost;
  base: string;
  compact?: boolean;
  onChange?: () => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  async function refresh() {
    await onChange?.();
  }

  return (
    <article className="rounded-[24px] border border-violet-100/80 bg-white p-5 shadow-[0_16px_40px_rgba(76,29,149,0.06)]">
      <div className="flex items-start gap-3">
        <ClubAvatar name={post.author.fullName} photoUrl={post.author.photoUrl} logoUrl={post.author.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge>{t(`club.postTypes.${post.postType}`, { defaultValue: post.postType })}</StatusBadge>
          </div>
          <ClubMeta author={post.author} createdAt={post.createdAt} category={post.author.businessCategory || post.category} />
        </div>
      </div>
      {post.title ? <ClubMemberText className="mt-3 text-lg font-black text-slate-900" text={post.title} /> : null}
      <ClubMemberText className={`mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 ${compact ? "line-clamp-4" : ""}`} text={post.text} />
      {post.lookingFor ? <p className="mt-2 text-sm text-slate-600">{t("club.feed.lookingForLabel", { value: post.lookingFor })}</p> : null}
      {post.imageUrl && !compact ? <img src={post.imageUrl} alt="" className="mt-3 max-h-80 w-full rounded-2xl object-cover" /> : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <GhostButton type="button" className="gap-1.5 px-3 py-2" onClick={() => clubSend("post", `/club/posts/${post._id}/react`).then(refresh)}>
          <Heart className={`h-4 w-4 ${post.likedByMe ? "fill-[#7C4DFF] text-[#7C4DFF]" : ""}`} />
          {t("club.feed.like", { count: post.likeCount })}
        </GhostButton>
        <span className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-600">
          <MessageCircle className="h-4 w-4" />
          {t("club.feed.comments", { count: post.commentCount || post.comments.length })}
        </span>
        <GhostButton type="button" className="gap-1.5 px-3 py-2" onClick={() => clubSend("post", `/club/posts/${post._id}/save`).then(refresh)}>
          <Bookmark className={`h-4 w-4 ${post.savedByMe ? "fill-[#7C4DFF] text-[#7C4DFF]" : ""}`} />
          {post.savedByMe ? t("club.feed.saved") : t("club.feed.save")}
        </GhostButton>
        <GhostButton
          type="button"
          className="gap-1.5 px-3 py-2"
          onClick={() => {
            const url = `${window.location.origin}${base}/feed`;
            void navigator.clipboard?.writeText(url).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          <Share2 className="h-4 w-4" />
          {copied ? t("club.common.copied") : t("club.common.share")}
        </GhostButton>
        <Link to={`${base}/members/${post.author.userId}`} className="ms-auto text-sm font-semibold text-[#5B2CFF]">{t("club.common.viewProfile")}</Link>
        <PrimaryButton type="button" className="px-3 py-2 text-sm" onClick={() => clubSend("post", "/club/connections", { userId: post.author.userId })}>{t("club.common.connect")}</PrimaryButton>
      </div>
      {!compact ? (
        <div className="mt-4 space-y-2">
          {post.comments.map((comment: ClubComment) => (
            <div key={comment._id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
              <span className="font-semibold">{comment.author.fullName}</span>
              <span className="text-slate-500"> · {comment.author.businessName}</span>
              <ClubMemberText className="mt-1 text-slate-700" text={comment.text} />
            </div>
          ))}
          <form className="flex gap-2" onSubmit={(event) => {
            event.preventDefault();
            void clubSend("post", `/club/posts/${post._id}/comments`, { text }).then(() => {
              setText("");
              return refresh();
            });
          }}>
            <input className={fieldClass} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("club.feed.commentPlaceholder")} />
            <PrimaryButton type="submit" className="gap-1.5"><MessageCircle className="h-4 w-4" />{t("club.feed.comment")}</PrimaryButton>
          </form>
        </div>
      ) : null}
    </article>
  );
}

const LOOKING_TYPES = new Set(["client", "supplier", "referral", "collaboration"]);
const OFFERING_TYPES = new Set(["project"]);

export function ClubOpportunityCard({
  row,
  base,
}: {
  row: { _id: string; title: string; description: string; country?: string; industry?: string; opportunityType: string; createdAt: string; author: ClubAuthor };
  base?: string;
}) {
  const { t } = useTranslation();
  const intent = LOOKING_TYPES.has(row.opportunityType) ? "looking" : OFFERING_TYPES.has(row.opportunityType) ? "offering" : "partnership";
  return (
    <article className="rounded-[24px] border border-violet-100/80 bg-[linear-gradient(180deg,#ffffff_0%,#FBF9FF_100%)] p-5 shadow-[0_16px_40px_rgba(76,29,149,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <StatusBadge>{t(`club.opportunities.intent.${intent}`)}</StatusBadge>
        <StatusBadge>{t(`club.opportunities.types.${row.opportunityType}`, { defaultValue: row.opportunityType })}</StatusBadge>
      </div>
      <ClubMemberText className="mt-3 text-lg font-black text-slate-900" text={row.title} />
      <ClubMeta author={row.author} createdAt={row.createdAt} category={row.industry} />
      <ClubMemberText className="mt-2 line-clamp-4 text-sm text-slate-700" text={row.description} />
      {base ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`${base}/members/${row.author.userId}`} className="rounded-2xl border border-violet-100 px-3 py-2 text-sm font-semibold text-[#5B2CFF]">{t("club.common.viewProfile")}</Link>
          <PrimaryButton type="button" className="px-3 py-2 text-sm" onClick={() => clubSend("post", "/club/connections", { userId: row.author.userId })}>{t("club.common.connect")}</PrimaryButton>
        </div>
      ) : null}
    </article>
  );
}

export function ClubPersonCard({
  member,
  base,
  extra,
  onConnect,
}: {
  member: ClubProfile | ClubAuthor;
  base: string;
  extra?: string;
  onConnect?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F8F5FF] p-3">
      <ClubAvatar name={member.fullName} photoUrl={member.photoUrl} logoUrl={member.logoUrl} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-900">{member.fullName}</p>
        <p className="truncate text-xs text-slate-500">
          {member.businessName} · {countryFlag(member.country)} {t(`club.countries.${member.country}`, { defaultValue: member.country })}
        </p>
        {extra ? <p className="truncate text-xs text-[#5B2CFF]">{extra}</p> : null}
      </div>
      <Link to={`${base}/members/${member.userId}`} className="text-xs font-bold text-[#5B2CFF]">{t("club.common.viewProfile")}</Link>
      {onConnect ? <PrimaryButton type="button" className="px-3 py-2 text-xs" onClick={onConnect}>{t("club.common.connect")}</PrimaryButton> : null}
    </div>
  );
}
