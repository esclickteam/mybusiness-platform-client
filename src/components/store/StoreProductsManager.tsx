"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  CheckCircle2,
  ChevronDown,
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
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";

type StoreView =
  | "home"
  | "settings"
  | "add-product"
  | "products"
  | "categories"
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-black text-slate-600">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition",
        "placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
        props.className || "",
      ].join(" ")}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-[110px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold leading-7 text-slate-900 outline-none transition",
        "placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
        props.className || "",
      ].join(" ")}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-sm font-bold text-slate-900 outline-none transition",
          "focus:border-violet-300 focus:ring-4 focus:ring-violet-100",
          props.className || "",
        ].join(" ")}
      />
      <ChevronDown
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
      className={[
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(124,58,237,0.22)] transition",
        "hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(124,58,237,0.28)] active:translate-y-0",
        "disabled:cursor-not-allowed disabled:opacity-60",
        props.className || "",
      ].join(" ")}
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : null}
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
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50",
        "disabled:cursor-not-allowed disabled:opacity-60",
        props.className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusBadge({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black",
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-slate-400",
        ].join(" ")}
      />
      {label}
    </span>
  );
}

function StoreHomeCard({
  title,
  text,
  icon,
  onClick,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[26px] border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 transition group-hover:bg-violet-700 group-hover:text-white">
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-slate-950">
            {title}
          </span>
          <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">
            {text}
          </span>
        </span>
      </div>
    </button>
  );
}

export default function StoreProductsManager({
  businessId: businessIdProp,
}: StoreProductsManagerProps) {
  const { user } = useAuth() as { user: AuthUserShape | null };

  const businessId =
    businessIdProp || user?.businessId || user?.business?._id || "";

  const [view, setView] = useState<StoreView>("home");
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
        editingProductId ? "המוצר עודכן בהצלחה" : "המוצר נוסף בהצלחה"
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
      currency: product.currency || "USD",
      categoryId,
      sku: product.sku || "",
      stock: String(product.stock ?? 0),
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      status: product.status || "active",
      isFeatured: Boolean(product.isFeatured),
      isDigital: Boolean(product.isDigital),
      digitalFileUrl: product.digitalFileUrl || "",
      images: JSON.stringify(product.images || []),
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

  if (!businessId) {
    return (
      <div
        dir="rtl"
        className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-right"
      >
        <p className="text-sm font-black text-amber-800">
          לא נמצא businessId. צריך להיכנס כבעל עסק כדי לנהל חנות.
        </p>
      </div>
    );
  }

  return (
    <section dir="rtl" className="w-full text-right">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100">
            <ShoppingBag size={15} />
            ניהול חנות
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            {view === "home" && "חנות"}
            {view === "settings" && "הגדרות חנות"}
            {view === "add-product" && (editingProductId ? "עריכת מוצר" : "הוספת מוצר")}
            {view === "products" && "מוצרים בחנות"}
            {view === "categories" && "קטגוריות מוצרים"}
            {view === "coupons" && "קופונים ומבצעים"}
            {view === "orders" && "הזמנות"}
          </h2>

          <p className="mt-1 text-sm font-bold leading-6 text-slate-400">
            {view === "home"
              ? "בחרי מה לנהל בחנות."
              : "כל שינוי נשמר ישירות בשרת ומופיע באתר."}
          </p>
        </div>

        {view !== "home" ? (
          <button
            type="button"
            onClick={() => setView("home")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-950 hover:text-white"
            title="חזרה"
          >
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={loadStoreData}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
            title="רענון"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
          </button>
        )}
      </div>

      {message && (
        <div
          className={[
            "mb-5 flex items-center gap-3 rounded-2xl border p-4 text-sm font-black",
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          <CheckCircle2 size={19} />
          {message.text}
        </div>
      )}

      {loading && view === "home" ? (
        <div className="grid min-h-[220px] place-items-center rounded-[28px] bg-slate-50">
          <div className="flex items-center gap-3 text-sm font-black text-slate-500">
            <Loader2 size={22} className="animate-spin text-violet-600" />
            טוען נתונים...
          </div>
        </div>
      ) : null}

      {!loading && view === "home" && (
        <div className="space-y-3">
          <StoreHomeCard
            title="הגדרות חנות"
            text="מטבע, משלוחים, וואטסאפ, מדיניות החזרות ותצוגת מחירים."
            icon={<Settings size={21} />}
            onClick={() => setView("settings")}
          />

          <StoreHomeCard
            title="הוספת מוצר"
            text="פתיחת עמוד מוצר נקי עם תמונות, מחיר, מלאי, תיאור וקטגוריה."
            icon={<PackagePlus size={21} />}
            onClick={() => {
              resetProductForm();
              setView("add-product");
            }}
          />

          <StoreHomeCard
            title="רשימת מוצרים"
            text={`ניהול גריד המוצרים בחנות. כרגע יש ${products.length} מוצרים.`}
            icon={<ShoppingBag size={21} />}
            onClick={() => setView("products")}
          />

          <StoreHomeCard
            title="קטגוריות מוצרים"
            text={`יצירה ושיוך קטגוריות כמו Shopify. כרגע יש ${categories.length} קטגוריות.`}
            icon={<Tags size={21} />}
            onClick={() => setView("categories")}
          />

          <StoreHomeCard
            title="מבצעים וקופונים"
            text={`קודי קופון, אחוזים או סכום קבוע. כרגע יש ${coupons.length} קופונים.`}
            icon={<BadgePercent size={21} />}
            onClick={() => setView("coupons")}
          />

          <StoreHomeCard
            title="הזמנות"
            text={`מעקב אחרי הזמנות וסטטוסים. כרגע יש ${orders.length} הזמנות.`}
            icon={<Boxes size={21} />}
            onClick={() => setView("orders")}
          />
        </div>
      )}

      {view === "settings" && (
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4">
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

            <div>
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

            <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="grid gap-3">
              {[
                ["isStoreActive", "חנות פעילה"],
                ["showPrices", "הצגת מחירים"],
                ["allowCart", "סל קניות"],
                ["allowWhatsappOrders", "הזמנות וואטסאפ"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700"
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

            <PrimaryButton type="button" onClick={saveSettings} loading={saving} className="w-full">
              <Save size={17} />
              שמירת הגדרות
            </PrimaryButton>
          </div>
        </div>
      )}

      {view === "add-product" && (
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>מחיר</FieldLabel>
                <TextInput
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, price: e.target.value }))
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
              <FieldLabel>קטגוריה</FieldLabel>
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

            <div className="grid gap-4 sm:grid-cols-3">
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
                    setProductForm((prev) => ({ ...prev, stock: e.target.value }))
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

            <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-violet-200 bg-white p-5 text-center transition hover:bg-violet-50">
              <ImagePlus size={28} className="text-violet-600" />
              <span className="mt-2 text-sm font-black text-slate-700">
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
              <p className="text-xs font-black text-violet-700">
                נבחרו {productImages.length} תמונות
              </p>
            )}

            <div className="grid gap-3">
              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700">
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

              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700">
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

            <PrimaryButton
              type="button"
              onClick={submitProduct}
              loading={saving}
              className="w-full"
            >
              {editingProductId ? <Save size={17} /> : <PackagePlus size={17} />}
              {editingProductId ? "שמירת מוצר" : "הוספת מוצר"}
            </PrimaryButton>

            {editingProductId && (
              <SecondaryButton
                type="button"
                onClick={() => {
                  resetProductForm();
                  setView("products");
                }}
                className="w-full"
              >
                ביטול עריכה
              </SecondaryButton>
            )}
          </div>
        </div>
      )}

      {view === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <TextInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש מוצר"
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

            <PrimaryButton
              type="button"
              onClick={() => {
                resetProductForm();
                setView("add-product");
              }}
              className="w-full"
            >
              <Plus size={17} />
              מוצר חדש
            </PrimaryButton>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-black text-slate-600">
                אין עדיין מוצרים
              </p>
              <button
                type="button"
                onClick={() => setView("add-product")}
                className="mt-4 rounded-2xl bg-violet-700 px-5 py-3 text-xs font-black text-white"
              >
                הוספת מוצר ראשון
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => {
                const image = product.mainImage || product.images?.[0] || "";

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative h-44 bg-slate-100">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-sm font-black text-slate-300">
                          אין תמונה
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
                    </div>

                    <div className="p-4">
                      <h4 className="text-base font-black text-slate-950">
                        {product.name}
                      </h4>

                      <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
                        {product.shortDescription ||
                          product.description ||
                          "אין תיאור"}
                      </p>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          {product.salePrice ? (
                            <p className="text-xs font-black text-slate-400 line-through">
                              {formatMoney(product.price, product.currency)}
                            </p>
                          ) : null}

                          <p className="text-xl font-black text-violet-700">
                            {formatMoney(
                              product.salePrice || product.price,
                              product.currency
                            )}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
                          {product.categoryName || "ללא קטגוריה"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                        <SecondaryButton
                          type="button"
                          onClick={() => editProduct(product)}
                          className="w-full"
                        >
                          עריכה
                        </SecondaryButton>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product._id)}
                          className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
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
      )}

      {view === "categories" && (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-black text-slate-950">
              {editingCategoryId ? "עריכת קטגוריה" : "הוספת קטגוריה"}
            </h3>

            <div className="grid gap-4">
              <div>
                <FieldLabel>שם קטגוריה</FieldLabel>
                <TextInput
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
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

              <label className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-violet-200 bg-white p-5 text-center transition hover:bg-violet-50">
                <ImagePlus size={26} className="text-violet-600" />
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

              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700">
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
                onClick={submitCategory}
                loading={saving}
                className="w-full"
              >
                <Save size={17} />
                שמירת קטגוריה
              </PrimaryButton>

              {editingCategoryId && (
                <SecondaryButton type="button" onClick={resetCategoryForm}>
                  ביטול עריכה
                </SecondaryButton>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-950">
                      {category.name}
                    </p>
                    <p className="truncate text-xs font-bold text-slate-400">
                      /{category.slug}
                    </p>
                  </div>

                  <StatusBadge
                    active={category.isVisible}
                    label={category.isVisible ? "מוצג" : "מוסתר"}
                  />
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <SecondaryButton onClick={() => editCategory(category)}>
                    עריכה
                  </SecondaryButton>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category._id)}
                    className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-black text-slate-500">
                אין קטגוריות עדיין
              </div>
            )}
          </div>
        </div>
      )}

      {view === "coupons" && (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-4 text-lg font-black text-slate-950">
              {editingCouponId ? "עריכת קופון" : "הוספת קופון"}
            </h3>

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

              <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700">
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
                onClick={submitCoupon}
                loading={saving}
                className="w-full"
              >
                <Save size={17} />
                שמירת קופון
              </PrimaryButton>

              {editingCouponId && (
                <SecondaryButton type="button" onClick={resetCouponForm}>
                  ביטול עריכה
                </SecondaryButton>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-black text-slate-950">
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

                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <SecondaryButton onClick={() => editCoupon(coupon)}>
                    עריכה
                  </SecondaryButton>

                  <button
                    type="button"
                    onClick={() => deleteCoupon(coupon._id)}
                    className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {coupons.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-black text-slate-500">
                אין קופונים עדיין
              </div>
            )}
          </div>
        </div>
      )}

      {view === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-base font-black text-slate-950">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {order.customerName} · {order.customerPhone || "אין טלפון"}
                  </p>
                </div>

                <p className="text-xl font-black text-violet-700">
                  {formatMoney(order.total, order.currency || settings.currency)}
                </p>

                <SelectInput
                  value={order.status || "new"}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
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

          {orders.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-black text-slate-500">
              אין הזמנות עדיין
            </div>
          )}
        </div>
      )}
    </section>
  );
}
