import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  Link2,
  PanelTop,
  RefreshCw,
  Settings2,
  Type,
  X,
} from "lucide-react";

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

type PortalFormField = {
  key: string;
  label: string;
};

type PortalFormItem = {
  elementId: string;
  kind: "portal-login" | "portal-register";
  title: string;
  fields: PortalFormField[];
  values: Record<string, string>;
};

const CHROME_SELECTOR = [
  "header",
  "footer",
  '[data-section-kind="header"]',
  '[data-section-kind="footer"]',
  '[data-template-section-type="header"]',
  '[data-template-section-type="footer"]',
].join(",");

const LOGIN_FORM_FIELDS: PortalFormField[] = [
  { key: "title", label: "כותרת" },
  { key: "subtitle", label: "תיאור" },
  { key: "email", label: "שדה אימייל" },
  { key: "password", label: "שדה סיסמה" },
  { key: "submit", label: "כפתור שליחה" },
  { key: "switch", label: "קישור להרשמה" },
  { key: "forgot", label: "קישור שכחתי סיסמה" },
];

const REGISTER_FORM_FIELDS: PortalFormField[] = [
  { key: "title", label: "כותרת" },
  { key: "subtitle", label: "תיאור" },
  { key: "name", label: "שדה שם" },
  { key: "email", label: "שדה אימייל" },
  { key: "phone", label: "שדה טלפון" },
  { key: "password", label: "שדה סיסמה" },
  { key: "submit", label: "כפתור שליחה" },
  { key: "switch", label: "קישור להתחברות" },
];

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

function isButtonLike(node: HTMLElement) {
  const tagName = node.tagName.toLowerCase();
  const type = String(
    node.getAttribute("data-visual-edit-type") ||
      node.getAttribute("data-visual-type") ||
      "",
  ).toLowerCase();

  return (
    tagName === "a" ||
    tagName === "button" ||
    type === "button" ||
    type === "link"
  );
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

        const hasNestedEdit = Boolean(node.querySelector("[data-visual-edit-id]"));
        const buttonLike = isButtonLike(node);

        /*
          Nested labels inside a button used to hide the parent, so the panel
          could not change the real clickable control (and its link).
        */
        if (hasNestedEdit && !buttonLike) return;

        const tagName = node.tagName.toLowerCase();
        const type = String(
          node.getAttribute("data-visual-edit-type") ||
            node.getAttribute("data-visual-type") ||
            "",
        ).toLowerCase();

        const isText =
          buttonLike ||
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
        const href = String(saved.href ?? readNodeHref(node));
        if (!text && !href) return;

        seen.add(elementId);

        items.push({
          elementId,
          area,
          kind: buttonLike ? "button" : "text",
          label:
            String(node.getAttribute("data-visual-edit-label") || "").trim() ||
            (buttonLike ? "כפתור" : "טקסט"),
          text,
          href,
        });
      });
    },
  );

  return items;
}

function collectPortalForms(root: HTMLElement | null): PortalFormItem[] {
  if (!root) return [];

  const items: PortalFormItem[] = [];
  const seen = new Set<string>();

  root
    .querySelectorAll<HTMLElement>(
      '[data-bizuply-portal-mount="true"], [data-bizuply-widget^="portal-"]',
    )
    .forEach((node) => {
      const kind = String(
        node.getAttribute("data-bizuply-portal-kind") ||
          node.getAttribute("data-bizuply-widget") ||
          "",
      ).trim();

      if (kind !== "portal-login" && kind !== "portal-register") return;

      const elementId = String(
        node.getAttribute("data-visual-edit-id") || "",
      ).trim();
      if (!elementId || seen.has(elementId)) return;
      seen.add(elementId);

      const fields =
        kind === "portal-login" ? LOGIN_FORM_FIELDS : REGISTER_FORM_FIELDS;

      const values: Record<string, string> = {};
      fields.forEach((field) => {
        values[field.key] = String(
          node.getAttribute(`data-portal-copy-${field.key}`) || "",
        ).trim();
      });

      items.push({
        elementId,
        kind,
        title: kind === "portal-login" ? "טופס התחברות" : "טופס הרשמה",
        fields,
        values,
      });
    });

  return items;
}

export default function VisualHeaderPanel({ open, editor, onClose }: Props) {
  const [items, setItems] = useState<ChromeItem[]>([]);
  const [forms, setForms] = useState<PortalFormItem[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { text: string; href: string }>
  >({});
  const [formDrafts, setFormDrafts] = useState<
    Record<string, Record<string, string>>
  >({});
  const [area, setArea] = useState<"header" | "footer" | "forms">("header");
  const [appliedId, setAppliedId] = useState("");

  /** Site pages offered in the link dropdown, so nobody types a URL by hand. */
  const linkOptions = useMemo(() => {
    if (!open) return [] as Array<{ value: string; label: string }>;

    const targets = editor?.getLinkTargets?.() as
      | {
          pages?: Array<{ label?: string; href?: string }>;
          sections?: Array<{ label?: string; href?: string }>;
        }
      | undefined;

    const options: Array<{ value: string; label: string }> = [];
    const seen = new Set<string>();

    const push = (href?: string, label?: string) => {
      const value = String(href || "").trim();
      if (!value || seen.has(value)) return;
      seen.add(value);
      options.push({ value, label: String(label || value) });
    };

    (targets?.pages || []).forEach((page) => push(page.href, page.label));
    (targets?.sections || []).forEach((section) =>
      push(section.href, `מקטע: ${section.label}`),
    );

    return options;
  }, [editor, open]);

  /*
    Read through refs so a data change elsewhere in the editor cannot wipe the
    values the user is currently typing in this panel.
  */
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const refresh = useCallback(() => {
    const currentEditor = editorRef.current;
    const root =
      (currentEditor?.canvasRef?.current as HTMLElement | null) || null;

    const next = collectChromeItems(root, asPlainObject(currentEditor?.data));
    const nextForms = collectPortalForms(root);

    setItems(next);
    setForms(nextForms);
    setDrafts(
      next.reduce<Record<string, { text: string; href: string }>>(
        (acc, item) => {
          acc[item.elementId] = { text: item.text, href: item.href };
          return acc;
        },
        {},
      ),
    );
    setFormDrafts(
      nextForms.reduce<Record<string, Record<string, string>>>((acc, form) => {
        acc[form.elementId] = { ...form.values };
        return acc;
      }, {}),
    );
  }, []);

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

  const markApplied = (id: string) => {
    setAppliedId(id);
    window.setTimeout(() => {
      setAppliedId((current) => (current === id ? "" : current));
    }, 1600);
  };

  const applyItem = (item: ChromeItem) => {
    const draft = drafts[item.elementId];
    if (!draft) return;

    const nextText = draft.text;
    if (nextText !== item.text) {
      editor?.updateText?.(item.elementId, nextText);
    }

    if (item.kind === "button") {
      const href = draft.href.trim();

      if (href !== item.href.trim()) {
        editor?.updateLink?.(item.elementId, {
          href,
          target:
            href.startsWith("http://") || href.startsWith("https://")
              ? "_blank"
              : "_self",
        });
      }
    }

    setItems((prev) =>
      prev.map((entry) =>
        entry.elementId === item.elementId
          ? { ...entry, text: nextText, href: draft.href }
          : entry,
      ),
    );

    /*
      Push the change onto the canvas. Without this the DOM keeps the old label
      and publish collects that stale text back from the DOM.
    */
    window.requestAnimationFrame(() => {
      editorRef.current?.applyDataToDom?.();
    });

    markApplied(item.elementId);
  };

  const applyForm = (form: PortalFormItem) => {
    const draft = formDrafts[form.elementId];
    if (!draft) return;

    const patch: Record<string, string> = {};
    form.fields.forEach((field) => {
      patch[`data-portal-copy-${field.key}`] = String(
        draft[field.key] || "",
      ).trim();
    });

    editor?.updateAttributes?.(form.elementId, patch);

    const root =
      (editorRef.current?.canvasRef?.current as HTMLElement | null) || null;
    const shell = root?.querySelector<HTMLElement>(
      `[data-visual-edit-id="${CSS.escape(form.elementId)}"]`,
    );

    if (shell) {
      Object.entries(patch).forEach(([attr, value]) => {
        if (value) shell.setAttribute(attr, value);
        else shell.removeAttribute(attr);
      });
      // Force the live form to remount with the new labels.
      delete shell.dataset.bizuplyPortalMounted;
      shell.removeAttribute("data-bizuply-portal-mounted");
      while (shell.firstChild) shell.removeChild(shell.firstChild);
    }

    setForms((prev) =>
      prev.map((entry) =>
        entry.elementId === form.elementId
          ? { ...entry, values: { ...draft } }
          : entry,
      ),
    );

    window.requestAnimationFrame(() => {
      editorRef.current?.applyDataToDom?.();
    });

    markApplied(form.elementId);
  };

  const isDirty = (item: ChromeItem) => {
    const draft = drafts[item.elementId];
    if (!draft) return false;

    return (
      draft.text !== item.text ||
      (item.kind === "button" && draft.href.trim() !== item.href.trim())
    );
  };

  const isFormDirty = (form: PortalFormItem) => {
    const draft = formDrafts[form.elementId];
    if (!draft) return false;

    return form.fields.some(
      (field) =>
        String(draft[field.key] || "").trim() !==
        String(form.values[field.key] || "").trim(),
    );
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
                עריכת הידר, פוטר וטפסים
              </h2>
              <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500">
                שנו שם כפתור, קישור או כיתוב בטופס — ואז לחצו החל.
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
                  ["forms", "טפסים"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  disabled={
                    (value === "footer" && !hasFooterItems) ||
                    (value === "forms" && !forms.length)
                  }
                  onClick={() => setArea(value)}
                  className={[
                    "flex-1 rounded-lg px-2 py-2 text-[11px] font-black transition",
                    area === value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                    (value === "footer" && !hasFooterItems) ||
                    (value === "forms" && !forms.length)
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

        {area === "forms" ? (
          !forms.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-[12px] font-bold leading-6 text-slate-500">
              אין טופס התחברות/הרשמה בעמוד הזה. הוסיפי עמוד מאזור אישי
              מהספרייה.
            </div>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => {
                const draft = formDrafts[form.elementId] || form.values;

                return (
                  <div
                    key={form.elementId}
                    className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm"
                  >
                    <div className="mb-3 text-sm font-black text-slate-800">
                      {form.title}
                    </div>

                    <div className="space-y-2">
                      {form.fields.map((field) => (
                        <label
                          key={field.key}
                          className="block text-[11px] font-black text-slate-500"
                        >
                          {field.label}
                          <input
                            value={draft[field.key] || ""}
                            onChange={(event) =>
                              setFormDrafts((prev) => ({
                                ...prev,
                                [form.elementId]: {
                                  ...draft,
                                  [field.key]: event.target.value,
                                },
                              }))
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => applyForm(form)}
                      disabled={!isFormDirty(form)}
                      className={[
                        "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition",
                        appliedId === form.elementId
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : isFormDirty(form)
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "cursor-not-allowed bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      {appliedId === form.elementId ? (
                        <>
                          <Check className="h-4 w-4" />
                          נשמר בטופס
                        </>
                      ) : (
                        "החל על הטופס"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : !visibleItems.length ? (
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
                          ? "bg-slate-900 text-white"
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
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        applyItem(item);
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                      placeholder="לדוגמה: אזור אישי"
                    />
                  </label>

                  {item.kind === "button" ? (
                    <div className="mt-2">
                      <span className="block text-[11px] font-black text-slate-500">
                        לאן הכפתור מקשר
                      </span>
                      <div className="mt-1 flex gap-2">
                        <select
                          value={
                            linkOptions.some(
                              (option) => option.value === draft.href,
                            ) || !draft.href
                              ? draft.href
                              : "__custom__"
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === "__custom__") return;

                            setDrafts((prev) => ({
                              ...prev,
                              [item.elementId]: { ...draft, href: value },
                            }));
                          }}
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                          <option value="">בלי קישור</option>
                          {linkOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          {draft.href &&
                          !linkOptions.some(
                            (option) => option.value === draft.href,
                          ) ? (
                            <option value="__custom__">
                              מותאם: {draft.href}
                            </option>
                          ) : null}
                        </select>
                        <button
                          type="button"
                          title="בחירה מתקדמת (טלפון, וואטסאפ, מייל, כתובת)"
                          onClick={() =>
                            editor?.openLinkSettings?.(item.elementId)
                          }
                          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
                        >
                          <Settings2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => applyItem(item)}
                    disabled={!isDirty(item)}
                    className={[
                      "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-black transition",
                      appliedId === item.elementId
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : isDirty(item)
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "cursor-not-allowed bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    {appliedId === item.elementId ? (
                      <>
                        <Check className="h-4 w-4" />
                        הוחל על כל העמודים
                      </>
                    ) : (
                      "החל"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
