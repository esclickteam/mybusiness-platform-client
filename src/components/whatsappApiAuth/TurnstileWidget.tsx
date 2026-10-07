import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile_missing")));
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("turnstile_load_failed"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export type TurnstileHandle = {
  /** Resolves with a fresh token (waits for the managed check if it is still running). */
  getToken: (timeoutMs?: number) => Promise<string | null>;
  /** Tokens are single-use: call after every submit. */
  reset: () => void;
};

type Props = { siteKey: string; language: string; action: string };

/**
 * Cloudflare Turnstile in managed "interaction-only" mode: invisible unless
 * Cloudflare decides a visitor must interact.
 */
const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget({ siteKey, language, action }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<Array<(t: string | null) => void>>([]);

  useEffect(() => {
    let cancelled = false;
    const settle = (value: string | null) => {
      token.current = value;
      if (value) {
        waiters.current.splice(0).forEach((resolve) => resolve(value));
      }
    };
    loadTurnstile()
      .then((api) => {
        if (cancelled || !container.current) return;
        widgetId.current = api.render(container.current, {
          sitekey: siteKey,
          action,
          appearance: "interaction-only",
          theme: "dark",
          language: language === "pt-BR" ? "pt-br" : language,
          callback: (value: string) => settle(value),
          "expired-callback": () => settle(null),
          "error-callback": () => settle(null),
        });
      })
      .catch(() => {
        waiters.current.splice(0).forEach((resolve) => resolve(null));
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey, language, action]);

  useImperativeHandle(ref, () => ({
    getToken: (timeoutMs = 15000) =>
      token.current
        ? Promise.resolve(token.current)
        : new Promise((resolve) => {
            const timer = setTimeout(() => {
              waiters.current = waiters.current.filter((w) => w !== done);
              resolve(null);
            }, timeoutMs);
            const done = (value: string | null) => {
              clearTimeout(timer);
              resolve(value);
            };
            waiters.current.push(done);
          }),
    reset: () => {
      token.current = null;
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  return <div ref={container} className="wa-auth-turnstile" data-testid="wa-turnstile" />;
});

export default TurnstileWidget;
