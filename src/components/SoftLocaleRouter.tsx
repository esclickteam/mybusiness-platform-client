import { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { marketingLocaleBasename } from "../lib/localePathCore.mjs";
import {
  SOFT_LOCALE_EVENT,
  type SoftLocaleDetail,
  captureLocalePaintHold,
  hideRootForSoftLocale,
  releaseLocalePaintHoldWhenReady,
  setSoftLocaleHandlerInstalled,
} from "../lib/softMarketingLocaleNavigate";

type SoftLocaleRouterProps = {
  children: ReactNode;
};

/**
 * BrowserRouter whose basename can change without a document reload.
 * Marketing locale switches (`/` ↔ `/he`) remount only this router tree while
 * a paint hold covers the gap until the next hero media is ready.
 */
export default function SoftLocaleRouter({ children }: SoftLocaleRouterProps) {
  const [routerKey, setRouterKey] = useState(0);
  const [basename, setBasename] = useState(() =>
    marketingLocaleBasename(window.location.pathname),
  );

  useEffect(() => {
    setSoftLocaleHandlerInstalled(true);

    const remountForPath = (path: string, { push = false, hold = false } = {}) => {
      const clean = String(path || "").split(/[?#]/)[0] || "/";
      if (hold) {
        captureLocalePaintHold();
        hideRootForSoftLocale();
      }
      if (push && window.location.pathname !== clean) {
        window.history.pushState(window.history.state, "", clean);
      }
      const nextBase = marketingLocaleBasename(clean);
      setBasename(nextBase);
      setRouterKey((key) => key + 1);
    };

    const onSoft = (event: Event) => {
      const detail = (event as CustomEvent<SoftLocaleDetail>).detail;
      if (!detail?.path) return;
      remountForPath(detail.path, { push: true, hold: false });
    };

    const onPopState = () => {
      const nextBase = marketingLocaleBasename(window.location.pathname);
      setBasename((prev) => {
        if (prev === nextBase) return prev;
        captureLocalePaintHold();
        hideRootForSoftLocale();
        setRouterKey((key) => key + 1);
        return nextBase;
      });
    };

    window.addEventListener(SOFT_LOCALE_EVENT, onSoft as EventListener);
    window.addEventListener("popstate", onPopState);
    return () => {
      setSoftLocaleHandlerInstalled(false);
      window.removeEventListener(SOFT_LOCALE_EVENT, onSoft as EventListener);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (routerKey === 0) return undefined;
    // Remount committed — only now may the new hero satisfy readiness.
    releaseLocalePaintHoldWhenReady(document);
    return undefined;
  }, [routerKey]);

  return (
    <BrowserRouter
      key={routerKey}
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {children}
    </BrowserRouter>
  );
}
