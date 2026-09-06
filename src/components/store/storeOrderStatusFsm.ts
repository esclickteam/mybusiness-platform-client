import i18n from "../../i18n/i18n";

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

const ORDER_STATUS_KEYS: Record<string, string> = {
  new: "leftover.storeOrder.new",
  pending_payment: "leftover.storeOrder.pending_payment",
  paid: "leftover.storeOrder.paid",
  processing: "leftover.storeOrder.processing",
  shipped: "leftover.storeOrder.shipped",
  completed: "leftover.storeOrder.completed",
  cancelled: "leftover.storeOrder.cancelled",
};

const ORDER_STATUS_FALLBACK: Record<string, string> = {
  new: "New",
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function getOrderStatusLabel(status: string) {
  const key = ORDER_STATUS_KEYS[status];
  return key
    ? i18n.t(key, ORDER_STATUS_FALLBACK[status] || status)
    : status;
}

export const ORDER_STATUS_LABELS: Record<string, string> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return getOrderStatusLabel(prop);
    },
  }
);

export function getAllowedOrderStatusTransitions(fromRaw?: string | null) {
  const from = String(fromRaw || "new").trim() || "new";
  return [from, ...(ORDER_STATUS_TRANSITIONS[from] || [])];
}
