import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Globe2,
  Loader2,
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
  createOteDomainContact,
  type DomainAvailabilityResult,
  type DomainContactPayload,
  type DomainContactResult,
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
};

export default function DomainSearch() {
  const [domain, setDomain] = useState("");
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

  const canSubmitContact = useMemo(() => {
    return Boolean(
      contact.name.trim() &&
        contact.address.trim() &&
        contact.postalCode.trim() &&
        contact.city.trim() &&
        contact.country.trim() &&
        contact.email.trim() &&
        contact.phone.trim(),
    );
  }, [contact]);

  async function handleCheck() {
    if (isChecking || !domain.trim()) return;

    setError("");
    setResult(null);
    setShowContactForm(false);
    setContactResult(null);
    setIsChecking(true);

    try {
      const nextResult =
        await checkDomainAvailability(domain);

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
    setIsCreatingContact(true);

    try {
      const selectedDomain =
        result?.domain || domain;

      const response = await createOteDomainContact({
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
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200">
              <Globe2 className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                מציאת דומיין לעסק
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                בדקו זמינות דומיין, ולאחר מכן המשיכו ליצירת איש קשר
                ניסיוני ב־Realtime Register OT&amp;E.
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
              <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={domain}
                onChange={(event) => {
                  setDomain(event.target.value);
                  setResult(null);
                  setError("");
                  setShowContactForm(false);
                  setContactResult(null);
                }}
                placeholder="לדוגמה: mybusiness.co.il"
                dir="ltr"
                autoComplete="off"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 pr-12 text-left text-base font-bold text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking || !domain.trim()}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
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

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            התוצאה כרגע היא מסביבת OT&amp;E בלבד ואינה משקפת זמינות
            אמיתית ב־Production.
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
                      className="text-xl font-black text-slate-950"
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
                        ? "הדומיין זמין בסביבת הניסוי"
                        : "הדומיין אינו זמין בסביבת הניסוי"}
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
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black"
                  >
                    <UserRound className="h-4 w-4" />
                    המשך לרישום ניסיוני
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
                <h3 className="text-xl font-black text-slate-950">
                  פרטי איש קשר לניסוי
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  הפרטים יישלחו ל־Realtime Register OT&amp;E בלבד.
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="שם מלא"
                value={contact.name}
                onChange={(value) => updateContact("name", value)}
                placeholder="Test User"
                required
              />

              <Field
                label="שם העסק"
                value={contact.organization || ""}
                onChange={(value) =>
                  updateContact("organization", value)
                }
                placeholder="Bizuply Test"
              />

              <Field
                label="כתובת"
                value={contact.address}
                onChange={(value) => updateContact("address", value)}
                placeholder="1 Test Street"
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
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
              <p className="text-xs font-semibold leading-6 text-slate-500">
                בשלב הניסוי מומלץ להשתמש בפרטי בדיקה בלבד. אין להזין
                פרטי לקוח אמיתיים עד להשלמת תהליך Production, הרשאות
                ופרטיות.
              </p>
            </div>

            {contactError ? (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-bold">{contactError}</p>
              </div>
            ) : null}

            {contactResult?.success && contactResult.contact?.handle ? (
              <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />

                  <div>
                    <h4 className="text-base font-black text-emerald-900">
                      איש הקשר נוצר ונשמר בהצלחה
                    </h4>

                    <p className="mt-2 text-sm font-bold text-emerald-700">
                      Contact Handle:
                    </p>

                    <code
                      className="mt-2 block break-all rounded-xl bg-white px-3 py-2 text-left text-sm font-black text-slate-800 ring-1 ring-emerald-200"
                      dir="ltr"
                    >
                      {contactResult.contact.handle}
                    </code>

                    {contactResult.registrationId ? (
                      <>
                        <p className="mt-3 text-sm font-bold text-emerald-700">
                          מזהה רישום במערכת:
                        </p>

                        <code
                          className="mt-2 block break-all rounded-xl bg-white px-3 py-2 text-left text-sm font-black text-slate-800 ring-1 ring-emerald-200"
                          dir="ltr"
                        >
                          {contactResult.registrationId}
                        </code>
                      </>
                    ) : null}

                    {contactResult.domain ? (
                      <p className="mt-3 text-xs font-semibold text-emerald-700">
                        הדומיין {contactResult.domain} נשמר ב־MongoDB
                        בסטטוס {contactResult.status || "contact_created"}.
                      </p>
                    ) : null}

                    <p className="mt-3 text-xs font-semibold text-emerald-700">
                      השלב הבא יהיה להשתמש ב־handle הזה כ־registrant
                      לרישום הדומיין הניסיוני.
                    </p>
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

              <button
                type="submit"
                disabled={!canSubmitContact || isCreatingContact}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {isCreatingContact ? (
                  <>
                    <BizuplyLoader size="sm" compact />
                    יוצר איש קשר
                  </>
                ) : (
                  <>
                    <UserRound className="h-5 w-5" />
                    יצירת איש קשר ניסיוני
                  </>
                )}
              </button>
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