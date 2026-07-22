"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Grid3X3,
  ImagePlus,
  Loader2,
  PackagePlus,
  Plus,
  RefreshCcw,
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

type StoreView =
  | "products"
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
  status?: "draft" | "active" | "hidden" | "out_of_stock";
  isFeatured?: boolean;
  isDigital?: boolean;
  digitalFileUrl?: string;
  tags?: string[];
};

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
  returnPolicy?: string;
  checkoutNote?: string;
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
  | "custom";

type PaymentProvider = {
  _id?: string;
  provider: PaymentProviderType;
  label?: string;
  isEnabled?: boolean;
  isPrimary?: boolean;
  mode?: "test" | "live";
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
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
};

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
  settingsFocus?: "all" | "payments" | "shipping";
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
  returnPolicy: "",
  checkoutNote: "",
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
  tags: "",
  status: "active",
  isFeatured: false,
  isDigital: false,
  digitalFileUrl: "",
};

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

const paymentProviderOptions: Array<{
  value: PaymentProviderType;
  label: string;
  description: string;
}> = [
  {
    value: "manual",
    label: "Manual payment",
    description: "The business handles the payment outside the system.",
  },
  {
    value: "whatsapp",
    label: "WhatsApp order",
    description: "The customer sends the order and the business completes payment manually.",
  },
  {
    value: "bank_transfer",
    label: "Bank transfer",
    description: "Manual bank transfer details for the business.",
  },
  {
    value: "stripe",
    label: "Stripe",
    description: "Connect the business Stripe account details.",
  },
  {
    value: "paypal",
    label: "PayPal",
    description: "Connect the business PayPal account.",
  },
  {
    value: "square",
    label: "Square",
    description: "Connect Square payment details for the business.",
  },
  {
    value: "adyen",
    label: "Adyen",
    description: "Connect Adyen merchant/payment details.",
  },
  {
    value: "checkout_com",
    label: "Checkout.com",
    description: "Connect Checkout.com merchant/API details.",
  },
  {
    value: "braintree",
    label: "Braintree",
    description: "Connect Braintree merchant/API details.",
  },
  {
    value: "mollie",
    label: "Mollie",
    description: "Connect Mollie payment details.",
  },
  {
    value: "worldpay",
    label: "Worldpay",
    description: "Connect Worldpay merchant details.",
  },
  {
    value: "verifone",
    label: "Verifone / 2Checkout",
    description: "Connect Verifone / 2Checkout payment details.",
  },
  {
    value: "grow",
    label: "Grow",
    description: "Connect the business Grow payment details.",
  },
  {
    value: "hyp",
    label: "Hyp",
    description: "Connect the business Hyp terminal/payment page details.",
  },
  {
    value: "tranzila",
    label: "Tranzila",
    description: "Connect the business Tranzila terminal details.",
  },
  {
    value: "custom",
    label: "Other provider",
    description: "External checkout URL or another international payment provider.",
  },
];

const emptyPaymentProviderForm: PaymentProvider = {
  provider: "manual",
  label: "Manual payment",
  isEnabled: true,
  isPrimary: false,
  mode: "live",
  credentials: {
    terminalNumber: "",
    username: "",
    apiKey: "",
    apiSecret: "",
    pageCode: "",
    supplierId: "",
    merchantId: "",
    accountId: "",
    publicKey: "",
    privateKey: "",
    webhookSecret: "",
    customCheckoutUrl: "",
  },
  connectionStatus: "not_connected",
  notes: "",
};

function getPaymentProviderLabel(provider?: string) {
  return (
    paymentProviderOptions.find((option) => option.value === provider)?.label ||
    provider ||
    "ספק סליקה"
  );
}

function getPaymentStatusLabel(status?: PaymentProvider["connectionStatus"]) {
  if (status === "connected") return "מחובר";
  if (status === "failed") return "נכשל";
  if (status === "pending") return "בהמתנה";
  return "לא מחובר";
}

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
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-950 outline-none transition",
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
        "min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold leading-7 text-slate-950 outline-none transition",
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
          "h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-sm font-extrabold text-slate-950 outline-none transition",
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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200/50 transition",
        "hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg active:translate-y-0",
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
        <p className="mt-4 text-lg font-black text-slate-950">{title}</p>
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

  const [paymentProviderForm, setPaymentProviderForm] =
    useState<PaymentProvider>(emptyPaymentProviderForm);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("all");

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
        product.categoryName?.toLowerCase().includes(cleanSearch);

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

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setProductImages([]);
    setEditingProductId(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setView("add-product");
  };

  const saveSettings = async () => {
    if (!businessId) return;

    setSaving(true);

    try {
      const { data } = await API.put(`/store/${businessId}/settings`, settings);
      setSettings({ ...emptySettings, ...(data?.settings || {}) });
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
        formData.append(key, String(value));
      });

      productImages.forEach((file) => {
        formData.append("images", file);
      });

      const request = editingProductId
        ? API.put(
            `/store/${businessId}/products/${editingProductId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : API.post(`/store/${businessId}/products`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      await request;

      resetProductForm();
      await loadStoreData();
      setView("products");

      showMessage(
        "success",
        editingProductId ? "המוצר עודכן בהצלחה" : "המוצר נוסף ונכנס לגריד"
      );
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
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      status: product.status || "active",
      isFeatured: Boolean(product.isFeatured),
      isDigital: Boolean(product.isDigital),
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
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        : API.post(`/store/${businessId}/categories`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      await request;

      resetCategoryForm();
      await loadStoreData();

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

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!businessId) return;

    try {
      await API.put(`/store/${businessId}/orders/${orderId}`, { status });
      await loadStoreData();
      showMessage("success", "סטטוס ההזמנה עודכן");
    } catch (err) {
      console.error("Update order status error:", err);
      showMessage("error", "שגיאה בעדכון הזמנה");
    }
  };


  const resetPaymentProviderForm = () => {
    setPaymentProviderForm(emptyPaymentProviderForm);
  };

  const editPaymentProvider = (provider: PaymentProvider) => {
    setPaymentProviderForm({
      ...emptyPaymentProviderForm,
      ...provider,
      credentials: {
        ...emptyPaymentProviderForm.credentials,
        ...(provider.credentials || {}),
      },
    });
    setView("settings");
  };

  const savePaymentProvider = async () => {
    if (!businessId) return;

    setPaymentActionLoading(true);

    try {
      const { data } = await API.put(
        `/store/${businessId}/payments/provider`,
        paymentProviderForm
      );

      setSettings({ ...emptySettings, ...(data?.settings || {}) });
      showMessage("success", "הגדרות הסליקה נשמרו בהצלחה");
    } catch (err) {
      console.error("Save payment provider error:", err);
      showMessage("error", "שגיאה בשמירת ספק הסליקה");
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const testPaymentProviderConnection = async (provider: PaymentProviderType) => {
    if (!businessId) return;

    setPaymentActionLoading(true);

    try {
      const { data } = await API.post(
        `/store/${businessId}/payments/test-connection`,
        { provider }
      );

      if (data?.provider) {
        setSettings((prev) => ({
          ...prev,
          paymentProviders: (prev.paymentProviders || []).map((item) =>
            item.provider === provider ? data.provider : item
          ),
        }));
      }

      showMessage(
        data?.success ? "success" : "error",
        data?.success
          ? "בדיקת החיבור עברה בהצלחה"
          : "חסרים פרטי חיבור לספק הסליקה"
      );
    } catch (err) {
      console.error("Test payment provider error:", err);
      showMessage("error", "שגיאה בבדיקת חיבור הסליקה");
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const deletePaymentProvider = async (provider: PaymentProviderType) => {
    if (!businessId) return;

    if (!window.confirm("למחוק את ספק הסליקה מהחנות?")) return;

    setPaymentActionLoading(true);

    try {
      const { data } = await API.delete(
        `/store/${businessId}/payments/provider/${provider}`
      );

      setSettings({ ...emptySettings, ...(data?.settings || {}) });
      showMessage("success", "ספק הסליקה נמחק");
    } catch (err) {
      console.error("Delete payment provider error:", err);
      showMessage("error", "שגיאה במחיקת ספק סליקה");
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const nav = [
    { id: "products" as StoreView, label: "מוצרים", icon: <Grid3X3 size={17} /> },
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

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
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
                    ? "bg-gradient-to-l from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200/40"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              )}
            >
              {item.icon}
              {item.label}
              {embedded && view === item.id ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-600" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
      ) : null}

      <div
        className={cx(
          embedded
            ? "rounded-xl border border-slate-200 bg-white p-4 md:p-5"
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
            onAddProduct={openAddProduct}
            onEditProduct={editProduct}
            onDeleteProduct={deleteProduct}
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
            paymentProviderForm={paymentProviderForm}
            setPaymentProviderForm={setPaymentProviderForm}
            paymentActionLoading={paymentActionLoading}
            onSavePaymentProvider={savePaymentProvider}
            onTestPaymentProvider={testPaymentProviderConnection}
            onEditPaymentProvider={editPaymentProvider}
            onDeletePaymentProvider={deletePaymentProvider}
            onResetPaymentProvider={resetPaymentProviderForm}
            focus={settingsFocus}
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
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
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
  onAddProduct,
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
  onAddProduct: () => void;
  onEditProduct: (product: StoreProduct) => void;
  onDeleteProduct: (productId: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-950">כל המוצרים</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">
            כאן רואים כל מוצר שנוסף לחנות, כולל שיוך לקטגוריה.
          </p>
        </div>

        <PrimaryButton type="button" onClick={onAddProduct}>
          <Plus size={17} />
          הוספת מוצר
        </PrimaryButton>
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
            placeholder="חיפוש לפי שם, תיאור או קטגוריה"
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
          text="הוסיפי מוצר ראשון, שייכי אותו לקטגוריה, והוא יופיע אוטומטית בגריד החנות."
          action={
            <PrimaryButton type="button" onClick={onAddProduct}>
              <Plus size={17} />
              הוספת מוצר ראשון
            </PrimaryButton>
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

                  {product.isFeatured ? (
                    <span className="absolute left-3 top-3 rounded-full bg-violet-700 px-3 py-1 text-[11px] font-black text-white">
                      מומלץ
                    </span>
                  ) : null}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-slate-950">
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
                      <p className="mt-1 text-sm font-black text-slate-950">
                        {product.stock ?? 0}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-black text-slate-400">
                        מק״ט
                      </p>
                      <p className="mt-1 truncate text-sm font-black text-slate-950">
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
          <h2 className="text-2xl font-black text-slate-950">
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
                <FieldLabel>מלאי</FieldLabel>
                <TextInput
                  type="number"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />
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

              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.isDigital}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      isDigital: e.target.checked,
                    }))
                  }
                />
                מוצר דיגיטלי
              </label>
            </div>

            {productForm.isDigital && (
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
          <p className="text-lg font-black text-slate-950">תמונות המוצר</p>
          <p className="mt-1 text-xs font-bold leading-6 text-slate-500">
            התמונה הראשונה תהיה התמונה הראשית בגריד החנות.
          </p>

          <label className="mt-5 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-violet-200 bg-violet-50/40 p-6 text-center transition hover:bg-violet-50">
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

          {productImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
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
            <h2 className="text-2xl font-black text-slate-950">
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
        <h2 className="mb-5 text-2xl font-black text-slate-950">
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
                    <p className="truncate text-lg font-black text-slate-950">
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
  paymentProviderForm,
  setPaymentProviderForm,
  paymentActionLoading,
  onSavePaymentProvider,
  onTestPaymentProvider,
  onEditPaymentProvider,
  onDeletePaymentProvider,
  onResetPaymentProvider,
  focus = "all",
}: {
  settings: StoreSettingsData;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettingsData>>;
  saving: boolean;
  onSave: () => void;
  paymentProviderForm: PaymentProvider;
  setPaymentProviderForm: React.Dispatch<React.SetStateAction<PaymentProvider>>;
  paymentActionLoading: boolean;
  onSavePaymentProvider: () => void;
  onTestPaymentProvider: (provider: PaymentProviderType) => void;
  onEditPaymentProvider: (provider: PaymentProvider) => void;
  onDeletePaymentProvider: (provider: PaymentProviderType) => void;
  onResetPaymentProvider: () => void;
  focus?: "all" | "payments" | "shipping";
}) {
  const activePaymentProviders = settings.paymentProviders || [];
  const selectedProviderOption = paymentProviderOptions.find(
    (option) => option.value === paymentProviderForm.provider
  );

  const updateCredentials = (
    key: keyof NonNullable<PaymentProvider["credentials"]>,
    value: string
  ) => {
    setPaymentProviderForm((prev) => ({
      ...prev,
      credentials: {
        ...(prev.credentials || {}),
        [key]: value,
      },
    }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="space-y-6">
        {focus !== "payments" ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">
              {focus === "shipping" ? "הגדרות משלוח" : "הגדרות חנות"}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {focus === "shipping"
                ? "מחיר משלוח, משלוח חינם ומדיניות."
                : "מטבע, משלוחים, וואטסאפ, מדיניות ותצוגת מחירים."}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
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

          <div className="mt-6 grid gap-3 md:grid-cols-4">
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

          <div className="mt-6">
            <PrimaryButton type="button" onClick={onSave} loading={saving}>
              <Save size={17} />
              שמירת הגדרות חנות
            </PrimaryButton>
          </div>
        </div>
        ) : null}

        {focus !== "shipping" ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                <CreditCard size={15} />
                תשלומים וסליקה
              </div>

              <h2 className="mt-3 text-2xl font-black text-slate-950">
                חיבור סליקה של העסק
              </h2>

              <p className="mt-1 text-sm font-bold leading-7 text-slate-500">
                כאן העסק מחבר את ספק הסליקה שלו. כל עסק שומר את פרטי החיבור שלו בלבד,
                והחיוב בפועל יבוצע רק לאחר מימוש API ייעודי לספק שנבחר.
              </p>
            </div>

            <SecondaryButton type="button" onClick={onResetPaymentProvider}>
              <Plus size={16} />
              ספק חדש
            </SecondaryButton>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <FieldLabel>ספק סליקה</FieldLabel>
              <SelectInput
                value={paymentProviderForm.provider}
                onChange={(e) => {
                  const provider = e.target.value as PaymentProviderType;
                  const option = paymentProviderOptions.find(
                    (item) => item.value === provider
                  );

                  setPaymentProviderForm((prev) => ({
                    ...prev,
                    provider,
                    label: option?.label || "",
                    credentials: {
                      ...emptyPaymentProviderForm.credentials,
                      ...(prev.credentials || {}),
                    },
                  }));
                }}
              >
                {paymentProviderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>

              {selectedProviderOption?.description && (
                <p className="mt-2 text-xs font-bold leading-5 text-slate-400">
                  {selectedProviderOption.description}
                </p>
              )}
            </div>

            <div>
              <FieldLabel>שם שיוצג ללקוח</FieldLabel>
              <TextInput
                value={paymentProviderForm.label || ""}
                onChange={(e) =>
                  setPaymentProviderForm((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
                placeholder="לדוגמה: תשלום מאובטח באשראי"
              />
            </div>

            <div>
              <FieldLabel>מצב עבודה</FieldLabel>
              <SelectInput
                value={paymentProviderForm.mode || "test"}
                onChange={(e) =>
                  setPaymentProviderForm((prev) => ({
                    ...prev,
                    mode: e.target.value as "test" | "live",
                  }))
                }
              >
                <option value="test">בדיקות</option>
                <option value="live">חי</option>
              </SelectInput>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(paymentProviderForm.isEnabled)}
                  onChange={(e) =>
                    setPaymentProviderForm((prev) => ({
                      ...prev,
                      isEnabled: e.target.checked,
                    }))
                  }
                />
                פעיל בחנות
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(paymentProviderForm.isPrimary)}
                  onChange={(e) =>
                    setPaymentProviderForm((prev) => ({
                      ...prev,
                      isPrimary: e.target.checked,
                    }))
                  }
                />
                ברירת מחדל
              </label>
            </div>

            <div>
              <FieldLabel>מספר מסוף / טרמינל</FieldLabel>
              <TextInput
                value={paymentProviderForm.credentials?.terminalNumber || ""}
                onChange={(e) =>
                  updateCredentials("terminalNumber", e.target.value)
                }
                placeholder="Terminal / Masof"
              />
            </div>

            <div>
              <FieldLabel>Supplier ID / Page Code</FieldLabel>
              <TextInput
                value={
                  paymentProviderForm.credentials?.supplierId ||
                  paymentProviderForm.credentials?.pageCode ||
                  ""
                }
                onChange={(e) => {
                  updateCredentials("supplierId", e.target.value);
                  updateCredentials("pageCode", e.target.value);
                }}
                placeholder="Depends on the selected provider"
              />
            </div>

            <div>
              <FieldLabel>Merchant ID / Account ID</FieldLabel>
              <TextInput
                value={
                  paymentProviderForm.credentials?.merchantId ||
                  paymentProviderForm.credentials?.accountId ||
                  ""
                }
                onChange={(e) => {
                  updateCredentials("merchantId", e.target.value);
                  updateCredentials("accountId", e.target.value);
                }}
                placeholder="Merchant / account identifier"
              />
            </div>

            <div>
              <FieldLabel>שם משתמש</FieldLabel>
              <TextInput
                value={paymentProviderForm.credentials?.username || ""}
                onChange={(e) => updateCredentials("username", e.target.value)}
                placeholder="Username"
              />
            </div>

            <div>
              <FieldLabel>API Key / Public Key</FieldLabel>
              <TextInput
                value={
                  paymentProviderForm.credentials?.apiKey ||
                  paymentProviderForm.credentials?.publicKey ||
                  ""
                }
                onChange={(e) => {
                  updateCredentials("apiKey", e.target.value);
                  updateCredentials("publicKey", e.target.value);
                }}
                placeholder="מפתח ציבורי / API Key"
              />
            </div>

            <div>
              <FieldLabel>API Secret / Private Key</FieldLabel>
              <TextInput
                type="password"
                value={
                  paymentProviderForm.credentials?.apiSecret === "••••••••" ||
                  paymentProviderForm.credentials?.privateKey === "••••••••"
                    ? ""
                    : paymentProviderForm.credentials?.apiSecret ||
                      paymentProviderForm.credentials?.privateKey ||
                      ""
                }
                onChange={(e) => {
                  updateCredentials("apiSecret", e.target.value);
                  updateCredentials("privateKey", e.target.value);
                }}
                placeholder="מפתח סודי אם הספק דורש"
              />
            </div>

            <div className="lg:col-span-2">
              <FieldLabel>קישור צ׳קאאוט חיצוני / ספק אחר</FieldLabel>
              <TextInput
                value={paymentProviderForm.credentials?.customCheckoutUrl || ""}
                onChange={(e) =>
                  updateCredentials("customCheckoutUrl", e.target.value)
                }
                placeholder="https://..."
              />
            </div>

            <div className="lg:col-span-2">
              <FieldLabel>הערות פנימיות</FieldLabel>
              <TextArea
                value={paymentProviderForm.notes || ""}
                onChange={(e) =>
                  setPaymentProviderForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="הערות חיבור, שם מסוף, פרטי ספק וכו׳"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton
              type="button"
              onClick={onSavePaymentProvider}
              loading={paymentActionLoading}
            >
              <Save size={17} />
              שמירת ספק סליקה
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() =>
                onTestPaymentProvider(paymentProviderForm.provider)
              }
              disabled={paymentActionLoading}
            >
              <RefreshCcw size={16} />
              בדיקת חיבור
            </SecondaryButton>
          </div>
        </div>
        ) : null}
      </div>

      {focus !== "shipping" ? (
      <aside className="space-y-5">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">
            ספקי סליקה פעילים
          </h3>

          <p className="mt-1 text-xs font-bold leading-6 text-slate-500">
            אלו אמצעי התשלום שהעסק הגדיר לחנות שלו.
          </p>

          <div className="mt-5 grid gap-3">
            {activePaymentProviders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-black text-slate-500">
                לא הוגדרו ספקי סליקה עדיין
              </div>
            ) : (
              activePaymentProviders.map((provider) => (
                <div
                  key={provider.provider}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        {provider.label || getPaymentProviderLabel(provider.provider)}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {getPaymentProviderLabel(provider.provider)} ·{" "}
                        {provider.mode === "live" ? "חי" : "בדיקות"}
                      </p>
                    </div>

                    <StatusBadge
                      active={provider.connectionStatus === "connected"}
                      label={getPaymentStatusLabel(provider.connectionStatus)}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {provider.isEnabled && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                        פעיל
                      </span>
                    )}

                    {provider.isPrimary && (
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-black text-violet-700">
                        ברירת מחדל
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <SecondaryButton
                      type="button"
                      onClick={() => onEditPaymentProvider(provider)}
                      className="w-full"
                    >
                      עריכה
                    </SecondaryButton>

                    {!["manual", "whatsapp"].includes(provider.provider) && (
                      <button
                        type="button"
                        onClick={() =>
                          onDeletePaymentProvider(provider.provider)
                        }
                        className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        title="מחיקת ספק"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black text-amber-900">
            חשוב לגבי סליקה
          </h3>

          <p className="mt-2 text-xs font-bold leading-6 text-amber-800">
            השמירה כאן שומרת את פרטי הספק של העסק במערכת. כדי לגבות אשראי
            בפועל צריך לממש יצירת תשלום לפי ה־API של כל ספק: Stripe, PayPal,
            Square, Adyen, Checkout.com, Grow, Hyp, Tranzila וכו׳.
          </p>
        </div>
      </aside>
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
        <h2 className="mb-5 text-2xl font-black text-slate-950">
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
        <h2 className="mb-5 text-2xl font-black text-slate-950">קופונים</h2>

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
                    <p className="text-lg font-black text-slate-950">
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

function OrdersView({
  orders,
  settings,
  onUpdateOrderStatus,
}: {
  orders: StoreOrder[];
  settings: StoreSettingsData;
  onUpdateOrderStatus: (orderId: string, status: string) => void;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-2xl font-black text-slate-950">הזמנות</h2>

      {orders.length === 0 ? (
        <EmptyBox
          title="אין הזמנות עדיין"
          text="כאן יופיעו הזמנות מהחנות הציבורית."
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <p className="text-lg font-black text-slate-950">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {order.customerName} · {order.customerPhone || "אין טלפון"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl font-black text-violet-700">
                    {formatMoney(order.total, order.currency || settings.currency)}
                  </p>

                  <SelectInput
                    value={order.status || "new"}
                    onChange={(e) =>
                      onUpdateOrderStatus(order._id, e.target.value)
                    }
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}