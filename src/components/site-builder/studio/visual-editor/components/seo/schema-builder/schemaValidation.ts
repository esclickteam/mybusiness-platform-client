import type { SeoSchemaType, SeoStructuredDataEntry } from "../../../../types";
import { safeParse } from "./schemaParsers";

export type SchemaValidationLevel = "valid" | "warn" | "error";

export type SchemaValidationResult = {
  level: SchemaValidationLevel;
  /** True only when a hard error blocks saving. */
  blocking: boolean;
  jsonError: string;
  requiredMissing: string[];
  recommendedMissing: string[];
  summary: string;
};

const MAX_JSON_LENGTH = 20000;

function isUrl(value: unknown) {
  const str = String(value ?? "").trim();
  if (!str) return true; // empty is allowed (optional)
  return /^https?:\/\/.+/i.test(str);
}

function collectStrings(node: any, key: string, out: string[]) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectStrings(item, key, out));
    return;
  }
  Object.keys(node).forEach((k) => {
    if (k === key && typeof node[k] === "string") out.push(node[k]);
    collectStrings(node[k], key, out);
  });
}

export function validateSchemaEntry(
  entry: Pick<SeoStructuredDataEntry, "json" | "schemaType">,
): SchemaValidationResult {
  const json = String(entry.json ?? "");
  const type = (entry.schemaType || "Custom") as SeoSchemaType;

  if (!json.trim()) {
    return {
      level: "error",
      blocking: true,
      jsonError: "ה‑JSON ריק",
      requiredMissing: [],
      recommendedMissing: [],
      summary: "ריק",
    };
  }

  if (json.length > MAX_JSON_LENGTH) {
    return {
      level: "error",
      blocking: true,
      jsonError: "ה‑JSON ארוך מדי",
      requiredMissing: [],
      recommendedMissing: [],
      summary: "ארוך מדי",
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return {
      level: "error",
      blocking: true,
      jsonError: error instanceof Error ? error.message : "JSON לא תקין",
      requiredMissing: [],
      recommendedMissing: [],
      summary: "JSON לא תקין",
    };
  }

  const obj = safeParse(json);
  if (!obj) {
    return {
      level: "error",
      blocking: true,
      jsonError: "ה‑Schema חייב להיות אובייקט",
      requiredMissing: [],
      recommendedMissing: [],
      summary: "מבנה לא תקין",
    };
  }

  const requiredMissing: string[] = [];
  const recommendedMissing: string[] = [];

  if (!obj["@context"]) recommendedMissing.push("@context");
  if (!obj["@type"]) requiredMissing.push("@type");

  const urls: string[] = [];
  collectStrings(obj, "url", urls);
  collectStrings(obj, "item", urls);
  collectStrings(obj, "logo", urls);
  const badUrl = urls.find((u) => u && !isUrl(u));

  switch (type) {
    case "LocalBusiness":
    case "Organization":
    case "Service":
      if (!String(obj.name || "").trim()) requiredMissing.push("name (שם)");
      break;
    case "Product":
      if (!String(obj.name || "").trim()) requiredMissing.push("name (שם המוצר)");
      if (obj.offers && obj.offers.price) {
        const price = Number(obj.offers.price);
        if (!Number.isFinite(price))
          requiredMissing.push("מחיר תקין ב‑offers");
      }
      break;
    case "FAQPage": {
      const list = Array.isArray(obj.mainEntity) ? obj.mainEntity : [];
      if (list.length === 0) requiredMissing.push("לפחות שאלה אחת");
      const emptyQ = list.some(
        (q: any) =>
          !String(q?.name || "").trim() ||
          !String(q?.acceptedAnswer?.text || "").trim(),
      );
      if (emptyQ) recommendedMissing.push("יש שאלה/תשובה ריקה");
      const seen = new Set<string>();
      let dup = false;
      list.forEach((q: any) => {
        const key = String(q?.name || "").trim();
        if (key && seen.has(key)) dup = true;
        seen.add(key);
      });
      if (dup) recommendedMissing.push("יש שאלות כפולות");
      break;
    }
    case "BreadcrumbList": {
      const list = Array.isArray(obj.itemListElement)
        ? obj.itemListElement
        : [];
      if (list.length === 0) requiredMissing.push("לפחות פריט אחד");
      const positionsOk = list.every(
        (li: any, i: number) => Number(li?.position) === i + 1,
      );
      if (!positionsOk) recommendedMissing.push("מיקומים לא רציפים");
      break;
    }
    default:
      break;
  }

  if (badUrl) recommendedMissing.push("יש כתובת URL לא תקינה");

  if (requiredMissing.length) {
    return {
      level: "error",
      blocking: true,
      jsonError: "",
      requiredMissing,
      recommendedMissing,
      summary: `חסר: ${requiredMissing.join(", ")}`,
    };
  }

  if (recommendedMissing.length) {
    return {
      level: "warn",
      blocking: false,
      jsonError: "",
      requiredMissing,
      recommendedMissing,
      summary: recommendedMissing.join(" · "),
    };
  }

  return {
    level: "valid",
    blocking: false,
    jsonError: "",
    requiredMissing,
    recommendedMissing,
    summary: "תקין",
  };
}

/** Remove </script> style breakouts before embedding JSON in HTML. */
export function sanitizeJsonLd(json: string): string {
  return String(json ?? "").replace(/<\/(script)/gi, "<\\/$1");
}
