import i18n from "../../../../../../../i18n/i18n";
import type { SeoSchemaType, SeoStructuredDataEntry } from "../../../../types";
import { safeParse } from "./schemaParsers";

const t = (key: string, opts?: Record<string, unknown>) => String(i18n.t(key, opts));

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
      jsonError: t("studio.schema.jsonEmpty"),
      requiredMissing: [],
      recommendedMissing: [],
      summary: t("studio.schema.empty"),
    };
  }

  if (json.length > MAX_JSON_LENGTH) {
    return {
      level: "error",
      blocking: true,
      jsonError: t("studio.schema.jsonTooLong"),
      requiredMissing: [],
      recommendedMissing: [],
      summary: t("studio.schema.tooLong"),
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    return {
      level: "error",
      blocking: true,
      jsonError: error instanceof Error ? error.message : t("studio.schema.invalidJson"),
      requiredMissing: [],
      recommendedMissing: [],
      summary: t("studio.schema.invalidJson"),
    };
  }

  const obj = safeParse(json);
  if (!obj) {
    return {
      level: "error",
      blocking: true,
      jsonError: t("studio.schema.mustBeObject"),
      requiredMissing: [],
      recommendedMissing: [],
      summary: t("studio.schema.invalidStructure"),
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
      if (!String(obj.name || "").trim()) requiredMissing.push(t("studio.schema.nameRequired"));
      break;
    case "Product":
      if (!String(obj.name || "").trim()) requiredMissing.push(t("studio.schema.productNameRequired"));
      if (obj.offers && obj.offers.price) {
        const price = Number(obj.offers.price);
        if (!Number.isFinite(price))
          requiredMissing.push(t("studio.schema.validPriceInOffers"));
      }
      break;
    case "FAQPage": {
      const list = Array.isArray(obj.mainEntity) ? obj.mainEntity : [];
      if (list.length === 0) requiredMissing.push(t("studio.schema.atLeastOneQuestion"));
      const emptyQ = list.some(
        (q: any) =>
          !String(q?.name || "").trim() ||
          !String(q?.acceptedAnswer?.text || "").trim(),
      );
      if (emptyQ) recommendedMissing.push(t("studio.schema.emptyQuestionAnswer"));
      const seen = new Set<string>();
      let dup = false;
      list.forEach((q: any) => {
        const key = String(q?.name || "").trim();
        if (key && seen.has(key)) dup = true;
        seen.add(key);
      });
      if (dup) recommendedMissing.push(t("studio.schema.duplicateQuestions"));
      break;
    }
    case "BreadcrumbList": {
      const list = Array.isArray(obj.itemListElement)
        ? obj.itemListElement
        : [];
      if (list.length === 0) requiredMissing.push(t("studio.schema.atLeastOneItem"));
      const positionsOk = list.every(
        (li: any, i: number) => Number(li?.position) === i + 1,
      );
      if (!positionsOk) recommendedMissing.push(t("studio.schema.positionsNotSequential"));
      break;
    }
    default:
      break;
  }

  if (badUrl) recommendedMissing.push(t("studio.schema.invalidUrl"));

  if (requiredMissing.length) {
    return {
      level: "error",
      blocking: true,
      jsonError: "",
      requiredMissing,
      recommendedMissing,
      summary: t("studio.schema.missing", { items: requiredMissing.join(", ") }),
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
    summary: t("studio.schema.valid"),
  };
}

/** Remove </script> style breakouts before embedding JSON in HTML. */
export function sanitizeJsonLd(json: string): string {
  return String(json ?? "").replace(/<\/(script)/gi, "<\\/$1");
}
