import React from "react";
import { useTranslation } from "react-i18next";
import { Bell, CheckCheck, Clock3, Flame, RefreshCw, Settings } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import "./automationsNotificationsDemo.css";

type DemoKind = "new_lead" | "task_due" | "regular";

type DemoNotification = {
  id: string;
  kind: DemoKind;
  typeLabel: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  meta?: string;
};

function KindIcon({ kind }: { kind: DemoKind }) {
  if (kind === "task_due") return <Clock3 size={18} aria-hidden="true" />;
  if (kind === "new_lead") return <Flame size={18} aria-hidden="true" />;
  return <Bell size={18} aria-hidden="true" />;
}

export default function AutomationsNotificationsDemo() {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";

  const DEMO_NOTIFICATIONS: DemoNotification[] = [
    {
      id: "1",
      kind: "new_lead",
      typeLabel: t("automationsPage.notif.item1.typeLabel"),
      title: t("automationsPage.notif.item1.title"),
      text: t("automationsPage.notif.item1.text"),
      time: t("automationsPage.notif.item1.time"),
      unread: true,
      meta: t("automationsPage.notif.item1.meta"),
    },
    {
      id: "2",
      kind: "task_due",
      typeLabel: t("automationsPage.notif.item2.typeLabel"),
      title: t("automationsPage.notif.item2.title"),
      text: t("automationsPage.notif.item2.text"),
      time: t("automationsPage.notif.item2.time"),
      unread: true,
      meta: t("automationsPage.notif.item2.meta"),
    },
    {
      id: "3",
      kind: "new_lead",
      typeLabel: t("automationsPage.notif.item3.typeLabel"),
      title: t("automationsPage.notif.item3.title"),
      text: t("automationsPage.notif.item3.text"),
      time: t("automationsPage.notif.item3.time"),
      unread: true,
      meta: t("automationsPage.notif.item3.meta"),
    },
    {
      id: "4",
      kind: "task_due",
      typeLabel: t("automationsPage.notif.item4.typeLabel"),
      title: t("automationsPage.notif.item4.title"),
      text: t("automationsPage.notif.item4.text"),
      time: t("automationsPage.notif.item4.time"),
      unread: false,
      meta: t("automationsPage.notif.item4.meta"),
    },
    {
      id: "5",
      kind: "regular",
      typeLabel: t("automationsPage.notif.item5.typeLabel"),
      title: t("automationsPage.notif.item5.title"),
      text: t("automationsPage.notif.item5.text"),
      time: t("automationsPage.notif.item5.time"),
      unread: false,
    },
  ];

  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <section
      className="pm-section amx-notif"
      aria-label={t("automationsPage.notif.sectionAriaLabel")}
    >
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Bell size={14} aria-hidden="true" />
              {t("automationsPage.notif.eyebrow")}
            </>
          }
          title={
            <>
              {t("automationsPage.notif.titleLead")}{" "}
              <span className="pm-grad">
                {t("automationsPage.notif.titleHighlight")}
              </span>
            </>
          }
          lead={t("automationsPage.notif.lead")}
        />

        <Reveal from="up" delay={0.08}>
          <div className="amx-notif__stage">
            <div className="amx-notif__glow" aria-hidden="true" />

            <div className="amx-notif__bell-wrap" aria-hidden="true">
              <span className="amx-notif__bell">
                <Bell size={22} strokeWidth={2.2} />
                <span className="amx-notif__count">{unreadCount}</span>
              </span>
            </div>

            <div className="amx-notif__panel" dir={dir}>
              <header className="amx-notif__head">
                <div>
                  <p className="amx-notif__badge">
                    {t("automationsPage.notif.badge")}
                  </p>
                  <h3>{t("automationsPage.notif.title")}</h3>
                  <p className="amx-notif__sub">
                    {t("automationsPage.notif.sub")}
                  </p>
                </div>
                <div className="amx-notif__head-actions">
                  <span>
                    <Settings size={15} />
                  </span>
                  <span>
                    <RefreshCw size={15} />
                  </span>
                </div>
              </header>

              <div className="amx-notif__tabs" aria-hidden="true">
                <span className="is-active">
                  {t("automationsPage.notif.tabAll")}
                </span>
                <span>
                  {t("automationsPage.notif.tabUnread", { count: unreadCount })}
                </span>
              </div>

              <div className="amx-notif__toolbar" aria-hidden="true">
                <span>
                  {t("automationsPage.notif.toolbarUnread", {
                    count: unreadCount,
                  })}
                </span>
                <span className="amx-notif__mark">
                  <CheckCheck size={14} />
                  {t("automationsPage.notif.markAll")}
                </span>
              </div>

              <ul className="amx-notif__list">
                {DEMO_NOTIFICATIONS.map((item) => (
                  <li
                    key={item.id}
                    className={`amx-notif__item${item.unread ? " is-unread" : ""}`}
                  >
                    <span
                      className={`amx-notif__icon amx-notif__icon--${item.kind}`}
                    >
                      <KindIcon kind={item.kind} />
                    </span>

                    <div className="amx-notif__body">
                      <div className="amx-notif__row">
                        <span className="amx-notif__type">{item.typeLabel}</span>
                        <time>{item.time}</time>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                      {item.meta ? (
                        <span className="amx-notif__meta">{item.meta}</span>
                      ) : null}
                    </div>

                    {item.unread ? <span className="amx-notif__dot" /> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
