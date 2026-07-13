import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  normalizePhoneForHref,
  normalizeWhatsAppPhone,
} from "../utils/visualDomApply";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SquareStack,
  Trash2,
  X,
} from "lucide-react";

export type VisualLinkModalTab =
  | "page"
  | "section"
  | "web"
  | "whatsapp"
  | "email"
  | "phone"
  | "document"
  | "anchor"
  | "address";

type VisualLinkModalProps = {
  open: boolean;
  elementId: string;
  elementLabel?: string;
  href?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  pages?: Array<{ id: string; label: string; href: string }>;
  sections?: Array<{ id: string; label: string; href: string }>;
  onClose: () => void;
  onApply: (payload: {
    href: string;
    target?: string;
    phoneNumber?: string;
    email?: string;
    subject?: string;
    message?: string;
  }) => void;
  onRemove?: () => void;
};

type TabDefinition = {
  id: VisualLinkModalTab;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const LINK_TABS: TabDefinition[] = [
  {
    id: "web",
    label: "אינטרנט",
    description: "אתר או כתובת URL",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "whatsapp",
    label: "וואטסאפ",
    description: "פתיחת שיחה ישירה",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    id: "phone",
    label: "טלפון",
    description: "חיוג בלחיצה",
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: "email",
    label: "אימייל",
    description: "פתיחת הודעה חדשה",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    id: "page",
    label: "עמוד",
    description: "עמוד אחר באתר",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "section",
    label: "סקשן",
    description: "גלילה לאזור בעמוד",
    icon: <SquareStack className="h-5 w-5" />,
  },
  {
    id: "document",
    label: "מסמך",
    description: "PDF או קובץ להורדה",
    icon: <ExternalLink className="h-5 w-5" />,
  },
  {
    id: "address",
    label: "כתובת",
    description: "פתיחה במפות",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "anchor",
    label: "ראש / תחתית",
    description: "ניווט מהיר בעמוד",
    icon: <ArrowUp className="h-5 w-5" />,
  },
];

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractQueryParam(href: string, key: string) {
  try {
    const query = href.split("?")[1] || "";
    return safeDecode(new URLSearchParams(query).get(key) || "");
  } catch {
    return "";
  }
}

function normalizeExternalHref(value: string) {
  const clean = value.trim();

  if (!clean) return "#";

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("/") ||
    clean.startsWith("#") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:")
  ) {
    return clean;
  }

  return `https://${clean}`;
}

function getInitialTab(
  href: string,
  sectionsLength: number,
): VisualLinkModalTab {
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (href.includes("wa.me")) return "whatsapp";
  if (href.includes("google.com/maps")) return "address";
  if (href === "#top" || href === "#bottom") return "anchor";
  if (href.startsWith("#")) return sectionsLength ? "section" : "anchor";
  if (href.startsWith("/")) return "page";
  if (/\.(pdf|docx?|xlsx?|pptx?|zip)(\?|#|$)/i.test(href)) return "document";
  return "web";
}

export default function VisualLinkModal({
  open,
  elementId,
  elementLabel = "קישור",
  href = "",
  phone = "",
  email = "",
  subject = "",
  message = "",
  pages = [],
  sections = [],
  onClose,
  onApply,
  onRemove,
}: VisualLinkModalProps) {
  const [tab, setTab] = useState<VisualLinkModalTab>("web");
  const [hrefValue, setHrefValue] = useState(href);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [emailValue, setEmailValue] = useState(email);
  const [subjectValue, setSubjectValue] = useState(subject);
  const [messageValue, setMessageValue] = useState(message);
  const [addressValue, setAddressValue] = useState("");

  useEffect(() => {
    if (!open) return;

    const nextTab = getInitialTab(href, sections.length);

    setTab(nextTab);
    setHrefValue(href);
    setPhoneValue(
      phone ||
        (href.startsWith("tel:") ? href.replace(/^tel:/, "") : ""),
    );
    setEmailValue(
      email ||
        (href.startsWith("mailto:")
          ? href.replace(/^mailto:/, "").split("?")[0]
          : ""),
    );
    setSubjectValue(
      subject ||
        (href.startsWith("mailto:")
          ? extractQueryParam(href, "subject")
          : ""),
    );
    setMessageValue(
      message ||
        (href.includes("wa.me")
          ? extractQueryParam(href, "text")
          : href.startsWith("mailto:")
            ? extractQueryParam(href, "body")
            : ""),
    );

    if (href.includes("google.com/maps")) {
      setAddressValue(extractQueryParam(href, "query"));
    } else {
      setAddressValue("");
    }
  }, [
    open,
    href,
    phone,
    email,
    subject,
    message,
    sections.length,
  ]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "enter"
      ) {
        event.preventDefault();
        handleApply();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  const activeTab = useMemo(
    () => LINK_TABS.find((item) => item.id === tab) || LINK_TABS[0],
    [tab],
  );

  const previewValue = useMemo(() => {
    if (tab === "whatsapp") {
      const normalized = normalizeWhatsAppPhone(phoneValue);
      if (!normalized) return "https://wa.me/972...";
      return `https://wa.me/${normalized}${
        messageValue.trim() ? "?text=..." : ""
      }`;
    }

    if (tab === "phone") {
      const normalized = normalizePhoneForHref(phoneValue);
      return normalized ? `tel:${normalized}` : "tel:+972...";
    }

    if (tab === "email") {
      const params = new URLSearchParams();
      if (subjectValue.trim()) params.set("subject", subjectValue.trim());
      if (messageValue.trim()) params.set("body", messageValue.trim());
      return emailValue.trim()
        ? `mailto:${emailValue.trim()}${
            params.toString() ? `?${params.toString()}` : ""
          }`
        : "mailto:name@example.com";
    }

    if (tab === "address") {
      return addressValue.trim()
        ? `Google Maps · ${addressValue.trim()}`
        : "Google Maps · כתובת העסק";
    }

    if (tab === "anchor") return hrefValue || "#top";

    return hrefValue || "לא הוגדר עדיין קישור";
  }, [
    tab,
    hrefValue,
    phoneValue,
    emailValue,
    subjectValue,
    messageValue,
    addressValue,
  ]);

  const canApply = useMemo(() => {
    if (!elementId) return false;
    if (tab === "whatsapp" || tab === "phone") return Boolean(phoneValue.trim());
    if (tab === "email") return Boolean(emailValue.trim());
    if (tab === "address") return Boolean(addressValue.trim());
    if (tab === "page") return Boolean(hrefValue || pages.length);
    if (tab === "section") return Boolean(hrefValue || sections.length);
    return Boolean(hrefValue.trim());
  }, [
    elementId,
    tab,
    phoneValue,
    emailValue,
    addressValue,
    hrefValue,
    pages.length,
    sections.length,
  ]);

  if (!open || typeof document === "undefined") return null;

  const handleApply = () => {
    if (tab === "whatsapp") {
      const normalizedPhone = normalizeWhatsAppPhone(phoneValue);
      const params = new URLSearchParams();

      if (messageValue.trim()) {
        params.set("text", messageValue.trim());
      }

      onApply({
        href: normalizedPhone
          ? `https://wa.me/${normalizedPhone}${
              params.toString() ? `?${params.toString()}` : ""
            }`
          : "#",
        target: "_blank",
        phoneNumber: phoneValue.trim(),
        message: messageValue.trim(),
      });
      onClose();
      return;
    }

    if (tab === "email") {
      const params = new URLSearchParams();

      if (subjectValue.trim()) {
        params.set("subject", subjectValue.trim());
      }

      if (messageValue.trim()) {
        params.set("body", messageValue.trim());
      }

      const cleanEmail = emailValue.trim();

      onApply({
        href: cleanEmail
          ? `mailto:${cleanEmail}${
              params.toString() ? `?${params.toString()}` : ""
            }`
          : "#",
        target: "_self",
        email: cleanEmail,
        subject: subjectValue.trim(),
        message: messageValue.trim(),
      });
      onClose();
      return;
    }

    if (tab === "phone") {
      const normalizedPhone = normalizePhoneForHref(phoneValue);

      onApply({
        href: normalizedPhone ? `tel:${normalizedPhone}` : "#",
        target: "_self",
        phoneNumber: phoneValue.trim(),
      });
      onClose();
      return;
    }

    if (tab === "address") {
      const cleanAddress = addressValue.trim();

      onApply({
        href: cleanAddress
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              cleanAddress,
            )}`
          : "#",
        target: "_blank",
      });
      onClose();
      return;
    }

    if (tab === "anchor") {
      onApply({
        href: hrefValue || "#top",
        target: "_self",
      });
      onClose();
      return;
    }

    const cleanHref =
      tab === "web" || tab === "document"
        ? normalizeExternalHref(hrefValue)
        : hrefValue || "#";

    onApply({
      href: cleanHref,
      target:
        cleanHref.startsWith("http://") ||
        cleanHref.startsWith("https://")
          ? "_blank"
          : "_self",
    });
    onClose();
  };

  const fieldClassName =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  const textareaClassName =
    "min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483605] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-md sm:p-6"
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="עריכת קישור"
        className="relative my-auto flex max-h-[calc(100vh-24px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.32)] sm:max-h-[calc(100vh-48px)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.14),transparent_55%),radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_52%)]" />

        <header className="relative flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200">
              <Link2 className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[30px]">
                הוספת קישור
              </h2>
              <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                {elementLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <section className="border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-7">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LINK_TABS.map((item) => {
                const isActive = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTab(item.id);

                      if (item.id === "anchor" && !hrefValue.startsWith("#")) {
                        setHrefValue("#top");
                      }

                      if (
                        item.id === "page" &&
                        !hrefValue &&
                        pages.length
                      ) {
                        setHrefValue(pages[0].href);
                      }

                      if (
                        item.id === "section" &&
                        !hrefValue.startsWith("#") &&
                        sections.length
                      ) {
                        setHrefValue(sections[0].href);
                      }
                    }}
                    className={[
                      "group flex min-h-[76px] items-center gap-3 rounded-2xl border px-3 py-3 text-right transition duration-200",
                      isActive
                        ? "border-violet-300 bg-white text-violet-700 shadow-[0_10px_28px_rgba(124,58,237,0.12)]"
                        : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                        isActive
                          ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-violet-200"
                          : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 group-hover:text-violet-600",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-black">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-400">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                  {activeTab.label}
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  {activeTab.description}
                </h3>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 sm:flex">
                {activeTab.icon}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
              {tab === "page" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    בחרי עמוד
                  </span>
                  <select
                    value={hrefValue}
                    onChange={(event) => setHrefValue(event.target.value)}
                    className={fieldClassName}
                  >
                    {pages.length ? (
                      pages.map((page) => (
                        <option key={page.id} value={page.href}>
                          {page.label}
                        </option>
                      ))
                    ) : (
                      <option value="/">אין עמודים זמינים</option>
                    )}
                  </select>
                </label>
              ) : null}

              {tab === "section" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    בחרי סקשן
                  </span>
                  <select
                    value={hrefValue}
                    onChange={(event) => setHrefValue(event.target.value)}
                    className={fieldClassName}
                  >
                    {sections.length ? (
                      sections.map((section) => (
                        <option key={section.id} value={section.href}>
                          {section.label}
                        </option>
                      ))
                    ) : (
                      <option value="#top">אין סקשנים זמינים</option>
                    )}
                  </select>
                </label>
              ) : null}

              {tab === "web" || tab === "document" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    {tab === "document"
                      ? "כתובת הקובץ"
                      : "כתובת האתר"}
                  </span>
                  <input
                    value={hrefValue}
                    onChange={(event) => setHrefValue(event.target.value)}
                    placeholder={
                      tab === "document"
                        ? "https://example.com/file.pdf"
                        : "https://example.com"
                    }
                    dir="ltr"
                    className={`${fieldClassName} text-left`}
                  />
                  <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
                    ניתן להדביק כתובת מלאה. אם חסר https:// הוא יתווסף
                    אוטומטית.
                  </span>
                </label>
              ) : null}

              {tab === "whatsapp" ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      מספר וואטסאפ
                    </span>
                    <input
                      value={phoneValue}
                      onChange={(event) =>
                        setPhoneValue(event.target.value)
                      }
                      placeholder="0501234567"
                      inputMode="tel"
                      dir="ltr"
                      className={`${fieldClassName} text-left`}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      הודעה מוכנה מראש
                    </span>
                    <textarea
                      value={messageValue}
                      onChange={(event) =>
                        setMessageValue(event.target.value)
                      }
                      placeholder="שלום, אשמח לקבל פרטים נוספים..."
                      className={textareaClassName}
                    />
                  </label>
                </div>
              ) : null}

              {tab === "email" ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      כתובת אימייל
                    </span>
                    <input
                      value={emailValue}
                      onChange={(event) =>
                        setEmailValue(event.target.value)
                      }
                      placeholder="name@example.com"
                      inputMode="email"
                      dir="ltr"
                      className={`${fieldClassName} text-left`}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      נושא
                    </span>
                    <input
                      value={subjectValue}
                      onChange={(event) =>
                        setSubjectValue(event.target.value)
                      }
                      placeholder="נושא האימייל"
                      className={fieldClassName}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      תוכן הודעה
                    </span>
                    <textarea
                      value={messageValue}
                      onChange={(event) =>
                        setMessageValue(event.target.value)
                      }
                      placeholder="שלום, אשמח לקבל פרטים נוספים..."
                      className={textareaClassName}
                    />
                  </label>
                </div>
              ) : null}

              {tab === "phone" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    מספר טלפון
                  </span>
                  <input
                    value={phoneValue}
                    onChange={(event) =>
                      setPhoneValue(event.target.value)
                    }
                    placeholder="0501234567"
                    inputMode="tel"
                    dir="ltr"
                    className={`${fieldClassName} text-left`}
                  />
                  <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
                    במובייל המספר ייפתח ישירות בחייגן.
                  </span>
                </label>
              ) : null}

              {tab === "address" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    כתובת העסק
                  </span>
                  <input
                    value={addressValue}
                    onChange={(event) =>
                      setAddressValue(event.target.value)
                    }
                    placeholder="רחוב, עיר, מדינה"
                    className={fieldClassName}
                  />
                  <span className="mt-2 block text-xs font-semibold leading-5 text-slate-400">
                    הקישור ייפתח בחיפוש Google Maps.
                  </span>
                </label>
              ) : null}

              {tab === "anchor" ? (
                <div>
                  <span className="mb-3 block text-sm font-black text-slate-700">
                    לאן לגלול?
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHrefValue("#top")}
                      className={[
                        "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-black transition",
                        hrefValue === "#top"
                          ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50",
                      ].join(" ")}
                    >
                      <ArrowUp className="h-5 w-5" />
                      ראש העמוד
                    </button>

                    <button
                      type="button"
                      onClick={() => setHrefValue("#bottom")}
                      className={[
                        "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-black transition",
                        hrefValue === "#bottom"
                          ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50",
                      ].join(" ")}
                    >
                      <ArrowDown className="h-5 w-5" />
                      תחתית העמוד
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Check className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-500">
                    תצוגת הקישור
                  </p>
                  <p
                    className="mt-1 break-all text-sm font-bold text-slate-800"
                    dir={
                      tab === "web" ||
                      tab === "document" ||
                      tab === "email" ||
                      tab === "phone" ||
                      tab === "whatsapp"
                        ? "ltr"
                        : "rtl"
                    }
                  >
                    {previewValue}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="relative flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            onClick={() => {
              onRemove?.();
              onClose();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 text-sm font-black text-red-600 transition hover:border-red-200 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            הסרת קישור
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50 sm:flex-none"
            >
              ביטול
            </button>

            <button
              type="button"
              disabled={!canApply}
              onClick={handleApply}
              className="inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:flex-none"
            >
              <Link2 className="h-4 w-4" />
              שמירת קישור
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
