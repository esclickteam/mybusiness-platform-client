"use client";

import React, { useEffect, useMemo, useState } from "react";
import API from "@api";

type FaqItem = {
  _id?: string;
  id?: string;
  faqId?: string;
  question?: string;
  answer?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
};

type FaqTabProps = {
  faqs?: FaqItem[];
  setFaqs?: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  isPreview?: boolean;
  navigate?: (path: string) => void;
  businessId?: string;
};

type FaqFormState = {
  question: string;
  answer: string;
};

function getFaqId(faq: FaqItem, index: number) {
  return faq.faqId || faq._id || faq.id || `faq-${index}`;
}

export default function FaqTab({
  faqs = [],
  setFaqs = () => {},
  isPreview = false,
  navigate,
  businessId,
}: FaqTabProps) {
  const [openAnswers, setOpenAnswers] = useState<string[]>([]);
  const [newFaq, setNewFaq] = useState<FaqFormState>({
    question: "",
    answer: "",
  });
  const [editFaqId, setEditFaqId] = useState<string | null>(null);
  const [editedFaq, setEditedFaq] = useState<FaqFormState>({
    question: "",
    answer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof setFaqs !== "function") {
      console.error("❌ setFaqs is not a function", setFaqs);
    }
  }, [setFaqs]);

  const safeFaqs = useMemo(() => {
    return Array.isArray(faqs) ? faqs : [];
  }, [faqs]);

  const toggleAnswer = (id: string) => {
    setOpenAnswers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = newFaq.question.trim();
    const answer = newFaq.answer.trim();

    if (!question || !answer || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await API.post("/business/my/faqs", {
        question,
        answer,
      });

      const added: FaqItem = response.data?.faq ?? response.data;

      setFaqs((prev) => [added, ...(Array.isArray(prev) ? prev : [])]);
      setNewFaq({ question: "", answer: "" });

      const addedId = added.faqId || added._id || added.id;
      if (addedId) {
        setOpenAnswers((prev) => [String(addedId), ...prev]);
      }
    } catch (err) {
      console.error("❌ שגיאה בהוספת שאלה נפוצה:", err);
      alert("לא הצלחנו להוסיף את השאלה. נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const approved = window.confirm("למחוק את השאלה הזו?");
    if (!approved || deletingId) return;

    try {
      setDeletingId(id);

      await API.delete(`/business/my/faqs/${id}`);

      setFaqs((prev) =>
        (Array.isArray(prev) ? prev : []).filter((faq, index) => {
          return getFaqId(faq, index) !== id;
        })
      );

      setOpenAnswers((prev) => prev.filter((item) => item !== id));

      if (editFaqId === id) {
        setEditFaqId(null);
        setEditedFaq({ question: "", answer: "" });
      }
    } catch (err) {
      console.error("❌ שגיאה במחיקת שאלה נפוצה:", err);
      alert("לא הצלחנו למחוק את השאלה. נסה שוב.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (faq: FaqItem, id: string) => {
    setEditFaqId(id);
    setEditedFaq({
      question: faq.question || "",
      answer: faq.answer || "",
    });
  };

  const handleCancelEdit = () => {
    setEditFaqId(null);
    setEditedFaq({ question: "", answer: "" });
  };

  const handleSaveEdit = async (id: string) => {
    const question = editedFaq.question.trim();
    const answer = editedFaq.answer.trim();

    if (!question || !answer || savingEditId) return;

    try {
      setSavingEditId(id);

      const response = await API.put(`/business/my/faqs/${id}`, {
        question,
        answer,
      });

      const updated: FaqItem = response.data?.faq ?? response.data;

      setFaqs((prev) =>
        (Array.isArray(prev) ? prev : []).map((faq, index) => {
          return getFaqId(faq, index) === id ? updated : faq;
        })
      );

      setEditFaqId(null);
      setEditedFaq({ question: "", answer: "" });
      setOpenAnswers((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } catch (err) {
      console.error("❌ שגיאה בשמירת שאלה נפוצה:", err);
      alert("לא הצלחנו לשמור את השינויים. נסה שוב.");
    } finally {
      setSavingEditId(null);
    }
  };

  return (
    <div dir="rtl" className="w-full text-right">
      {!isPreview && (
        <div className="mb-6 rounded-[1.5rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-800">
                הוספת שאלה חדשה
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                הוסף שאלה ותשובה שיופיעו בפרופיל הציבורי של העסק.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm sm:flex">
              ❔
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-800">
                שאלה
              </label>

              <input
                type="text"
                value={newFaq.question}
                disabled={isSubmitting}
                placeholder="לדוגמה: איך קובעים תור?"
                onChange={(event) =>
                  setNewFaq((prev) => ({
                    ...prev,
                    question: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-800">
                תשובה
              </label>

              <textarea
                value={newFaq.answer}
                disabled={isSubmitting}
                rows={4}
                placeholder="כתוב כאן תשובה ברורה וקצרה ללקוחות..."
                onChange={(event) =>
                  setNewFaq((prev) => ({
                    ...prev,
                    answer: event.target.value,
                  }))
                }
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-7 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !newFaq.question.trim() ||
                !newFaq.answer.trim()
              }
              className="inline-flex h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? "מוסיף שאלה..." : "➕ הוספת שאלה"}
            </button>
          </form>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-800">
            שאלות ותשובות
          </h3>

          {!isPreview && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              כאן אפשר לערוך את השאלות שיופיעו בפרופיל הציבורי.
            </p>
          )}
        </div>

        <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
          {safeFaqs.length} שאלות
        </span>
      </div>

      {safeFaqs.length === 0 ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl shadow-sm">
            💬
          </div>

          <h4 className="mt-4 text-base font-black text-slate-800">
            עדיין אין שאלות נפוצות
          </h4>

          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            לאחר שתוסיף שאלות ותשובות, הן יופיעו כאן ובפרופיל הציבורי של העסק.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {safeFaqs.map((faq, index) => {
            const id = getFaqId(faq, index);
            const isOpen = openAnswers.includes(id);
            const isEditing = editFaqId === id;
            const isDeleting = deletingId === id;
            const isSavingEdit = savingEditId === id;

            return (
              <div
                key={id}
                className={[
                  "overflow-hidden rounded-[1.35rem] border bg-white shadow-sm transition",
                  isOpen
                    ? "border-violet-200 shadow-[0_16px_42px_rgba(124,58,237,0.10)]"
                    : "border-slate-100 hover:border-violet-100 hover:shadow-md",
                ].join(" ")}
              >
                {!isPreview && !isEditing && (
                  <div className="flex justify-end gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                    <button
                      type="button"
                      title="עריכה"
                      onClick={() => handleStartEdit(faq, id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm shadow-sm transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      title="מחיקה"
                      disabled={isDeleting}
                      onClick={() => handleDelete(id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "…" : "🗑️"}
                    </button>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-3 p-4">
                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-800">
                        שאלה
                      </label>

                      <input
                        value={editedFaq.question}
                        disabled={isSavingEdit}
                        onChange={(event) =>
                          setEditedFaq((prev) => ({
                            ...prev,
                            question: event.target.value,
                          }))
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black text-slate-800">
                        תשובה
                      </label>

                      <textarea
                        value={editedFaq.answer}
                        disabled={isSavingEdit}
                        rows={4}
                        onChange={(event) =>
                          setEditedFaq((prev) => ({
                            ...prev,
                            answer: event.target.value,
                          }))
                        }
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium leading-7 text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={
                          isSavingEdit ||
                          !editedFaq.question.trim() ||
                          !editedFaq.answer.trim()
                        }
                        onClick={() => handleSaveEdit(id)}
                        className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-slate-800 shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
                      >
                        {isSavingEdit ? "שומר..." : "💾 שמירה"}
                      </button>

                      <button
                        type="button"
                        disabled={isSavingEdit}
                        onClick={handleCancelEdit}
                        className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleAnswer(id)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-right transition hover:bg-violet-50/50"
                    >
                      <span className="text-sm font-black leading-7 text-slate-800 sm:text-base">
                        {faq.question || "שאלה ללא כותרת"}
                      </span>

                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition",
                          isOpen
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                        <p className="text-sm leading-7 text-slate-600">
                          {faq.answer || "לא נוספה תשובה לשאלה הזו."}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isPreview && safeFaqs.length > 0 && navigate && businessId && (
        <button
          type="button"
          onClick={() => navigate(`/business/${businessId}?tab=faq`)}
          className="mt-5 flex h-[52px] w-full items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 text-sm font-black text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
        >
          👀 צפייה בפרופיל הציבורי
        </button>
      )}
    </div>
  );
}