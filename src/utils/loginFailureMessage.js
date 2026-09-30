/**
 * Login failures come back from the API client as a plain Error with `status`
 * (the axios `response` object is not preserved). Treat 4xx as a credential
 * problem and keep "server error" for network failures and 5xx.
 */
export function messageForLoginFailure(err, translate) {
  const status = Number(err?.status || err?.response?.status || 0);
  const fromBody = err?.response?.data?.error || err?.response?.data?.message;
  const raw = String(fromBody || err?.message || "").trim();
  const usable =
    Boolean(raw) &&
    raw !== "Network error" &&
    !raw.startsWith("Request failed with status code");

  if (status >= 400 && status < 500) {
    return usable ? raw : translate("login.errors.incorrectCredentials");
  }
  return translate("login.errors.serverError");
}
