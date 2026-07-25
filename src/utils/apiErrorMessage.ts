const TECHNICAL_MESSAGES: Record<string, string> = {
  NO_REFRESH_TOKEN: "יש להתחבר מחדש",
  "Network error": "בעיית רשת — בדקו את החיבור",
};

export function getApiErrorMessage(
  err: unknown,
  fallback = "שגיאה בטעינת הנתונים"
): string {
  const anyErr = err as {
    message?: string;
    code?: string;
    response?: { data?: { error?: string; message?: string } };
  };

  const serverMsg =
    anyErr?.response?.data?.error || anyErr?.response?.data?.message;
  if (serverMsg && typeof serverMsg === "string") {
    return serverMsg;
  }

  const raw = anyErr?.message || anyErr?.code || "";
  if (raw && TECHNICAL_MESSAGES[raw]) {
    return TECHNICAL_MESSAGES[raw];
  }

  if (typeof raw === "string" && raw.startsWith("Request failed with status code")) {
    return fallback;
  }

  return raw || fallback;
}
