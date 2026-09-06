import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
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
  labelKey: string;
  /** text = copy/label; link = destination page for a form text-button */
  kind?: "text" | "link";
};

type PortalFormItem = {
  elementId: string;
  kind: "portal-login" | "portal-register";
  title: string;
  fields: PortalFormField[];
  values: Record<string, string>;
  links: Record<string, string>;
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
  { key: "title", label: "Title", labelKey: "fieldTitle" },
  { key: "subtitle", label: "Description", labelKey: "fieldSubtitle" },
  { key: "email", label: "Email field", labelKey: "fieldEmail" },
  { key: "password", label: "Password field", labelKey: "fieldPassword" },
  { key: "submit", label: "Sign-in button text", labelKey: "loginSubmit" },
  { key: "switch", label: "Text: No account? Sign up", labelKey: "loginSwitch" },
  { key: "forgot", label: "Text: Forgot password", labelKey: "loginForgot" },
  {
    key: "switch",
    label: "Where Sign up goes",
    labelKey: "loginSwitchLink",
    kind: "link",
  },
  {
    key: "forgot",
    label: "Where Forgot password goes",
    labelKey: "loginForgotLink",
    kind: "link",
  },
];

const REGISTER_FORM_FIELDS: PortalFormField[] = [
  { key: "title", label: "Title", labelKey: "fieldTitle" },
  { key: "subtitle", label: "Description", labelKey: "fieldSubtitle" },
  { key: "name", label: "Name field", labelKey: "fieldName" },
  { key: "email", label: "Email field", labelKey: "fieldEmail" },
  { key: "phone", label: "Phone field", labelKey: "fieldPhone" },
  { key: "password", label: "Password field", labelKey: "fieldPassword" },
  { key: "submit", label: "Create-account button text", labelKey: "registerSubmit" },
  { key: "switch", label: "Text: Already registered? Sign in", labelKey: "registerSwitch" },
  {
    key: "switch",
    label: "Where Sign in goes",
    labelKey: "registerSwitchLink",
    kind: "link",
  },
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
  const direct = String(
    node.getAttribute("data-visual-link-href") ||
      node.getAttribute("data-link-url") ||
      node.getAttribute("data-href") ||
      (node instanceof HTMLAnchorElement ? node.getAttribute("href") : "") ||
      "",
  ).trim();
  if (direct) return direct;

  // Nested CTA labels often sit inside the real <a>/linked control.
  const linkHost =
    (node.closest("a") as HTMLAnchorElement | null) ||
    (node.closest(
      "[data-visual-link-href], [data-link-url], [data-href]",
    ) as HTMLElement | null);

  if (!linkHost || linkHost === node) return "";

  return String(
    linkHost.getAttribute("data-visual-link-href") ||
      linkHost.getAttribute("data-link-url") ||
      linkHost.getAttribute("data-href") ||
      (linkHost instanceof HTMLAnchorElement
        ? linkHost.getAttribute("href")
        : "") ||
      "",
  ).trim();
}

function getButtonLikeAncestor(node: HTMLElement) {
  const host = node.parentElement?.closest<HTMLElement>(
    [
      "a[data-visual-edit-id]",
      "button[data-visual-edit-id]",
      '[data-visual-edit-type="button"][data-visual-edit-id]',
      '[data-visual-type="button"][data-visual-edit-id]',
      '[data-visual-edit-type="link"][data-visual-edit-id]',
    ].join(", "),
  );
  return host && host !== node ? host : null;
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
  labels: { button: string; text: string },
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

        /*
          Prefer the real clickable control. Nested label spans used to show up
          as separate text rows without a link field — which broke CTA editing.
        */
        const buttonAncestor = getButtonLikeAncestor(node);
        if (buttonAncestor && isButtonLike(buttonAncestor) && !buttonLike) {
          return;
        }

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
        // Empty saved.href must not hide the live DOM/link attributes.
        const savedHref = String(saved.href ?? "").trim();
        const href = savedHref || readNodeHref(node);
        if (!text && !href) return;

        seen.add(elementId);

        items.push({
          elementId,
          area,
          kind: buttonLike ? "button" : "text",
          label:
            String(node.getAttribute("data-visual-edit-label") || "").trim() ||
            (buttonLike ? labels.button : labels.text),
          text,
          href,
        });
      });
    },
  );

  return items;
}

function collectPortalForms(
  root: HTMLElement | null,
  titles: { login: string; register: string },
): PortalFormItem[] {
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
      const links: Record<string, string> = {};
      fields.forEach((field) => {
        if (field.kind === "link") {
          links[field.key] = String(
            node.getAttribute(`data-portal-link-${field.key}`) || "",
          ).trim();
          return;
        }
        values[field.key] = String(
          node.getAttribute(`data-portal-copy-${field.key}`) || "",
        ).trim();
      });

      items.push({
        elementId,
        kind,
        title: kind === "portal-login" ? titles.login : titles.register,
        fields,
        values,
        links,
      });
    });

  return items;
}

export default function VisualHeaderPanel({ open, editor, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [items, setItems] = useState<ChromeItem[]>([]);
  const [forms, setForms] = useState<PortalFormItem[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { text: string; href: string }>
  >({});
  const [formDrafts, setFormDrafts] = useState<
    Record<
      string,
      { values: Record<string, string>; links: Record<string, string> }
    >
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
      push(section.href, t("studio.headerPanel.sectionPrefix", { label: section.label })),
    );

    return options;
  }, [editor, open, t]);

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

    const next = collectChromeItems(root, asPlainObject(currentEditor?.data), {
      button: t("studio.headerPanel.button"),
      text: t("studio.headerPanel.text"),
    });
    const nextForms = collectPortalForms(root, {
      login: t("studio.headerPanel.loginForm"),
      register: t("studio.headerPanel.registerForm"),
    });

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
      nextForms.reduce<
        Record<
          string,
          { values: Record<string, string>; links: Record<string, string> }
        >
      >((acc, form) => {
        acc[form.elementId] = {
          values: { ...form.values },
          links: { ...form.links },
        };
        return acc;
      }, {}),
    );
  }, [t]);

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open, refresh]);

  /*
    Selecting the portal form on the canvas should jump straight to form
    links — owners cannot deep-select the inner runtime buttons.
  */
  useEffect(() => {
    if (!open) return;

    const selectedId = String(
      editorRef.current?.selectedElement?.id || "",
    ).trim();
    if (!selectedId) return;

    const root =
      (editorRef.current?.canvasRef?.current as HTMLElement | null) || null;
    const node = root?.querySelector<HTMLElement>(
      `[data-visual-edit-id="${CSS.escape(selectedId)}"]`,
    );
    const kind = String(
      node?.getAttribute("data-bizuply-portal-kind") ||
        node?.getAttribute("data-bizuply-widget") ||
        "",
    );

    if (kind === "portal-login" || kind === "portal-register") {
      setArea("forms");
    }
  }, [open, editor?.selectedElement?.id]);

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
      if (field.kind === "link") {
        patch[`data-portal-link-${field.key}`] = String(
          draft.links[field.key] || "",
        ).trim();
        return;
      }
      patch[`data-portal-copy-${field.key}`] = String(
        draft.values[field.key] || "",
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
      // Force the live form to remount with the new labels/links.
      delete shell.dataset.bizuplyPortalMounted;
      delete shell.dataset.bizuplyPortalLive;
      shell.removeAttribute("data-bizuply-portal-mounted");
      shell.removeAttribute("data-bizuply-portal-live");
      while (shell.firstChild) shell.removeChild(shell.firstChild);
    }

    setForms((prev) =>
      prev.map((entry) =>
        entry.elementId === form.elementId
          ? {
              ...entry,
              values: { ...draft.values },
              links: { ...draft.links },
            }
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

    return form.fields.some((field) => {
      if (field.kind === "link") {
        return (
          String(draft.links[field.key] || "").trim() !==
          String(form.links[field.key] || "").trim()
        );
      }
      return (
        String(draft.values[field.key] || "").trim() !==
        String(form.values[field.key] || "").trim()
      );
    });
  };

  return (
    <aside
      className="absolute inset-y-0 right-0 z-[2147483000] flex w-[340px] max-w-[92vw] flex-col border-l border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white shadow-[-18px_0_50px_rgba(15,23,42,0.12)]"
      dir={pageDir}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-black text-slate-800">
                <PanelTop className="h-4 w-4 text-slate-500" />
                {t("studio.headerPanel.title")}
              </h2>
              <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500">
                {t("studio.headerPanel.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
              aria-label={t("studio.headerPanel.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 rounded-xl bg-slate-100 p-1">
              {(
                [
                  ["header", t("studio.headerPanel.header")],
                  ["footer", t("studio.headerPanel.footer")],
                  ["forms", t("studio.headerPanel.forms")],
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
              title={t("studio.headerPanel.refresh")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {area === "forms" ? (
          !forms.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-[12px] font-bold leading-6 text-slate-500">
              {t("studio.headerPanel.noForms")}
            </div>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => {
                const draft = formDrafts[form.elementId] || {
                  values: form.values,
                  links: form.links,
                };
                const textFields = form.fields.filter(
                  (field) => field.kind !== "link",
                );
                const linkFields = form.fields.filter(
                  (field) => field.kind === "link",
                );

                return (
                  <div
                    key={form.elementId}
                    className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm"
                  >
                    <div className="mb-3 text-sm font-black text-slate-800">
                      {form.title}
                    </div>

                    <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-bold leading-5 text-amber-900">
                      {t("studio.headerPanel.formButtonsHint")}
                    </div>

                    {linkFields.length ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-700">
                          <Link2 className="h-3.5 w-3.5" />
                          {t("studio.headerPanel.formLinks")}
                        </div>
                        {linkFields.map((field) => (
                          <label
                            key={`link-${field.key}`}
                            className="block text-[11px] font-black text-slate-500"
                          >
                            {t(`studio.headerPanel.${field.labelKey}`, field.label)}
                            <select
                              value={draft.links[field.key] || ""}
                              onChange={(event) =>
                                setFormDrafts((prev) => ({
                                  ...prev,
                                  [form.elementId]: {
                                    ...draft,
                                    links: {
                                      ...draft.links,
                                      [field.key]: event.target.value,
                                    },
                                  },
                                }))
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                              <option value="">
                                {t("studio.headerPanel.autoPage")}
                              </option>
                              {linkOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                              {draft.links[field.key] &&
                              !linkOptions.some(
                                (option) =>
                                  option.value === draft.links[field.key],
                              ) ? (
                                <option value={draft.links[field.key]}>
                                  {t("studio.headerPanel.custom", { value: draft.links[field.key] })}
                                </option>
                              ) : null}
                            </select>
                          </label>
                        ))}
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      {textFields.map((field) => (
                        <label
                          key={`text-${field.key}`}
                          className="block text-[11px] font-black text-slate-500"
                        >
                          {t(`studio.headerPanel.${field.labelKey}`, field.label)}
                          <input
                            value={draft.values[field.key] || ""}
                            onChange={(event) =>
                              setFormDrafts((prev) => ({
                                ...prev,
                                [form.elementId]: {
                                  ...draft,
                                  values: {
                                    ...draft.values,
                                    [field.key]: event.target.value,
                                  },
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
                          {t("studio.headerPanel.savedForm")}
                        </>
                      ) : (
                        t("studio.headerPanel.applyForm")
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : !visibleItems.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-[12px] font-bold leading-6 text-slate-500">
            {t("studio.headerPanel.noneInArea", {
              area: area === "header"
                ? t("studio.headerPanel.header")
                : t("studio.headerPanel.footer"),
            })}
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
                      {item.kind === "button" ? t("studio.headerPanel.buttonLink") : t("studio.headerPanel.text")}
                    </span>
                  </div>

                  <label className="block text-[11px] font-black text-slate-500">
                    {t("studio.headerPanel.buttonName")}
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
                      placeholder={t("studio.headerPanel.buttonNamePh")}
                    />
                  </label>

                  {item.kind === "button" ? (
                    <div className="mt-2">
                      <span className="block text-[11px] font-black text-slate-500">
                        {t("studio.headerPanel.buttonGoes")}
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
                          <option value="">{t("studio.headerPanel.noLink")}</option>
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
                              {t("studio.headerPanel.custom", { value: draft.href })}
                            </option>
                          ) : null}
                        </select>
                        <button
                          type="button"
                          title={t("studio.headerPanel.advancedLink")}
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
                        {t("studio.headerPanel.appliedAll")}
                      </>
                    ) : (
                      t("studio.headerPanel.apply")
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
