import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  confirmPublicPaypalPayment,
  confirmPublicStripePayment,
  createPublicStoreOrder,
  getPublicPayments,
  getPublicShop,
  resolveCheckoutProvider,
  startPublicPaypalCheckout,
  startPublicStripeCheckout,
  type PublicPaymentsInfo,
  type PublicPickupOptions,
  type PublicShippingAddress,
  type PublicStoreProduct,
} from "../../../api/publicStoreApi";
import {
  normalizeCheckoutAppearance,
  type CheckoutAppearance,
} from "../../store/checkoutAppearance";
import { resolveStoreUnitPrice } from "../../../utils/storePricing";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantLabel?: string;
  variantId?: string;
  sku?: string;
  custom?: boolean;
};

type FulfillmentType = "shipping" | "pickup";

const EMPTY_SHIPPING_ADDRESS: PublicShippingAddress = {
  fullName: "",
  phone: "",
  country: "ישראל",
  city: "",
  street: "",
  houseNumber: "",
  apartment: "",
  postalCode: "",
  additionalInstructions: "",
};

function resolveProductKind(product?: PublicStoreProduct | null) {
  const kind = String(product?.productKind || "").toLowerCase();
  if (kind === "physical" || kind === "digital" || kind === "service") {
    return kind;
  }
  if (product?.isDigital) return "digital";
  return "physical";
}

function cartNeedsPhysicalFulfillment(
  cart: CartItem[],
  products: PublicStoreProduct[]
) {
  return cart.some((item) => {
    if (item.custom) return true;
    const product = products.find((entry) => entry._id === item.productId);
    return resolveProductKind(product) === "physical";
  });
}

function buildShippingRawText(address: PublicShippingAddress) {
  return [
    address.fullName,
    address.phone,
    [address.street, address.houseNumber].filter(Boolean).join(" "),
    address.apartment ? `דירה ${address.apartment}` : "",
    [address.city, address.postalCode].filter(Boolean).join(" "),
    address.country,
    address.additionalInstructions,
  ]
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .join("\n");
}

function validateShippingAddressForm(address: PublicShippingAddress) {
  const required: Array<keyof PublicShippingAddress> = [
    "fullName",
    "phone",
    "country",
    "city",
    "street",
    "houseNumber",
  ];
  const missing = required.filter((key) => !String(address[key] || "").trim());
  return { ok: missing.length === 0, missing };
}

function availableStockForProduct(
  product: PublicStoreProduct | undefined,
  item?: Pick<CartItem, "variantId" | "variantLabel">
) {
  if (!product) return Number.POSITIVE_INFINITY;
  if (product.trackStock === false) return Number.POSITIVE_INFINITY;

  const variants = Array.isArray(product.variants) ? product.variants : [];
  if (variants.length > 0) {
    const variant =
      variants.find((entry) => String(entry._id) === String(item?.variantId || "")) ||
      variants.find((entry) => {
        const label = [entry.optionName, entry.optionValue]
          .filter(Boolean)
          .join(" / ");
        return (
          label === item?.variantLabel ||
          entry.optionValue === item?.variantLabel
        );
      });
    if (!variant) return 0;
    return Math.max(0, Number(variant.stock || 0));
  }

  return Math.max(0, Number(product.stock || 0));
}

type PublicStoreCheckoutProps = {
  businessId: string;
  enabled?: boolean;
};

const CART_KEY = (businessId: string) => `bizuply_store_cart_${businessId}`;

const PROVIDER_UI: Record<
  string,
  { title: string; subtitle: string; button: string; accent: string }
> = {
  paypal: {
    title: "סל ותשלום",
    subtitle: "תשלום מאובטח דרך PayPal",
    button: "לתשלום מאובטח ב-PayPal",
    accent: "#0070BA",
  },
  stripe: {
    title: "סל ותשלום",
    subtitle: "תשלום מאובטח דרך Stripe",
    button: "לתשלום מאובטח ב-Stripe",
    accent: "#635BFF",
  },
};

function formatMoney(amount: number, currency = "ILS") {
  try {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency || "ILS",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function loadCart(businessId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY(businessId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(businessId: string, items: CartItem[]) {
  localStorage.setItem(CART_KEY(businessId), JSON.stringify(items));
}

function normalizeIncomingCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((raw, index) => {
      const item = raw && typeof raw === "object" ? (raw as Record<string, any>) : {};
      const name = String(item.name || item.title || "").trim();
      const price = Number(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const productId = String(
        item.productId || item.cartId || item.ref || `custom-${index}`
      ).trim();

      if (!name || !Number.isFinite(price) || price < 0 || !productId) {
        return null;
      }

      return {
        productId,
        name,
        price,
        quantity,
        image: String(item.image || ""),
        variantLabel: String(item.variantLabel || item.size || item.color || ""),
        variantId: String(item.variantId || ""),
        sku: String(item.sku || item.ref || ""),
        custom: Boolean(item.custom) || !/^[a-f\d]{24}$/i.test(productId),
      } as CartItem;
    })
    .filter(Boolean) as CartItem[];
}

export default function PublicStoreCheckout({
  businessId,
  enabled = true,
}: PublicStoreCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payments, setPayments] = useState<PublicPaymentsInfo | null>(null);
  const [currency, setCurrency] = useState("ILS");
  const [products, setProducts] = useState<PublicStoreProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("shipping");
  const [shippingAddress, setShippingAddress] = useState<PublicShippingAddress>(
    EMPTY_SHIPPING_ADDRESS
  );
  const [pickupOptions, setPickupOptions] = useState<PublicPickupOptions>({});
  const [hasTemplateCartUi, setHasTemplateCartUi] = useState(false);
  const [appearance, setAppearance] = useState<CheckoutAppearance>(
    normalizeCheckoutAppearance(null),
  );
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const needsPhysicalFulfillment = useMemo(
    () => cartNeedsPhysicalFulfillment(cart, products),
    [cart, products]
  );

  const pickupConfigured = Boolean(
    pickupOptions?.enabled !== false &&
      (String(pickupOptions?.locationName || "").trim() ||
        String(pickupOptions?.address || "").trim())
  );

  const checkoutProvider = useMemo(
    () => resolveCheckoutProvider(payments),
    [payments]
  );

  const checkoutReady = Boolean(
    payments?.checkoutReady ||
      checkoutProvider === "paypal" ||
      checkoutProvider === "stripe"
  );

  const providerUi = PROVIDER_UI[checkoutProvider] || {
    title: "סל ותשלום",
    subtitle: checkoutProvider
      ? `תשלום דרך ${payments?.providers?.find((item) => item.provider === checkoutProvider)?.label || checkoutProvider}`
      : "בחרו ספק תשלום בלשונית תשלומים",
    button: "המשך לתשלום",
    accent: "#0f172a",
  };

  const checkoutTitle = appearance.title || providerUi.title;
  const checkoutButtonLabel = appearance.buttonLabel || providerUi.button;
  const checkoutAccent = appearance.accentColor || providerUi.accent;
  const checkoutPrimary = appearance.primaryColor || providerUi.accent;

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const syncCart = useCallback(
    (next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
      setCart((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        saveCart(businessId, value);
        return value;
      });
    },
    [businessId]
  );

  const addProduct = useCallback(
    (product: PublicStoreProduct, quantity = 1) => {
      const variants = Array.isArray(product.variants) ? product.variants : [];
      if (variants.length > 0) {
        setMessage({
          type: "error",
          text: `למוצר "${product.name}" יש וריאציות — בחרו מידה/צבע לפני הוספה לסל`,
        });
        setOpen(true);
        return;
      }

      if (
        product.trackStock !== false &&
        !product.allowBackorder &&
        (product.status === "out_of_stock" ||
          availableStockForProduct(product) < quantity)
      ) {
        setMessage({
          type: "error",
          text: `"${product.name}" אזל מהמלאי`,
        });
        setOpen(true);
        return;
      }

      syncCart((prev) => {
        const existing = prev.find((item) => item.productId === product._id);
        if (existing) {
          const nextQty = existing.quantity + quantity;
          const available = availableStockForProduct(product);
          if (
            product.trackStock !== false &&
            !product.allowBackorder &&
            nextQty > available
          ) {
            setMessage({
              type: "error",
              text: `מלאי לא מספיק עבור "${product.name}". זמין: ${available}`,
            });
            return prev;
          }
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: nextQty }
              : item
          );
        }
        return [
          ...prev,
          {
            productId: product._id,
            name: product.name,
            price: resolveStoreUnitPrice(product).price,
            quantity,
            image:
              product.mainImage ||
              product.image ||
              product.images?.[0] ||
              "",
            sku: product.sku || "",
            custom: false,
          },
        ];
      });
      setOpen(true);
      setMessage({ type: "info", text: `${product.name} נוסף לסל` });
    },
    [syncCart]
  );

  useEffect(() => {
    if (!businessId || !enabled) return;
    setCart(loadCart(businessId));
  }, [businessId, enabled]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const detectTemplateCart = () => {
      setHasTemplateCartUi(
        Boolean(
          document.querySelector(
            '[data-template-id="velmora"], [data-bizuply-template-cart="true"]'
          )
        )
      );
    };

    detectTemplateCart();
    const timer = window.setTimeout(detectTemplateCart, 400);
    return () => window.clearTimeout(timer);
  }, [businessId, open]);

  useEffect(() => {
    if (!businessId || !enabled) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [paymentsInfo, shop] = await Promise.all([
          getPublicPayments(businessId),
          getPublicShop(businessId),
        ]);

        if (cancelled) return;

        setPayments(paymentsInfo);
        setAppearance(
          normalizeCheckoutAppearance(paymentsInfo.checkoutAppearance),
        );
        setCurrency(
          paymentsInfo.currency || shop.settings?.currency || "ILS"
        );
        setProducts(
          (shop.products || []).filter((item) => item.status !== "draft")
        );
        setPickupOptions(shop.settings?.pickupOptions || {});
      } catch (err) {
        console.error("Public store load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [businessId, enabled]);

  useEffect(() => {
    if (!businessId || !enabled) return;

    function onOpenCheckout(event: Event) {
      const detail = (event as CustomEvent).detail || {};
      const incoming = normalizeIncomingCartItems(detail.items);
      if (incoming.length) {
        syncCart(incoming);
      } else if (Array.isArray(detail.items) && detail.items.length === 0) {
        syncCart([]);
      }

      if (!checkoutReady) {
        setMessage({
          type: "error",
          text: "אין ספק תשלום מחובר. חברו ספק תשלום בלשונית תשלומים בניהול האתר.",
        });
      } else {
        setMessage(null);
      }
      setOpen(true);
    }

    window.addEventListener(
      "bizuply:open-checkout",
      onOpenCheckout as EventListener
    );

    return () => {
      window.removeEventListener(
        "bizuply:open-checkout",
        onOpenCheckout as EventListener
      );
    };
  }, [businessId, checkoutReady, enabled, syncCart]);

  useEffect(() => {
    if (!businessId || !enabled || !checkoutReady) return;

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest(
        "[data-bizuply-add-to-cart], [data-product-id][data-add-to-cart], .bizuply-add-to-cart"
      ) as HTMLElement | null;

      if (!trigger) return;

      const productId =
        trigger.getAttribute("data-bizuply-add-to-cart") ||
        trigger.getAttribute("data-product-id") ||
        "";

      if (!productId) return;

      const product = products.find((item) => item._id === productId);
      if (!product) return;

      event.preventDefault();
      event.stopPropagation();
      addProduct(product);
    }

    function onCustomAdd(event: Event) {
      const detail = (event as CustomEvent).detail || {};
      const productId = String(detail.productId || "");
      const product = products.find((item) => item._id === productId);
      if (product) {
        addProduct(product, Number(detail.quantity) || 1);
        return;
      }

      const incoming = normalizeIncomingCartItems([detail]);
      if (!incoming.length) return;
      syncCart((prev) => {
        const next = [...prev];
        for (const item of incoming) {
          const existing = next.find((row) => row.productId === item.productId);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            next.push(item);
          }
        }
        return next;
      });
      setOpen(true);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("bizuply:add-to-cart", onCustomAdd as EventListener);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(
        "bizuply:add-to-cart",
        onCustomAdd as EventListener
      );
    };
  }, [addProduct, businessId, checkoutReady, enabled, products, syncCart]);

  useEffect(() => {
    if (!businessId || !enabled) return;

    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get("store_payment");
    const orderId = params.get("orderId") || "";
    const sessionId = params.get("session_id") || "";
    const provider = String(params.get("provider") || "").toLowerCase();

    if (paymentState === "cancel") {
      setMessage({ type: "info", text: "התשלום בוטל. אפשר לנסות שוב מהסל." });
      setOpen(true);
      return;
    }

    if (paymentState !== "success" || !orderId) return;

    let cancelled = false;

    async function confirm() {
      try {
        if (provider === "paypal" || (!sessionId && provider !== "stripe")) {
          const result = await confirmPublicPaypalPayment(businessId, orderId);
          if (cancelled) return;

          syncCart([]);
          setMessage({
            type: "success",
            text: result.paid
              ? `התשלום התקבל בהצלחה${
                  result.order?.orderNumber
                    ? ` (הזמנה ${result.order.orderNumber})`
                    : ""
                }`
              : `ההזמנה נשלחה לתשלום ב-PayPal${
                  result.order?.orderNumber
                    ? ` (הזמנה ${result.order.orderNumber})`
                    : ""
                }. נא לאשר את התשלום בחשבון PayPal של העסק.`,
          });
          setOpen(true);
          return;
        }

        if (!sessionId) return;

        const result = await confirmPublicStripePayment(
          businessId,
          orderId,
          sessionId
        );
        if (cancelled) return;

        if (result.paid) {
          syncCart([]);
          setMessage({
            type: "success",
            text: `התשלום התקבל בהצלחה${
              result.order?.orderNumber ? ` (הזמנה ${result.order.orderNumber})` : ""
            }`,
          });
          setOpen(true);
        } else {
          setMessage({
            type: "info",
            text: "התשלום עדיין בעיבוד. נסו לרענן בעוד רגע.",
          });
        }
      } catch (err: any) {
        if (cancelled) return;
        setMessage({
          type: "error",
          text:
            err?.response?.data?.error ||
            err?.message ||
            "אישור התשלום נכשל",
        });
      } finally {
        const url = new URL(window.location.href);
        url.searchParams.delete("store_payment");
        url.searchParams.delete("orderId");
        url.searchParams.delete("session_id");
        url.searchParams.delete("provider");
        window.history.replaceState({}, "", url.toString());
      }
    }

    confirm();
    return () => {
      cancelled = true;
    };
  }, [businessId, enabled, syncCart]);

  async function handlePay() {
    if (!customerName.trim()) {
      setMessage({ type: "error", text: "נא להזין שם מלא" });
      return;
    }
    if (!cart.length) {
      setMessage({ type: "error", text: "הסל ריק" });
      return;
    }
    if (!checkoutReady || !checkoutProvider) {
      setMessage({
        type: "error",
        text: "אין ספק תשלום מחובר. חברו ספק תשלום בלשונית תשלומים בניהול האתר.",
      });
      return;
    }

    const effectiveShippingAddress: PublicShippingAddress = {
      ...shippingAddress,
      fullName: shippingAddress.fullName.trim() || customerName.trim(),
      phone: shippingAddress.phone.trim() || customerPhone.trim(),
    };

    if (needsPhysicalFulfillment) {
      if (fulfillmentType !== "shipping" && fulfillmentType !== "pickup") {
        setMessage({ type: "error", text: "נא לבחור שיטת קבלה" });
        return;
      }
      if (fulfillmentType === "shipping") {
        const validated = validateShippingAddressForm(effectiveShippingAddress);
        if (!validated.ok) {
          setMessage({
            type: "error",
            text: "נא למלא את כל שדות המשלוח החובה לפני התשלום",
          });
          return;
        }
      }
      if (fulfillmentType === "pickup" && !pickupConfigured) {
        setMessage({
          type: "error",
          text: "איסוף עצמי עדיין לא הוגדר בחנות. בחרו משלוח או פנו לבעל החנות.",
        });
        return;
      }
    }

    setPaying(true);
    setMessage(null);

    try {
      const returnBase = `${window.location.origin}${window.location.pathname}`;
      const cancelUrl = `${returnBase}?store_payment=cancel&provider=${checkoutProvider}`;

      for (const item of cart) {
        if (item.custom) continue;
        const product = products.find((entry) => entry._id === item.productId);
        if (!product || product.trackStock === false || product.allowBackorder) {
          continue;
        }
        const available = availableStockForProduct(product, item);
        if (item.quantity > available) {
          setMessage({
            type: "error",
            text:
              available <= 0
                ? `"${item.name}" אזל מהמלאי`
                : `מלאי לא מספיק עבור "${item.name}". זמין: ${available}`,
          });
          setPaying(false);
          return;
        }
      }

      const draft = await createPublicStoreOrder(businessId, {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: cart.map((item) => ({
          productId: item.custom ? undefined : item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variantLabel: item.variantLabel,
          variantId: item.variantId || undefined,
          sku: item.sku,
        })),
        fulfillmentType: needsPhysicalFulfillment ? fulfillmentType : "none",
        shippingAddress:
          needsPhysicalFulfillment && fulfillmentType === "shipping"
            ? {
                ...effectiveShippingAddress,
                rawText: buildShippingRawText(effectiveShippingAddress),
              }
            : undefined,
        pickupDetails:
          needsPhysicalFulfillment && fulfillmentType === "pickup"
            ? pickupOptions
            : undefined,
        paymentProvider: checkoutProvider,
        startCheckout: false,
      });

      const orderId = draft.order?._id;
      if (!orderId) {
        throw new Error("לא נוצרה הזמנה");
      }

      const successUrl =
        checkoutProvider === "stripe"
          ? `${returnBase}?store_payment=success&provider=stripe&orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`
          : `${returnBase}?store_payment=success&provider=${checkoutProvider}&orderId=${orderId}`;

      const pay =
        checkoutProvider === "paypal"
          ? await startPublicPaypalCheckout(businessId, orderId, {
              successUrl,
              cancelUrl,
            })
          : await startPublicStripeCheckout(businessId, orderId, {
              successUrl,
              cancelUrl,
            });

      const checkoutUrl = pay.checkoutUrl || "";
      if (!checkoutUrl) {
        throw new Error("לא התקבל קישור לתשלום");
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "שגיאה בפתיחת התשלום",
      });
      setPaying(false);
    }
  }

  if (!enabled || !businessId || loading) return null;
  if (!checkoutReady && !open) return null;

  return (
    <div dir="rtl" className="bizuply-public-store-checkout">
      {checkoutReady && !hasTemplateCartUi ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-[70] inline-flex h-14 items-center gap-2 px-5 text-sm font-bold shadow-xl transition hover:opacity-95"
          style={{
            backgroundColor: checkoutPrimary,
            color: appearance.buttonTextColor,
            borderRadius: 999,
          }}
          aria-label="פתח סל קניות"
        >
          <ShoppingBag size={18} />
          סל
          {cartCount > 0 ? (
            <span
              className="grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-black"
              style={{
                backgroundColor: appearance.buttonTextColor,
                color: checkoutPrimary,
              }}
            >
              {cartCount}
            </span>
          ) : null}
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center"
          style={{ backgroundColor: appearance.overlayColor }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden shadow-2xl"
            style={{
              backgroundColor: appearance.panelBackground,
              borderRadius: appearance.panelRadius,
              color: appearance.textColor,
              border: `1px solid ${appearance.borderColor}`,
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: `1px solid ${appearance.borderColor}` }}
            >
              <div>
                <h2
                  className="text-base font-bold"
                  style={{ color: appearance.textColor }}
                >
                  {checkoutTitle}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: appearance.mutedTextColor }}
                >
                  {providerUi.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full transition hover:opacity-80"
                style={{
                  backgroundColor: `${appearance.borderColor}66`,
                  color: appearance.textColor,
                }}
                aria-label="סגור"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-right">
              {message ? (
                <div
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : message.type === "error"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-sky-200 bg-sky-50 text-sky-800"
                  }`}
                >
                  {message.type === "success" ? (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {message.text}
                    </span>
                  ) : (
                    message.text
                  )}
                </div>
              ) : null}

              {products.length ? (
                <div>
                  <h3
                    className="mb-2 text-sm font-bold"
                    style={{ color: appearance.textColor }}
                  >
                    מוצרים בחנות
                  </h3>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {products.slice(0, 12).map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between gap-2 px-3 py-2"
                        style={{
                          borderRadius: Math.max(8, appearance.buttonRadius - 2),
                          border: `1px solid ${appearance.borderColor}`,
                        }}
                      >
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{ color: appearance.textColor }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: appearance.mutedTextColor }}
                          >
                            {formatMoney(Number(product.price) || 0, currency)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="px-3 py-1.5 text-xs font-bold"
                          style={{
                            backgroundColor: checkoutAccent,
                            color: appearance.buttonTextColor,
                            borderRadius: Math.max(
                              6,
                              appearance.buttonRadius - 4,
                            ),
                          }}
                        >
                          הוסף
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h3
                  className="mb-2 text-sm font-bold"
                  style={{ color: appearance.textColor }}
                >
                  הסל שלי
                </h3>
                {cart.length ? (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-2 px-3 py-2"
                        style={{
                          borderRadius: Math.max(8, appearance.buttonRadius - 2),
                          border: `1px solid ${appearance.borderColor}`,
                        }}
                      >
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{ color: appearance.textColor }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: appearance.mutedTextColor }}
                          >
                            {formatMoney(item.price * item.quantity, currency)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center"
                            style={{
                              borderRadius: 8,
                              border: `1px solid ${appearance.borderColor}`,
                              color: appearance.textColor,
                            }}
                            onClick={() =>
                              syncCart((prev) =>
                                prev
                                  .map((row) =>
                                    row.productId === item.productId
                                      ? {
                                          ...row,
                                          quantity: Math.max(0, row.quantity - 1),
                                        }
                                      : row
                                  )
                                  .filter((row) => row.quantity > 0)
                              )
                            }
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-6 text-center text-sm font-bold"
                            style={{ color: appearance.textColor }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center"
                            style={{
                              borderRadius: 8,
                              border: `1px solid ${appearance.borderColor}`,
                              color: appearance.textColor,
                            }}
                            onClick={() =>
                              syncCart((prev) =>
                                prev.map((row) =>
                                  row.productId === item.productId
                                    ? { ...row, quantity: row.quantity + 1 }
                                    : row
                                )
                              )
                            }
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <p
                      className="text-sm font-bold"
                      style={{ color: appearance.textColor }}
                    >
                      סה״כ: {formatMoney(cartTotal, currency)}
                    </p>
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: appearance.mutedTextColor }}
                  >
                    הסל ריק. הוסיפו מוצרים מהחנות ולחצו שוב על מעבר לתשלום.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3
                  className="text-sm font-bold"
                  style={{ color: appearance.textColor }}
                >
                  פרטי לקוח
                </h3>
                <input
                  className="h-11 w-full px-3 text-sm outline-none"
                  style={{
                    borderRadius: Math.max(8, appearance.buttonRadius - 2),
                    border: `1px solid ${appearance.borderColor}`,
                    color: appearance.textColor,
                    backgroundColor: appearance.panelBackground,
                  }}
                  placeholder="שם מלא *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  className="h-11 w-full px-3 text-sm outline-none"
                  style={{
                    borderRadius: Math.max(8, appearance.buttonRadius - 2),
                    border: `1px solid ${appearance.borderColor}`,
                    color: appearance.textColor,
                    backgroundColor: appearance.panelBackground,
                  }}
                  placeholder="אימייל"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <input
                  className="h-11 w-full px-3 text-sm outline-none"
                  style={{
                    borderRadius: Math.max(8, appearance.buttonRadius - 2),
                    border: `1px solid ${appearance.borderColor}`,
                    color: appearance.textColor,
                    backgroundColor: appearance.panelBackground,
                  }}
                  placeholder="טלפון"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              {needsPhysicalFulfillment ? (
                <div className="space-y-3">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: appearance.textColor }}
                  >
                    שיטת קבלה
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["shipping", "משלוח"],
                        ["pickup", "איסוף עצמי"],
                      ] as const
                    ).map(([value, label]) => {
                      const selected = fulfillmentType === value;
                      const disabled = value === "pickup" && !pickupConfigured;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={disabled}
                          onClick={() => setFulfillmentType(value)}
                          className="h-11 text-sm font-bold outline-none disabled:opacity-45"
                          style={{
                            borderRadius: Math.max(8, appearance.buttonRadius - 2),
                            border: `1px solid ${
                              selected
                                ? appearance.accentColor || appearance.primaryColor
                                : appearance.borderColor
                            }`,
                            backgroundColor: selected
                              ? appearance.accentColor || appearance.primaryColor
                              : appearance.panelBackground,
                            color: selected
                              ? appearance.buttonTextColor
                              : appearance.textColor,
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {fulfillmentType === "shipping" ? (
                    <div className="space-y-2">
                      {(
                        [
                          ["fullName", "שם מלא *"],
                          ["phone", "טלפון *"],
                          ["country", "מדינה *"],
                          ["city", "עיר *"],
                          ["street", "רחוב *"],
                          ["houseNumber", "מספר בית *"],
                          ["apartment", "דירה (אופציונלי)"],
                          ["postalCode", "מיקוד (אופציונלי)"],
                        ] as const
                      ).map(([key, placeholder]) => (
                        <input
                          key={key}
                          className="h-11 w-full px-3 text-sm outline-none"
                          style={{
                            borderRadius: Math.max(8, appearance.buttonRadius - 2),
                            border: `1px solid ${appearance.borderColor}`,
                            color: appearance.textColor,
                            backgroundColor: appearance.panelBackground,
                          }}
                          placeholder={placeholder}
                          value={shippingAddress[key] || ""}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                        />
                      ))}
                      <textarea
                        className="min-h-[84px] w-full px-3 py-2 text-sm outline-none"
                        style={{
                          borderRadius: Math.max(8, appearance.buttonRadius - 2),
                          border: `1px solid ${appearance.borderColor}`,
                          color: appearance.textColor,
                          backgroundColor: appearance.panelBackground,
                        }}
                        placeholder="הערות לשליח (אופציונלי)"
                        value={shippingAddress.additionalInstructions || ""}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            additionalInstructions: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ) : null}

                  {fulfillmentType === "pickup" && pickupConfigured ? (
                    <div
                      className="space-y-1 rounded-xl p-3 text-sm"
                      style={{
                        border: `1px solid ${appearance.borderColor}`,
                        color: appearance.textColor,
                        backgroundColor: appearance.panelBackground,
                      }}
                    >
                      {pickupOptions.locationName ? (
                        <p className="font-bold">{pickupOptions.locationName}</p>
                      ) : null}
                      {pickupOptions.address ? (
                        <p style={{ color: appearance.mutedTextColor }}>
                          {pickupOptions.address}
                        </p>
                      ) : null}
                      {pickupOptions.hours ? (
                        <p style={{ color: appearance.mutedTextColor }}>
                          שעות פעילות: {pickupOptions.hours}
                        </p>
                      ) : null}
                      {pickupOptions.instructions ? (
                        <p style={{ color: appearance.mutedTextColor }}>
                          הוראות איסוף: {pickupOptions.instructions}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div
              className="p-4"
              style={{ borderTop: `1px solid ${appearance.borderColor}` }}
            >
              <button
                type="button"
                disabled={paying || !cart.length || !checkoutReady}
                onClick={handlePay}
                className="inline-flex h-12 w-full items-center justify-center gap-2 text-sm font-bold disabled:opacity-60"
                style={{
                  backgroundColor: checkoutPrimary,
                  color: appearance.buttonTextColor,
                  borderRadius: appearance.buttonRadius,
                }}
              >
                {paying ? <Loader2 size={16} className="animate-spin" /> : null}
                {checkoutButtonLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
