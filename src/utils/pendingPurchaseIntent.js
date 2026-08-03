export const PENDING_PURCHASE_INTENT_KEY = "bizuply_pending_purchase_intent";
export const PENDING_PURCHASE_INTENT_TTL_MS = 30 * 60 * 1000;

const ALLOWED_KEYS = [
  "serviceKey",
  "purchaseMode",
  "selectedPlanKey",
  "selectedAddOnKeys",
  "quantities",
  "returnPath",
  "createdAt",
];

function storageOrNull(storage) {
  if (storage) return storage;
  return typeof window !== "undefined" ? window.sessionStorage : null;
}

export function sanitizePendingPurchaseIntent(value, now = Date.now()) {
  if (!value || typeof value !== "object") return null;

  const serviceKey = String(value.serviceKey || "").trim();
  const purchaseMode =
    value.purchaseMode === "bundle" || value.purchaseMode === "standalone"
      ? value.purchaseMode
      : null;
  if (!serviceKey || !purchaseMode) return null;

  const selectedAddOnKeys = Array.isArray(value.selectedAddOnKeys)
    ? [...new Set(value.selectedAddOnKeys.map(String).filter(Boolean))]
    : [];
  const quantities =
    value.quantities && typeof value.quantities === "object"
      ? Object.fromEntries(
          Object.entries(value.quantities)
            .filter(([key, quantity]) => key && Number.isFinite(Number(quantity)))
            .map(([key, quantity]) => [
              String(key),
              Math.max(1, Math.floor(Number(quantity))),
            ])
        )
      : {};

  return {
    serviceKey,
    purchaseMode,
    selectedPlanKey: value.selectedPlanKey
      ? String(value.selectedPlanKey)
      : null,
    selectedAddOnKeys,
    quantities,
    returnPath:
      typeof value.returnPath === "string" && value.returnPath.startsWith("/")
        ? value.returnPath
        : "/pricing",
    createdAt: Number.isFinite(Number(value.createdAt))
      ? Number(value.createdAt)
      : now,
  };
}

export function savePendingPurchaseIntent(value, storage, now = Date.now()) {
  const target = storageOrNull(storage);
  const sanitized = sanitizePendingPurchaseIntent(
    { ...value, createdAt: now },
    now
  );
  if (!target || !sanitized) return null;
  target.setItem(PENDING_PURCHASE_INTENT_KEY, JSON.stringify(sanitized));
  return sanitized;
}

export function loadPendingPurchaseIntent(storage, now = Date.now()) {
  const target = storageOrNull(storage);
  if (!target) return null;

  try {
    const raw = JSON.parse(target.getItem(PENDING_PURCHASE_INTENT_KEY) || "null");
    const sanitized = sanitizePendingPurchaseIntent(raw, now);
    const hasOnlyAllowedKeys =
      raw &&
      typeof raw === "object" &&
      Object.keys(raw).every((key) => ALLOWED_KEYS.includes(key));
    if (
      !sanitized ||
      !hasOnlyAllowedKeys ||
      now - sanitized.createdAt > PENDING_PURCHASE_INTENT_TTL_MS ||
      sanitized.createdAt > now + 60_000
    ) {
      target.removeItem(PENDING_PURCHASE_INTENT_KEY);
      return null;
    }
    return sanitized;
  } catch {
    target.removeItem(PENDING_PURCHASE_INTENT_KEY);
    return null;
  }
}

export function clearPendingPurchaseIntent(storage) {
  storageOrNull(storage)?.removeItem(PENDING_PURCHASE_INTENT_KEY);
}
