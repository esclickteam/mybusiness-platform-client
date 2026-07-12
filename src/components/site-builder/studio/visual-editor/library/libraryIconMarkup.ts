const ICONS: Record<string, string> = {
  instagram: "IG",
  facebook: "f",
  whatsapp: "WA",
  tiktok: "♪",
  youtube: "▶",
  linkedin: "in",
  x: "X",
  telegram: "➤",
  pinterest: "P",
  phone: "☎",
  email: "✉",
  map: "⌖",
  waze: "W",
  globe: "◎",
  arrow: "→",
  star: "★",
  check: "✓",
  heart: "♥",
  sparkles: "✦",
  play: "▶",
  quote: "“",
  menu: "☰",
};

export function getLibraryIconText(name: string) {
  return ICONS[String(name || "").toLowerCase()] || "•";
}

export function buildLibraryIconHtml(
  name: string,
  label?: string,
) {
  const text = getLibraryIconText(name);

  return `<span
    aria-hidden="true"
    data-bizuply-library-icon="${String(name || "custom")}"
    style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;font:inherit;color:inherit;line-height:1"
  >${text}</span>${
    label
      ? `<span style="margin-inline-start:.55em">${label}</span>`
      : ""
  }`;
}
