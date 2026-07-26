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
  type PublicStoreProduct,
} from "../../../api/publicStoreApi";

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
  const [hasTemplateCartUi, setHasTemplateCartUi] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

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
            price: Number(product.salePrice ?? product.price) || 0,
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
        setCurrency(
          paymentsInfo.currency || shop.settings?.currency || "ILS"
        );
        setProducts(
          (shop.products || []).filter((item) => item.status !== "draft")
        );
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
          text: "אין ספק תשלום מחובר. חברו PayPal או Stripe בלשונית תשלומים בניהול האתר.",
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
        text: "אין ספק תשלום מחובר. חברו ספק בלשונית תשלומים.",
      });
      return;
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
          className="fixed bottom-5 left-5 z-[70] inline-flex h-14 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-bold text-white shadow-xl hover:bg-slate-800"
          aria-label="פתח סל קניות"
        >
          <ShoppingBag size={18} />
          סל
          {cartCount > 0 ? (
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-emerald-400 px-1.5 text-xs font-black text-slate-900">
              {cartCount}
            </span>
          ) : null}
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {providerUi.title}
                </h2>
                <p className="text-xs text-slate-500">{providerUi.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
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
                  <h3 className="mb-2 text-sm font-bold text-slate-800">
                    מוצרים בחנות
                  </h3>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {products.slice(0, 12).map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatMoney(Number(product.price) || 0, currency)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          הוסף
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className="mb-2 text-sm font-bold text-slate-800">הסל שלי</h3>
                {cart.length ? (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatMoney(item.price * item.quantity, currency)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center rounded-md border"
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
                          <span className="w-6 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="grid h-7 w-7 place-items-center rounded-md border"
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
                    <p className="text-sm font-bold text-slate-900">
                      סה״כ: {formatMoney(cartTotal, currency)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    הסל ריק. הוסיפו מוצרים מהחנות ולחצו שוב על מעבר לתשלום.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800">פרטי לקוח</h3>
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  placeholder="שם מלא *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  placeholder="אימייל"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <input
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  placeholder="טלפון"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                disabled={paying || !cart.length || !checkoutReady}
                onClick={handlePay}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: providerUi.accent }}
              >
                {paying ? <Loader2 size={16} className="animate-spin" /> : null}
                {providerUi.button}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
