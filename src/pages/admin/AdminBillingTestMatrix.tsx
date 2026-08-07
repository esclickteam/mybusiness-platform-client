import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  FlaskConical,
  RefreshCw,
  XCircle,
} from "lucide-react";

import {
  createBillingTestCheckout,
  fetchBillingTestMapping,
  fetchBillingTestMatrix,
  isBillingTestAvailable,
  normalizeVerifyChecks,
  verifyBillingTestSession,
  type BillingTestCatalogItem,
  type BillingTestMappingEntry,
  type BillingTestMatrixResponse,
  type BillingTestVerifyResponse,
} from "../../api/billingTestApi";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";

const PACKAGE_OPTIONS = [
  {
    id: "monthly",
    name: "חבילה חודשית",
    note: "CRM חודשי מתחדש",
  },
  {
    id: "yearly",
    name: "חבילה שנתית",
    note: "CRM שנתי מתחדש",
  },
  {
    id: "website_only",
    name: "אתר בלבד",
    note: "רכישת אתר ללא מנוי CRM",
  },
] as const;

type PackageSku = (typeof PACKAGE_OPTIONS)[number]["id"];

function isAdminRole(role?: string | null) {
  const normalized = String(role || "").toLowerCase();
  return normalized === "admin" || normalized === "superadmin";
}

function catalogLabel(item: BillingTestCatalogItem) {
  return item.nameHe || item.nameEn || item.sku;
}

function billingLabel(billing?: string) {
  if (billing === "recurring_month") return "חודשי";
  if (billing === "recurring_year") return "שנתי";
  if (billing === "one_time") return "חד־פעמי";
  return billing || "—";
}

function extractCatalogLists(matrix?: BillingTestMatrixResponse | null) {
  const items = Array.isArray(matrix?.items) ? matrix!.items! : [];
  const packagesFromItems = items.filter((item) => item.kind === "package");
  const upsellsFromItems = items.filter(
    (item) => item.kind === "upsell" || !item.kind
  );
  const addonsFromItems = items.filter((item) => item.kind === "addon");

  const packages =
    Array.isArray(matrix?.packages) && matrix!.packages!.length
      ? matrix!.packages!
      : packagesFromItems;
  const upsells =
    Array.isArray(matrix?.upsells) && matrix!.upsells!.length
      ? matrix!.upsells!
      : upsellsFromItems;
  const addons =
    Array.isArray(matrix?.addons) && matrix!.addons!.length
      ? matrix!.addons!
      : addonsFromItems;

  return { packages, upsells, addons };
}

function mappingRows(data?: {
  mapping?: BillingTestMappingEntry[];
  items?: BillingTestMappingEntry[];
} | null) {
  if (Array.isArray(data?.mapping)) return data!.mapping!;
  if (Array.isArray(data?.items)) return data!.items!;
  return [];
}

function AdminBillingTestMatrix() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [matrix, setMatrix] = useState<BillingTestMatrixResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const [packageSku, setPackageSku] = useState<PackageSku>("monthly");
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [lastSessionId, setLastSessionId] = useState("");
  const [sessionInput, setSessionInput] = useState("");

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] =
    useState<BillingTestVerifyResponse | null>(null);

  const [mappingLoading, setMappingLoading] = useState(false);
  const [mapping, setMapping] = useState<BillingTestMappingEntry[]>([]);
  const [showMapping, setShowMapping] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!isAdminRole(user.role)) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fromQuery =
      searchParams.get("session_id") ||
      searchParams.get("sessionId") ||
      "";
    if (fromQuery) {
      setLastSessionId(fromQuery);
      setSessionInput(fromQuery);
    }
  }, [searchParams]);

  const loadMatrix = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBillingTestMatrix();
      setMatrix(data);
    } catch (err) {
      setMatrix(null);
      setError(
        err instanceof Error
          ? err.message
          : "שגיאה בטעינת מטריצת בדיקות החיוב"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const available = isBillingTestAvailable(matrix);
  const { packages, upsells, addons } = useMemo(
    () => extractCatalogLists(matrix),
    [matrix]
  );

  const visibleUpsells = useMemo(() => {
    return upsells.filter((item) => {
      if (!item || item.active === false) return false;
      if (packageSku === "website_only" && item.sku === "website_addon") {
        return false;
      }
      return true;
    });
  }, [upsells, packageSku]);

  const visibleAddons = useMemo(() => {
    return addons.filter((item) => item && item.active !== false);
  }, [addons]);

  const packageMeta = useMemo(() => {
    const fromApi = packages.find((item) => item.sku === packageSku);
    const fallback = PACKAGE_OPTIONS.find((item) => item.id === packageSku);
    return {
      name: fromApi ? catalogLabel(fromApi) : fallback?.name || packageSku,
      amountIls: fromApi?.amountIls,
      note: fallback?.note || "",
    };
  }, [packages, packageSku]);

  const toggleSku = (
    sku: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      list.includes(sku) ? list.filter((item) => item !== sku) : [...list, sku]
    );
  };

  const openCheckout = async () => {
    setCheckoutLoading(true);
    setError("");
    setBanner("");
    try {
      const result = await createBillingTestCheckout({
        packageSku,
        upsellSkus: selectedUpsells,
        addonSkus: selectedAddons,
      });
      if (result.sessionId) {
        setLastSessionId(result.sessionId);
        setSessionInput(result.sessionId);
      }
      setBanner("נפתח Stripe Test Checkout — אין חיוב אמיתי.");
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "יצירת Checkout נכשלה"
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const runVerify = async (sessionIdOverride?: string) => {
    const sessionId = String(sessionIdOverride || sessionInput || "").trim();
    if (!sessionId) {
      setError("יש להזין sessionId לאימות");
      return;
    }
    setVerifyLoading(true);
    setError("");
    setBanner("");
    try {
      const data = await verifyBillingTestSession(sessionId);
      setVerifyResult(data);
      setLastSessionId(sessionId);
      const checks = normalizeVerifyChecks(data);
      const allPass =
        typeof data.pass === "boolean"
          ? data.pass
          : typeof data.ok === "boolean"
            ? data.ok
            : checks.length > 0 && checks.every((item) => item.pass);
      setBanner(
        allPass
          ? "אימות הושלם — כל הבדיקות עברו."
          : "אימות הושלם — יש בדיקות שנכשלו."
      );
      if (searchParams.get("session_id") || searchParams.get("sessionId")) {
        const next = new URLSearchParams(searchParams);
        next.delete("session_id");
        next.delete("sessionId");
        setSearchParams(next, { replace: true });
      }
    } catch (err) {
      setVerifyResult(null);
      setError(err instanceof Error ? err.message : "אימות נכשל");
    } finally {
      setVerifyLoading(false);
    }
  };

  const loadMapping = async () => {
    setMappingLoading(true);
    setError("");
    try {
      const data = await fetchBillingTestMapping();
      setMapping(mappingRows(data));
      setShowMapping(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "שגיאה בטעינת מיפוי מחירים"
      );
    } finally {
      setMappingLoading(false);
    }
  };

  const verifyChecks = normalizeVerifyChecks(verifyResult);
  const verifyPass =
    typeof verifyResult?.pass === "boolean"
      ? verifyResult.pass
      : typeof verifyResult?.ok === "boolean"
        ? verifyResult.ok
        : verifyChecks.length > 0 && verifyChecks.every((item) => item.pass);

  return (
    <>
      <AdminHeader />
      <div
        className="min-h-screen bg-[#F8F9FA] px-3 py-5 sm:px-4 sm:py-7 md:px-8"
        dir="rtl"
        style={{ fontFamily: '"Assistant", "Inter", "Rubik", sans-serif' }}
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-black tracking-wide text-amber-800 shadow-sm">
                  <FlaskConical className="h-3.5 w-3.5" />
                  TEST MODE – NO REAL CHARGE
                </span>
                {matrix?.mode ? (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                    mode: {matrix.mode}
                  </span>
                ) : null}
              </div>
              <h1 className="text-2xl font-black text-purple-950 sm:text-3xl">
                מטריצת בדיקות Billing
              </h1>
              <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-600">
                בדיקת רכישות Stripe Test מקצה לקצה — חבילות, אפסיילים, ווובהוקים
                ואימות DB — ללא חיוב אמיתי.
              </p>
            </div>

            <button
              type="button"
              onClick={loadMatrix}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              רענון
            </button>
          </div>

          {banner ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {banner}
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-slate-500">
              טוען מטריצת בדיקות…
            </div>
          ) : !available ? (
            <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                מטריצת הבדיקות אינה זמינה
              </h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
                {matrix?.message ||
                  "השרת אינו במצב Stripe Test (mode !== test). Checkout לא מוצג כדי למנוע חיובים אמיתיים."}
              </p>
              <p className="mt-3 text-xs font-bold text-slate-400">
                זמין ב-Local / Staging בלבד כאשר STRIPE_MODE=test.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-black text-slate-900">
                  בחירת חבילה ואפסיילים
                </h2>

                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {PACKAGE_OPTIONS.map((option) => {
                    const selected = packageSku === option.id;
                    const apiItem = packages.find(
                      (item) => item.sku === option.id
                    );
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setPackageSku(option.id);
                          if (option.id === "website_only") {
                            setSelectedUpsells((prev) =>
                              prev.filter((sku) => sku !== "website_addon")
                            );
                          }
                        }}
                        className={`rounded-xl border px-3 py-3 text-right transition ${
                          selected
                            ? "border-[#7C4DFF] bg-violet-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-violet-200"
                        }`}
                      >
                        <strong className="block text-sm font-black text-slate-900">
                          {apiItem ? catalogLabel(apiItem) : option.name}
                        </strong>
                        <span className="mt-1 block text-xs font-bold text-slate-500">
                          {option.note}
                        </span>
                        {apiItem?.amountIls != null ? (
                          <span className="mt-2 block text-sm font-black text-emerald-700">
                            ₪{Number(apiItem.amountIls).toLocaleString("he-IL")}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  נבחר:{" "}
                  <span className="font-black text-slate-900">
                    {packageMeta.name}
                  </span>
                  {packageMeta.amountIls != null
                    ? ` · ₪${Number(packageMeta.amountIls).toLocaleString("he-IL")}`
                    : ""}
                </div>

                <div className="mb-5 space-y-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      אפסיילים
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-slate-500">
                      סמנו שירותים להוספה לרכישת הבדיקה
                    </p>
                  </div>
                  {!visibleUpsells.length ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-500">
                      אין אפסיילים פעילים מה-API
                    </div>
                  ) : (
                    <div className="grid max-h-[22rem] gap-2 overflow-y-auto sm:grid-cols-2">
                      {visibleUpsells.map((item) => {
                        const checked = selectedUpsells.includes(item.sku);
                        return (
                          <label
                            key={item.sku}
                            className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-3 text-sm ${
                              checked
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={checked}
                              onChange={() =>
                                toggleSku(
                                  item.sku,
                                  selectedUpsells,
                                  setSelectedUpsells
                                )
                              }
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-black text-slate-900">
                                {catalogLabel(item)}
                              </span>
                              <span className="mt-0.5 block text-[11px] font-bold text-slate-500">
                                {billingLabel(item.billing)}
                                {item.amountIls != null
                                  ? ` · ₪${item.amountIls}`
                                  : ""}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {visibleAddons.length ? (
                  <div className="mb-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Addons נוספים
                      </h3>
                      <p className="mt-0.5 text-xs font-bold text-slate-500">
                        תוספות אופציונליות מהקטלוג
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {visibleAddons.map((item) => {
                        const checked = selectedAddons.includes(item.sku);
                        return (
                          <label
                            key={item.sku}
                            className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-3 text-sm ${
                              checked
                                ? "border-sky-400 bg-sky-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={checked}
                              onChange={() =>
                                toggleSku(
                                  item.sku,
                                  selectedAddons,
                                  setSelectedAddons
                                )
                              }
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-black text-slate-900">
                                {catalogLabel(item)}
                              </span>
                              <span className="mt-0.5 block text-[11px] font-bold text-slate-500">
                                {billingLabel(item.billing)}
                                {item.amountIls != null
                                  ? ` · ₪${item.amountIls}`
                                  : ""}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={checkoutLoading}
                  onClick={openCheckout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4" />
                  {checkoutLoading
                    ? "פותח Checkout…"
                    : "פתח Stripe Test Checkout"}
                </button>
              </section>

              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-lg font-black text-slate-900">
                    אימות אחרי רכישה
                  </h2>
                  <p className="mb-3 text-xs font-bold text-slate-500">
                    הזינו sessionId מ-Stripe (או מהחזרה ל-URL) ובדקו PASS/FAIL.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={sessionInput}
                      onChange={(e) => setSessionInput(e.target.value)}
                      placeholder="cs_test_..."
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      disabled={verifyLoading}
                      onClick={() => runVerify()}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                      {verifyLoading ? "מאמת…" : "אמת"}
                    </button>
                  </div>
                  {lastSessionId ? (
                    <p className="mt-2 text-[11px] font-bold text-slate-400" dir="ltr">
                      last session: {lastSessionId}
                    </p>
                  ) : null}

                  {verifyResult ? (
                    <div className="mt-4">
                      <div
                        className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
                          verifyPass
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {verifyPass ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {verifyPass ? "PASS" : "FAIL"}
                      </div>
                      <div className="space-y-2">
                        {verifyChecks.length ? (
                          verifyChecks.map((check) => (
                            <div
                              key={check.key}
                              className={`rounded-xl border px-3 py-2 text-sm ${
                                check.pass
                                  ? "border-emerald-100 bg-emerald-50/60"
                                  : "border-rose-100 bg-rose-50/60"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-slate-800">
                                  {check.label}
                                </span>
                                <span
                                  className={`shrink-0 text-xs font-black ${
                                    check.pass
                                      ? "text-emerald-700"
                                      : "text-rose-700"
                                  }`}
                                >
                                  {check.pass ? "PASS" : "FAIL"}
                                </span>
                              </div>
                              {check.detail ? (
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  {check.detail}
                                </p>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm font-semibold text-slate-500">
                            {verifyResult.message ||
                              "לא התקבלה רשימת בדיקות מהשרת"}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      מיפוי מחירים Test
                    </h2>
                    <button
                      type="button"
                      disabled={mappingLoading}
                      onClick={loadMapping}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {mappingLoading ? "טוען…" : "טען mapping"}
                    </button>
                  </div>
                  {!showMapping ? (
                    <p className="text-sm font-semibold text-slate-500">
                      אופציונלי — הצגת Live lookupKey ↔ Test Price IDs.
                    </p>
                  ) : !mapping.length ? (
                    <p className="text-sm font-semibold text-slate-500">
                      אין רשומות מיפוי
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="min-w-full text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="px-2 py-2 text-right font-bold">
                              SKU
                            </th>
                            <th className="px-2 py-2 text-right font-bold">
                              Lookup
                            </th>
                            <th className="px-2 py-2 text-right font-bold">
                              Test Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {mapping.map((row, index) => (
                            <tr
                              key={`${row.sku || row.lookupKey || index}`}
                              className="border-t border-slate-100"
                            >
                              <td className="px-2 py-2 font-mono">
                                {row.sku || "—"}
                              </td>
                              <td className="px-2 py-2 font-mono" dir="ltr">
                                {row.lookupKey ||
                                  row.stripeLookupKey ||
                                  "—"}
                              </td>
                              <td className="px-2 py-2 font-mono" dir="ltr">
                                {row.testPriceId ||
                                  row.stripeTestPriceId ||
                                  "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-violet-100 bg-gradient-to-l from-[#f3e9ff] via-white to-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-100 text-[#7C4DFF]">
                      <CircleDollarSign className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        תזכורת בטיחות
                      </h3>
                      <p className="mt-1 text-xs font-semibold leading-6 text-slate-600">
                        הדף עובד רק כשהשרת מדווח mode=test. בפרודקשן המטריצה
                        נחסמת ואין Checkout.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminBillingTestMatrix;