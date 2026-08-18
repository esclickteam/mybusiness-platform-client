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
