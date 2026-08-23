export function getManagedBusinessId() {
  try {
    return String(localStorage.getItem("managedBusinessId") || "").trim();
  } catch {
    return "";
  }
}

export function getManagedBusinessName() {
  try {
    return String(localStorage.getItem("managedBusinessName") || "").trim();
  } catch {
    return "";
  }
}

export function getPartnerDisplayName() {
  try {
    return String(localStorage.getItem("partnerDisplayName") || "").trim();
  } catch {
    return "";
  }
}

export function setManagedBusinessContext({
  managedBusinessId,
  managedBusinessName,
  partnerName,
}: {
  managedBusinessId?: string | null;
  managedBusinessName?: string | null;
  partnerName?: string | null;
}) {
  try {
    if (managedBusinessId) {
      localStorage.setItem("managedBusinessId", String(managedBusinessId));
    } else {
      localStorage.removeItem("managedBusinessId");
    }
    if (managedBusinessName) {
      localStorage.setItem("managedBusinessName", String(managedBusinessName));
    } else {
      localStorage.removeItem("managedBusinessName");
    }
    if (partnerName) {
      localStorage.setItem("partnerDisplayName", String(partnerName));
    }
  } catch {
    /* ignore */
  }
}

export function clearManagedBusinessContext() {
  try {
    localStorage.removeItem("managedBusinessId");
    localStorage.removeItem("managedBusinessName");
  } catch {
    /* ignore */
  }
}

export function isPartnerManagedSession(user?: { role?: string; managedBusinessId?: string | null } | null) {
  if (user?.role !== "partner") return false;
  return Boolean(user?.managedBusinessId || getManagedBusinessId());
}

export function canOperateManagedBusiness(
  user:
    | {
        role?: string;
        businessId?: string | null;
        managedBusinessId?: string | null;
      }
    | null
    | undefined,
  businessId?: string | null
) {
  if (!user || user.role !== "partner" || !businessId) return false;
  const managed = String(
    user.managedBusinessId || getManagedBusinessId() || ""
  ).trim();
  return Boolean(managed && managed === String(businessId));
}

export function applyManagedSessionToUser<T extends Record<string, unknown>>(
  user: T | null | undefined
): T | null {
  if (!user) return null;
  if (String(user.role || "") !== "partner") return user;

  const managedBusinessId = String(
    user.managedBusinessId || getManagedBusinessId() || ""
  ).trim();
  if (!managedBusinessId) return user;

  const managedBusinessName =
    (typeof user.managedBusinessName === "string" && user.managedBusinessName) ||
    getManagedBusinessName() ||
    "";
  const partnerName =
    (typeof user.partnerName === "string" && user.partnerName) ||
    getPartnerDisplayName() ||
    "";

  setManagedBusinessContext({
    managedBusinessId,
    managedBusinessName: managedBusinessName || null,
    partnerName: partnerName || null,
  });

  return {
    ...user,
    role: "partner",
    managedBusinessId,
    managedBusinessName: managedBusinessName || user.managedBusinessName || null,
    partnerName: partnerName || user.partnerName || null,
    businessId: user.businessId || managedBusinessId,
  };
}
