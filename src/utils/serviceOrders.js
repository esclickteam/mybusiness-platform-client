import API from "../api";
import { buildServiceOrderPayload } from "./servicePurchaseFlow";

/**
 * Creates a managed-service checkout. Pricing and Stripe identifiers are
 * deliberately resolved by the server; this request contains identifiers only.
 */
export async function createServiceOrderCheckout({ intent, authenticatedUser }) {
  const payload = buildServiceOrderPayload(intent, authenticatedUser);
  const { data } = await API.post(
    "/service-orders/create-checkout",
    payload
  );
  return data;
}

export default createServiceOrderCheckout;
