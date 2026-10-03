import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AlertTriangle, Check, ChevronDown, Copy, Info, ShieldCheck } from "lucide-react";

/* ---------- Syntax highlighting ---------- */

export type CodeLanguage = "bash" | "js" | "python" | "json" | "http" | "text";

const KEYWORDS: Record<string, Set<string>> = {
  js: new Set([
    "const", "let", "var", "await", "async", "function", "return", "if", "else", "new", "import",
    "from", "export", "throw", "try", "catch", "true", "false", "null", "undefined", "of", "for",
  ]),
  python: new Set([
    "import", "from", "def", "return", "if", "else", "elif", "not", "and", "or", "with", "as",
    "None", "True", "False", "raise", "in", "for", "try", "except",
  ]),
  bash: new Set(["curl", "export"]),
  json: new Set(["true", "false", "null"]),
};

const TOKEN_RE: Record<string, RegExp> = {
  json: /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|\b(true|false|null)\b|([{}[\],:])/g,
  js: /(\/\/[^\n]*)|(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|\b([A-Za-z_$][\w$]*)\b(?=\s*\()|\b([A-Za-z_$][\w$]*)\b/g,
  python: /(#[^\n]*)|("""[\s\S]*?"""|f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|\b([A-Za-z_][\w]*)\b(?=\s*\()|\b([A-Za-z_][\w]*)\b/g,
  bash: /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'[^']*')|(\s--?[A-Za-z][\w-]*)|(\$[A-Za-z_][\w]*)|\b([A-Za-z_][\w]*)\b/g,
  http: /^([A-Z]+)(?= )|^([A-Za-z-]+)(?=:)/gm,
};

export function highlight(code: string, language: CodeLanguage): React.ReactNode[] {
  const re = TOKEN_RE[language];
  if (!re) return [code];
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  re.lastIndex = 0;
  const push = (text: string, cls?: string) => {
    if (!text) return;
    out.push(cls ? <span key={key++} className={cls}>{text}</span> : text);
  };
  let match: RegExpExecArray | null;
  while ((match = re.exec(code))) {
    if (match[0] === "") {
      re.lastIndex += 1;
      continue;
    }
    push(code.slice(last, match.index));
    last = match.index + match[0].length;
    if (language === "json") {
      if (match[1]) {
        push(match[1], match[2] ? "tok-key" : "tok-str");
        if (match[2]) push(match[2], "tok-punc");
      } else if (match[3]) push(match[3], "tok-num");
      else if (match[4]) push(match[4], "tok-kw");
      else push(match[5], "tok-punc");
    } else if (language === "http") {
      push(match[0], match[1] ? "tok-kw" : "tok-key");
    } else if (language === "bash") {
      if (match[1]) push(match[1], "tok-com");
      else if (match[2]) push(match[2], "tok-str");
      else if (match[3]) push(match[3], "tok-flag");
      else if (match[4]) push(match[4], "tok-num");
      else push(match[5], KEYWORDS.bash.has(match[5]) ? "tok-kw" : undefined);
    } else {
      const kw = KEYWORDS[language];
      if (match[1]) push(match[1], "tok-com");
      else if (match[2]) push(match[2], "tok-str");
      else if (match[3]) push(match[3], "tok-num");
      else if (match[4]) push(match[4], kw.has(match[4]) ? "tok-kw" : "tok-fn");
      else push(match[5], kw.has(match[5]) ? "tok-kw" : undefined);
    }
  }
  push(code.slice(last));
  return out;
}

/* ---------- Shared language preference for code tabs ---------- */

let preferredLabel = "cURL";
const listeners = new Set<() => void>();

function setPreferredLabel(label: string) {
  preferredLabel = label;
  listeners.forEach((listener) => listener());
}

function usePreferredLabel() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => preferredLabel,
    () => preferredLabel,
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall back to a hidden textarea below */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);
  return (
    <button
      type="button"
      className={state === "done" ? "wa-copy is-done" : "wa-copy"}
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "done" : "failed");
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setState("idle"), 1800);
      }}
    >
      {state === "done" ? <Check size={14} /> : <Copy size={14} />}
      <span aria-live="polite">{state === "done" ? "Copied" : state === "failed" ? "Copy failed" : label}</span>
    </button>
  );
}

export type CodeSample = { label: string; language: CodeLanguage; code: string };

export function CodeBlock({
  title,
  samples,
  code,
  language = "text",
}: {
  title?: string;
  samples?: CodeSample[];
  code?: string;
  language?: CodeLanguage;
}) {
  const id = useId();
  const preferred = usePreferredLabel();
  const list: CodeSample[] = samples?.length ? samples : [{ label: title || "", language, code: code || "" }];
  const tabbed = list.length > 1;
  const active = tabbed ? Math.max(0, list.findIndex((sample) => sample.label === preferred)) : 0;
  const current = list[active];

  return (
    <div className="wa-codeblock">
      <div className="wa-codeblock-bar">
        {tabbed ? (
          <div className="wa-codeblock-tabs" role="tablist" aria-label={title || "Code language"}>
            {list.map((sample, index) => (
              <button
                key={sample.label}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${id}-panel`}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setPreferredLabel(sample.label)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  event.preventDefault();
                  const step = event.key === "ArrowRight" ? 1 : -1;
                  const next = (index + step + list.length) % list.length;
                  setPreferredLabel(list[next].label);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="wa-codeblock-title">{title || current.label}</span>
        )}
        <CopyButton text={current.code} />
      </div>
      <pre
        id={`${id}-panel`}
        role={tabbed ? "tabpanel" : undefined}
        aria-labelledby={tabbed ? `${id}-tab-${active}` : undefined}
        aria-label={tabbed ? undefined : title || "Code sample"}
        tabIndex={0}
      >
        <code>{highlight(current.code, current.language)}</code>
      </pre>
    </div>
  );
}

/* ---------- Layout helpers ---------- */

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "wa-section-head is-center" : "wa-section-head"}>
      {eyebrow ? <p className="wa-eyebrow">{eyebrow}</p> : null}
      <Heading className={Heading === "h1" ? "wa-display" : "wa-h2"}>{title}</Heading>
      {lead ? <p className="wa-lead">{lead}</p> : null}
    </div>
  );
}

const CALLOUT_ICON = { info: Info, warn: AlertTriangle, ok: ShieldCheck } as const;

export function Callout({
  tone = "info",
  children,
}: {
  tone?: keyof typeof CALLOUT_ICON;
  children: React.ReactNode;
}) {
  const Icon = CALLOUT_ICON[tone];
  return (
    <div className={`wa-callout is-${tone}`}>
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function Accordion({
  items,
  defaultOpen = null,
}: {
  items: Array<{ q: string; a: React.ReactNode }>;
  defaultOpen?: number | null;
}) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="wa-accordion">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q} className="wa-accordion-item">
            <h3>
              <button
                type="button"
                id={`${id}-q-${index}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
              >
                {item.q}
                <ChevronDown size={18} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${id}-a-${index}`}
              role="region"
              aria-labelledby={`${id}-q-${index}`}
              className="wa-accordion-panel"
              hidden={!expanded}
            >
              {typeof item.a === "string" ? <p>{item.a}</p> : item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

const AUTO_REVEAL = ".wa-section .wa-section-head, .wa-section :is(.wa-grid-2, .wa-grid-3, .wa-grid-4)";

/**
 * Fades `.wa-reveal` elements in as they scroll into view. Section heads and card grids that start below
 * the fold are revealed too, including content mounted later by lazy pages. Re-runs when `key` changes.
 */
export function useReveal(key: string) {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return undefined;
    const instant = prefersReducedMotion() || typeof IntersectionObserver === "undefined";
    const observer = instant
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-in");
              observer?.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );
    let frame = 0;
    const scan = () => {
      frame = 0;
      main.querySelectorAll<HTMLElement>(AUTO_REVEAL).forEach((node) => {
        if (node.dataset.waSeen) return;
        node.dataset.waSeen = "1";
        if (instant || node.closest(".wa-reveal")) return;
        if (node.getBoundingClientRect().top < window.innerHeight) return;
        node.classList.add("wa-reveal");
      });
      main.querySelectorAll<HTMLElement>(".wa-reveal:not(.is-in)").forEach((node) => {
        if (observer) observer.observe(node);
        else node.classList.add("is-in");
      });
    };
    scan();
    const mutations = new MutationObserver(() => {
      if (!frame) frame = window.requestAnimationFrame(scan);
    });
    mutations.observe(main, { childList: true, subtree: true });
    // A fast jump (End key, scrollbar drag) can skip an element without ever intersecting it.
    let scrollFrame = 0;
    const revealPassed = () => {
      scrollFrame = 0;
      main.querySelectorAll<HTMLElement>(".wa-reveal:not(.is-in)").forEach((node) => {
        if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add("is-in");
      });
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(revealPassed);
    };
    if (observer) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", onScroll);
      mutations.disconnect();
      observer?.disconnect();
    };
  }, [key]);
}

/** Feeds the pointer position to hover cards as `--mx` / `--my` for their spotlight. */
export function useCardSpotlight() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia?.("(hover: hover)").matches) return undefined;
    let frame = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      frame = 0;
      const target = last?.target instanceof Element ? last.target.closest<HTMLElement>(".wa-card.is-hover") : null;
      if (!target || !last) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);
}
