import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { homeText } from "./homeCopy";
import locales from "./homeLocales.json";

const source = [
  "src/components/home-experience/HomeExperienceSections.tsx",
  "src/components/home-experience/HomeExperienceFooter.tsx",
  "src/components/home-experience/ProductScenes.tsx",
]
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

function englishStrings() {
  const found = new Set<string>();
  const direct = /text\(\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null;
  while ((match = direct.exec(source))) found.add(match[2]);
  const columns = /\[\s*"\/[^"]+"\s*,\s*"[^"]*"\s*,\s*"((?:\\.|[^"\\])*)"\s*\]/g;
  while ((match = columns.exec(source))) found.add(match[1]);
  const headings = /\ben:\s*"((?:\\.|[^"\\])*)"/g;
  while ((match = headings.exec(source))) found.add(match[1]);
  return [...found];
}

const PROPER = new Set([
  "CRM",
  "WhatsApp",
  "WhatsApp API",
  "FAQ",
  "SaaS",
  "Meta",
  "Facebook",
  "Instagram",
  "Studio",
  "Website Studio",
  "Emma Wilson",
  "Sophia Mitchell",
  "Olivia Bennett",
  "Northwind Studio",
]);

describe("homepage copy", () => {
  it("translates every homepage string into Spanish, Portuguese, and Arabic", () => {
    const missing: string[] = [];
    for (const english of englishStrings()) {
      if (PROPER.has(english)) continue;
      for (const pack of [locales.es, locales.pt, locales.ar]) {
        const value = pack[english];
        if (!value || value === english) missing.push(english);
      }
    }
    expect(missing).toEqual([]);
  });

  it("keeps Hebrew and does not leave the named Arabic buttons in English", () => {
    expect(homeText("he", "לראות את המערכת", "See the system")).toBe("לראות את המערכת");
    expect(homeText("ar", "לראות את המערכת", "See the system")).toBe("شاهدوا النظام");
    expect(homeText("es", "דילוג לתוכן", "Skip to content")).toBe("Saltar al contenido");
    expect(homeText("pt-BR", "לצפות בהדגמה", "Watch the demo")).toBe("Ver a demonstração");
    expect(homeText("en", "שלום", "See the system")).toBe("See the system");
  });
});
