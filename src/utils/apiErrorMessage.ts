const TECHNICAL_MESSAGES: Record<string, string> = {
  NO_REFRESH_TOKEN: "יש להתחבר מחדש",
  "Network error": "בעיית רשת — בדקו את החיבור",
};

const TECHNICAL_PATTERN =
  /mongo(?:db|servererror)?|redis|railway|vercel|cloudinary|econnrefused|enotfound|etimedout|cannot read propert|undefined is not|is not a function|typeerror|referenceerror|syntaxerror|internal server error|request failed with status|status code \d{3}|whatsapp_token|whatsapp_embedded|meta_app_id|objectid|prisma|sequelize|deployment failed|\/api\/|stack trace|\bat\s+\S+\s+\(|production deployment|sites-staging|up\.railway|מונגו|רדיס|דיבאג|webhook processing|stripe webhook|cast to objectid/i;

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isTechnicalErrorMessage(message: string): boolean {
  const raw = asText(message);
  if (!raw) return false;
  if (TECHNICAL_MESSAGES[raw]) return true;
  if (raw.startsWith("Request failed with status code")) return true;
  return TECHNICAL_PATTERN.test(raw);
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "שגיאה בטעינת הנתונים"
): string {
  const anyErr = err as {
    message?: string;
    code?: string;
    response?: { data?: { error?: string; message?: string } };
  };

  const candidates = [
    asText(anyErr?.response?.data?.error),
    asText(anyErr?.response?.data?.message),
    asText(anyErr?.message),
    asText(anyErr?.code),
  ].filter(Boolean);

  for (const raw of candidates) {
    if (TECHNICAL_MESSAGES[raw]) {
      return TECHNICAL_MESSAGES[raw];
    }
    if (isTechnicalErrorMessage(raw)) {
      return fallback;
    }
    return raw;
  }

  return fallback;
}
