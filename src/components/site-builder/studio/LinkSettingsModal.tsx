import React from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../hooks/useLocaleDir";
import {
  ChevronDown,
  FileText,
  Globe2,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";

type LinkTarget = "_self" | "_blank" | string;

export type LinkSettingsPayload = {
  href: string;
  target?: LinkTarget;
  rel?: string;
};

export type LinkSettingsPage = {
  id: string;
  title?: string;
  slug?: string;
  isHome?: boolean;
};

export type LinkSettingsSection = {
  id: string;
  title?: string;
  kind?: string;
  tagName?: string;
};

type LinkMode =
  | "page"
  | "section"
  | "url"
  | "email"
  | "phone"
  | "whatsapp"
  | "address";

type LinkSettingsModalProps = {
  open: boolean;
  pages: LinkSettingsPage[];
  sections: LinkSettingsSection[];
  activePageId?: string;
  currentHref?: string;
  currentTarget?: LinkTarget;
  selectedElement?: unknown;
  onClose: () => void;
  onSave: (payload: LinkSettingsPayload) => void;
  onRemove: () => void;
};

const MAIN_MODE_KEYS: Array<{ mode: LinkMode; labelKey: string; icon: React.ReactNode }> = [
  { mode: "page", labelKey: "studio.linkSettings.page", icon: <FileText className="h-5 w-5" /> },
  { mode: "section", labelKey: "studio.linkSettings.section", icon: <Layers className="h-5 w-5" /> },
  { mode: "url", labelKey: "studio.linkSettings.url", icon: <Globe2 className="h-5 w-5" /> },
];

const MORE_MODE_KEYS: Array<{ mode: LinkMode; labelKey: string; icon: React.ReactNode }> = [
  { mode: "email", labelKey: "studio.linkSettings.email", icon: <Mail className="h-5 w-5" /> },
  { mode: "phone", labelKey: "studio.linkSettings.phone", icon: <Phone className="h-5 w-5" /> },
  { mode: "whatsapp", labelKey: "studio.linkSettings.whatsapp", icon: <MessageCircle className="h-5 w-5" /> },
  { mode: "address", labelKey: "studio.linkSettings.address", icon: <MapPin className="h-5 w-5" /> },
];

function normalizeVisualIdPart(value: string) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9א-ת_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || "section";
}

function normalizeSlug(value: string | null | undefined) {
  const clean = String(value || "").trim();

  if (!clean || clean === "/") return "";

  return clean.replace(/^\//, "").replace(/\/$/, "");
}

function normalizeUrlHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean) return "";
  if (clean.startsWith("#")) return clean;
  if (clean.startsWith("/")) return clean;
  if (clean.startsWith("mailto:")) return clean;
  if (clean.startsWith("tel:")) return clean;
  if (clean.startsWith("sms:")) return clean;
  if (clean.startsWith("https://wa.me/")) return clean;
  if (clean.startsWith("http://wa.me/")) return clean;
  if (clean.startsWith("https://api.whatsapp.com/")) return clean;
  if (clean.startsWith("http://api.whatsapp.com/")) return clean;
  if (clean.startsWith("http://")) return clean;
  if (clean.startsWith("https://")) return clean;

  return `https://${clean}`;
}

function getPageHref(page: LinkSettingsPage | undefined) {
  if (!page || page.isHome || page.id === "home") return "/";

  const cleanSlug = normalizeSlug(page.slug || page.id);

  return cleanSlug ? `/${cleanSlug}` : "/";
}

function normalizePhoneDigits(value: string) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function normalizePhoneForTel(value: string) {
  const clean = normalizePhoneDigits(value);

  if (!clean) return "";
  if (clean.startsWith("+")) return clean;
  if (clean.startsWith("972")) return `+${clean}`;
  if (clean.startsWith("0")) return `+972${clean.slice(1)}`;

  return `+${clean}`;
}

function normalizePhoneForWhatsapp(value: string) {
  const clean = normalizePhoneDigits(value).replace(/^\+/, "");

  if (!clean) return "";
  if (clean.startsWith("972")) return clean;
  if (clean.startsWith("0")) return `972${clean.slice(1)}`;

  return clean;
}

function buildWhatsappHref(phone: string, message: string) {
  const cleanPhone = normalizePhoneForWhatsapp(phone);

  if (!cleanPhone) return "";

  const cleanMessage = String(message || "").trim();
  const encoded = cleanMessage ? `?text=${encodeURIComponent(cleanMessage)}` : "";

  return `https://wa.me/${cleanPhone}${encoded}`;
}

function parseWhatsappHref(href: string) {
  const clean = String(href || "").trim();

  if (!clean.includes("wa.me/") && !clean.includes("api.whatsapp.com")) {
    return {
      phone: "",
      message: "",
    };
  }

  try {
    const url = new URL(clean);
    const pathPhone = url.pathname.replace(/\//g, "");
    const queryPhone = url.searchParams.get("phone") || "";
    const phone = pathPhone || queryPhone;
    const message = url.searchParams.get("text") || "";

    return {
      phone,
      message,
    };
  } catch {
    return {
      phone: clean.replace(/^.*wa\.me\//, "").split("?")[0],
      message: "",
    };
  }
}

function parseMailtoHref(href: string) {
  const clean = String(href || "");

  if (!clean.startsWith("mailto:")) {
    return {
      email: "",
      subject: "",
      body: "",
    };
  }

  const withoutPrefix = clean.replace(/^mailto:/, "");
  const [emailPart, queryPart = ""] = withoutPrefix.split("?");

  try {
    const params = new URLSearchParams(queryPart);

    return {
      email: decodeURIComponent(emailPart || ""),
      subject: params.get("subject") || "",
      body: params.get("body") || "",
    };
  } catch {
    return {
      email: emailPart || "",
      subject: "",
      body: "",
    };
  }
}

function buildMailtoHref(email: string, subject: string, body: string) {
  const cleanEmail = String(email || "").trim();

  if (!cleanEmail) return "";

  const params = new URLSearchParams();

  if (String(subject || "").trim()) {
    params.set("subject", String(subject || "").trim());
  }

  if (String(body || "").trim()) {
    params.set("body", String(body || "").trim());
  }

  const query = params.toString();

  return `mailto:${cleanEmail}${query ? `?${query}` : ""}`;
}

function buildAddressHref(address: string) {
  const cleanAddress = String(address || "").trim();

  if (!cleanAddress) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`;
}

function parseAddressHref(href: string) {
  const clean = String(href || "");

  if (!clean.includes("google.com/maps")) return "";

  try {
    const url = new URL(clean);
    return url.searchParams.get("query") || "";
  } catch {
    return "";
  }
}

function detectModeFromHref(href: string): LinkMode {
  const clean = String(href || "").trim();

  if (!clean) return "page";
  if (clean.startsWith("mailto:")) return "email";
  if (clean.startsWith("tel:")) return "phone";
  if (clean.includes("wa.me/") || clean.includes("api.whatsapp.com")) return "whatsapp";
  if (clean.includes("google.com/maps")) return "address";
  if (clean.startsWith("#")) return "section";
  if (clean.startsWith("/")) return "page";

  return "url";
}

function getSafeTarget(value: LinkTarget | undefined): "_self" | "_blank" {
  return value === "_blank" ? "_blank" : "_self";
}

function getModeLabel(mode: LinkMode, t: (key: string) => string) {
  const item =
    MAIN_MODE_KEYS.find((entry) => entry.mode === mode) ||
    MORE_MODE_KEYS.find((entry) => entry.mode === mode);
  return item ? t(item.labelKey) : t("studio.linkSettings.linkFallback");
}

export default function LinkSettingsModal({
  open,
  pages,
  sections,
  activePageId,
  currentHref = "",
  currentTarget = "_self",
  onClose,
  onSave,
  onRemove,
}: LinkSettingsModalProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const safePages = Array.isArray(pages) ? pages : [];
  const safeSections = Array.isArray(sections) ? sections : [];

  const initialPageId =
    safePages.find((page) => getPageHref(page) === currentHref)?.id ||
    activePageId ||
    safePages[0]?.id ||
    "home";

  const initialSectionId =
    currentHref.startsWith("#") && !currentHref.startsWith("#popup-")
      ? currentHref.replace(/^#/, "")
      : safeSections[0]?.id || "";

  const initialMail = parseMailtoHref(currentHref);
  const initialWhatsapp = parseWhatsappHref(currentHref);
  const initialAddress = parseAddressHref(currentHref);

  const [mode, setMode] = React.useState<LinkMode>(() => detectModeFromHref(currentHref));
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [target, setTarget] = React.useState<"_self" | "_blank">(
    getSafeTarget(currentTarget),
  );

  const [pageId, setPageId] = React.useState(initialPageId);
  const [sectionId, setSectionId] = React.useState(initialSectionId);
  const [urlValue, setUrlValue] = React.useState(currentHref || "");
  const [emailValue, setEmailValue] = React.useState(initialMail.email);
  const [emailSubject, setEmailSubject] = React.useState(initialMail.subject);
  const [emailBody, setEmailBody] = React.useState(initialMail.body);
  const [phoneValue, setPhoneValue] = React.useState(
    currentHref.startsWith("tel:") ? currentHref.replace(/^tel:/, "") : "",
  );
  const [whatsappPhone, setWhatsappPhone] = React.useState(initialWhatsapp.phone);
  const [whatsappMessage, setWhatsappMessage] = React.useState(
    initialWhatsapp.message,
  );
  const [addressValue, setAddressValue] = React.useState(initialAddress);
  const [popupId, setPopupId] = React.useState(
    currentHref.startsWith("#popup-") ? currentHref.replace(/^#popup-/, "") : "contact",
  );
  const [topBottom, setTopBottom] = React.useState<"top" | "bottom">(
    currentHref === "#bottom" ? "bottom" : "top",
  );

  React.useEffect(() => {
    if (!open) return;

    const nextMode = detectModeFromHref(currentHref);
    const nextMail = parseMailtoHref(currentHref);
    const nextWhatsapp = parseWhatsappHref(currentHref);

    setMode(nextMode);
    setShowMoreMenu(false);
    setTarget(getSafeTarget(currentTarget));
    setPageId(
      safePages.find((page) => getPageHref(page) === currentHref)?.id ||
        activePageId ||
        safePages[0]?.id ||
        "home",
    );
    setSectionId(
      currentHref.startsWith("#") && !currentHref.startsWith("#popup-")
        ? currentHref.replace(/^#/, "")
        : safeSections[0]?.id || "",
    );
    setUrlValue(currentHref || "");
    setEmailValue(nextMail.email);
    setEmailSubject(nextMail.subject);
    setEmailBody(nextMail.body);
    setPhoneValue(currentHref.startsWith("tel:") ? currentHref.replace(/^tel:/, "") : "");
    setWhatsappPhone(nextWhatsapp.phone);
    setWhatsappMessage(nextWhatsapp.message);
    setAddressValue(parseAddressHref(currentHref));
    setPopupId(
      currentHref.startsWith("#popup-")
        ? currentHref.replace(/^#popup-/, "")
        : "contact",
    );
    setTopBottom(currentHref === "#bottom" ? "bottom" : "top");
  }, [activePageId, currentHref, currentTarget, open, safePages, safeSections]);

  function buildHref() {
    if (mode === "page") {
      const selectedPage = safePages.find((page) => page.id === pageId) || safePages[0];
      return getPageHref(selectedPage);
    }

    if (mode === "section") {
      return sectionId ? `#${normalizeVisualIdPart(sectionId)}` : "";
    }

    if (mode === "url") {
      return normalizeUrlHref(urlValue);
    }

    if (mode === "email") {
      return buildMailtoHref(emailValue, emailSubject, emailBody);
    }

    if (mode === "phone") {
      const cleanPhone = normalizePhoneForTel(phoneValue);
      return cleanPhone ? `tel:${cleanPhone}` : "";
    }

    if (mode === "whatsapp") {
      return buildWhatsappHref(whatsappPhone, whatsappMessage);
    }

    if (mode === "address") {
      return buildAddressHref(addressValue);
    }


    return "";
  }

  function getPreviewHref() {
    const href = buildHref();

    return href || t("studio.linkSettings.notSet");
  }

  function saveLink() {
    const href = buildHref();

    if (!href) return;

    onSave({
      href,
      target,
      rel: target === "_blank" ? "noopener noreferrer" : "",
    });
  }

  function chooseMode(nextMode: LinkMode) {
    setMode(nextMode);
    setShowMoreMenu(false);
  }

  if (!open) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      dir={dir}
      className="pointer-events-auto fixed inset-0 z-[2147483647] grid place-items-center overflow-y-auto border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/35 p-6 backdrop-blur-[2px]"
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative my-auto max-h-[calc(100vh-48px)] w-[min(760px,calc(100vw-32px))] overflow-y-auto overflow-x-visible rounded-[32px] border border-slate-200 bg-white/95 p-6 text-right shadow-[0_30px_120px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">
              {t("studio.linkSettings.title")}
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              {t("studio.linkSettings.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label={t("studio.close")}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <div className="grid grid-cols-4 gap-2 rounded-[24px] bg-slate-100 p-1">
            {MAIN_MODE_KEYS.map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() => chooseMode(item.mode)}
                className={[
                  "flex h-16 items-center justify-center gap-2 rounded-[20px] text-sm font-black transition",
                  mode === item.mode
                    ? "bg-white text-blue-700 shadow-[0_8px_20px_rgba(15,23,42,0.10)]"
                    : "text-slate-500 hover:text-slate-800",
                ].join(" ")}
                title={t(item.labelKey)}
              >
                {item.icon}
                <span className="hidden sm:inline">{t(item.labelKey)}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowMoreMenu((value) => !value)}
              className={[
                "flex h-16 items-center justify-center gap-2 rounded-[20px] text-sm font-black transition",
                MORE_MODE_KEYS.some((item) => item.mode === mode)
                  ? "bg-white text-blue-700 shadow-[0_8px_20px_rgba(15,23,42,0.10)]"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
              title={t("studio.linkSettings.more")}
            >
              <MoreHorizontal className="h-6 w-6" />
              <span className="hidden sm:inline">{t("studio.linkSettings.more")}</span>
            </button>
          </div>

          {showMoreMenu ? (
            <div className="absolute left-0 top-[76px] z-50 w-[min(340px,calc(100vw-64px))] rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
              <div className="space-y-1">
                {MORE_MODE_KEYS.map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => chooseMode(item.mode)}
                    className={[
                      "flex h-12 w-full items-center justify-start gap-3 rounded-2xl px-4 text-right text-base font-bold transition",
                      mode === item.mode
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-800 hover:bg-slate-50",
                    ].join(" ")}
                    dir={dir}
                  >
                    {item.icon}
                    <span>{t(item.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="min-h-[210px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-slate-800">
              {getModeLabel(mode, t)}
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              {t("studio.linkSettings.linkType")}
            </span>
          </div>

          {mode === "page" ? (
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-600">
                {t("studio.linkSettings.choosePage")}
              </span>
              <select
                value={pageId}
                onChange={(event) => setPageId(event.target.value)}
                className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-right text-base font-black text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              >
                {safePages.length ? (
                  safePages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title || page.id}
                    </option>
                  ))
                ) : (
                  <option value="home">Homepage</option>
                )}
              </select>
            </label>
          ) : null}

          {mode === "section" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  {t("studio.linkSettings.chooseSection")}
                </span>
                <select
                  value={sectionId}
                  onChange={(event) => setSectionId(event.target.value)}
                  className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-right text-base font-black text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                >
                  {safeSections.length ? (
                    safeSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title || section.id}
                      </option>
                    ))
                  ) : (
                    <option value="contact">Contact</option>
                  )}
                </select>
              </label>
            </div>
          ) : null}

          {mode === "url" ? (
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-600">
                {t("studio.linkSettings.websiteUrl")}
              </span>
              <input
                value={urlValue}
                onChange={(event) => setUrlValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveLink();
                }}
                placeholder={t("studio.linkSettings.urlPlaceholder")}
                dir="ltr"
                className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-left text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          ) : null}

          {mode === "email" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  {t("studio.linkSettings.emailAddress")}
                </span>
                <input
                  value={emailValue}
                  onChange={(event) => setEmailValue(event.target.value)}
                  placeholder="hello@example.com"
                  dir="ltr"
                  className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-left text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  {t("studio.linkSettings.subjectOptional")}
                </span>
                <input
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  placeholder={t("studio.linkSettings.subjectPlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-right text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          ) : null}

          {mode === "phone" ? (
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-600">
                {t("studio.linkSettings.phoneNumber")}
              </span>
              <input
                value={phoneValue}
                onChange={(event) => setPhoneValue(event.target.value)}
                placeholder="0501234567"
                dir="ltr"
                className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-left text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          ) : null}

          {mode === "whatsapp" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  {t("studio.linkSettings.whatsappNumber")}
                </span>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={whatsappPhone}
                    onChange={(event) => setWhatsappPhone(event.target.value)}
                    placeholder="0501234567"
                    dir="ltr"
                    className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 pr-12 text-left text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <span className="mt-2 block text-xs font-bold text-slate-400">
                  {t("studio.linkSettings.whatsappHint")}
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-600">
                  {t("studio.linkSettings.presetMessage")}
                </span>
                <textarea
                  value={whatsappMessage}
                  onChange={(event) => setWhatsappMessage(event.target.value)}
                  placeholder={t("studio.linkSettings.messagePlaceholder")}
                  className="min-h-[100px] w-full resize-y rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-right text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          ) : null}

          {mode === "address" ? (
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-600">
                {t("studio.linkSettings.address")}
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={addressValue}
                  onChange={(event) => setAddressValue(event.target.value)}
                  placeholder={t("studio.linkSettings.addressPlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-slate-200 bg-white px-4 pr-12 text-right text-base font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500" dir="ltr">
          {getPreviewHref()}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setTarget("_self")}
            className={[
              "rounded-xl px-3 py-3 text-sm font-black transition",
              target === "_self"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500",
            ].join(" ")}
          >
            {t("studio.linkSettings.sameTab")}
          </button>

          <button
            type="button"
            onClick={() => setTarget("_blank")}
            className={[
              "rounded-xl px-3 py-3 text-sm font-black transition",
              target === "_blank"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500",
            ].join(" ")}
          >
            {t("studio.linkSettings.newTab")}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-sm font-black text-blue-700 transition hover:bg-blue-50"
          >
            <Trash2 className="h-4 w-4" />
            {t("studio.linkSettings.removeLink")}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              {t("studio.cancel")}
            </button>

            <button
              type="button"
              onClick={saveLink}
              disabled={!buildHref()}
              className={[
                "h-12 rounded-2xl px-8 text-sm font-black text-black transition",
                buildHref()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300",
              ].join(" ")}
            >
              {t("studio.save")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
