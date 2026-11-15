import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  classifyContentClick,
  classifyContentView,
  forgetContentVisitor,
  publicContentAnalyticsEnabled,
  sendContentEvent,
} from "../../lib/publicContentAnalytics.mjs";
import { analyticsAllowed } from "../../lib/trackingConsent";

export default function PublicContentAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!publicContentAnalyticsEnabled() || !analyticsAllowed()) return;
    const view = classifyContentView(location.pathname);
    if (!view) return;
    sendContentEvent(view, { consent: true });
  }, [location.pathname]);

  useEffect(() => {
    if (!publicContentAnalyticsEnabled()) return;
    const onConsent = () => {
      if (!analyticsAllowed()) {
        forgetContentVisitor();
        return;
      }
      const view = classifyContentView(window.location.pathname);
      if (view) sendContentEvent(view, { consent: true });
    };
    const onClick = (event: MouseEvent) => {
      if (!analyticsAllowed()) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const click = classifyContentClick(window.location.pathname, anchor.getAttribute("href") || "");
      if (click) sendContentEvent(click, { consent: true });
    };
    window.addEventListener("bizuply-tracking-consent", onConsent);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("bizuply-tracking-consent", onConsent);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
