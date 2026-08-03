import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link2, PanelTop, RefreshCw, Type, X } from "lucide-react";

import { readVisualContent } from "./utils/visualData";
import {
  canonicalChromeVisualKey,
  readSharedChrome,
} from "./utils/visualSharedChrome";

type Props = {
  open: boolean;
  editor: Record<string, any> | null;
  onClose: () => void;
};

type ChromeItem = {
  elementId: string;
  area: "header" | "footer";
  kind: "button" | "text";
  label: string;
  text: string;
  href: string;
};

const CHROME_SELECTOR = [
  "header",
  "footer",
  '[data-section-kind="header"]',
  '[data-section-kind="footer"]',
  '[data-template-section-type="header"]',
  '[data-template-section-type="footer"]',
].join(",");

function asPlainObject(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function readNodeText(node: HTMLElement) {
  const raw =
    typeof node.innerText === "string" && node.innerText.length
      ? node.innerText
      : node.textContent || "";

  return raw.replace(/\s+/g, " ").trim();
}

function readNodeHref(node: HTMLElement) {
  return String(
    node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      (node instanceof HTMLAnchorElement ? node.getAttribute("href") : "") ||
      "",
  ).trim();
}

/**
 * Header and footer items that carry a label, so the owner can rename buttons
 * and menu entries in one place instead of hunting them on the canvas.
 */
function collectChromeItems(
  root: HTMLElement | null,
  data: Record<string, any>,
): ChromeItem[] {
  if (!root) return [];

  const content = readVisualContent(data);
  const sharedContent = asPlainObject(readSharedChrome(data).__content);

  const items: ChromeItem[] = [];
  const seen = new Set<string>();

  Array.from(root.querySelectorAll<HTMLElement>(CHROME_SELECTOR)).forEach(
    (chromeRoot) => {
      const isFooter =
        chromeRoot.tagName.toLowerCase() === "footer" ||
        chromeRoot.getAttribute("data-section-kind") === "footer" ||
        chromeRoot.getAttribute("data-template-section-type") === "footer";

      const area: ChromeItem["area"] = isFooter ? "footer" : "header";

      Array.from(
        chromeRoot.querySelectorAll<HTMLElement>("[data-visual-edit-id]"),
      ).forEach((node) => {
        const elementId = String(
          node.getAttribute("data-visual-edit-id") || "",
        ).trim();

        if (!elementId || seen.has(elementId)) return;
        if (node.closest("[data-visual-editor-only='true']")) return;
        if (node.querySelector("[data-visual-edit-id]")) return;

        const tagName = node.tagName.toLowerCase();
        const type = String(
          node.getAttribute("data-visual-edit-type") ||
            node.getAttribute("data-visual-type") ||
            "",
        ).toLowerCase();

        const isButton =
          tagName === "a" ||
          tagName === "button" ||
          type === "button" ||
          type === "link";

        const isText =
          isButton ||
          type === "text" ||
          ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "strong"].includes(
            tagName,
          );

        if (!isText) return;

        const canonicalKey = canonicalChromeVisualKey(elementId);
        const saved = asPlainObject(
          content[elementId] ||
            (canonicalKey ? sharedContent[canonicalKey] : null),
        );

        const text = String(saved.text ?? readNodeText(node));
        if (!text) return;

        seen.add(elementId);

        items.push({
          elementId,
          area,
          kind: isButton ? "button" : "text",
          label:
            String(node.getAttribute("data-visual-edit-label") || "").trim() ||
            (isButton ? "כפתור" : "טקסט"),
          text,
          href: String(saved.href ?? readNodeHref(node)),
        });
      });
    },
  );

  return items;
}

export default function VisualHeaderPanel({ open, editor, onClose }: Props) {
  const [items, setItems] = useState<ChromeItem[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { text: string; href: string }>
  >({});
  const [area, setArea] = useState<"header" | "footer">("header");

  const canvasRoot: HTMLElement | null =
    (editor?.canvasRef?.current as HTMLElement | null) || null;

  const editorData = asPlainObject(editor?.data);

  const refresh = useCallback(() => {
    const next = collectChromeItems(canvasRoot, editorData);
    setItems(next);
    setDrafts(
      next.reduce<Record<string, { text: string; href: string }>>(
        (acc, item) => {
          acc[item.elementId] = { text: item.text, href: item.href };
          return acc;
        },
        {},
      ),
    );
  }, [canvasRoot, editorData]);

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open, refresh]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.area === area),
    [items, area],
  );

  const hasFooterItems = useMemo(
    () => items.some((item) => item.area === "footer"),
    [items],
  );

  if (!open) return null;

  const commitText = (elementId: string, value: string) => {
    editor?.updateText?.(elementId, value);
  };

  const commitHref = (elementId: string, value: string) => {
    const href = value.trim();

    editor?.updateLink?.(elementId, {
      href,
      target:
        href.startsWith("http://") || href.startsWith("https://")
          ? "_blank"
          : "_self",
    });
  };

  return (
    <aside
      className="absolute inset-y-0 right-0 z-[2147483000] flex w-[340px] max-w-[92vw] flex-col border-l border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
      dir="rtl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-black text-slate-800">
                <PanelTop className="h-4 w-4 text-slate-500" />
                עריכת הידר ופוטר
              </h2>
              <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500">
                שינוי כאן חל על כל העמודים שבהם ההידר מופיע.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
              aria-label="סגירה"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 rounded-xl bg-slate-100 p-1">
              {(
                [
                  ["header", "הידר"],
                  ["footer", "פוטר"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  disabled={value === "footer" && !hasFooterItems}
                  onClick={() => setArea(value)}
                  className={[
                    "flex-1 rounded-lg px-3 py-2 text-xs font-black transition",
                    area === value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                    value === "footer" && !hasFooterItems
                      ? "cursor-not-allowed opacity-40"
                      : "",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={refresh}
              title="רענון הרשימה"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!visibleItems.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-[12px] font-bold leading-6 text-slate-500">
            לא נמצאו כפתורים או טקסטים ב{area === "header" ? "הידר" : "פוטר"}.
            נסי לרענן, או לבחור אלמנט בקנבס.
          </div>
        ) : (
          <div className="space-y-2">
            {visibleItems.map((item) => {
              const draft = drafts[item.elementId] || {
                text: item.text,
                href: item.href,
              };

              return (
                <div
                  key={item.elementId}
                  className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={[
                        "grid h-6 w-6 place-items-center rounded-lg",
                        item.kind === "button"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {item.kind === "button" ? (
                        <Link2 className="h-3.5 w-3.5" />
                      ) : (
                        <Type className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-black text-slate-500">
                      {item.kind === "button" ? "כפתור / קישור" : "טקסט"}
                    </span>
                  </div>

                  <label className="block text-[11px] font-black text-slate-500">
                    שם הכפתור
                    <input
                      value={draft.text}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [item.elementId]: {
                            ...draft,
                            text: event.target.value,
                          },
                        }))
                      }
                      onBlur={(event) =>
                        commitText(item.elementId, event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        commitText(item.elementId, draft.text);
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                      placeholder="לדוגמה: אזור אישי"
                    />
                  </label>

                  {item.kind === "button" ? (
                    <label className="mt-2 block text-[11px] font-black text-slate-500">
                      קישור
                      <input
                        value={draft.href}
                        dir="ltr"
                        onChange={(event) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [item.elementId]: {
                              ...draft,
                              href: event.target.value,
                            },
                          }))
                        }
                        onBlur={(event) =>
                          commitHref(item.elementId, event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key !== "Enter") return;
                          event.preventDefault();
                          commitHref(item.elementId, draft.href);
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                        placeholder="/login  ·  /account  ·  https://"
                      />
                    </label>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
