import API from "../api";

/**
 * Create a Stripe Checkout session for a managed-service upsell (ServiceOrder).
 *
 * The client sends ONLY the identifiers the server needs — the server resolves
 * the real Stripe Price, currency, interval and mode from its PricingCatalog.
 * We deliberately never send amount, currency, priceId, billing or mode.
 *
 * @param {Object} params
 * @param {string} params.serviceKey            Base managed_service SKU.
 * @param {string[]} [params.selectedAddOnKeys] managed_service_addon SKUs.
 * @param {Object} [params.quantities]          Map of addOnKey -> quantity.
 * @param {string|null} [params.businessId]
 * @param {string|null} [params.userId]
 * @returns {Promise<{url:string, mode:string, billingType:string, totals:Object, items:Array}>}
 */
export async function createServiceOrderCheckout({
  serviceKey,
  selectedAddOnKeys = [],
  quantities = {},
  businessId = null,
  userId = null,
}) {
  const { data } = await API.post("/service-orders/create-checkout", {
    serviceKey,
    selectedAddOnKeys,
    quantities,
    businessId,
    userId,
  });
  return data;
}

export default createServiceOrderCheckout;
