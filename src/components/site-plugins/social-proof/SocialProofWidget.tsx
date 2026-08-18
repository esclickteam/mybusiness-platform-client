import React, { useEffect, useState } from "react";
import { getPublicSiteResource } from "../../../api/publicSiteRuntimeApi";
import { matchesDeviceTarget, matchesPageTarget } from "../whatsapp-float/whatsappFloatUtils";

type SocialProofEvent = {
  text: string;
  at?: string;
  demo?: boolean;
};

export default function SocialProofWidget({
  slug,
  pageId,
  settings,
}: {
  slug: string;
  pageId?: string;
  settings?: {
    position?: string;
    delaySeconds?: number;
    frequencySeconds?: number;
    demoMode?: boolean;
    pageTargeting?: { mode?: string; pageIds?: string[] };
    deviceTargeting?: { desktop?: boolean; tablet?: boolean; mobile?: boolean };
  };
}) {
  const [events, setEvents] = useState<SocialProofEvent[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getPublicSiteResource<{ events?: SocialProofEvent[] }>(slug, "/social-proof")
      .then((data) => {
        const items = Array.isArray(data?.events) ? data.events : [];
        setEvents(items);
      })
      .catch(() => setEvents([]));
  }, [slug]);

  useEffect(() => {
    if (!events.length) return;
    const delay = Math.max(1, Number(settings?.delaySeconds) || 4) * 1000;
    const freq = Math.max(3, Number(settings?.frequencySeconds) || 8) * 1000;
    const start = window.setTimeout(() => setVisible(true), delay);
    const tick = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
      setVisible(true);
    }, freq);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(tick);
    };
  }, [events, settings?.delaySeconds, settings?.frequencySeconds]);

  if (!matchesPageTarget(settings?.pageTargeting, pageId) || !matchesDeviceTarget(settings?.deviceTargeting)) {
    return null;
  }
  if (!visible || !events[index]) return null;
  const event = events[index];
  const pos = settings?.position || "bottom-left";
  const style: React.CSSProperties =
    pos === "bottom-right"
      ? { right: 16, bottom: 16 }
      : { left: 16, bottom: 16 };

  return (
    <div
      data-bizuply-widget="social-proof"
      data-bizuply-plugin="social-proof"
      data-bizuply-plugin-runtime="true"
      style={{
        position: "fixed",
        zIndex: 2147482500,
        ...style,
      }}
      className="max-w-xs rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg"
    >
      {event.demo || settings?.demoMode ? (
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-600">
          DEMO
        </div>
      ) : null}
      <div className="font-medium text-slate-800">{event.text}</div>
    </div>
  );
}
