import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import BizuplyLoader from "../../components/ui/BizuplyLoader";
import {
  checkDomainAvailability,
  checkoutDomainRegistration,
  createDomainContact,
  quoteDomainRegistration,
  registerDomain,
  type DomainAvailabilityResult,
  type DomainContactPayload,
  type DomainContactResult,
  type DomainQuoteResult,
  type DomainRegisterResult,
  type DomainYears,
} from "../../services/domainService";

type ContactFormState = Omit<
  DomainContactPayload,
  | "domain"
  | "availability"
  | "premium"
  | "currency"
  | "price"
  | "reason"
  | "rawStatus"
  | "brand"
>;

const INITIAL_CONTACT: ContactFormState = {
  name: "",
  organization: "",
  address: "",
  addressLine2: "",
  addressLine3: "",
  postalCode: "",
  city: "",
  state: "",
  country: "IL",
  email: "",
  phone: "",
  vatNumber: "",
};

const DEFAULT_DOMAIN_YEAR_OPTIONS: DomainYears[] = [1, 2, 3, 5, 10];
const IL_DOMAIN_YEAR_OPTIONS: DomainYears[] = [1, 2];

function isIsraeliDomain(domain: string) {
  return /\.il$/i.test(String(domain || "").trim());
}

function yearOptionsForDomain(domain: string): DomainYears[] {
  return isIsraeliDomain(domain)
    ? IL_DOMAIN_YEAR_OPTIONS
    : DEFAULT_DOMAIN_YEAR_OPTIONS;
}

const DOMAIN_EXTENSIONS = [
  "co.il",
  "com",
  "net",
  "org",
  "ai",
  "online",
  "co",
  "io",
  "info",
  "store",
  "app",
] as const;

type DomainExtension = (typeof DOMAIN_EXTENSIONS)[number];

const EXTENSIONS_BY_LENGTH = [...DOMAIN_EXTENSIONS].sort(
  (a, b) => b.length - a.length,
);

function formatIls(amount: number) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function cleanDomainInput(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");
}

function parseDomainInput(
  value: string,
  fallbackTld: DomainExtension,
): { name: string; tld: DomainExtension; full: string } {
  const clean = cleanDomainInput(value);

  for (const ext of EXTENSIONS_BY_LENGTH) {
    const suffix = `.${ext}`;
    if (clean.endsWith(suffix) && clean.length > suffix.length) {
      return {
        name: clean.slice(0, -suffix.length),
        tld: ext,
        full: clean,
      };
    }
  }

  const name = clean.replace(/^\.+/, "").replace(/\.+$/, "");
  return {
    name,
    tld: fallbackTld,
    full: name ? `${name}.${fallbackTld}` : "",
  };
}

export default function DomainSearch() {
  const [domainName, setDomainName] = useState("");
  const [selectedTld, setSelectedTld] =
    useState<DomainExtension>("co.il");
  const [result, setResult] =
    useState<DomainAvailabilityResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const [showContactForm, setShowContactForm] = useState(false);
  const [contact, setContact] =
    useState<ContactFormState>(INITIAL_CONTACT);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactResult, setContactResult] =
    useState<DomainContactResult | null>(null);
  const [selectedYears, setSelectedYears] = useState<DomainYears>(1);
  const [yearOptions, setYearOptions] = useState<DomainYears[]>(
    IL_DOMAIN_YEAR_OPTIONS,
  );
  const [quote, setQuote] = useState<DomainQuoteResult | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerResult, setRegisterResult] =
    useState<DomainRegisterResult | null>(null);

  const selectedDomainForContact = result?.domain || fullDomain;
  const requiresVat = isIsraeliDomain(selectedDomainForContact);

  const canSubmitContact = useMemo(() => {
    return Boolean(
      contact.name.trim() &&
        contact.address.trim() &&
        contact.postalCode.trim() &&
        contact.city.trim() &&
        contact.country.trim() &&
        contact.email.trim() &&
        contact.phone.trim() &&
        (!requiresVat || String(contact.vatNumber || "").trim()),
    );
  }, [contact, requiresVat]);

  const fullDomain = useMemo(() => {
    const parsed = parseDomainInput(domainName, selectedTld);
    return parsed.name ? `${parsed.name}.${selectedTld}` : "";
  }, [domainName, selectedTld]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainPaid = params.get("domain_paid");
    const registrationId = params.get("registrationId") || "";

    if (domainPaid !== "1" || !registrationId) return;

    let cancelled = false;

    async function completeAfterPayment() {
      setShowContactForm(true);
      setRegisterError("");
      setIsCheckingOut(true);

      try {
        const response = await registerDomain({ registrationId });
        if (cancelled) return;
        setRegisterResult(response);
        setContactResult((current) =>
          current
            ? { ...current, registrationId, status: response.status }
            : {
                success: true,
                registrationId,
                domain: response.domain,
                status: response.status,
              },
        );
      } catch (requestError) {
        if (cancelled) return;
        setRegisterError(
          requestError instanceof Error
            ? requestError.message
            : "אישור התשלום התקבל, אך השלמת הרישום נכשלה. נסו שוב.",
        );
      } finally {
        if (!cancelled) setIsCheckingOut(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("domain_paid");
        url.searchParams.delete("registrationId");
        window.history.replaceState({}, "", url.toString());
      }
    }

    void completeAfterPayment();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const registrationId = contactResult?.registrationId;
    if (!registrationId || registerResult?.success) return;

    let cancelled = false;

    async function loadQuote() {
      setIsQuoting(true);
      setRegisterError("");
      try {
        const nextQuote = await quoteDomainRegistration({
          registrationId,
          years: selectedYears,
          vatNumber: contact.vatNumber,
        });
        if (!cancelled) {
          setQuote(nextQuote);
          if (Array.isArray(nextQuote.options) && nextQuote.options.length) {
            const nextOptions = nextQuote.options.filter((year): year is DomainYears =>
              DEFAULT_DOMAIN_YEAR_OPTIONS.includes(year as DomainYears),
            );
            if (nextOptions.length) {
              setYearOptions(nextOptions);
              if (!nextOptions.includes(selectedYears)) {
                setSelectedYears(nextOptions[0]);
              }
            }
          }
        }
      } catch (requestError) {
        if (!cancelled) {
          setQuote(null);
          setRegisterError(
            requestError instanceof Error
              ? requestError.message
              : "טעינת מחיר הדומיין נכשלה",
          );
        }
      } finally {
        if (!cancelled) setIsQuoting(false);
      }
    }

    void loadQuote();
    return () => {
      cancelled = true;
    };
  }, [
    contactResult?.registrationId,
    selectedYears,
    registerResult?.success,
    contact.vatNumber,
  ]);

  function handleDomainNameChange(value: string) {
    const parsed = parseDomainInput(value, selectedTld);
    setDomainName(parsed.name);
    if (parsed.name && value.includes(".")) {
      setSelectedTld(parsed.tld);
    }
    setResult(null);
    setError("");
    setShowContactForm(false);
    setContactResult(null);
    setRegisterResult(null);
    setQuote(null);
  }

  function handleSelectTld(tld: DomainExtension) {
    const parsed = parseDomainInput(domainName, tld);
    setSelectedTld(tld);
    setDomainName(parsed.name);
    setResult(null);
    setError("");
    setShowContactForm(false);
    setContactResult(null);
    setRegisterResult(null);
    setQuote(null);
  }

  async function handleCheck() {
    if (isChecking || !fullDomain) return;

    setError("");
    setResult(null);
    setShowContactForm(false);
    setContactResult(null);
    setRegisterResult(null);
    setRegisterError("");
    setQuote(null);
    setIsChecking(true);

    try {
      const nextResult =
        await checkDomainAvailability(fullDomain);

      setResult(nextResult);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "בדיקת הדומיין נכשלה",
      );
    } finally {
      setIsChecking(false);
    }
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    void handleCheck();
  }

  async function handleCreateContact(event: React.FormEvent) {
    event.preventDefault();

    if (!canSubmitContact || isCreatingContact) return;

    setContactError("");
    setContactResult(null);
    setRegisterResult(null);
    setRegisterError("");
    setIsCreatingContact(true);

    try {
      const selectedDomain =
        result?.domain || fullDomain;

      const response = await createDomainContact({
        ...contact,

        domain: selectedDomain,

        country:
          contact.country
            .trim()
            .toUpperCase(),

        availability:
          result?.available,

        premium:
          result?.premium,

        currency:
          result?.currency ?? null,

        price:
          result?.price ?? null,

        reason:
          result?.reason ?? null,

        rawStatus:
          result?.rawStatus ?? null,

        brand: "default",
      });

      setContactResult(response);
      const options = yearOptionsForDomain(selectedDomain);
      setYearOptions(options);
      setSelectedYears(options[0] || 1);
      setQuote(null);
    } catch (requestError) {
      setContactError(
        requestError instanceof Error
          ? requestError.message
          : "יצירת איש הקשר נכשלה",
      );
    } finally {
      setIsCreatingContact(false);
    }
  }

  async function handlePayAndRegister() {
    if (!contactResult?.registrationId || isCheckingOut) return;

    setRegisterError("");
    setIsCheckingOut(true);

    try {
      const checkout = await checkoutDomainRegistration({
        registrationId: contactResult.registrationId,
        years: selectedYears,
        vatNumber: contact.vatNumber,
      });

      if (checkout.alreadyRegistered) {
        setRegisterResult({
          success: true,
          alreadyRegistered: true,
          domain: checkout.domain,
          registrationId: checkout.registrationId,
          status: checkout.status || "registered",
        });
        return;
      }

      if (!checkout.paymentUrl) {
        throw new Error("לא התקבל קישור לתשלום");
      }

      window.location.href = checkout.paymentUrl;
    } catch (requestError) {
      setRegisterError(
        requestError instanceof Error
          ? requestError.message
          : "מעבר לתשלום נכשל",
      );
      setIsCheckingOut(false);
    }
  }

  function updateContact(
    field: keyof ContactFormState,
    value: string,
  ) {
    setContact((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section
      dir="rtl"
      className="mx-auto w-full max-w-5xl"
    >
      <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(15,23,42,0.10)]">
        <div className="relative overflow-hidden border-b border-slate-100 px-6 py-7 md:px-9">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.14),transparent_56%),radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_52%)]" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-lg shadow-violet-200">
              <Globe2 className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">
                מציאת דומיין לעסק
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                הזינו שם דומיין, בחרו סיומת, ובדקו זמינות אמיתית לפני
                הרישום.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-7 md:px-9">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <span
                className="pointer-events-none absolute right-11 top-1/2 z-10 max-w-[6.5rem] -translate-y-1/2 truncate text-sm font-black text-slate-400"
                dir="ltr"
              >
                .{selectedTld}
              </span>

              <input
                value={domainName}
                onChange={(event) => {
                  handleDomainNameChange(event.target.value);
                }}
                placeholder="לדוגמה: mybusiness"
                dir="ltr"
                autoComplete="off"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-0 pl-5 pr-36 text-right text-base font-bold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking || !fullDomain}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-7 text-sm font-black text-slate-800 shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {isChecking ? (
                <>
                  <BizuplyLoader size="sm" compact />
                  בודק זמינות
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  בדיקת דומיין
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2" dir="rtl">
            {DOMAIN_EXTENSIONS.map((tld) => {
              const active = selectedTld === tld;
              return (
                <button
                  key={tld}
                  type="button"
                  onClick={() => handleSelectTld(tld)}
                  className={[
                    "inline-flex h-10 items-center rounded-full border px-4 text-sm font-bold transition",
                    active
                      ? "border-violet-400 bg-violet-50 text-violet-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  .{tld}
                </button>
              );
            })}
          </div>

          {fullDomain ? (
            <p className="mt-3 text-xs font-semibold text-slate-500" dir="ltr">
              ייבדק: {fullDomain}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            בדיקת הזמינות ורכישת דומיין מתבצעות בסביבת Production חיה.
          </div>

          {error ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : null}

          {result ? (
            <div
              className={[
                "mt-6 rounded-[28px] border p-5 md:p-6",
                result.available
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-amber-200 bg-amber-50/70",
              ].join(" ")}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {result.available ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-amber-600" />
                  )}

                  <div>
                    <p
                      className="text-xl font-black text-slate-800"
                      dir="ltr"
                    >
                      {result.domain}
                    </p>

                    <p
                      className={[
                        "mt-1 text-sm font-bold",
                        result.available
                          ? "text-emerald-700"
                          : "text-amber-700",
                      ].join(" ")}
                    >
                      {result.available
                        ? "הדומיין זמין לרישום"
                        : "הדומיין אינו זמין"}
                    </p>
                  </div>
                </div>

                {result.available ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactForm(true);
                      setContactError("");
                      setContactResult(null);
                    }}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    <UserRound className="h-4 w-4" />
                    המשך לרישום דומיין
                  </button>
                ) : null}
              </div>

              {result.premium ? (
                <p className="mt-4 text-sm font-bold text-amber-700">
                  זהו דומיין Premium וייתכן שיש לו מחיר מיוחד.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showContactForm ? (
        <div className="mt-7 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 md:px-9">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  פרטי איש קשר לרישום
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  הפרטים יישלחו ל־Realtime Register לרישום הדומיין.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowContactForm(false);
                setContactError("");
                setContactResult(null);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              aria-label="סגירה"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleCreateContact}
            className="px-6 py-7 md:px-9"
          >
            {!contactResult?.success ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="שם מלא"
                value={contact.name}
                onChange={(value) => updateContact("name", value)}
                placeholder="Israel Israeli"
                required
              />

              <Field
                label="שם העסק"
                value={contact.organization || ""}
                onChange={(value) =>
                  updateContact("organization", value)
                }
                placeholder="BizUply LLC"
              />

              <Field
                label="כתובת"
                value={contact.address}
                onChange={(value) => updateContact("address", value)}
                placeholder="1007 N Orange St."
                required
              />

              <Field
                label="שורת כתובת נוספת"
                value={contact.addressLine2 || ""}
                onChange={(value) =>
                  updateContact("addressLine2", value)
                }
                placeholder="אופציונלי"
              />

              <Field
                label="שורת כתובת שלישית"
                value={contact.addressLine3 || ""}
                onChange={(value) =>
                  updateContact("addressLine3", value)
                }
                placeholder="אופציונלי"
              />

              <Field
                label="עיר"
                value={contact.city}
                onChange={(value) => updateContact("city", value)}
                placeholder="Haifa"
                required
              />

              <Field
                label="מיקוד"
                value={contact.postalCode}
                onChange={(value) =>
                  updateContact("postalCode", value)
                }
                placeholder="1234567"
                required
              />

              <Field
                label="מדינה"
                value={contact.country}
                onChange={(value) => updateContact("country", value)}
                placeholder="IL"
                dir="ltr"
                required
              />

              <Field
                label="מחוז / אזור"
                value={contact.state || ""}
                onChange={(value) => updateContact("state", value)}
                placeholder="אופציונלי"
              />

              <Field
                label="אימייל"
                value={contact.email}
                onChange={(value) => updateContact("email", value)}
                placeholder="test@example.com"
                type="email"
                dir="ltr"
                required
              />

              <Field
                label="טלפון"
                value={contact.phone}
                onChange={(value) => updateContact("phone", value)}
                placeholder="0501234567"
                type="tel"
                dir="ltr"
                required
              />

              {requiresVat ? (
                <Field
                  label="מספר עוסק / ח.פ. / מע״מ"
                  value={contact.vatNumber || ""}
                  onChange={(value) => updateContact("vatNumber", value)}
                  placeholder="למשל 512345678"
                  dir="ltr"
                  required
                />
              ) : null}
            </div>
            ) : null}

            {!contactResult?.success ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
              <p className="text-xs font-semibold leading-6 text-slate-500">
                הזינו פרטי בעלים אמיתיים לרישום הדומיין. הפרטים נשלחים
                לרישום Production וישמשו כאיש קשר רשמי של הדומיין.
              </p>
            </div>
            ) : null}

            {contactError ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-bold">{contactError}</p>
              </div>
            ) : null}

            {contactResult?.success &&
            contactResult.registrationId &&
            !registerResult?.success ? (
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="min-w-0">
                  <h4 className="text-base font-black text-slate-900">
                    בחרו תקופת רישום והמשיכו לתשלום
                  </h4>
                  {requiresVat ? (
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      לדומייני .il נדרש מספר עוסק / ח.פ. / מע״מ, ותקופת רישום של
                      שנה או שנתיים בלבד.
                    </p>
                  ) : null}

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <h5 className="text-sm font-black text-slate-800">
                            בחירת תקופת רישום
                          </h5>
                          <div className="mt-3 grid gap-2">
                            {yearOptions.map((years) => {
                              const active = selectedYears === years;
                              return (
                                <button
                                  key={years}
                                  type="button"
                                  onClick={() => setSelectedYears(years)}
                                  className={[
                                    "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition",
                                    active
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300",
                                  ].join(" ")}
                                >
                                  <span>
                                    {years === 1 ? "שנה אחת" : `${years} שנים`}
                                  </span>
                                  {active ? (
                                    <span className="text-xs font-black text-emerald-700">
                                      נבחר
                                    </span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <h5 className="text-sm font-black text-slate-800">
                            סיכום
                          </h5>
                          <p className="mt-3 text-sm font-semibold text-slate-600">
                            {selectedYears === 1
                              ? "שנה אחת"
                              : `${selectedYears} שנים`}
                          </p>
                          <p className="mt-4 text-2xl font-black text-slate-900">
                            {isQuoting
                              ? "מחשב מחיר..."
                              : quote
                                ? formatIls(quote.price)
                                : "—"}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            תשלום מאובטח · חידוש שנתי לפי תנאי הרישום
                          </p>
                          <button
                            type="button"
                            onClick={() => void handlePayAndRegister()}
                            disabled={
                              isCheckingOut || isQuoting || !quote?.price
                            }
                            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isCheckingOut ? (
                              <>
                                <BizuplyLoader size="sm" compact />
                                מעביר לתשלום...
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-5 w-5" />
                                המשך לתשלום מאובטח
                              </>
                            )}
                          </button>
                        </div>
                  </div>
                </div>
              </div>
            ) : null}

            {registerError ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-bold">{registerError}</p>
              </div>
            ) : null}

            {registerResult?.success ? (
              <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                  <div>
                    <h4 className="text-base font-black text-emerald-900">
                      {registerResult.alreadyRegistered
                        ? "הדומיין כבר רשום"
                        : "הדומיין נרשם בהצלחה"}
                    </h4>
                    <p
                      className="mt-2 text-sm font-black text-slate-800"
                      dir="ltr"
                    >
                      {registerResult.domain}
                    </p>
                    {registerResult.registration?.expirationDate ? (
                      <p className="mt-2 text-xs font-semibold text-emerald-700">
                        תוקף עד:{" "}
                        {new Date(
                          registerResult.registration.expirationDate,
                        ).toLocaleDateString("he-IL")}
                      </p>
                    ) : null}
                    {registerResult.quote?.total != null ? (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        עלות משוערת: {registerResult.quote.total}{" "}
                        {registerResult.quote.currency || ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                חזרה
              </button>

              {!contactResult?.success ? (
                <button
                  type="submit"
                  disabled={!canSubmitContact || isCreatingContact}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-7 text-sm font-black text-slate-800 shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {isCreatingContact ? (
                    <>
                      <BizuplyLoader size="sm" compact />
                      יוצר איש קשר
                    </>
                  ) : (
                    <>
                      <UserRound className="h-5 w-5" />
                      יצירת איש קשר לרישום
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  dir?: "rtl" | "ltr";
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  dir = "rtl",
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-black text-slate-700">
        {label}
        {required ? (
          <span className="text-red-500">*</span>
        ) : null}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        dir={dir}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}