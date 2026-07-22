"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@api";
import FaqTab from "../FaqTab";
import BizuplyLoader from "../../../../../components/ui/BizuplyLoader";

type FaqItem = {
  _id?: string;
  id?: string;
  question?: string;
  answer?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
};

type CurrentUser = {
  _id?: string;
  id?: string;
  businessId?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
};

type FaqSectionProps = {
  currentUser?: CurrentUser | null;
  renderTopBar?: () => React.ReactNode;
};

type FaqTabSetFaqs = React.Dispatch<React.SetStateAction<FaqItem[]>>;

export default function FaqSection({
  currentUser = null,
  renderTopBar,
}: FaqSectionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadFaqs() {
      try {
        setIsLoading(true);

        const res = await API.get("/business/my/faqs");

        const faqsArr: FaqItem[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.faqs)
            ? res.data.faqs
            : [];

        if (isMounted) {
          setFaqs(faqsArr);
        }
      } catch (err) {
        console.error("❌ שגיאה בטעינת שאלות נפוצות:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFaqs();

    return () => {
      isMounted = false;
    };
  }, []);

  const businessId =
    currentUser?.businessId || currentUser?._id || currentUser?.id || "";

  const hasFaqs = faqs.length > 0;

  const previewFaqs = useMemo(() => {
    return faqs.slice(0, 4);
  }, [faqs]);

  const typedSetFaqs = setFaqs as FaqTabSetFaqs;

  return (
    <section
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.02fr_0.98fr]">
        {/* EDIT */}
        <div className="order-1 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-white via-violet-50 to-blue-50 px-6 py-8 sm:px-8">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-300/35 blur-3xl" />
            <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  ניהול שאלות נפוצות
                </div>

                <div className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                  תצוגה חיה בזמן אמת
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    שאלות נפוצות
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    הוסף תשובות לשאלות נפוצות של לקוחות והפוך את הפרופיל
                    לברור, מקצועי ואמין יותר.
                  </p>
                </div>

                <div className="w-full rounded-2xl border border-white bg-white/85 px-5 py-4 shadow-lg backdrop-blur sm:w-auto">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    סה״כ שאלות
                  </p>

                  <p className="mt-1 text-3xl font-black text-slate-950">
                    {faqs.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            {isLoading ? (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-slate-100 bg-white text-center shadow-sm">
                <BizuplyLoader size="lg" />

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  טוען שאלות נפוצות…
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  השאלות והתשובות שלך נטענות.
                </p>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">
                      ניהול שאלות ותשובות
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      הוסף, ערוך או מחק שאלות שיופיעו בפרופיל הציבורי.
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                    {faqs.length} שאלות
                  </span>
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                  <FaqTab
                    faqs={faqs}
                    setFaqs={typedSetFaqs}
                    isPreview={false}
                    navigate={navigate}
                    businessId={businessId}
                  />
                </div>
              </div>
            )}

            {!isLoading && !hasFaqs && (
              <div className="rounded-[1.75rem] border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                  ❔
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  התחל עם השאלה הנפוצה הראשונה
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                  הוסף שאלות על מחירים, שעות פעילות, תהליך הזמנה, ביטולים,
                  מיקום או כל דבר שלקוחות שואלים בדרך כלל.
                </p>
              </div>
            )}

            {hasFaqs && businessId && (
              <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => navigate(`/business/${businessId}?tab=faq`)}
                  className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5"
                >
                  צפייה בפרופיל הציבורי
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW */}
        <aside className="order-2">
          <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            {renderTopBar && (
              <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
                {renderTopBar()}
              </div>
            )}

            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.14),transparent_32%)]" />

              <div className="relative p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-violet-700">
                      תצוגה מקדימה של הפרופיל הציבורי
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      שאלות ותשובות
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl text-white shadow-lg shadow-violet-500/20">
                    ❔
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.7rem] border border-white/80 bg-white shadow-2xl">
                  <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50 px-5 py-7 text-slate-950">
                    <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-violet-300/30 blur-3xl" />
                    <div className="absolute -bottom-20 right-12 h-52 w-52 rounded-full bg-blue-300/25 blur-3xl" />

                    <div className="relative">
                      <div className="inline-flex rounded-full border border-violet-100 bg-white/80 px-3 py-1 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
                        תצוגה מקדימה חיה
                      </div>

                      <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                        שאלות ותשובות
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        כך אזור השאלות והתשובות יופיע ללקוחות בפרופיל העסקי.
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            שאלות
                          </p>

                          <p className="mt-1 text-2xl font-black text-slate-950">
                            {faqs.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                            סטטוס
                          </p>

                          <p className="mt-1 text-lg font-black text-slate-950">
                            {hasFaqs ? "פעיל" : "ריק"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-950">
                          מה לקוחות שואלים
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          כאן יוצגו השאלות הנפוצות שיעזרו ללקוחות להבין את
                          השירותים מהר יותר.
                        </p>
                      </div>

                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-black",
                          hasFaqs
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {hasFaqs ? "פעיל" : "ריק"}
                      </span>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                      {isLoading ? (
                        <div className="flex min-h-64 flex-col items-center justify-center text-center">
                          <BizuplyLoader size="lg" />

                          <p className="mt-4 text-sm font-bold text-slate-500">
                            טוען שאלות נפוצות…
                          </p>
                        </div>
                      ) : hasFaqs ? (
                        <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-sm">
                          <FaqTab
                            faqs={previewFaqs}
                            setFaqs={typedSetFaqs}
                            isPreview={true}
                            navigate={navigate}
                            businessId={businessId}
                          />
                        </div>
                      ) : (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl shadow-sm">
                            💬
                          </div>

                          <h3 className="mt-4 text-lg font-black text-slate-950">
                            עדיין אין שאלות נפוצות
                          </h3>

                          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                            הוסף שאלות ותשובות נפוצות כדי לעזור ללקוחות להבין
                            את השירותים שלך מהר יותר.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          שאלות
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {faqs.length}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                          סטטוס
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-950">
                          {hasFaqs ? "פעיל" : "ריק"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}