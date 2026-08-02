"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Grid3X3,
  ImagePlus,
  Loader2,
  MoreVertical,
  PackagePlus,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { emitStoreCatalogChanged } from "../site-builder/studio/data/templates/shared/storeCatalogSync";
import {
  CHECKOUT_APPEARANCE_PRESETS,
  DEFAULT_CHECKOUT_APPEARANCE,
  normalizeCheckoutAppearance,
  type CheckoutAppearance,
} from "./checkoutAppearance";

type StoreView =
  | "products"
  | "inventory"
  | "add-product"
  | "categories"
  | "settings"
  | "coupons"
  | "orders";

type StoreCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isVisible?: boolean;
  sortOrder?: number;
};

type StoreProductVariant = {
  _id?: string;
  optionName?: string;
  optionValue?: string;
  price?: number | null;
  salePrice?: number | null;
  sku?: string;
  stock?: number;
};

type StoreProduct = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  currency?: string;
  images?: string[];
  imageIds?: string[];
  mainImage?: string;
  categoryId?: string | StoreCategory | null;
  categoryName?: string;
  sku?: string;
  stock?: number;
  trackStock?: boolean;
  allowBackorder?: boolean;
  variants?: StoreProductVariant[];
  status?: "draft" | "active" | "hidden" | "out_of_stock";
  isFeatured?: boolean;
  isDemo?: boolean;
  isDigital?: boolean;
  productKind?: "physical" | "digital" | "service";
  digitalFileUrl?: string;
  tags?: string[];
};

function isDemoStoreProduct(product: StoreProduct): boolean {
  if (product.isDemo === false) return false;
  if (product.isDemo === true) return true;
  if (/^DEMO-/i.test(String(product.sku || ""))) return true;
  return (product.tags || []).some((tag) => String(tag).trim() === "דמו");
}

type StoreSettingsData = {
  storeName?: string;
  storeDescription?: string;
  currency?: string;
  isStoreActive?: boolean;
  showPrices?: boolean;
  allowCart?: boolean;
  allowWhatsappOrders?: boolean;
  whatsappPhone?: string;
  allowManualOrders?: boolean;
  defaultShippingPrice?: number;
  freeShippingFrom?: number | null;
  shippingPolicy?: string;
  pickupOptions?: {
    enabled?: boolean;
    locationName?: string;
    address?: string;
    hours?: string;
    instructions?: string;
  };
  returnPolicy?: string;
  checkoutNote?: string;
  checkoutAppearance?: Partial<CheckoutAppearance>;
  seoTitle?: string;
  seoDescription?: string;
  paymentMethods?: string[];
  paymentProviders?: PaymentProvider[];
  defaultPaymentProvider?: string;
  allowCashPayment?: boolean;
  allowBankTransfer?: boolean;
  bankTransferDetails?: {
    bankName?: string;
    branchNumber?: string;
    accountNumber?: string;
    accountOwnerName?: string;
    notes?: string;
  };
  allowBitPayment?: boolean;
  bitPhone?: string;
  allowPayboxPayment?: boolean;
  payboxPhone?: string;
  orderConfirmationEmail?: {
    enabled?: boolean;
    language?: string;
    replyToOverride?: string;
  };
};

type PaymentProviderType =
  | "manual"
  | "whatsapp"
  | "bank_transfer"
  | "stripe"
  | "paypal"
  | "square"
  | "adyen"
  | "checkout_com"
  | "braintree"
  | "mollie"
  | "worldpay"
  | "verifone"
  | "grow"
  | "hyp"
  | "tranzila"
  | "payme"
  | "payplus"
  | "cal"
  | "custom";

type PaymentProvider = {
  _id?: string;
  provider: PaymentProviderType;
  label?: string;
  isEnabled?: boolean;
  isPrimary?: boolean;
  mode?: "test" | "live";
  installmentsEnabled?: boolean;
  credentials?: {
    terminalNumber?: string;
    username?: string;
    apiKey?: string;
    apiSecret?: string;
    pageCode?: string;
    supplierId?: string;
    merchantId?: string;
    accountId?: string;
    publicKey?: string;
    privateKey?: string;
    webhookSecret?: string;
    customCheckoutUrl?: string;
  };
  connectionStatus?: "not_connected" | "pending" | "connected" | "failed";
  lastConnectionCheckAt?: string | null;
  notes?: string;
};

type StoreCoupon = {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount?: number;
  isActive?: boolean;
};

type StoreOrderShippingAddress =
  | string
  | {
      fullName?: string;
      phone?: string;
      country?: string;
      city?: string;
      street?: string;
      houseNumber?: string;
      apartment?: string;
      postalCode?: string;
      additionalInstructions?: string;
      rawText?: string;
    };

type StoreOrder = {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  total?: number;
  subtotal?: number;
  shippingPrice?: number;
  discountTotal?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
  fulfillmentType?: "shipping" | "pickup" | "none";
  shippingAddress?: StoreOrderShippingAddress;
  pickupDetails?: {
    locationName?: string;
    address?: string;
    hours?: string;
    instructions?: string;
  };
  confirmationEmail?: {
    status?: "none" | "queued" | "sending" | "sent" | "failed" | "skipped";
    lastSentAt?: string | null;
    lastError?: string;
    attemptCount?: number;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
};

function formatOrderShippingAddress(value?: StoreOrderShippingAddress) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (value.rawText) return String(value.rawText).trim();
  return [
    value.fullName,
    value.phone,
    [value.street, value.houseNumber].filter(Boolean).join(" "),
    value.apartment ? `דירה ${value.apartment}` : "",
    [value.city, value.postalCode].filter(Boolean).join(" "),
    value.country,
    value.additionalInstructions,
  ]
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .join("\n");
}

type AuthUserShape = {
  businessId?: string;
  business?: { _id?: string };
  role?: string;
};

type StoreProductsManagerProps = {
  businessId?: string;
  embedded?: boolean;
  initialView?: StoreView;
  allowedViews?: StoreView[];
  settingsFocus?: "all" | "shipping";
};

const emptySettings: StoreSettingsData = {
  storeName: "",
  storeDescription: "",
  currency: "USD",
  isStoreActive: true,
  showPrices: true,
  allowCart: true,
  allowWhatsappOrders: true,
  whatsappPhone: "",
  allowManualOrders: true,
  defaultShippingPrice: 0,
  freeShippingFrom: null,
  shippingPolicy: "",
  pickupOptions: {
    enabled: true,
    locationName: "",
    address: "",
    hours: "",
    instructions: "",
  },
  returnPolicy: "",
  checkoutNote: "",
  checkoutAppearance: { ...DEFAULT_CHECKOUT_APPEARANCE },
  seoTitle: "",
  seoDescription: "",
  paymentMethods: ["manual"],
  paymentProviders: [
    {
      provider: "manual",
      label: "Manual payment",
      isEnabled: true,
      isPrimary: true,
      mode: "live",
      connectionStatus: "connected",
    },
    {
      provider: "whatsapp",
      label: "WhatsApp order",
      isEnabled: true,
      isPrimary: false,
      mode: "live",
      connectionStatus: "connected",
    },
  ],
  defaultPaymentProvider: "manual",
  allowCashPayment: false,
  allowBankTransfer: false,
  bankTransferDetails: {
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    accountOwnerName: "",
    notes: "",
  },
  allowBitPayment: false,
  bitPhone: "",
  allowPayboxPayment: false,
  orderConfirmationEmail: {
    enabled: true,
    language: "he",
    replyToOverride: "",
  },
  payboxPhone: "",
};

const emptyProductForm = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  salePrice: "",
  currency: "USD",
  categoryId: "",
  sku: "",
  stock: "0",
  trackStock: true,
  allowBackorder: false,
  variants: [] as StoreProductVariant[],
  tags: "",
  status: "active",
  isFeatured: false,
  isDigital: false,
  productKind: "physical" as "physical" | "digital" | "service",
  digitalFileUrl: "",
};

function productStockTotal(product: {
  stock?: number;
  variants?: StoreProductVariant[];
}) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.reduce(
      (sum, variant) => sum + Math.max(0, Number(variant.stock || 0)),
      0
    );
  }
  return Math.max(0, Number(product.stock || 0));
}

const emptyCategoryForm = {
  name: "",
  description: "",
  isVisible: true,
  sortOrder: "0",
};

const emptyCouponForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrderAmount: "0",
  startsAt: "",
  expiresAt: "",
  usageLimit: "",
  isActive: true,
};

function formatMoney(value?: number | string | null, currency = "USD") {
  const amount = Number(value || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function normalizeDateInput(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-black text-slate-700">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 outline-none transition",
        "placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
        props.className
      )}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold leading-7 text-slate-800 outline-none transition",
        "placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
        props.className
      )}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cx(
          "h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-sm font-extrabold text-slate-800 outline-none transition",
          "focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
          props.className
        )}
      />
      <ChevronDown
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function PrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 py-3 text-sm font-semibold text-slate-800 shadow-md shadow-violet-200/50 transition",
        "hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 hover:shadow-lg active:translate-y-0",
        "disabled:cursor-not-allowed disabled:opacity-60",
        props.className
      )}
    >
      {loading ? <BizuplyLoader size="xs" compact /> : null}
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50",
        "disabled:cursor-not-allowed disabled:opacity-60",
        props.className
      )}
    >
      {children}
    </button>
  );
}

function StatusBadge({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
      )}
    >
      <span
        className={cx(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {label}
    </span>
  );
}

function EmptyBox({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[260px] place-items-center rounded-[32px] border border-dashed border-slate-300 bg-white p-8 text-center">
      <div>
        <ShoppingBag size={42} className="mx-auto text-slate-300" />
        <p className="mt-4 text-lg font-black text-slate-800">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-7 text-slate-500">
          {text}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export default function StoreProductsManager({
  businessId: businessIdProp,
  embedded = false,
  initialView = "products",
  allowedViews,
  settingsFocus = "all",
}: StoreProductsManagerProps) {
  const { user } = useAuth() as { user: AuthUserShape | null };

  const businessId =
    businessIdProp || user?.businessId || user?.business?._id || "";

  const [view, setView] = useState<StoreView>(initialView);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [settings, setSettings] = useState<StoreSettingsData>(emptySettings);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [coupons, setCoupons] = useState<StoreCoupon[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [resendingOrderId, setResendingOrderId] = useState<string | null>(null);

  const [productForm, setProductForm] =
    useState<Record<string, any>>(emptyProductForm);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] =
    useState<Record<string, any>>(emptyCategoryForm);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [couponForm, setCouponForm] =
    useState<Record<string, any>>(emptyCouponForm);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("all");
  const [seedingDemo, setSeedingDemo] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory =
        filterCategoryId === "all" ||
        String(
          typeof product.categoryId === "object"
            ? product.categoryId?._id
            : product.categoryId || ""
        ) === filterCategoryId;

      const cleanSearch = search.trim().toLowerCase();

      const bySearch =
        !cleanSearch ||
        product.name?.toLowerCase().includes(cleanSearch) ||
        product.description?.toLowerCase().includes(cleanSearch) ||
        product.shortDescription?.toLowerCase().includes(cleanSearch) ||
        product.categoryName?.toLowerCase().includes(cleanSearch) ||
        product.sku?.toLowerCase().includes(cleanSearch);

      return byCategory && bySearch;
    });
  }, [products, search, filterCategoryId]);

  const productsWithoutCategory = useMemo(() => {
    return products.filter((product) => !product.categoryId).length;
  }, [products]);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });

    window.setTimeout(() => {
      setMessage(null);
    }, 3500);
  }, []);

  const loadStoreData = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);

    try {
      const [settingsRes, categoriesRes, productsRes, couponsRes, ordersRes] =
        await Promise.allSettled([
          API.get(`/store/${businessId}/settings`),
          API.get(`/store/${businessId}/categories?all=1`),
          API.get(`/store/${businessId}/products?status=all`),
          API.get(`/store/${businessId}/coupons`),
          API.get(`/store/${businessId}/orders`),
        ]);

      if (settingsRes.status === "fulfilled") {
        setSettings({
          ...emptySettings,
          ...(settingsRes.value.data?.settings || {}),
        });
      }

      if (categoriesRes.status === "fulfilled") {
        setCategories(categoriesRes.value.data?.categories || []);
      }

      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value.data?.products || []);
      }

      if (couponsRes.status === "fulfilled") {
        setCoupons(couponsRes.value.data?.coupons || []);
      }

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data?.orders || []);
      }
    } catch (err) {
      console.error("Load store data error:", err);
      showMessage("error", "לא הצלחנו לטעון את נתוני החנות");
    } finally {
      setLoading(false);
    }
  }, [businessId, showMessage]);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const seedDemoProducts = useCallback(async () => {
    if (!businessId || seedingDemo) return;

    setSeedingDemo(true);

    try {
      const { data } = await API.post(`/store/${businessId}/seed-demo`);
      await loadStoreData();
      emitStoreCatalogChanged(businessId);

      if (data?.seeded) {
        showMessage(
          "success",
          `נוספו ${data.productCount || 0} מוצרי דמו לתצוגה — כשתוסיפו מוצר אמיתי הם יוחלפו אוטומטית`,
        );
      } else if (data?.reason === "already_has_products") {
        showMessage("success", "בחנות כבר יש מוצרים — לא הוספנו דמו מעל הנתונים שלך");
      }
    } catch (err) {
      console.error("Seed store demo error:", err);
      showMessage("error", "לא הצלחנו להוסיף מוצרי דמו");
    } finally {
      setSeedingDemo(false);
    }
  }, [businessId, loadStoreData, seedingDemo, showMessage]);

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setProductImages([]);
    setEditingProductId(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setView("add-product");
  };

  const updateProductInventory = useCallback(
    async (
      product: StoreProduct,
      patch: { sku?: string; stock?: number; status?: string }
    ) => {
      if (!businessId) return;

      try {
        const formData = new FormData();
        if (patch.sku !== undefined) {
          formData.set("sku", String(patch.sku || "").trim());
        }
        if (patch.stock !== undefined) {
          formData.set("stock", String(Math.max(0, Number(patch.stock) || 0)));
        }
        if (patch.status !== undefined) {
          formData.set("status", String(patch.status || "active"));
        }

        const { data } = await API.put(
          `/store/${businessId}/products/${product._id}`,
          formData
        );

        const updated = data?.product as StoreProduct | undefined;
        setProducts((current) =>
          current.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  ...(updated || {}),
                  sku: patch.sku !== undefined ? patch.sku : item.sku,
                  stock:
                    patch.stock !== undefined
                      ? Math.max(0, Number(patch.stock) || 0)
                      : item.stock,
                  status:
                    (patch.status as StoreProduct["status"]) ||
                    updated?.status ||
                    item.status,
                }
              : item
          )
        );
        emitStoreCatalogChanged(businessId);
      } catch (err) {
        console.error("Update inventory error:", err);
        showMessage("error", "לא הצלחנו לעדכן את המלאי");
        await loadStoreData();
      }
    },
    [businessId, loadStoreData, showMessage]
  );

  const saveSettings = async () => {
    if (!businessId) return;

    setSaving(true);

    try {
      // Never round-trip paymentProviders — GET masks secrets as "••••••••"
      // and a full settings PUT would wipe real Stripe/Hyp keys in Mongo.
      const {
        paymentProviders: _paymentProviders,
        defaultPaymentProvider: _defaultPaymentProvider,
        paymentMethods: _paymentMethods,
        ...safeSettings
      } = settings;

      const { data } = await API.put(
        `/store/${businessId}/settings`,
        safeSettings
      );
      setSettings({
        ...emptySettings,
        ...(data?.settings || {}),
        // Keep local payment snapshot from previous load / payments panel.
        paymentProviders: settings.paymentProviders,
        defaultPaymentProvider: settings.defaultPaymentProvider,
        paymentMethods: settings.paymentMethods,
      });
      showMessage("success", "הגדרות החנות נשמרו בהצלחה");
    } catch (err) {
      console.error("Save store settings error:", err);
      showMessage("error", "שגיאה בשמירת הגדרות החנות");
    } finally {
      setSaving(false);
    }
  };

  const submitProduct = async () => {
    if (!businessId) return;

    if (!productForm.name?.trim()) {
      showMessage("error", "צריך להזין שם מוצר");
      return;
    }

    if (!productForm.price && productForm.price !== 0) {
      showMessage("error", "צריך להזין מחיר מוצר");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(productForm).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        // Keep URL lists and file uploads on separate fields to avoid multer collisions.
        if (
          key === "images" ||
          key === "imageIds" ||
          key === "mainImage" ||
          key === "existingImages" ||
          key === "existingImageIds"
        ) {
          return;
        }
        if (key === "variants") {
          formData.append(
            "variants",
            JSON.stringify(Array.isArray(value) ? value : [])
          );
          return;
        }
        if (key === "categoryId") {
          // Empty string breaks Mongo ObjectId casting on the server.
          formData.append("categoryId", String(value || "").trim());
          return;
        }
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
          return;
        }
        formData.append(key, String(value));
      });

      // Always send inventory fields explicitly so they never get dropped.
      formData.set("sku", String(productForm.sku ?? "").trim());
      formData.set(
        "stock",
        String(
          Math.max(
            0,
            Number(
              Array.isArray(productForm.variants) &&
                productForm.variants.length > 0
                ? productForm.variants.reduce(
                    (sum: number, variant: any) =>
                      sum + Math.max(0, Number(variant?.stock || 0)),
                    0
                  )
                : productForm.stock || 0
            ) || 0
          )
        )
      );
      formData.set("status", String(productForm.status || "active"));
      formData.set(
        "trackStock",
        productForm.trackStock === false ? "false" : "true"
      );
      formData.set(
        "allowBackorder",
        productForm.allowBackorder ? "true" : "false"
      );

      let existingImages: string[] = [];
      try {
        const parsed = JSON.parse(String(productForm.images || "[]"));
        existingImages = Array.isArray(parsed)
          ? parsed.filter(
              (url) => typeof url === "string" && /^https?:\/\//i.test(url)
            )
          : [];
      } catch {
        existingImages = [];
      }

      let existingImageIds: string[] = [];
      try {
        const parsed = JSON.parse(String(productForm.imageIds || "[]"));
        existingImageIds = Array.isArray(parsed)
          ? parsed.filter((id) => typeof id === "string" && id.trim())
          : [];
      } catch {
        existingImageIds = [];
      }

      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append("existingImageIds", JSON.stringify(existingImageIds));
      if (existingImages[0]) {
        formData.append("mainImage", existingImages[0]);
      }

      productImages.forEach((file) => {
        formData.append("imageFiles", file);
      });

      // Do not force Content-Type — axios must set the multipart boundary.
      const { data } = editingProductId
        ? await API.put(
            `/store/${businessId}/products/${editingProductId}`,
            formData
          )
        : await API.post(`/store/${businessId}/products`, formData);

      resetProductForm();
      await loadStoreData();
      emitStoreCatalogChanged(businessId);
      setView("products");

      const clearedDemoCount = Number(data?.demoCleanup?.productCount || 0);
      if (!editingProductId && clearedDemoCount > 0) {
        showMessage(
          "success",
          `המוצר נוסף לחנות — ${clearedDemoCount} מוצרי דמו הוחלפו במוצרים שלך`
        );
      } else {
        showMessage(
          "success",
          editingProductId ? "המוצר עודכן בהצלחה" : "המוצר נוסף ונכנס לגריד"
        );
      }
    } catch (err) {
      console.error("Submit product error:", err);
      showMessage("error", "שגיאה בשמירת המוצר");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product: StoreProduct) => {
    const categoryId =
      typeof product.categoryId === "object"
        ? product.categoryId?._id || ""
        : product.categoryId || "";

    setEditingProductId(product._id);
    setProductImages([]);

    setProductForm({
      name: product.name || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      salePrice:
        product.salePrice === null ? "" : String(product.salePrice ?? ""),
      currency: product.currency || settings.currency || "USD",
      categoryId,
      sku: product.sku || "",
      stock: String(product.stock ?? 0),
      trackStock: product.trackStock !== false,
      allowBackorder: Boolean(product.allowBackorder),
      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            _id: variant._id,
            optionName: variant.optionName || "",
            optionValue: variant.optionValue || "",
            price:
              variant.price === null || variant.price === undefined
                ? ""
                : String(variant.price),
            salePrice:
              variant.salePrice === null || variant.salePrice === undefined
                ? ""
                : String(variant.salePrice),
            sku: variant.sku || "",
            stock: String(variant.stock ?? 0),
          }))
        : [],
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      status: product.status || "active",
      isFeatured: Boolean(product.isFeatured),
      isDigital: Boolean(product.isDigital) || product.productKind === "digital",
      productKind:
        product.productKind === "digital" ||
        product.productKind === "service" ||
        product.productKind === "physical"
          ? product.productKind
          : product.isDigital
            ? "digital"
            : "physical",
      digitalFileUrl: product.digitalFileUrl || "",
      images: JSON.stringify(product.images || []),
      imageIds: JSON.stringify(product.imageIds || []),
      mainImage: product.mainImage || "",
    });

    setView("add-product");
  };

  const deleteProduct = async (productId: string) => {
    if (!businessId) return;
    if (!window.confirm("למחוק את המוצר?")) return;

    try {
      await API.delete(`/store/${businessId}/products/${productId}`);
      await loadStoreData();
      emitStoreCatalogChanged(businessId);
      showMessage("success", "המוצר נמחק");
    } catch (err) {
      console.error("Delete product error:", err);
      showMessage("error", "שגיאה במחיקת מוצר");
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setCategoryImage(null);
    setEditingCategoryId(null);
  };

  const submitCategory = async () => {
    if (!businessId) return;

    if (!categoryForm.name?.trim()) {
      showMessage("error", "צריך להזין שם קטגוריה");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(categoryForm).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });

      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      const request = editingCategoryId
        ? API.put(
            `/store/${businessId}/categories/${editingCategoryId}`,
            formData
          )
        : API.post(`/store/${businessId}/categories`, formData);

      await request;

      resetCategoryForm();
      await loadStoreData();
      emitStoreCatalogChanged(businessId);

      showMessage(
        "success",
        editingCategoryId ? "הקטגוריה עודכנה" : "הקטגוריה נוספה"
      );
    } catch (err) {
      console.error("Submit category error:", err);
      showMessage("error", "שגיאה בשמירת קטגוריה");
    } finally {
      setSaving(false);
    }
  };

  const editCategory = (category: StoreCategory) => {
    setEditingCategoryId(category._id);
    setCategoryImage(null);

    setCategoryForm({
      name: category.name || "",
      description: category.description || "",
      isVisible: Boolean(category.isVisible),
      sortOrder: String(category.sortOrder ?? 0),
    });

    setView("categories");
  };

  const deleteCategory = async (categoryId: string) => {
    if (!businessId) return;

    if (!window.confirm("למחוק את הקטגוריה? המוצרים לא יימחקו, רק השיוך יוסר.")) {
      return;
    }

    try {
      await API.delete(`/store/${businessId}/categories/${categoryId}`);
      await loadStoreData();
      emitStoreCatalogChanged(businessId);
      showMessage("success", "הקטגוריה נמחקה");
    } catch (err) {
      console.error("Delete category error:", err);
      showMessage("error", "שגיאה במחיקת קטגוריה");
    }
  };

  const resetCouponForm = () => {
    setCouponForm(emptyCouponForm);
    setEditingCouponId(null);
  };

  const submitCoupon = async () => {
    if (!businessId) return;

    if (!couponForm.code?.trim()) {
      showMessage("error", "צריך להזין קוד קופון");
      return;
    }

    if (!couponForm.discountValue) {
      showMessage("error", "צריך להזין ערך הנחה");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...couponForm,
        code: String(couponForm.code).trim().toUpperCase(),
      };

      const request = editingCouponId
        ? API.put(`/store/${businessId}/coupons/${editingCouponId}`, payload)
        : API.post(`/store/${businessId}/coupons`, payload);

      await request;

      resetCouponForm();
      await loadStoreData();

      showMessage(
        "success",
        editingCouponId ? "הקופון עודכן" : "הקופון נוסף"
      );
    } catch (err) {
      console.error("Submit coupon error:", err);
      showMessage("error", "שגיאה בשמירת קופון");
    } finally {
      setSaving(false);
    }
  };

  const editCoupon = (coupon: StoreCoupon) => {
    setEditingCouponId(coupon._id);

    setCouponForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "percent",
      discountValue: String(coupon.discountValue ?? ""),
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      startsAt: normalizeDateInput(coupon.startsAt),
      expiresAt: normalizeDateInput(coupon.expiresAt),
      usageLimit:
        coupon.usageLimit === null ? "" : String(coupon.usageLimit ?? ""),
      isActive: Boolean(coupon.isActive),
    });

    setView("coupons");
  };

  const deleteCoupon = async (couponId: string) => {
    if (!businessId) return;
    if (!window.confirm("למחוק את הקופון?")) return;

    try {
      await API.delete(`/store/${businessId}/coupons/${couponId}`);
      await loadStoreData();
      showMessage("success", "הקופון נמחק");
    } catch (err) {
      console.error("Delete coupon error:", err);
      showMessage("error", "שגיאה במחיקת קופון");
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: string,
    options?: { sendConfirmationEmail?: boolean }
  ) => {
    if (!businessId) return;

    try {
      const payload: Record<string, unknown> = { status };
      if (status === "paid") {
        payload.paymentStatus = "paid";
        payload.sendConfirmationEmail =
          options?.sendConfirmationEmail !== false;
      }

      await API.put(`/store/${businessId}/orders/${orderId}`, payload);
      await loadStoreData();
      showMessage("success", "סטטוס ההזמנה עודכן");
    } catch (err) {
      console.error("Update order status error:", err);
      showMessage("error", "שגיאה בעדכון הזמנה");
    }
  };

  const resendOrderConfirmationEmail = async (orderId: string) => {
    if (!businessId || resendingOrderId) return;

    setResendingOrderId(orderId);
    try {
      const { data } = await API.post(
        `/store/${businessId}/orders/${orderId}/resend-confirmation-email`
      );
      await loadStoreData();
      if (data?.skipped) {
        showMessage(
          "error",
          data?.reason === "resend_in_progress"
            ? "שליחה מחדש כבר בתהליך"
            : data?.reason || "המייל לא נשלח מחדש"
        );
        return;
      }
      showMessage("success", "מייל אישור ההזמנה נכנס לתור שליחה");
    } catch (err: any) {
      console.error("Resend confirmation email error:", err);
      showMessage(
        "error",
        err?.response?.data?.error || "שגיאה בשליחה מחדש של מייל האישור"
      );
    } finally {
      setResendingOrderId(null);
    }
  };


  const nav = [
    { id: "products" as StoreView, label: "מוצרים", icon: <Grid3X3 size={17} /> },
    {
      id: "inventory" as StoreView,
      label: "מלאי",
      icon: <ClipboardList size={17} />,
    },
    { id: "add-product" as StoreView, label: "הוספה", icon: <Plus size={17} /> },
    { id: "categories" as StoreView, label: "קטגוריות", icon: <Tags size={17} /> },
    { id: "settings" as StoreView, label: "הגדרות", icon: <Settings size={17} /> },
    { id: "coupons" as StoreView, label: "קופונים", icon: <BadgePercent size={17} /> },
    { id: "orders" as StoreView, label: "הזמנות", icon: <Boxes size={17} /> },
  ].filter((item) => !allowedViews || allowedViews.includes(item.id));

  if (!businessId) {
    return (
      <div
        dir="rtl"
        className="rounded-[32px] border border-amber-200 bg-amber-50 p-6 text-right"
      >
        <p className="text-sm font-black text-amber-800">
          לא נמצא businessId. צריך להיכנס כבעל עסק כדי לנהל חנות.
        </p>
      </div>
    );
  }

  return (
    <section dir="rtl" className="w-full text-right">
      {!embedded ? (
        <div className="mb-6 rounded-[34px] border border-slate-200 bg-white p-5 shadow-[0_22px_80px_rgba(15,23,42,0.08)] md:p-7">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                <ShoppingBag size={15} />
                ניהול חנות
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
                מוצרים, קטגוריות והגדרות
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
                מוסיפים מוצר פעם אחת, משייכים אותו לקטגוריה, והוא מופיע אוטומטית
                בגריד החנות ובדפי הקטגוריות באתר.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 xl:min-w-[620px]">
              <StatCard title="מוצרים" value={products.length} />
              <StatCard title="קטגוריות" value={categories.length} />
              <StatCard title="ללא קטגוריה" value={productsWithoutCategory} />
              <StatCard title="קופונים" value={coupons.length} />
              <StatCard title="הזמנות" value={orders.length} />
              <StatCard
                title="סטטוס"
                value={settings.isStoreActive ? "פעיל" : "כבוי"}
              />
            </div>
          </div>
        </div>
      ) : null}

      {message && (
        <div
          className={cx(
            "mb-5 flex items-center gap-3 rounded-2xl border p-4 text-sm font-black",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          <CheckCircle2 size={19} />
          {message.text}
        </div>
      )}

      {nav.length > 1 ? (
      <div
        className={cx(
          embedded ? "mb-4 border-b border-slate-200" : "mb-6 rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm"
        )}
      >
        <div
          className={cx(
            embedded
              ? "flex gap-1 overflow-x-auto pb-0"
              : "grid grid-cols-2 gap-2 md:grid-cols-6"
          )}
        >
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === "add-product") resetProductForm();
                setView(item.id);
              }}
              className={cx(
                "flex items-center justify-center gap-2 text-sm font-semibold transition",
                embedded
                  ? "relative shrink-0 px-4 py-2.5"
                  : "min-h-12 rounded-2xl px-4 font-black",
                embedded
                  ? view === item.id
                    ? "text-violet-700"
                    : "text-slate-500 hover:text-slate-800"
                  : view === item.id
                    ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-md shadow-violet-200/40"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              )}
            >
              {item.icon}
              {item.label}
              {embedded && view === item.id ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
      ) : null}

      <div
        className={cx(
          "min-w-0",
          embedded
            ? "overflow-x-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
            : "min-h-[520px] rounded-[34px] border border-slate-200 bg-[#F8FAFC] p-4 shadow-[0_22px_80px_rgba(15,23,42,0.06)] md:p-6"
        )}
      >
        {loading ? (
          <div className="grid min-h-[420px] place-items-center">
            <div className="flex items-center gap-3 text-sm font-black text-slate-500">
              <BizuplyLoader size="sm" compact />
              טוען נתוני חנות...
            </div>
          </div>
        ) : null}

        {!loading && view === "products" && (
          <ProductsView
            products={filteredProducts}
            categories={categories}
            search={search}
            setSearch={setSearch}
            filterCategoryId={filterCategoryId}
            setFilterCategoryId={setFilterCategoryId}
            settings={settings}
            seedingDemo={seedingDemo}
            onSeedDemo={() => {
              void seedDemoProducts();
            }}
            onAddProduct={openAddProduct}
            onOpenInventory={() => setView("inventory")}
            onEditProduct={editProduct}
            onDeleteProduct={deleteProduct}
          />
        )}

        {!loading && view === "inventory" && (
          <InventoryView
            products={filteredProducts}
            search={search}
            setSearch={setSearch}
            onBackToProducts={() => setView("products")}
            onEditProduct={editProduct}
            onDeleteProduct={deleteProduct}
            onUpdateInventory={updateProductInventory}
          />
        )}

        {!loading && view === "add-product" && (
          <ProductFormView
            productForm={productForm}
            setProductForm={setProductForm}
            productImages={productImages}
            setProductImages={setProductImages}
            categories={categories}
            editingProductId={editingProductId}
            saving={saving}
            onSubmit={submitProduct}
            onCancel={() => {
              resetProductForm();
              setView("products");
            }}
            onCreateCategory={() => setView("categories")}
          />
        )}

        {!loading && view === "categories" && (
          <CategoriesView
            categories={categories}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            categoryImage={categoryImage}
            setCategoryImage={setCategoryImage}
            editingCategoryId={editingCategoryId}
            saving={saving}
            onSubmit={submitCategory}
            onReset={resetCategoryForm}
            onEdit={editCategory}
            onDelete={deleteCategory}
          />
        )}

        {!loading && view === "settings" && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            saving={saving}
            onSave={saveSettings}
            focus={settingsFocus}
            embedded={embedded}
          />
        )}

        {!loading && view === "coupons" && (
          <CouponsView
            coupons={coupons}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            editingCouponId={editingCouponId}
            saving={saving}
            settings={settings}
            onSubmit={submitCoupon}
            onReset={resetCouponForm}
            onEdit={editCoupon}
            onDelete={deleteCoupon}
          />
        )}

        {!loading && view === "orders" && (
          <OrdersView
            orders={orders}
            settings={settings}
            onUpdateOrderStatus={updateOrderStatus}
            onResendConfirmationEmail={resendOrderConfirmationEmail}
            resendingOrderId={resendingOrderId}
          />
        )}
      </div>
    </section>
  );
}

function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <p className="text-[11px] font-black text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-black text-slate-800">{value}</p>
    </div>
  );
}

function InventoryView({
  products,
  search,
  setSearch,
  onBackToProducts,
  onEditProduct,
  onDeleteProduct,
  onUpdateInventory,
}: {
  products: StoreProduct[];
  search: string;
  setSearch: (value: string) => void;
  onBackToProducts: () => void;
  onEditProduct: (product: StoreProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateInventory: (
    product: StoreProduct,
    patch: { sku?: string; stock?: number; status?: string }
  ) => Promise<void>;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftSku, setDraftSku] = useState<Record<string, string>>({});
  const [draftStock, setDraftStock] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextSku: Record<string, string> = {};
    const nextStock: Record<string, string> = {};
    products.forEach((product) => {
      nextSku[product._id] = product.sku || "";
      nextStock[product._id] = String(productStockTotal(product));
    });
    setDraftSku(nextSku);
    setDraftStock(nextStock);
  }, [products]);

  async function commitPatch(
    product: StoreProduct,
    patch: { sku?: string; stock?: number; status?: string }
  ) {
    setSavingId(product._id);
    try {
      await onUpdateInventory(product, patch);
    } finally {
      setSavingId(null);
      setOpenMenuId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-sm font-black text-slate-800">
            <button
              type="button"
              onClick={onBackToProducts}
              className="text-slate-500 transition hover:text-slate-800"
            >
              מוצרים
            </button>
            <span className="text-slate-300">»</span>
            <span>מלאי</span>
          </nav>
          <p className="mt-2 text-sm font-bold text-slate-500">
            רשימת מלאי ומק״ט לכל מוצר — עדכון מהיר בלי לפתוח את כרטיס המוצר.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש..."
            className="pr-10"
          />
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyBox
          title="אין מוצרים במלאי"
          text="הוסיפו מוצרים בחנות כדי לנהל כאן מק״ט וכמויות."
          action={
            <PrimaryButton type="button" onClick={onBackToProducts}>
              חזרה למוצרים
            </PrimaryButton>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-4 py-3 text-xs font-black tracking-wide">
                    מוצר
                  </th>
                  <th className="px-4 py-3 text-xs font-black tracking-wide">
                    מק״ט / ברקוד
                  </th>
                  <th className="px-4 py-3 text-xs font-black tracking-wide">
                    כמות
                  </th>
                  <th className="px-4 py-3 text-xs font-black tracking-wide">
                    מלאי
                  </th>
                  <th className="w-14 px-3 py-3 text-xs font-black tracking-wide">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const image = product.mainImage || product.images?.[0] || "";
                  const stock = productStockTotal(product);
                  const busy = savingId === product._id;
                  const hasVariants =
                    Array.isArray(product.variants) &&
                    product.variants.length > 0;

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-slate-200 bg-white transition hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full place-items-center text-slate-300">
                                <ImagePlus size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800">
                              {product.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs font-bold text-slate-400">
                              {product.categoryName || "ללא קטגוריה"}
                              {hasVariants
                                ? ` · ${product.variants!.length} וריאציות`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          disabled={busy}
                          value={draftSku[product._id] ?? product.sku ?? ""}
                          onChange={(e) =>
                            setDraftSku((prev) => ({
                              ...prev,
                              [product._id]: e.target.value,
                            }))
                          }
                          onBlur={() => {
                            const next = String(
                              draftSku[product._id] ?? ""
                            ).trim();
                            if (next === String(product.sku || "").trim()) {
                              return;
                            }
                            void commitPatch(product, { sku: next });
                          }}
                          placeholder="—"
                          className="w-full min-w-[120px] rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-mono text-sm font-bold text-slate-700 outline-none transition hover:border-slate-200 focus:border-violet-300 focus:bg-white"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          disabled={busy || hasVariants}
                          value={draftStock[product._id] ?? String(stock)}
                          title={
                            hasVariants
                              ? "כשיש וריאציות — עדכנו מלאי בכל וריאציה בעריכת המוצר"
                              : undefined
                          }
                          onChange={(e) =>
                            setDraftStock((prev) => ({
                              ...prev,
                              [product._id]: e.target.value,
                            }))
                          }
                          onBlur={() => {
                            if (hasVariants) return;
                            const next = Math.max(
                              0,
                              Number(draftStock[product._id] ?? stock) || 0
                            );
                            if (next === stock) return;
                            void commitPatch(product, {
                              stock: next,
                              status:
                                next <= 0
                                  ? "out_of_stock"
                                  : product.status === "out_of_stock"
                                    ? "active"
                                    : product.status,
                            });
                          }}
                          className={`w-20 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm font-black outline-none transition hover:border-slate-200 focus:border-violet-300 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${
                            stock <= 0
                              ? "text-rose-600"
                              : stock <= 3
                                ? "text-amber-600"
                                : "text-slate-800"
                          }`}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="relative inline-flex min-w-[128px]">
                          <select
                            disabled={busy}
                            value={
                              product.status === "out_of_stock" || stock <= 0
                                ? "out_of_stock"
                                : product.status || "active"
                            }
                            onChange={(e) => {
                              const status = e.target.value;
                              void commitPatch(product, {
                                status,
                                stock:
                                  status === "out_of_stock"
                                    ? 0
                                    : stock > 0
                                      ? stock
                                      : 1,
                              });
                            }}
                            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-8 text-sm font-black text-slate-700 outline-none transition hover:border-slate-300 focus:border-violet-300"
                          >
                            <option value="active">במלאי</option>
                            <option value="out_of_stock">אזל מהמלאי</option>
                            <option value="draft">טיוטה</option>
                            <option value="hidden">מוסתר</option>
                          </select>
                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </td>

                      <td className="relative px-3 py-3">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setOpenMenuId((current) =>
                              current === product._id ? null : product._id
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                          aria-label="פעולות"
                        >
                          {busy ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <MoreVertical size={16} />
                          )}
                        </button>

                        {openMenuId === product._id ? (
                          <div className="absolute left-3 top-12 z-20 min-w-[140px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditProduct(product);
                              }}
                              className="block w-full px-3 py-2 text-right text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              עריכת מוצר
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDeleteProduct(product._id);
                              }}
                              className="block w-full px-3 py-2 text-right text-sm font-bold text-rose-600 hover:bg-rose-50"
                            >
                              מחיקה
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsView({
  products,
  categories,
  search,
  setSearch,
  filterCategoryId,
  setFilterCategoryId,
  settings,
  seedingDemo,
  onSeedDemo,
  onAddProduct,
  onOpenInventory,
  onEditProduct,
  onDeleteProduct,
}: {
  products: StoreProduct[];
  categories: StoreCategory[];
  search: string;
  setSearch: (value: string) => void;
  filterCategoryId: string;
  setFilterCategoryId: (value: string) => void;
  settings: StoreSettingsData;
  seedingDemo: boolean;
  onSeedDemo: () => void;
  onAddProduct: () => void;
  onOpenInventory: () => void;
  onEditProduct: (product: StoreProduct) => void;
  onDeleteProduct: (productId: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">כל המוצרים</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            כאן רואים כל מוצר שנוסף לחנות, כולל שיוך לקטגוריה.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton type="button" onClick={onOpenInventory}>
            <ClipboardList size={17} />
            רשימת מלאי
          </SecondaryButton>
          <PrimaryButton type="button" onClick={onAddProduct}>
            <Plus size={17} />
            הוספת מוצר
          </PrimaryButton>
        </div>
      </div>

      <div className="mb-6 grid gap-3 rounded-[28px] border border-slate-200 bg-white p-3 md:grid-cols-[1fr_260px_auto]">
        <div className="relative">
          <Search
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, מק״ט, תיאור או קטגוריה"
            className="pr-10"
          />
        </div>

        <SelectInput
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
        >
          <option value="all">כל הקטגוריות</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </SelectInput>

        <div className="grid place-items-center rounded-2xl bg-slate-50 px-4 text-sm font-black text-slate-500">
          {products.length} מוצרים
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyBox
          title="אין עדיין מוצרים"
          text="הוסיפו את המוצרים שלכם לחנות. אפשר גם לטעון מוצרי דמו לתצוגה — הם יוחלפו אוטומטית ברגע שתוסיפו מוצר אמיתי."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton type="button" onClick={onAddProduct}>
                <Plus size={17} />
                הוספת מוצר ראשון
              </PrimaryButton>
              <button
                type="button"
                disabled={seedingDemo}
                onClick={onSeedDemo}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {seedingDemo ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <PackagePlus size={17} />
                )}
                {seedingDemo ? "טוען מוצרי דמו..." : "טעינת מוצרי דמו לתצוגה"}
              </button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const image = product.mainImage || product.images?.[0] || "";

            return (
              <article
                key={product._id}
                className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 bg-slate-100">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <div className="text-center">
                        <ImagePlus size={34} className="mx-auto text-slate-300" />
                        <p className="mt-2 text-xs font-black text-slate-400">
                          אין תמונה
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <StatusBadge
                      active={product.status === "active"}
                      label={
                        product.status === "active"
                          ? "פעיל"
                          : product.status || "טיוטה"
                      }
                    />
                  </div>

                  <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                    {isDemoStoreProduct(product) ? (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-black text-white">
                        דמו
                      </span>
                    ) : null}
                    {product.isFeatured ? (
                      <span className="rounded-full bg-violet-700 px-3 py-1 text-[11px] font-black text-black">
                        מומלץ
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-slate-800">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
                        {product.shortDescription ||
                          product.description ||
                          "אין תיאור"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      {product.salePrice ? (
                        <p className="text-xs font-black text-slate-400 line-through">
                          {formatMoney(product.price, product.currency)}
                        </p>
                      ) : null}

                      <p className="text-2xl font-black text-violet-700">
                        {formatMoney(
                          product.salePrice || product.price,
                          product.currency || settings.currency
                        )}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
                      {product.categoryName || "ללא קטגוריה"}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black text-slate-400">
                        מלאי
                      </p>
                      <p
                        className={`mt-1 text-sm font-black ${
                          productStockTotal(product) <= 0
                            ? "text-rose-600"
                            : productStockTotal(product) <= 3
                              ? "text-amber-600"
                              : "text-slate-800"
                        }`}
                      >
                        {productStockTotal(product)}
                        {Array.isArray(product.variants) &&
                        product.variants.length > 0
                          ? ` · ${product.variants.length} וריאציות`
                          : ""}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black text-slate-400">
                        מק״ט
                      </p>
                      <p className="mt-1 truncate text-sm font-black text-slate-800">
                        {product.sku || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <SecondaryButton
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="w-full"
                    >
                      עריכת מוצר
                    </SecondaryButton>

                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product._id)}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      title="מחיקת מוצר"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductFormView({
  productForm,
  setProductForm,
  productImages,
  setProductImages,
  categories,
  editingProductId,
  saving,
  onSubmit,
  onCancel,
  onCreateCategory,
}: {
  productForm: Record<string, any>;
  setProductForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  productImages: File[];
  setProductImages: React.Dispatch<React.SetStateAction<File[]>>;
  categories: StoreCategory[];
  editingProductId: string | null;
  saving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onCreateCategory: () => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {editingProductId ? "עריכת מוצר" : "הוספת מוצר חדש"}
          </h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            בחרי קטגוריה קיימת או צרי קטגוריה חדשה לפני שמירת המוצר.
          </p>
        </div>

        <SecondaryButton type="button" onClick={onCancel}>
          <ArrowRight size={16} />
          חזרה למוצרים
        </SecondaryButton>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-5">
            <div>
              <FieldLabel>שם מוצר</FieldLabel>
              <TextInput
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="לדוגמה: מארז פרימיום"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>מחיר</FieldLabel>
                <TextInput
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="119"
                />
              </div>

              <div>
                <FieldLabel>מחיר מבצע</FieldLabel>
                <TextInput
                  type="number"
                  value={productForm.salePrice}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      salePrice: e.target.value,
                    }))
                  }
                  placeholder="99"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <FieldLabel>קטגוריה</FieldLabel>
                <button
                  type="button"
                  onClick={onCreateCategory}
                  className="text-xs font-black text-violet-700 hover:text-violet-900"
                >
                  + יצירת קטגוריה
                </button>
              </div>

              <SelectInput
                value={productForm.categoryId}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              >
                <option value="">ללא קטגוריה</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div>
              <FieldLabel>תיאור קצר</FieldLabel>
              <TextInput
                value={productForm.shortDescription}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="משפט קצר שיופיע בכרטיס מוצר"
              />
            </div>

            <div>
              <FieldLabel>תיאור מלא</FieldLabel>
              <TextArea
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="תיאור המוצר, יתרונות, מה כלול וכו׳"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <FieldLabel>מק״ט</FieldLabel>
                <TextInput
                  value={productForm.sku}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, sku: e.target.value }))
                  }
                />
              </div>

              <div>
                <FieldLabel>מלאי כללי</FieldLabel>
                <TextInput
                  type="number"
                  min={0}
                  value={productForm.stock}
                  disabled={
                    Array.isArray(productForm.variants) &&
                    productForm.variants.length > 0
                  }
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />
                {Array.isArray(productForm.variants) &&
                productForm.variants.length > 0 ? (
                  <p className="mt-1 text-[11px] font-bold text-slate-400">
                    כשיש וריאציות — המלאי מנוהל לכל וריאציה
                  </p>
                ) : null}
              </div>

              <div>
                <FieldLabel>סטטוס</FieldLabel>
                <SelectInput
                  value={productForm.status}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="active">פעיל</option>
                  <option value="draft">טיוטה</option>
                  <option value="hidden">מוסתר</option>
                  <option value="out_of_stock">אזל מהמלאי</option>
                </SelectInput>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.trackStock !== false}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      trackStock: e.target.checked,
                    }))
                  }
                />
                מעקב מלאי אוטומטי
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(productForm.allowBackorder)}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      allowBackorder: e.target.checked,
                    }))
                  }
                />
                לאפשר הזמנה גם כשאין מלאי
              </label>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <FieldLabel>וריאציות (מידה / צבע)</FieldLabel>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    מלאי ומק״ט נפרדים לכל אפשרות — מומלץ לאופנה
                  </p>
                </div>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    setProductForm((prev) => ({
                      ...prev,
                      variants: [
                        ...(Array.isArray(prev.variants) ? prev.variants : []),
                        {
                          optionName: "מידה",
                          optionValue: "",
                          sku: "",
                          stock: "0",
                          price: "",
                          salePrice: "",
                        },
                      ],
                    }))
                  }
                >
                  + הוספת וריאציה
                </SecondaryButton>
              </div>

              {Array.isArray(productForm.variants) &&
              productForm.variants.length > 0 ? (
                <div className="space-y-3">
                  {productForm.variants.map((variant: any, index: number) => (
                    <div
                      key={variant._id || `variant-${index}`}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-6"
                    >
                      <TextInput
                        placeholder="שם אפשרות (מידה)"
                        value={variant.optionName || ""}
                        onChange={(e) =>
                          setProductForm((prev) => {
                            const next = [
                              ...(Array.isArray(prev.variants)
                                ? prev.variants
                                : []),
                            ];
                            next[index] = {
                              ...next[index],
                              optionName: e.target.value,
                            };
                            return { ...prev, variants: next };
                          })
                        }
                      />
                      <TextInput
                        placeholder="ערך (M / שחור)"
                        value={variant.optionValue || ""}
                        onChange={(e) =>
                          setProductForm((prev) => {
                            const next = [
                              ...(Array.isArray(prev.variants)
                                ? prev.variants
                                : []),
                            ];
                            next[index] = {
                              ...next[index],
                              optionValue: e.target.value,
                            };
                            return { ...prev, variants: next };
                          })
                        }
                      />
                      <TextInput
                        placeholder="מק״ט"
                        value={variant.sku || ""}
                        onChange={(e) =>
                          setProductForm((prev) => {
                            const next = [
                              ...(Array.isArray(prev.variants)
                                ? prev.variants
                                : []),
                            ];
                            next[index] = {
                              ...next[index],
                              sku: e.target.value,
                            };
                            return { ...prev, variants: next };
                          })
                        }
                      />
                      <TextInput
                        type="number"
                        min={0}
                        placeholder="מלאי"
                        value={variant.stock ?? "0"}
                        onChange={(e) =>
                          setProductForm((prev) => {
                            const next = [
                              ...(Array.isArray(prev.variants)
                                ? prev.variants
                                : []),
                            ];
                            next[index] = {
                              ...next[index],
                              stock: e.target.value,
                            };
                            return { ...prev, variants: next };
                          })
                        }
                      />
                      <TextInput
                        type="number"
                        min={0}
                        placeholder="מחיר (אופציונלי)"
                        value={variant.price ?? ""}
                        onChange={(e) =>
                          setProductForm((prev) => {
                            const next = [
                              ...(Array.isArray(prev.variants)
                                ? prev.variants
                                : []),
                            ];
                            next[index] = {
                              ...next[index],
                              price: e.target.value,
                            };
                            return { ...prev, variants: next };
                          })
                        }
                      />
                      <button
                        type="button"
                        className="rounded-2xl bg-rose-50 px-3 text-sm font-black text-rose-600 transition hover:bg-rose-100"
                        onClick={() =>
                          setProductForm((prev) => ({
                            ...prev,
                            variants: (
                              Array.isArray(prev.variants) ? prev.variants : []
                            ).filter((_: any, i: number) => i !== index),
                          }))
                        }
                      >
                        הסרה
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400">
                  אין וריאציות — המלאי הכללי ישמש לרכישה
                </p>
              )}
            </div>

            <div>
              <FieldLabel>תגיות</FieldLabel>
              <TextInput
                value={productForm.tags}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="חדש, מבצע, פרימיום"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                />
                מוצר מומלץ
              </label>

              <div>
                <FieldLabel>סוג מוצר</FieldLabel>
                <SelectInput
                  value={productForm.productKind || (productForm.isDigital ? "digital" : "physical")}
                  onChange={(e) => {
                    const productKind = e.target.value as
                      | "physical"
                      | "digital"
                      | "service";
                    setProductForm((prev) => ({
                      ...prev,
                      productKind,
                      isDigital: productKind === "digital",
                    }));
                  }}
                >
                  <option value="physical">מוצר פיזי</option>
                  <option value="digital">מוצר דיגיטלי</option>
                  <option value="service">שירות</option>
                </SelectInput>
              </div>
            </div>

            {(productForm.productKind === "digital" || productForm.isDigital) && (
              <div>
                <FieldLabel>קישור לקובץ דיגיטלי</FieldLabel>
                <TextInput
                  value={productForm.digitalFileUrl}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      digitalFileUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-black text-slate-800">תמונות המוצר</p>
          <p className="mt-1 text-xs font-bold leading-6 text-slate-500">
            התמונה הראשונה תהיה התמונה הראשית בגריד החנות.
          </p>

          <label className="mt-5 flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center transition hover:bg-violet-50">
            <ImagePlus size={36} className="text-violet-600" />
            <span className="mt-3 text-sm font-black text-slate-800">
              העלאת תמונות
            </span>
            <span className="mt-1 text-xs font-bold text-slate-400">
              אפשר לבחור כמה תמונות יחד
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                setProductImages(Array.from(e.target.files || []))
              }
            />
          </label>

          {(() => {
            let existing: string[] = [];
            try {
              const parsed = JSON.parse(String(productForm.images || "[]"));
              existing = Array.isArray(parsed)
                ? parsed.filter(
                    (url) =>
                      typeof url === "string" && /^https?:\/\//i.test(url)
                  )
                : [];
            } catch {
              existing = [];
            }
            if (productForm.mainImage && !existing.includes(productForm.mainImage)) {
              existing = [String(productForm.mainImage), ...existing];
            }

            return existing.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-xs font-black text-slate-500">
                  תמונות שמורות
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {existing.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute left-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-rose-600 shadow"
                        onClick={() => {
                          const next = existing.filter((_, i) => i !== index);
                          setProductForm((prev) => ({
                            ...prev,
                            images: JSON.stringify(next),
                            mainImage: next[0] || "",
                          }));
                        }}
                      >
                        הסר
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {productImages.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-black text-slate-500">
                תמונות חדשות להעלאה
              </p>
              <div className="grid grid-cols-3 gap-2">
                {productImages.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3">
            <PrimaryButton
              type="button"
              onClick={onSubmit}
              loading={saving}
              className="w-full"
            >
              {editingProductId ? <Save size={17} /> : <PackagePlus size={17} />}
              {editingProductId ? "שמירת שינויים" : "שמירת מוצר"}
            </PrimaryButton>

            <SecondaryButton type="button" onClick={onCancel} className="w-full">
              <X size={16} />
              ביטול
            </SecondaryButton>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CategoriesView({
  categories,
  categoryForm,
  setCategoryForm,
  categoryImage,
  setCategoryImage,
  editingCategoryId,
  saving,
  onSubmit,
  onReset,
  onEdit,
  onDelete,
}: {
  categories: StoreCategory[];
  categoryForm: Record<string, any>;
  setCategoryForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  categoryImage: File | null;
  setCategoryImage: React.Dispatch<React.SetStateAction<File | null>>;
  editingCategoryId: string | null;
  saving: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onEdit: (category: StoreCategory) => void;
  onDelete: (categoryId: string) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {editingCategoryId ? "עריכת קטגוריה" : "הוספת קטגוריה"}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              אחרי יצירת קטגוריה תוכלי לשייך אליה מוצרים בטופס מוצר.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <FieldLabel>שם קטגוריה</FieldLabel>
            <TextInput
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="לדוגמה: בגדי ים"
            />
          </div>

          <div>
            <FieldLabel>תיאור</FieldLabel>
            <TextArea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <FieldLabel>סדר תצוגה</FieldLabel>
            <TextInput
              type="number"
              value={categoryForm.sortOrder}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  sortOrder: e.target.value,
                }))
              }
            />
          </div>

          <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-violet-200 bg-violet-50/40 p-5 text-center transition hover:bg-violet-50">
            <ImagePlus size={28} className="text-violet-600" />
            <span className="mt-2 text-sm font-black text-slate-700">
              תמונת קטגוריה
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
            />
          </label>

          {categoryImage && (
            <p className="text-xs font-black text-violet-700">
              נבחרה תמונה: {categoryImage.name}
            </p>
          )}

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
            <input
              type="checkbox"
              checked={categoryForm.isVisible}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  isVisible: e.target.checked,
                }))
              }
            />
            קטגוריה מוצגת באתר
          </label>

          <PrimaryButton
            type="button"
            onClick={onSubmit}
            loading={saving}
            className="w-full"
          >
            <Save size={17} />
            {editingCategoryId ? "שמירת קטגוריה" : "הוספת קטגוריה"}
          </PrimaryButton>

          {editingCategoryId && (
            <SecondaryButton type="button" onClick={onReset} className="w-full">
              ביטול עריכה
            </SecondaryButton>
          )}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-2xl font-black text-slate-800">
          קטגוריות קיימות
        </h2>

        {categories.length === 0 ? (
          <EmptyBox
            title="אין קטגוריות עדיין"
            text="צרי קטגוריות כמו Shopify, ואז כל מוצר שתוסיפי יוכל להשתייך לקטגוריה."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-slate-300">
                        <Tags size={26} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black text-slate-800">
                      {category.name}
                    </p>
                    <p className="truncate text-xs font-bold text-slate-400">
                      /{category.slug}
                    </p>
                    <div className="mt-2">
                      <StatusBadge
                        active={category.isVisible}
                        label={category.isVisible ? "מוצגת" : "מוסתרת"}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <SecondaryButton onClick={() => onEdit(category)}>
                    עריכה
                  </SecondaryButton>

                  <button
                    type="button"
                    onClick={() => onDelete(category._id)}
                    className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsView({
  settings,
  setSettings,
  saving,
  onSave,
  focus = "all",
  embedded = false,
}: {
  settings: StoreSettingsData;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettingsData>>;
  saving: boolean;
  onSave: () => void;
  focus?: "all" | "shipping";
  embedded?: boolean;
}) {
  const checkoutLook = normalizeCheckoutAppearance(settings.checkoutAppearance);

  const updateCheckoutAppearance = (
    patch: Partial<CheckoutAppearance>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      checkoutAppearance: normalizeCheckoutAppearance({
        ...prev.checkoutAppearance,
        ...patch,
      }),
    }));
  };

  const cardClass = embedded
    ? "rounded-2xl border border-slate-200 bg-white p-4"
    : "rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6";

  const checkoutPreview = (
    <div
      className="min-w-0 overflow-hidden border shadow-sm"
      style={{
        borderRadius: checkoutLook.panelRadius,
        borderColor: checkoutLook.borderColor,
        backgroundColor: checkoutLook.panelBackground,
        color: checkoutLook.textColor,
      }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: checkoutLook.borderColor }}
      >
        <p className="text-sm font-black">
          {checkoutLook.title || "סל ותשלום"}
        </p>
        <p
          className="text-xs font-bold"
          style={{ color: checkoutLook.mutedTextColor }}
        >
          תצוגה מקדימה חיה
        </p>
      </div>
      <div className="space-y-3 p-4">
        <div
          className="flex items-center justify-between gap-3 border px-3 py-2 text-xs font-bold"
          style={{
            borderRadius: Math.max(8, checkoutLook.buttonRadius - 2),
            borderColor: checkoutLook.borderColor,
          }}
        >
          <span className="min-w-0 truncate">מוצר לדוגמה</span>
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 text-[11px] font-black text-white"
            style={{
              backgroundColor: checkoutLook.accentColor,
              borderRadius: Math.max(6, checkoutLook.buttonRadius - 4),
              color: checkoutLook.buttonTextColor,
            }}
          >
            הוסף
          </button>
        </div>
        <p
          className="text-xs font-bold"
          style={{ color: checkoutLook.mutedTextColor }}
        >
          סה״כ: ₪250
        </p>
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center text-sm font-black"
          style={{
            backgroundColor: checkoutLook.primaryColor,
            color: checkoutLook.buttonTextColor,
            borderRadius: checkoutLook.buttonRadius,
          }}
        >
          {checkoutLook.buttonLabel || "המשך לתשלום"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-w-0 space-y-6">
        <div className={cardClass}>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800">
              {focus === "shipping" ? "הגדרות משלוח" : "הגדרות חנות"}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {focus === "shipping"
                ? "מחיר משלוח, משלוח חינם ומדיניות."
                : "מטבע, משלוחים, וואטסאפ, מדיניות ותצוגת מחירים."}
            </p>
          </div>

          <div className={cx("grid gap-5", embedded ? "sm:grid-cols-2" : "lg:grid-cols-2")}>
            <div>
              <FieldLabel>שם החנות</FieldLabel>
              <TextInput
                value={settings.storeName || ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, storeName: e.target.value }))
                }
              />
            </div>

            <div>
              <FieldLabel>מטבע</FieldLabel>
              <SelectInput
                value={settings.currency || "USD"}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, currency: e.target.value }))
                }
              >
                <option value="USD">USD</option>
                <option value="ILS">ILS</option>
                <option value="EUR">EUR</option>
              </SelectInput>
            </div>

            <div className="lg:col-span-2">
              <FieldLabel>תיאור חנות</FieldLabel>
              <TextArea
                value={settings.storeDescription || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    storeDescription: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel>טלפון וואטסאפ להזמנות</FieldLabel>
              <TextInput
                value={settings.whatsappPhone || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    whatsappPhone: e.target.value,
                  }))
                }
                placeholder="972500000000"
              />
            </div>

            <div>
              <FieldLabel>הערה בצ׳קאאוט</FieldLabel>
              <TextInput
                value={settings.checkoutNote || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    checkoutNote: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel>מחיר משלוח</FieldLabel>
              <TextInput
                type="number"
                value={String(settings.defaultShippingPrice ?? 0)}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultShippingPrice: Number(e.target.value || 0),
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel>משלוח חינם מעל</FieldLabel>
              <TextInput
                type="number"
                value={settings.freeShippingFrom ?? ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    freeShippingFrom: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel>מדיניות משלוחים</FieldLabel>
              <TextArea
                value={settings.shippingPolicy || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    shippingPolicy: e.target.value,
                  }))
                }
              />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-800">איסוף עצמי</p>
              <label className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.pickupOptions?.enabled !== false}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      pickupOptions: {
                        ...(prev.pickupOptions || {}),
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
                לאפשר איסוף עצמי בקופה
              </label>
              <div className="mt-3 grid gap-3">
                <div>
                  <FieldLabel>שם נקודת האיסוף</FieldLabel>
                  <TextInput
                    value={settings.pickupOptions?.locationName || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        pickupOptions: {
                          ...(prev.pickupOptions || {}),
                          locationName: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <FieldLabel>כתובת</FieldLabel>
                  <TextInput
                    value={settings.pickupOptions?.address || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        pickupOptions: {
                          ...(prev.pickupOptions || {}),
                          address: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <FieldLabel>שעות פעילות</FieldLabel>
                  <TextInput
                    value={settings.pickupOptions?.hours || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        pickupOptions: {
                          ...(prev.pickupOptions || {}),
                          hours: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <FieldLabel>הוראות איסוף</FieldLabel>
                  <TextArea
                    value={settings.pickupOptions?.instructions || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        pickupOptions: {
                          ...(prev.pickupOptions || {}),
                          instructions: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>מדיניות החזרות</FieldLabel>
              <TextArea
                value={settings.returnPolicy || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    returnPolicy: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className={cx("mt-6 grid gap-3", embedded ? "sm:grid-cols-2" : "md:grid-cols-4")}>
            {[
              ["isStoreActive", "חנות פעילה"],
              ["showPrices", "הצגת מחירים"],
              ["allowCart", "סל קניות"],
              ["allowWhatsappOrders", "הזמנות וואטסאפ"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={Boolean((settings as any)[key])}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>

          {focus !== "shipping" ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-800">
                מייל אישור הזמנה
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                נשלח אוטומטית רק אחרי שהתשלום אומת בשרת וההזמנה סומנה כ־paid.
                השולח: שם העסק &lt;noreply@bizuply.com&gt;
              </p>
              <label className="mt-4 flex items-center gap-2 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.orderConfirmationEmail?.enabled !== false}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      orderConfirmationEmail: {
                        ...(prev.orderConfirmationEmail || {}),
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
                שליחה אוטומטית של מייל אישור לאחר תשלום
              </label>
            </div>
          ) : null}

          <div className="mt-6">
            <PrimaryButton type="button" onClick={onSave} loading={saving}>
              <Save size={17} />
              שמירת הגדרות חנות
            </PrimaryButton>
          </div>
        </div>

        {focus !== "shipping" ? (
          <div className={cx(cardClass, "min-w-0")}>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white">
                <ShoppingBag size={15} />
                עיצוב סל ותשלום
              </div>
              <h2 className="mt-3 text-2xl font-black text-slate-800">
                צבעים וכפתורים של הסל
              </h2>
              <p className="mt-1 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                בחרו ערכת צבעים או התאימו ידנית. השינויים חלים על מודל הסל
                והתשלום באתר הציבורי.
              </p>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {CHECKOUT_APPEARANCE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateCheckoutAppearance(preset.values)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                    style={{
                      backgroundColor:
                        preset.values.primaryColor ||
                        DEFAULT_CHECKOUT_APPEARANCE.primaryColor,
                    }}
                  />
                  {preset.label}
                </button>
              ))}
            </div>

            {embedded ? (
              <div className="mb-6 max-w-md">{checkoutPreview}</div>
            ) : null}

            <div
              className={cx(
                "grid min-w-0 gap-6",
                !embedded && "xl:grid-cols-[minmax(0,1fr)_280px]",
              )}
            >
              <div className={cx("grid min-w-0 gap-4", embedded ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-2")}>
                {(
                  [
                    ["primaryColor", "צבע כפתור ראשי"],
                    ["buttonTextColor", "צבע טקסט בכפתור"],
                    ["accentColor", "צבע הדגשה / הוספה"],
                    ["panelBackground", "רקע החלון"],
                    ["textColor", "צבע כותרות"],
                    ["mutedTextColor", "צבע טקסט משני"],
                    ["borderColor", "צבע מסגרות"],
                  ] as Array<[keyof CheckoutAppearance, string]>
                ).map(([key, label]) => (
                  <label key={key} className="grid min-w-0 gap-2">
                    <span className="text-xs font-black text-slate-500">
                      {label}
                    </span>
                    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                      <input
                        type="color"
                        value={
                          /^#([0-9a-f]{6})$/i.test(String(checkoutLook[key] || ""))
                            ? String(checkoutLook[key])
                            : "#0f172a"
                        }
                        onChange={(e) =>
                          updateCheckoutAppearance({ [key]: e.target.value })
                        }
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={String(checkoutLook[key] || "")}
                        onChange={(e) =>
                          updateCheckoutAppearance({ [key]: e.target.value })
                        }
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-violet-300"
                      />
                    </div>
                  </label>
                ))}

                <div className="min-w-0">
                  <FieldLabel>כותרת הסל (אופציונלי)</FieldLabel>
                  <TextInput
                    value={checkoutLook.title}
                    onChange={(e) =>
                      updateCheckoutAppearance({ title: e.target.value })
                    }
                    placeholder="סל ותשלום"
                  />
                </div>

                <div className="min-w-0">
                  <FieldLabel>טקסט כפתור תשלום (אופציונלי)</FieldLabel>
                  <TextInput
                    value={checkoutLook.buttonLabel}
                    onChange={(e) =>
                      updateCheckoutAppearance({ buttonLabel: e.target.value })
                    }
                    placeholder="המשך לתשלום"
                  />
                </div>

                <div className="min-w-0">
                  <FieldLabel>עיגול כפתורים</FieldLabel>
                  <TextInput
                    type="number"
                    min={4}
                    max={28}
                    value={String(checkoutLook.buttonRadius)}
                    onChange={(e) =>
                      updateCheckoutAppearance({
                        buttonRadius: Number(e.target.value || 12),
                      })
                    }
                  />
                </div>

                <div className="min-w-0">
                  <FieldLabel>עיגול חלון</FieldLabel>
                  <TextInput
                    type="number"
                    min={8}
                    max={36}
                    value={String(checkoutLook.panelRadius)}
                    onChange={(e) =>
                      updateCheckoutAppearance({
                        panelRadius: Number(e.target.value || 16),
                      })
                    }
                  />
                </div>
              </div>

              {!embedded ? checkoutPreview : null}
            </div>

            <div className="mt-6">
              <PrimaryButton type="button" onClick={onSave} loading={saving}>
                <Save size={17} />
                שמירת עיצוב הסל
              </PrimaryButton>
            </div>
          </div>
        ) : null}

    </div>
  );
}
function CouponsView({
  coupons,
  couponForm,
  setCouponForm,
  editingCouponId,
  saving,
  settings,
  onSubmit,
  onReset,
  onEdit,
  onDelete,
}: {
  coupons: StoreCoupon[];
  couponForm: Record<string, any>;
  setCouponForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  editingCouponId: string | null;
  saving: boolean;
  settings: StoreSettingsData;
  onSubmit: () => void;
  onReset: () => void;
  onEdit: (coupon: StoreCoupon) => void;
  onDelete: (couponId: string) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-2xl font-black text-slate-800">
          {editingCouponId ? "עריכת קופון" : "הוספת קופון"}
        </h2>

        <div className="grid gap-4">
          <div>
            <FieldLabel>קוד קופון</FieldLabel>
            <TextInput
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="SALE20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>סוג הנחה</FieldLabel>
              <SelectInput
                value={couponForm.discountType}
                onChange={(e) =>
                  setCouponForm((prev) => ({
                    ...prev,
                    discountType: e.target.value,
                  }))
                }
              >
                <option value="percent">אחוזים</option>
                <option value="fixed">סכום קבוע</option>
              </SelectInput>
            </div>

            <div>
              <FieldLabel>ערך הנחה</FieldLabel>
              <TextInput
                type="number"
                value={couponForm.discountValue}
                onChange={(e) =>
                  setCouponForm((prev) => ({
                    ...prev,
                    discountValue: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <FieldLabel>מינימום הזמנה</FieldLabel>
            <TextInput
              type="number"
              value={couponForm.minOrderAmount}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  minOrderAmount: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>מתאריך</FieldLabel>
              <TextInput
                type="date"
                value={couponForm.startsAt}
                onChange={(e) =>
                  setCouponForm((prev) => ({
                    ...prev,
                    startsAt: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel>עד תאריך</FieldLabel>
              <TextInput
                type="date"
                value={couponForm.expiresAt}
                onChange={(e) =>
                  setCouponForm((prev) => ({
                    ...prev,
                    expiresAt: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <FieldLabel>מגבלת שימושים</FieldLabel>
            <TextInput
              type="number"
              value={couponForm.usageLimit}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  usageLimit: e.target.value,
                }))
              }
              placeholder="ריק = ללא הגבלה"
            />
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
            <input
              type="checkbox"
              checked={couponForm.isActive}
              onChange={(e) =>
                setCouponForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            קופון פעיל
          </label>

          <PrimaryButton
            type="button"
            onClick={onSubmit}
            loading={saving}
            className="w-full"
          >
            <Save size={17} />
            שמירת קופון
          </PrimaryButton>

          {editingCouponId && (
            <SecondaryButton type="button" onClick={onReset} className="w-full">
              ביטול עריכה
            </SecondaryButton>
          )}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-2xl font-black text-slate-800">קופונים</h2>

        {coupons.length === 0 ? (
          <EmptyBox
            title="אין קופונים עדיין"
            text="צרי קודי קופון ומבצעים שיופיעו בתהליך ההזמנה."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-slate-800">
                      {coupon.code}
                    </p>
                    <p className="text-xs font-bold text-slate-400">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}%`
                        : formatMoney(coupon.discountValue, settings.currency)}
                    </p>
                  </div>

                  <StatusBadge
                    active={coupon.isActive}
                    label={coupon.isActive ? "פעיל" : "כבוי"}
                  />
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <SecondaryButton onClick={() => onEdit(coupon)}>
                    עריכה
                  </SecondaryButton>

                  <button
                    type="button"
                    onClick={() => onDelete(coupon._id)}
                    className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function confirmationEmailLabel(status?: string) {
  switch (status) {
    case "queued":
      return { text: "מייל בתור", className: "bg-amber-50 text-amber-700" };
    case "sending":
      return { text: "שולח מייל…", className: "bg-sky-50 text-sky-700" };
    case "sent":
      return { text: "מייל נשלח", className: "bg-emerald-50 text-emerald-700" };
    case "failed":
      return { text: "שליחת מייל נכשלה", className: "bg-rose-50 text-rose-700" };
    case "skipped":
      return { text: "מייל לא נשלח", className: "bg-slate-100 text-slate-600" };
    default:
      return { text: "אין מייל אישור", className: "bg-slate-100 text-slate-500" };
  }
}

function OrdersView({
  orders,
  settings,
  onUpdateOrderStatus,
  onResendConfirmationEmail,
  resendingOrderId,
}: {
  orders: StoreOrder[];
  settings: StoreSettingsData;
  onUpdateOrderStatus: (
    orderId: string,
    status: string,
    options?: { sendConfirmationEmail?: boolean }
  ) => void;
  onResendConfirmationEmail: (orderId: string) => void;
  resendingOrderId?: string | null;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-2xl font-black text-slate-800">הזמנות</h2>

      {orders.length === 0 ? (
        <EmptyBox
          title="אין הזמנות עדיין"
          text="כאן יופיעו הזמנות מהחנות הציבורית."
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const emailBadge = confirmationEmailLabel(
              order.confirmationEmail?.status
            );
            const canResend =
              order.paymentStatus === "paid" || order.status === "paid";

            return (
              <div
                key={order._id}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <p className="text-lg font-black text-slate-800">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {order.customerName} · {order.customerPhone || "אין טלפון"}
                      {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-black text-violet-700">
                      {formatMoney(
                        order.total,
                        order.currency || settings.currency
                      )}
                    </p>

                    <SelectInput
                      value={order.status || "new"}
                      onChange={(e) => {
                        const nextStatus = e.target.value;
                        if (
                          nextStatus === "paid" &&
                          order.paymentStatus !== "paid"
                        ) {
                          const markPaid = window.confirm(
                            "לסמן את ההזמנה כשולמה?\n\nפעולה זו תירשם עם המשתמש המבצע והזמן."
                          );
                          if (!markPaid) return;
                          const sendConfirmationEmail = window.confirm(
                            "בחירה מפורשת: לשלוח עכשיו מייל אישור הזמנה ללקוח?\n\nאישור = לשלוח מייל\nביטול = לסמן כשולם בלי מייל\n\nשליחה נוספת אפשרית רק דרך ״שליחה מחדש״."
                          );
                          onUpdateOrderStatus(order._id, nextStatus, {
                            sendConfirmationEmail,
                          });
                          return;
                        }
                        onUpdateOrderStatus(order._id, nextStatus);
                      }}
                      className="min-w-[190px]"
                    >
                      <option value="new">חדשה</option>
                      <option value="pending_payment">ממתינה לתשלום</option>
                      <option value="paid">שולמה</option>
                      <option value="processing">בטיפול</option>
                      <option value="shipped">נשלחה</option>
                      <option value="completed">הושלמה</option>
                      <option value="cancelled">בוטלה</option>
                    </SelectInput>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${emailBadge.className}`}
                  >
                    {emailBadge.text}
                  </span>
                  {order.confirmationEmail?.lastError ? (
                    <span className="text-xs font-bold text-rose-600">
                      {order.confirmationEmail.lastError}
                    </span>
                  ) : null}
                  {canResend ? (
                    <button
                      type="button"
                      disabled={resendingOrderId === order._id}
                      onClick={() => onResendConfirmationEmail(order._id)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resendingOrderId === order._id
                        ? "שולח…"
                        : "שליחה מחדש של מייל אישור"}
                    </button>
                  ) : null}
                </div>

                {order.items?.length ? (
                  <div className="mt-4 grid gap-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600"
                      >
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} ×{" "}
                          {formatMoney(
                            item.price,
                            order.currency || settings.currency
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {order.fulfillmentType === "pickup" ||
                order.pickupDetails?.locationName ||
                order.pickupDetails?.address ? (
                  <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 whitespace-pre-wrap">
                    <p className="mb-1 text-xs font-black uppercase tracking-wide text-amber-700">
                      איסוף עצמי
                    </p>
                    {[
                      order.pickupDetails?.locationName,
                      order.pickupDetails?.address,
                      order.pickupDetails?.hours
                        ? `שעות: ${order.pickupDetails.hours}`
                        : "",
                      order.pickupDetails?.instructions
                        ? `הוראות: ${order.pickupDetails.instructions}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join("\n")}
                  </div>
                ) : null}

                {formatOrderShippingAddress(order.shippingAddress) ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 whitespace-pre-wrap">
                    <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-500">
                      כתובת למשלוח
                    </p>
                    {formatOrderShippingAddress(order.shippingAddress)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}