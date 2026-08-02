import API from "../api";

export type PublicStoreCategory = {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  isVisible?: boolean;
  sortOrder?: number;
};

export type PublicStoreVariant = {
  _id?: string;
  optionName?: string;
  optionValue?: string;
  price?: number | null;
  salePrice?: number | null;
  sku?: string;
  stock?: number;
};

export type PublicStoreProduct = {
  _id: string;
  name: string;
  price: number;
  currency?: string;
  image?: string;
  mainImage?: string;
  images?: string[];
  shortDescription?: string;
  description?: string;
  status?: string;
  slug?: string;
  tags?: string[];
  isFeatured?: boolean;
  categoryName?: string;
  categoryId?: string | PublicStoreCategory | null;
  compareAtPrice?: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  trackStock?: boolean;
  allowBackorder?: boolean;
  variants?: PublicStoreVariant[];
};

export type PublicPaymentProvider = {
  provider: string;
  label: string;
  isPrimary?: boolean;
  installmentsEnabled?: boolean;
};

export type PublicCheckoutAppearance = {
  primaryColor?: string;
  buttonTextColor?: string;
  accentColor?: string;
  panelBackground?: string;
  textColor?: string;
  mutedTextColor?: string;
  borderColor?: string;
  buttonRadius?: number;
  panelRadius?: number;
  overlayColor?: string;
  title?: string;
  buttonLabel?: string;
};

export type PublicPaymentsInfo = {
  providers: PublicPaymentProvider[];
  primaryProvider?: string;
  checkoutReady?: boolean;
  stripeReady: boolean;
  paypalReady?: boolean;
  currency: string;
  storeName: string;
  isStoreActive: boolean;
  checkoutAppearance?: PublicCheckoutAppearance;
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

export async function getPublicShop(
  businessId: string,
  params?: { categorySlug?: string; search?: string },
) {
  const { data } = await API.get(`/store/${businessId}/shop`, {
    params: {
      categorySlug: params?.categorySlug,
      search: params?.search,
    },
  });
  return data as {
    settings?: {
      currency?: string;
      storeName?: string;
      isStoreActive?: boolean;
      defaultShippingPrice?: number;
      freeShippingFrom?: number | null;
    };
    categories?: PublicStoreCategory[];
    activeCategory?: PublicStoreCategory | null;
    products?: PublicStoreProduct[];
  };
}

export async function getPublicStoreCategories(businessId: string) {
  const { data } = await API.get(`/store/${businessId}/categories`);
  return data as { categories?: PublicStoreCategory[] };
}

export async function createPublicStoreOrder(
  businessId: string,
  payload: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    items: Array<{
      productId?: string;
      quantity: number;
      name?: string;
      title?: string;
      price?: number;
      image?: string;
      variantLabel?: string;
      variantId?: string;
      sku?: string;
      ref?: string;
    }>;
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

export async function startPublicPaypalCheckout(
  businessId: string,
  orderId: string,
  payload: { successUrl: string; cancelUrl: string }
) {
  const { data } = await API.post(
    `/store/${businessId}/orders/${orderId}/pay/paypal`,
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

export async function confirmPublicPaypalPayment(
  businessId: string,
  orderId: string
) {
  const { data } = await API.get(
    `/store/${businessId}/orders/${orderId}/paypal/confirm`
  );
  return data as {
    success: boolean;
    paid: boolean;
    awaitingConfirmation?: boolean;
    order: PublicStoreOrder;
  };
}

export function resolveCheckoutProvider(payments: PublicPaymentsInfo | null) {
  if (!payments) return "";

  const primary = String(payments.primaryProvider || "").trim();
  if (primary === "paypal" && payments.paypalReady) return "paypal";
  if (primary === "stripe" && payments.stripeReady) return "stripe";

  if (payments.paypalReady) return "paypal";
  if (payments.stripeReady) return "stripe";

  return primary || "";
}
