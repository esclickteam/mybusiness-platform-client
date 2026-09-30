export function metaAdsFriendlyMessage(
  error: unknown,
  fallback: string
): string {
  const anyErr = error as {
    response?: { status?: number; data?: { error?: string; message?: string; details?: { code?: number } } };
    message?: string;
  };
  const status = Number(anyErr?.response?.status || 0);
  const code = Number(anyErr?.response?.data?.details?.code || 0);
  const raw = String(
    anyErr?.response?.data?.error || anyErr?.response?.data?.message || anyErr?.message || ""
  ).toLowerCase();
  if (status === 429 || code === 613 || raw.includes("rate limit") || raw.includes("too many calls")) {
    return "RATE_LIMIT";
  }
  if (status === 401 || raw.includes("session has expired") || raw.includes("(#190)") || raw.includes("access token")) {
    return "TOKEN";
  }
  if (status === 403 || raw.includes("permission") || raw.includes("oauth")) {
    return "PERMISSION";
  }
  if (raw.includes("not connected") || raw.includes("connect a meta")) {
    return "DISCONNECTED";
  }
  return fallback;
}
