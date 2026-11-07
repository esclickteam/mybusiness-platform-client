import locales from "./homeLocales.json";

const packs = locales as {
  es: Record<string, string>;
  pt: Record<string, string>;
  ar: Record<string, string>;
};

export function homeText(language: string, hebrew: string, english: string) {
  const value = String(language || "en").toLowerCase();
  if (value.startsWith("he") || value.startsWith("iw")) return hebrew;
  const pack = value.startsWith("es")
    ? packs.es
    : value.startsWith("pt")
      ? packs.pt
      : value.startsWith("ar")
        ? packs.ar
        : null;
  if (!pack) return english;
  return pack[english] || english;
}

export function homeButtonLabel(language: string, english: string) {
  return homeText(language, english, english);
}
