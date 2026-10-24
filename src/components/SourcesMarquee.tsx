"use client";

import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

type Channel = {
  name: string;
  label: string;
  mark: "meta" | "facebook" | "instagram" | "whatsapp" | "google" | "site";
};

const CHANNELS: Channel[] = [
  { name: "Meta", label: "Lead Ads", mark: "meta" },
  { name: "Facebook", label: "Lead Ads", mark: "facebook" },
  { name: "Instagram", label: "Lead Ads", mark: "instagram" },
  { name: "WhatsApp", label: "Business API", mark: "whatsapp" },
  { name: "Google Ads", label: "Leads", mark: "google" },
  { name: "Website", label: "Forms", mark: "site" },
];

function Mark({ kind, gid }: { kind: Channel["mark"]; gid: string }) {
  if (kind === "meta") {
    return <img src="/meta.svg" alt="" width={28} height={28} />;
  }
  if (kind === "google") {
    return <img src="/google-ads.svg" alt="" width={28} height={28} />;
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <defs>
          <radialGradient id={gid} cx="30%" cy="110%" r="120%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="45%" stopColor="#d62976" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill={`url(#${gid})`} />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="#fff" />
      </svg>
    );
  }
  if (kind === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path fill="#25D366" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.15h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.85c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.25-4.76-4.15-4.9-4.35-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.19-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.29.29-.12.56.16.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.37-.23.63-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#38bdf8" />
      <path d="M6 15.5 10.2 8h2.1L8.2 15.5H6zm5.6 0 4.2-7.5h2.1l-4.1 7.5h-2.2z" fill="#fff" />
    </svg>
  );
}

function Row({ copy, track }: { copy: Channel[]; track: string }) {
  return (
    <ul className="home-marquee__row">
      {copy.map((channel, index) => (
        <li key={`${track}-${channel.name}-${index}`} className="home-channel">
          <Mark kind={channel.mark} gid={`ig-${track}-${index}`} />
          <span>
            <strong>{channel.name}</strong>
            <em>{channel.label}</em>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SourcesMarquee() {
  const { t, i18n } = useTranslation();
  const loop = [...CHANNELS, ...CHANNELS];

  return (
    <div className="home-flow" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="home-flow__eyebrow">{t("live.sourcesEyebrow")}</p>
        <h2 className="home-flow__title">{t("home.flowTitle")}</h2>
        <p className="home-flow__lead">{t("home.flowBody")}</p>
        <div className="home-flow__board">
          <div className="home-marquee" aria-label={t("live.sourcesEyebrow")}>
            <div className="home-marquee__track">
              <Row copy={loop} track="a" />
              <Row copy={loop} track="b" />
            </div>
          </div>
          <div className="home-flow__line" aria-hidden="true" />
          <div className="home-flow__crm">
            <p>{t("home.flowInto")}</p>
            <strong>CRM</strong>
            <span>{t("home.flowNext")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
