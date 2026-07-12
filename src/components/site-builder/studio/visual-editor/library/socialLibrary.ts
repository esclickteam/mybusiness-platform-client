import { absoluteLayout, boxNode, iconNode, textNode } from "./libraryFactories";
import type { VisualLibraryElementItem } from "./visualLibraryTypes";

type SocialDefinition = {
  id: string;
  title: string;
  platform: string;
  iconName: string;
  color: string;
  href?: string;
  phoneNumber?: string;
  message?: string;
  category?: "social" | "contact";
};

const socialDefinitions: SocialDefinition[] = [
  {
    id: "instagram",
    title: "Instagram",
    platform: "instagram",
    iconName: "instagram",
    color: "#d946ef",
    href: "https://instagram.com/",
  },
  {
    id: "facebook",
    title: "Facebook",
    platform: "facebook",
    iconName: "facebook",
    color: "#1877f2",
    href: "https://facebook.com/",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    platform: "whatsapp",
    iconName: "whatsapp",
    color: "#25d366",
    phoneNumber: "",
    message: "היי, אשמח לקבל פרטים",
    category: "contact",
  },
  {
    id: "tiktok",
    title: "TikTok",
    platform: "tiktok",
    iconName: "tiktok",
    color: "#111111",
    href: "https://tiktok.com/",
  },
  {
    id: "youtube",
    title: "YouTube",
    platform: "youtube",
    iconName: "youtube",
    color: "#ff0000",
    href: "https://youtube.com/",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    platform: "linkedin",
    iconName: "linkedin",
    color: "#0a66c2",
    href: "https://linkedin.com/",
  },
  {
    id: "x",
    title: "X / Twitter",
    platform: "x",
    iconName: "x",
    color: "#111111",
    href: "https://x.com/",
  },
  {
    id: "telegram",
    title: "Telegram",
    platform: "telegram",
    iconName: "telegram",
    color: "#229ed9",
    href: "https://t.me/",
  },
  {
    id: "pinterest",
    title: "Pinterest",
    platform: "pinterest",
    iconName: "pinterest",
    color: "#e60023",
    href: "https://pinterest.com/",
  },
  {
    id: "phone",
    title: "חיוג טלפוני",
    platform: "phone",
    iconName: "phone",
    color: "#0f172a",
    phoneNumber: "",
    category: "contact",
  },
  {
    id: "email",
    title: "שליחת אימייל",
    platform: "email",
    iconName: "email",
    color: "#7c3aed",
    category: "contact",
  },
  {
    id: "waze",
    title: "Waze",
    platform: "waze",
    iconName: "waze",
    color: "#33ccff",
    href: "https://waze.com/ul",
    category: "contact",
  },
  {
    id: "google-maps",
    title: "Google Maps",
    platform: "map",
    iconName: "map",
    color: "#16a34a",
    href: "https://maps.google.com/",
    category: "contact",
  },
  {
    id: "custom-link",
    title: "קישור מותאם",
    platform: "custom",
    iconName: "globe",
    color: "#475569",
    href: "https://",
    category: "social",
  },
];

function buildSocialButton(
  definition: SocialDefinition,
  style: "circle" | "pill" | "outline",
): VisualLibraryElementItem {
  const isPill = style === "pill";
  const isOutline = style === "outline";
  const width = isPill ? "210px" : "58px";
  const title =
    style === "circle"
      ? definition.title
      : `${definition.title} ${style === "pill" ? "עם טקסט" : "מסגרת"}`;

  return {
    id: `social-${definition.id}-${style}`,
    kind: isPill ? "group" : "element",
    tab: "elements",
    category: definition.category || "social",
    title,
    description:
      definition.platform === "phone"
        ? "לחיצה תפתח את החייגן"
        : definition.platform === "whatsapp"
          ? "לחיצה תפתח שיחת WhatsApp"
          : `קישור ישיר אל ${definition.title}`,
    keywords: [
      definition.title,
      definition.platform,
      "רשתות",
      "קישור",
      "כפתור",
    ],
    previewHtml: isPill
      ? `<div style="display:inline-flex;align-items:center;gap:10px;background:${definition.color};color:white;border-radius:999px;padding:11px 18px;font-weight:900">${definition.iconName.toUpperCase()} ${definition.title}</div>`
      : `<div style="width:60px;height:60px;margin:auto;border-radius:999px;display:flex;align-items:center;justify-content:center;background:${
          isOutline ? "#ffffff" : definition.color
        };border:${isOutline ? `2px solid ${definition.color}` : "0"};color:${
          isOutline ? definition.color : "#ffffff"
        };font-weight:900">${definition.iconName.toUpperCase()}</div>`,
    nodes: [
      {
        key: "root",
        type:
          definition.platform === "phone"
            ? "phone-link"
            : definition.platform === "email"
              ? "email-link"
              : "social-link",
        label: title,
        tagName: "a",
        content: {
          platform: definition.platform,
          iconName: definition.iconName,
          iconText:
            definition.platform === "instagram"
              ? "IG"
              : definition.platform === "facebook"
                ? "f"
                : definition.platform === "whatsapp"
                  ? "WA"
                  : definition.platform === "linkedin"
                    ? "in"
                    : definition.platform === "youtube"
                      ? "▶"
                      : definition.platform === "telegram"
                        ? "➤"
                        : definition.platform === "phone"
                          ? "☎"
                          : definition.platform === "email"
                            ? "✉"
                            : definition.platform === "map"
                              ? "⌖"
                              : definition.platform === "waze"
                                ? "W"
                                : definition.platform === "pinterest"
                                  ? "P"
                                  : definition.platform === "x"
                                    ? "X"
                                    : "◎",
          text: isPill ? definition.title : "",
          href: definition.href || "",
          phoneNumber: definition.phoneNumber || "",
          message: definition.message || "",
          email: "",
          subject: "",
          body: "",
          target:
            definition.platform === "phone" ||
            definition.platform === "email"
              ? "_self"
              : "_blank",
          rel: "noopener noreferrer",
          ariaLabel: definition.title,
        },
        style: {
          color: isOutline ? definition.color : "#ffffff",
          backgroundColor: isOutline
            ? "#ffffff"
            : definition.color,
          border: isOutline
            ? `2px solid ${definition.color}`
            : "0",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isPill ? "10px" : "0",
          fontSize: isPill ? "16px" : "17px",
          fontWeight: "900",
          textDecoration: "none",
          boxShadow: isOutline
            ? "none"
            : "0 12px 28px rgba(15,23,42,.16)",
          padding: isPill ? "0 20px" : "0",
        },
        layout: absoluteLayout(
          40,
          40,
          width,
          "58px",
          25,
        ),
      },
    ],
  };
}

export const SOCIAL_LIBRARY: VisualLibraryElementItem[] = [
  ...socialDefinitions.flatMap((definition) => [
    buildSocialButton(definition, "circle"),
    buildSocialButton(definition, "pill"),
    buildSocialButton(definition, "outline"),
  ]),
  {
    id: "social-bar-main",
    kind: "group",
    tab: "elements",
    category: "social",
    title: "סרגל רשתות",
    description: "Instagram, Facebook, WhatsApp, TikTok ו־YouTube",
    keywords: ["סרגל", "רשתות", "social bar", "אייקונים"],
    previewHtml:
      '<div style="display:flex;gap:8px"><span style="width:36px;height:36px;border-radius:99px;background:#d946ef;color:white;display:grid;place-items:center">IG</span><span style="width:36px;height:36px;border-radius:99px;background:#1877f2;color:white;display:grid;place-items:center">f</span><span style="width:36px;height:36px;border-radius:99px;background:#25d366;color:white;display:grid;place-items:center">WA</span><span style="width:36px;height:36px;border-radius:99px;background:#111;color:white;display:grid;place-items:center">♪</span></div>',
    nodes: [
      ["instagram", "IG", "#d946ef"],
      ["facebook", "f", "#1877f2"],
      ["whatsapp", "WA", "#25d366"],
      ["tiktok", "♪", "#111111"],
      ["youtube", "▶", "#ff0000"],
    ].map(([platform, iconText, color], index) => ({
      key: `social-${platform}`,
      type:
        platform === "whatsapp" ? "social-link" : "social-link",
      label: String(platform),
      tagName: "a",
      content: {
        platform,
        iconName: platform,
        iconText,
        href:
          platform === "instagram"
            ? "https://instagram.com/"
            : platform === "facebook"
              ? "https://facebook.com/"
              : platform === "tiktok"
                ? "https://tiktok.com/"
                : platform === "youtube"
                  ? "https://youtube.com/"
                  : "",
        phoneNumber: "",
        message: "היי, אשמח לקבל פרטים",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      style: {
        color: "#ffffff",
        backgroundColor: color,
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "900",
        textDecoration: "none",
      },
      layout: absoluteLayout(
        40 + index * 64,
        40,
        "52px",
        "52px",
        20 + index,
      ),
    })),
  },
  {
    id: "contact-floating-whatsapp",
    kind: "group",
    tab: "elements",
    category: "contact",
    title: "WhatsApp צף",
    description: "כפתור צף עם טקסט והודעה",
    keywords: ["whatsapp", "צף", "ליד", "קשר"],
    previewHtml:
      '<div style="display:flex;align-items:center;gap:10px;background:#25d366;color:white;border-radius:999px;padding:12px 20px;font-weight:900">WA דברו איתנו</div>',
    nodes: [
      {
        key: "root",
        type: "social-link",
        label: "WhatsApp צף",
        tagName: "a",
        content: {
          platform: "whatsapp",
          iconName: "whatsapp",
          iconText: "WA",
          text: "דברו איתנו",
          phoneNumber: "",
          message: "היי, אשמח לקבל פרטים",
          target: "_blank",
          rel: "noopener noreferrer",
          floating: true,
        },
        style: {
          color: "#ffffff",
          backgroundColor: "#25d366",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "16px",
          fontWeight: "900",
          textDecoration: "none",
          boxShadow: "0 16px 38px rgba(37,211,102,.32)",
          padding: "0 22px",
        },
        layout: {
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "190px",
          height: "58px",
          zIndex: 999,
          freePosition: true,
        },
      },
    ],
  },
];
