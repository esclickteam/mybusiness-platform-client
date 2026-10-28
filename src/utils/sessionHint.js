/**
 * Non-secret flag that tells the app a refresh cookie may exist.
 * It is not a token and is never sent as Authorization.
 * Domain is shared across www/apex so a return visit on the other host
 * still tries the httpOnly refresh cookie.
 */

export const SESSION_HINT_NAME = "bizuply_session";
const REMEMBER_FLAG = "bizuply_remember_me";
const YEAR_SECONDS = 365 * 24 * 60 * 60;

function hintDomain(hostname) {
  const host = String(hostname || "").toLowerCase().split(":")[0];
  if (host === "bizuply.com" || host.endsWith(".bizuply.com")) return ".bizuply.com";
  if (host === "bizuply.co.il" || host.endsWith(".bizuply.co.il")) return ".bizuply.co.il";
  return "";
}

function writeCookie(value, { persistent, domain }) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  const domainPart = domain ? `; Domain=${domain}` : "";
  const maxAge = persistent ? `; Max-Age=${YEAR_SECONDS}` : value === "" ? "; Max-Age=0" : "";
  document.cookie = `${SESSION_HINT_NAME}=${value}; Path=/; SameSite=Lax${maxAge}${domainPart}${secure}`;
}

export function writeSessionHint(remember = true) {
  if (typeof document === "undefined") return;
  const persistent = remember !== false;
  const domain = hintDomain(
    typeof window !== "undefined" ? window.location.hostname : ""
  );
  if (!persistent) {
    writeCookie("", { persistent: false, domain: "" });
    if (domain) writeCookie("", { persistent: false, domain });
  }
  writeCookie("1", { persistent, domain });
  try {
    localStorage.setItem(REMEMBER_FLAG, persistent ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function hasSessionHint() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === SESSION_HINT_NAME && value === "1";
  });
}

export function clearSessionHint() {
  if (typeof document === "undefined") return;
  const domain = hintDomain(
    typeof window !== "undefined" ? window.location.hostname : ""
  );
  writeCookie("", { persistent: false, domain: "" });
  if (domain) writeCookie("", { persistent: false, domain });
  try {
    localStorage.removeItem(REMEMBER_FLAG);
  } catch {
    /* ignore */
  }
}
