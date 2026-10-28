import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Bot, CalendarCheck, Sparkles, UserRound } from "lucide-react";

/**
 * Visual-only product story. No customer data and no API calls.
 * The four beats share one CSS timeline: lead, meeting, AI, chart.
 */
export default function LoginShowcase({
  headline,
}: {
  headline?: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section className="auth-live" aria-hidden="true">
      <h2 className="auth-live__title">
        {headline || (
          <>
            {t("login.heroTitleTop")} <em>{t("login.heroTitleHighlight")}</em>
          </>
        )}
      </h2>
      <p className="auth-live__caption">{t("login.liveCaption")}</p>

      <div className="auth-live__window">
        <div className="auth-live__chrome">
          <span />
          <span />
          <span />
          <strong>BizUply</strong>
        </div>

        <div className="auth-live__stage">
          <article className="auth-beat auth-beat--crm">
            <header className="auth-beat__head">
              <UserRound size={16} />
              <span>{t("login.featureCrmTitle")}</span>
              <em className="auth-live__badge">{t("login.liveNewLead")}</em>
            </header>
            <div className="auth-lead">
              <div className="auth-lead__avatar">ML</div>
              <div>
                <strong>{t("login.liveLeadName")}</strong>
                <span>{t("login.liveLeadMeta")}</span>
              </div>
            </div>
            <div className="auth-status">
              <i />
              <span>{t("login.liveStatusNew")}</span>
              <span>{t("login.liveStatusTalk")}</span>
              <span>{t("login.liveStatusBooked")}</span>
            </div>
          </article>

          <article className="auth-beat auth-beat--meet">
            <header className="auth-beat__head">
              <CalendarCheck size={16} />
              <span>{t("login.featureAppointmentsTitle")}</span>
            </header>
            <div className="auth-cal">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((day) => (
                <span key={day} className={day === "5" ? "is-booked" : ""}>
                  {day}
                </span>
              ))}
            </div>
            <div className="auth-meet">
              <div>
                <strong>{t("login.liveMeetWhen")}</strong>
                <span>{t("login.liveLeadName")}</span>
              </div>
              <em className="auth-meet__ok">{t("login.liveMeetOk")}</em>
            </div>
          </article>

          <article className="auth-beat auth-beat--ai">
            <header className="auth-beat__head">
              <span className="auth-ai__glow">
                <Bot size={16} />
              </span>
              <span>{t("login.featureAiTitle")}</span>
              <Sparkles size={14} />
            </header>
            <p className="auth-type">
              <span>{t("login.liveAiText")}</span>
            </p>
          </article>

          <article className="auth-beat auth-beat--chart">
            <header className="auth-beat__head">
              <span>{t("login.liveChartTitle")}</span>
            </header>
            <svg className="auth-chart" viewBox="0 0 240 78" preserveAspectRatio="none">
              <path d="M4 62 C 36 60, 48 28, 78 34 S 124 18, 156 26 210 8, 236 14" />
              <path d="M4 68 C 40 66, 70 48, 108 52 S 168 40, 236 36" />
              <path className="is-green" d="M4 58 C 52 56, 88 44, 128 46 S 190 30, 236 28" />
            </svg>
            <div className="auth-metrics">
              <p>
                <strong>{t("login.liveMetricLeads")}</strong>
                <span>{t("login.liveMetricLeadsLabel")}</span>
              </p>
              <p>
                <strong>{t("login.liveMetricMeetings")}</strong>
                <span>{t("login.liveMetricMeetingsLabel")}</span>
              </p>
              <p>
                <strong>{t("login.liveMetricReply")}</strong>
                <span>{t("login.liveMetricReplyLabel")}</span>
              </p>
            </div>
          </article>
        </div>

        <div className="auth-live__rail">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
