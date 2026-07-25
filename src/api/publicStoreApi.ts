import API from "../api";

export type PublicStoreProduct = {
  _id: string;
  name: string;
  price: number;
  currency?: string;
  image?: string;
  images?: string[];
  shortDescription?: string;
  status?: string;
};

export type PublicPaymentsInfo = {
  providers: Array<{
    provider: string;
    label: string;
    installmentsEnabled?: boolean;
  }>;
  stripeReady: boolean;
  currency: string;
  storeName: string;
  isStoreActive: boolean;
};

export type PublicStoreOrder = {
  _id: string;
  orderNumber?: string;
  total?: number;
  currency?: string;
  paymentStatus?: string;
  status?: string;
  checkoutUrl?: string;
};

export async function getPublicPayments(businessId: string) {
  const { data } = await API.get(`/store/${businessId}/payments/public`);
  return data as PublicPaymentsInfo;
}

export async function getPublicShop(businessId: string) {
  const { data } = await API.get(`/store/${businessId}/shop`);
  return data as {
    settings?: { currency?: string; storeName?: string; isStoreActive?: boolean };
    products?: PublicStoreProduct[];
  };
}

export async function createPublicStoreOrder(
  businessId: string,
  payload: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress?: string;
    notes?: string;
    paymentProvider?: string;
    successUrl?: string;
    cancelUrl?: string;
    startCheckout?: boolean;
  }
) {
  const { data } = await API.post(`/store/${businessId}/orders`, payload);
  return data as {
    success: boolean;
    order: PublicStoreOrder;
    checkoutUrl?: string;
  };
}

export async function startPublicStripeCheckout(
  businessId: string,
  orderId: string,
  payload: { successUrl: string; cancelUrl: string }
) {
  const { data } = await API.post(
    `/store/${businessId}/orders/${orderId}/pay/stripe`,
    payload
  );
  return data as {
    success: boolean;
    alreadyPaid?: boolean;
    order: PublicStoreOrder;
    checkoutUrl?: string;
  };
}

export async function confirmPublicStripePayment(
  businessId: string,
  orderId: string,
  sessionId: string
) {
  const { data } = await API.get(
    `/store/${businessId}/orders/${orderId}/stripe/confirm`,
    { params: { session_id: sessionId } }
  );
  return data as {
    success: boolean;
    paid: boolean;
    order: PublicStoreOrder;
  };
}
