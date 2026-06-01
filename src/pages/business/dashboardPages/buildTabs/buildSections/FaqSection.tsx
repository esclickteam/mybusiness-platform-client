"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@api";
import FaqTab from "../FaqTab";

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
        console.error("❌ Error loading FAQs:", err);
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

  const typedSetFaqs = setFaqs as unknown as () => void;

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      {/* PREVIEW */}
      <aside className="order-2 xl:order-1">
        <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          {renderTopBar && (
            <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
              {renderTopBar()}
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-white/75 backdrop-blur">
                    Public profile preview
                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    Questions & Answers
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    This is how your FAQ section will appear to customers.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-xl backdrop-blur">
                  ❔
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    FAQs
                  </p>
                  <p className="mt-1 text-2xl font-black">{faqs.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    Status
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {hasFaqs ? "Active" : "Empty"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
                {isLoading ? (
                  <div className="flex min-h-64 flex-col items-center justify-center text-center">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                    <p className="mt-4 text-sm font-bold text-white/70">
                      Loading FAQs…
                    </p>
                  </div>
                ) : hasFaqs ? (
                  <div className="rounded-[1.25rem] bg-white text-slate-950 shadow-xl">
                    <FaqTab
                      faqs={previewFaqs}
                      setFaqs={typedSetFaqs}
                      isPreview={true}
                      navigate={navigate}
                      businessId={businessId}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-white/20 bg-white/10 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                      💬
                    </div>

                    <h3 className="mt-4 text-lg font-black">No FAQs yet</h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                      Add common questions and answers to help customers
                      understand your services faster.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* EDIT */}
      <div className="order-1 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-2">
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50 px-6 py-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-black text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            FAQ Manager
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Frequently Asked Questions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Add answers to common customer questions and make your profile
                feel clear, professional and trustworthy.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Total Questions
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {faqs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          {isLoading ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-[1.75rem] border border-slate-100 bg-slate-50 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

              <h3 className="mt-5 text-lg font-black text-slate-950">
                Loading FAQs…
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your questions and answers are loading.
              </p>
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/70 p-4 shadow-sm sm:p-5">
              <FaqTab
                faqs={faqs}
                setFaqs={typedSetFaqs}
                isPreview={false}
                navigate={navigate}
                businessId={businessId}
              />
            </div>
          )}

          {!isLoading && !hasFaqs && (
            <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
                ❔
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-950">
                Start with your first FAQ
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add questions about prices, working hours, booking process,
                cancellations, location or anything customers usually ask.
              </p>
            </div>
          )}

          {hasFaqs && businessId && (
            <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-white/80 bg-white/85 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <button
                type="button"
                onClick={() => navigate(`/business/${businessId}?tab=faq`)}
                className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                View Public Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}