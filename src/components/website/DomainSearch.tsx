import React, { useState } from "react";
import {
  CheckCircle2,
  Globe2,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import {
  checkDomainAvailability,
  type DomainAvailabilityResult,
} from "@/services/domainService";

export default function DomainSearch() {
  const [domain, setDomain] = useState("");
  const [result, setResult] =
    useState<DomainAvailabilityResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    if (isChecking) return;

    setError("");
    setResult(null);
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void handleCheck();
  }

  return (
    <section
      dir="rtl"
      className="mx-auto w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] md:p-9"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200">
          <Globe2 className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            מציאת דומיין לעסק
          </h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            חפשו כתובת זמינה לאתר. כרגע הבדיקה מתבצעת
            בסביבת הניסוי OT&amp;E.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={domain}
            onChange={(event) => {
              setDomain(event.target.value);
              setResult(null);
              setError("");
            }}
            placeholder="לדוגמה: mybusiness.co.il"
            dir="ltr"
            autoComplete="off"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 pr-12 text-left text-base font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <button
          type="submit"
          disabled={isChecking || !domain.trim()}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
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

      {error ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      ) : null}

      {result ? (
        <div
          className={[
            "mt-5 rounded-3xl border p-5",
            result.available
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            {result.available ? (
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            ) : (
              <XCircle className="h-7 w-7 text-amber-600" />
            )}

            <div>
              <p className="text-lg font-black text-slate-950" dir="ltr">
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

          {result.premium ? (
            <p className="mt-4 text-sm font-bold text-amber-700">
              זהו דומיין Premium וייתכן שיש לו מחיר מיוחד.
            </p>
          ) : null}

          {result.available ? (
            <button
              type="button"
              disabled
              className="mt-5 h-12 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white opacity-50"
              title="הרישום יתווסף בשלב הבא"
            >
              המשך לרישום ניסיוני
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}