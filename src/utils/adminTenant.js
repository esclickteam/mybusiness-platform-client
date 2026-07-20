const ADMIN_ACTIVE_BUSINESS_KEY = "adminActiveBusinessId";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("businessDetails") || "null");
  } catch {
    return null;
  }
}

export function isAdminUser(user = getStoredUser()) {
  return user?.role === "admin";
}

export function getBusinessIdFromPath(pathname = window.location.pathname) {
  const match = String(pathname || "").match(/^\/business\/([^/]+)/);
  return match?.[1] || "";
}

export function setAdminActiveBusinessId(businessId) {
  const id = String(businessId || "").trim();
  if (!id) {
    localStorage.removeItem(ADMIN_ACTIVE_BUSINESS_KEY);
    return;
  }
  localStorage.setItem(ADMIN_ACTIVE_BUSINESS_KEY, id);
}

export function clearAdminActiveBusinessId() {
  localStorage.removeItem(ADMIN_ACTIVE_BUSINESS_KEY);
}

/**
 * Active tenant for admin API calls (URL first, then last entered business).
 */
export function getAdminActiveBusinessId() {
  if (!isAdminUser()) return null;

  const fromPath = getBusinessIdFromPath();
  if (fromPath) {
    setAdminActiveBusinessId(fromPath);
    return fromPath;
  }

  return localStorage.getItem(ADMIN_ACTIVE_BUSINESS_KEY) || null;
}
