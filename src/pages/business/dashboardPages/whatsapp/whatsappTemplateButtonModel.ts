import type { WhatsAppTemplateButton } from "@/api/whatsappApi";

export type ButtonIssueCode =
  | "URL_REQUIRED"
  | "URL_NEEDS_HTTPS"
  | "URL_INVALID"
  | "DOUBLE_SCHEME"
  | "DYNAMIC_NEEDS_VARIABLE"
  | "DYNAMIC_ONE_VARIABLE"
  | "VARIABLE_MUST_END"
  | "SAMPLE_REQUIRED"
  | "SAMPLE_MUST_BE_FULL_URL"
  | "SAMPLE_MISMATCH"
  | "SAMPLE_HAS_VARIABLE"
  | "SAMPLE_MISSING_VALUE"
  | "BUTTON_TEXT_REQUIRED"
  | "PHONE_INVALID"
  | "COPY_CODE_REQUIRED"
  | "COPY_CODE_TOO_LONG"
  | "TOO_MANY_BUTTONS"
  | "TOO_MANY_URL"
  | "TOO_MANY_PHONE"
  | "TOO_MANY_COPY"
  | "TOO_MANY_VOICE"
  | "BUTTON_ORDER";

export type UrlButtonAnalysis = {
  urlType: "static" | "dynamic";
  templateUrl: string;
  exampleUrl: string;
  suffix: string;
  previewUrl: string;
  issues: ButtonIssueCode[];
};

const URL_MAX = 2000;

function placeholders(url = ""): string[] {
  return [...String(url).matchAll(/\{\{\s*(\d+)\s*\}\}/g)].map((match) => match[1]);
}

function dynamicPrefix(url = ""): string {
  return String(url || "").replace(/\{\{\s*1\s*\}\}\s*$/, "");
}

function hasDoubleScheme(value = ""): boolean {
  return /https?:\/\/\s*https?:\/\//i.test(String(value || ""));
}

export function analyzeUrlButton(button: Partial<WhatsAppTemplateButton> = {}): UrlButtonAnalysis {
  const templateUrl = String(button.url || "").trim();
  const sample = String(button.exampleUrl || "").trim();
  const dynamic = button.urlType === "dynamic" || /\{\{/.test(templateUrl);
  const issues: ButtonIssueCode[] = [];

  if (hasDoubleScheme(templateUrl) || hasDoubleScheme(sample)) issues.push("DOUBLE_SCHEME");

  if (!dynamic) {
    if (!templateUrl) issues.push("URL_REQUIRED");
    else if (!/^https:\/\//i.test(templateUrl)) issues.push("URL_NEEDS_HTTPS");
    else if (/\s/.test(templateUrl)) issues.push("URL_INVALID");
    return {
      urlType: "static",
      templateUrl: templateUrl.slice(0, URL_MAX),
      exampleUrl: "",
      suffix: "",
      previewUrl: issues.length ? "" : templateUrl.slice(0, URL_MAX),
      issues,
    };
  }

  const vars = placeholders(templateUrl);
  if (!templateUrl) issues.push("URL_REQUIRED");
  else if (!/^https:\/\//i.test(templateUrl)) issues.push("URL_NEEDS_HTTPS");
  else if (/\s/.test(templateUrl)) issues.push("URL_INVALID");
  if (!vars.length) issues.push("DYNAMIC_NEEDS_VARIABLE");
  if (vars.length > 1 || vars.some((item) => item !== "1")) issues.push("DYNAMIC_ONE_VARIABLE");
  if (templateUrl && !/\{\{\s*1\s*\}\}$/.test(templateUrl)) issues.push("VARIABLE_MUST_END");

  const prefix = dynamicPrefix(templateUrl);
  if (!sample) issues.push("SAMPLE_REQUIRED");
  else if (!/^https:\/\//i.test(sample)) issues.push("SAMPLE_MUST_BE_FULL_URL");
  else if (/\{\{/.test(sample)) issues.push("SAMPLE_HAS_VARIABLE");
  else if (!prefix || !sample.startsWith(prefix) || sample.length <= prefix.length) {
    issues.push("SAMPLE_MISMATCH");
  }

  const suffix = prefix && sample.startsWith(prefix) ? sample.slice(prefix.length) : "";
  const unique = [...new Set(issues)];
  return {
    urlType: "dynamic",
    templateUrl: templateUrl.slice(0, URL_MAX),
    exampleUrl: sample.slice(0, URL_MAX),
    suffix,
    previewUrl: unique.length ? "" : sample.slice(0, URL_MAX),
    issues: unique,
  };
}

export function applyUrlTypeChange(
  button: WhatsAppTemplateButton,
  urlType: "static" | "dynamic"
): WhatsAppTemplateButton {
  if (urlType === "static") {
    return {
      ...button,
      urlType: "static",
      url: String(button.url || "")
        .replace(/\{\{\s*1\s*\}\}/g, "")
        .replace(/\/+$/, ""),
      exampleUrl: "",
    };
  }
  let url = String(button.url || "").trim();
  if (url && !/\{\{\s*1\s*\}\}$/.test(url) && !url.includes("{{")) {
    url = `${url.replace(/\/+$/, "")}/{{1}}`;
  }
  return { ...button, urlType: "dynamic", url };
}

function buttonIssues(button: WhatsAppTemplateButton): ButtonIssueCode[] {
  const issues: ButtonIssueCode[] = [];
  if (button.type === "request_contact_info") return issues;
  if (button.type !== "copy_code" && !String(button.text || "").trim()) {
    issues.push("BUTTON_TEXT_REQUIRED");
  }
  if (button.type === "url") issues.push(...analyzeUrlButton(button).issues);
  if (button.type === "phone_number") {
    const digits = String(button.phoneNumber || "").replace(/\D/g, "");
    if (digits.length < 8) issues.push("PHONE_INVALID");
  }
  if (button.type === "copy_code") {
    const code = String(button.exampleUrl || "").trim();
    if (!code) issues.push("COPY_CODE_REQUIRED");
    else if (code.length > 15) issues.push("COPY_CODE_TOO_LONG");
  }
  return issues;
}

export function buttonSetIssues(buttons: WhatsAppTemplateButton[] = []): ButtonIssueCode[] {
  const issues: ButtonIssueCode[] = [];
  if (buttons.length > 10) issues.push("TOO_MANY_BUTTONS");
  if (buttons.filter((btn) => btn.type === "url").length > 2) issues.push("TOO_MANY_URL");
  if (buttons.filter((btn) => btn.type === "phone_number").length > 1) issues.push("TOO_MANY_PHONE");
  if (buttons.filter((btn) => btn.type === "copy_code").length > 1) issues.push("TOO_MANY_COPY");
  if (buttons.filter((btn) => btn.type === "voice_call").length > 1) issues.push("TOO_MANY_VOICE");
  const kinds = buttons.map((btn) => (btn.type === "quick_reply" ? "qr" : "cta"));
  const switches = kinds.filter((kind, index) => index > 0 && kind !== kinds[index - 1]);
  if (switches.length > 1) issues.push("BUTTON_ORDER");
  buttons.forEach((button) => issues.push(...buttonIssues(button)));
  return [...new Set(issues)];
}

export function moveButton(
  buttons: WhatsAppTemplateButton[],
  index: number,
  delta: number
): WhatsAppTemplateButton[] {
  const next = index + delta;
  if (next < 0 || next >= buttons.length) return buttons;
  const copy = buttons.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}
