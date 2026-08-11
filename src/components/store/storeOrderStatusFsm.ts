/** Mirrors server/services/storeOrderStatusFsm.js for admin UI gating. */

export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  new: ["pending_payment", "paid", "processing", "cancelled"],
  pending_payment: ["paid", "cancelled", "new"],
  paid: ["processing", "shipped", "completed", "cancelled"],
  processing: ["shipped", "completed", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "חדשה",
  pending_payment: "ממתינה לתשלום",
  paid: "שולמה",
  processing: "בטיפול",
  shipped: "נשלחה",
  completed: "הושלמה",
  cancelled: "בוטלה",
};

export function getAllowedOrderStatusTransitions(fromRaw?: string | null) {
  const from = String(fromRaw || "new").trim() || "new";
  return [from, ...(ORDER_STATUS_TRANSITIONS[from] || [])];
}