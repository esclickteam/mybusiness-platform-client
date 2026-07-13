import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Globe,
  HelpCircle,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SquareStack,
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

const PRIMARY_TABS: Array<{
  id: VisualLinkModalTab;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "page", label: "עמוד", icon: <FileText className="h-5 w-5" /> },
  { id: "section", label: "סקשן", icon: <SquareStack className="h-5 w-5" /> },
  { id: "web", label: "אינטרנט", icon: <Globe className="h-5 w-5" /> },
  {
    id: "whatsapp",
    label: "וואטסאפ",
    icon: <MessageCircle className="h-5 w-5" />,
  },
];

const MORE_TABS: Array<{
  id: VisualLinkModalTab;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "document", label: "מסמך", icon: <FileText className="h-4 w-4" /> },
  { id: "email", label: "אימייל", icon: <Mail className="h-4 w-4" /> },
  { id: "phone", label: "טלפון", icon: <Phone className="h-4 w-4" /> },
  { id: "anchor", label: "ראש/תחתית עמוד", icon: <ArrowUp className="h-4 w-4" /> },
  { id: "address", label: "כתובת", icon: <MapPin className="h-4 w-4" /> },
];

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
  const [moreOpen, setMoreOpen] = useState(false);
  const [hrefValue, setHrefValue] = useState(href);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [emailValue, setEmailValue] = useState(email);
  const [subjectValue, setSubjectValue] = useState(subject);
  const [messageValue, setMessageValue] = useState(message);
  const [addressValue, setAddressValue] = useState("");

  useEffect(() => {
    if (!open) return;

    setHrefValue(href);
    setPhoneValue(phone);
    setEmailValue(email);
    setSubjectValue(subject);
    setMessageValue(message);
    setMoreOpen(false);

    if (href.startsWith("mailto:")) setTab("email");
    else if (href.startsWith("tel:")) setTab("phone");
    else if (href.includes("wa.me")) setTab("whatsapp");
    else if (href.startsWith("#")) setTab(sections.length ? "section" : "web");
    else if (href.startsWith("/")) setTab("page");
    else setTab("web");
  }, [open, href, phone, email, subject, message, sections.length]);

  const title = useMemo(() => {
    if (tab === "whatsapp") return "מספר וואטסאפ";
    if (tab === "email") return "כתובת אימייל";
    if (tab === "phone") return "מספר טלפון";
    if (tab === "page") return "בחירת עמוד";
    if (tab === "section") return "בחירת סקשן";
    if (tab === "address") return "כתובת";
    if (tab === "anchor") return "גלילה בעמוד";
    return "כתובת קישור";
  }, [tab]);

  if (!open || typeof document === "undefined") return null;

  const handleApply = () => {
    if (tab === "whatsapp") {
      const digits = phoneValue.replace(/\D/g, "");
      onApply({
        href: digits
          ? `https://wa.me/${digits}${
              messageValue.trim()
                ? `?text=${encodeURIComponent(messageValue.trim())}`
                : ""
            }`
          : "#",
        target: "_blank",
        phoneNumber: phoneValue,
        message: messageValue,
      });
      onClose();
      return;
    }

    if (tab === "email") {
      const params = new URLSearchParams();
      if (subjectValue.trim()) params.set("subject", subjectValue.trim());
      onApply({
        href: emailValue
          ? `mailto:${emailValue}${params.toString() ? `?${params}` : ""}`
          : "#",
        email: emailValue,
        subject: subjectValue,
      });
      onClose();
      return;
    }

    if (tab === "phone") {
      onApply({
        href: phoneValue ? `tel:${phoneValue}` : "#",
        phoneNumber: phoneValue,
      });
      onClose();
      return;
    }

    if (tab === "address") {
      onApply({
        href: addressValue
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressValue)}`
          : "#",
        target: "_blank",
      });
      onClose();
      return;
    }

    if (tab === "anchor") {
      onApply({ href: hrefValue || "#top" });
      onClose();
      return;
    }

    onApply({
      href: hrefValue || "#",
      target:
        hrefValue.startsWith("http") || hrefValue.startsWith("https")
          ? "_blank"
          : "_self",
    });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483605] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-slate-700" />
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">
                קישור אל
              </h2>
              <p className="text-sm font-medium text-slate-500">{elementLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="עזרה"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
              aria-label="סגירה"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            {PRIMARY_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTab(item.id);
                  setMoreOpen(false);
                }}
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-2xl border transition",
                  tab === item.id
                    ? "border-slate-300 bg-slate-100 text-slate-900 shadow-sm"
                    : "border-transparent bg-white text-slate-500 hover:bg-slate-50",
                ].join(" ")}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((current) => !current)}
                className={[
                  "flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-black transition",
                  moreOpen || MORE_TABS.some((item) => item.id === tab)
                    ? "border-slate-300 bg-slate-100 text-slate-900"
                    : "border-transparent bg-white text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                ···
              </button>

              {moreOpen ? (
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                  {MORE_TABS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTab(item.id);
                        setMoreOpen(false);
                        if (item.id === "anchor") setHrefValue("#top");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-right text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>

          {tab === "page" ? (
            <select
              value={hrefValue}
              onChange={(event) => setHrefValue(event.target.value)}
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
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
          ) : null}

          {tab === "section" ? (
            <select
              value={hrefValue}
              onChange={(event) => setHrefValue(event.target.value)}
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
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
          ) : null}

          {tab === "web" || tab === "document" ? (
            <input
              value={hrefValue}
              onChange={(event) => setHrefValue(event.target.value)}
              placeholder="https://example.com"
              dir="ltr"
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-left text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          ) : null}

          {tab === "whatsapp" ? (
            <>
              <input
                value={phoneValue}
                onChange={(event) => setPhoneValue(event.target.value)}
                placeholder="מספר וואטסאפ, לדוגמה 0501234567"
                className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <input
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
                placeholder="הודעה מוכנה מראש (אופציונלי)"
                className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <p className="mt-3 text-sm leading-6 text-slate-500">
                מבקרים יוכלו ליצור איתכם קשר בלחיצה על הקישור הזה בכל מכשיר
                שמותקנת בו וואטסאפ.
              </p>
            </>
          ) : null}

          {tab === "email" ? (
            <>
              <input
                value={emailValue}
                onChange={(event) => setEmailValue(event.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-left text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <input
                value={subjectValue}
                onChange={(event) => setSubjectValue(event.target.value)}
                placeholder="נושא האימייל"
                className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </>
          ) : null}

          {tab === "phone" ? (
            <input
              value={phoneValue}
              onChange={(event) => setPhoneValue(event.target.value)}
              placeholder="0501234567"
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          ) : null}

          {tab === "address" ? (
            <input
              value={addressValue}
              onChange={(event) => setAddressValue(event.target.value)}
              placeholder="רחוב, עיר, מדינה"
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          ) : null}

          {tab === "anchor" ? (
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setHrefValue("#top")}
                className={[
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black",
                  hrefValue === "#top"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700",
                ].join(" ")}
              >
                <ArrowUp className="h-4 w-4" />
                ראש העמוד
              </button>
              <button
                type="button"
                onClick={() => setHrefValue("#bottom")}
                className={[
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black",
                  hrefValue === "#bottom"
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-700",
                ].join(" ")}
              >
                <ArrowDown className="h-4 w-4" />
                תחתית העמוד
              </button>
            </div>
          ) : null}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              onRemove?.();
              onClose();
            }}
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            הסרת קישור
          </button>

          <button
            type="button"
            disabled={!elementId}
            onClick={handleApply}
            className="rounded-full bg-[#116dff] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#0f5ed6] disabled:opacity-40"
          >
            קישור
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
