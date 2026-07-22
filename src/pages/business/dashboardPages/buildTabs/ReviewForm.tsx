"use client";

import React, { useMemo, useState } from "react";

import API from "@/api";
import Icon from "@/components/UI/Icon";

type RatingKey =
  | "experience"
  | "service"
  | "professional"
  | "timing"
  | "availability"
  | "value"
  | "goal";

type RatingConfig = {
  key: RatingKey;
  label: string;
  icon: string;
  required?: boolean;
};

type ReviewPayload = {
  _id?: string;
  rating?: number;
  averageScore?: number;
  comment?: string;
  ratings?: Record<string, number | undefined>;
  clientName?: string;
  clientEmail?: string;
  client?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
  date?: string;
  [key: string]: unknown;
};

type SocketLike = {
  emit?: (...args: unknown[]) => void;
};

type ReviewFormProps = {
  businessId: string;
  socket?: SocketLike | null;
  onSuccess?: (review?: ReviewPayload) => void | Promise<void>;
  defaultName?: string;
  defaultEmail?: string;
  layout?: "default" | "modal";
};

type FormState = {
  name: string;
  email: string;
  comment: string;
  ratings: Partial<Record<RatingKey, number>>;
};

const PRIMARY_FIELDS: RatingConfig[] = [
  {
    key: "experience",
    label: "חוויה כללית",
    icon: "overall",
    required: true,
  },
  {
    key: "service",
    label: "איכות השירות",
    icon: "service",
    required: true,
  },
  {
    key: "professional",
    label: "מקצועיות",
    icon: "professionalism",
    required: true,
  },
];

const OPTIONAL_FIELDS: RatingConfig[] = [
  {
    key: "timing",
    label: "עמידה בזמנים",
    icon: "timeliness",
  },
  {
    key: "availability",
    label: "זמינות",
    icon: "availability",
  },
  {
    key: "value",
    label: "תמורה למחיר",
    icon: "valueForMoney",
  },
  {
    key: "goal",
    label: "השגת מטרה",
    icon: "goalAchievement",
  },
];

function getAverage(ratings: Partial<Record<RatingKey, number>>) {
  const values = Object.values(ratings).filter(
    (value): value is number => typeof value === "number" && value > 0
  );

  if (!values.length) return 0;

  const total = values.reduce((sum, value) => sum + value, 0);

  return Math.round((total / values.length) * 10) / 10;
}

function getRatingLabel(value: number) {
  if (value >= 4.8) return "מצוין";
  if (value >= 4) return "מעולה";
  if (value >= 3) return "טוב";
  if (value >= 2) return "בסדר";
  if (value > 0) return "דורש שיפור";
  return "טרם דורג";
}

function StarRating({
  value = 0,
  onChange,
}: {
  value?: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const activeValue = hover || value;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = rating <= activeValue;

        return (
          <button
            key={rating}
            type="button"
            onMouseEnter={() => setHover(rating)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(rating)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(rating)}
            aria-label={`${rating} כוכבים`}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-2xl text-lg transition-all",
              "focus:outline-none focus:ring-4 focus:ring-amber-100",
              active
                ? "bg-amber-50 text-amber-500 shadow-sm ring-1 ring-amber-100"
                : "bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-amber-400",
            ].join(" ")}
          >
            ★
          </button>
        );
      })}

      {value > 0 && (
        <span className="mr-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function RatingRow({
  field,
  value,
  onChange,
}: {
  field: RatingConfig;
  value?: number;
  onChange: (key: RatingKey, value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Icon name={field.icon} size={18} />
          </div>

          <div className="min-w-0 text-right">
            <p className="text-sm font-black text-slate-800">
              {field.label}
              {field.required && <span className="text-violet-600"> *</span>}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              לחצו על הכוכבים לדירוג
            </p>
          </div>
        </div>

        <StarRating
          value={value || 0}
          onChange={(rating) => onChange(field.key, rating)}
        />
      </div>
    </div>
  );
}

export default function ReviewForm({
  businessId,
  socket,
  onSuccess,
  defaultName = "",
  defaultEmail = "",
  layout = "default",
}: ReviewFormProps) {
  const isModalLayout = layout === "modal";
  const [form, setForm] = useState<FormState>({
    name: defaultName,
    email: defaultEmail,
    comment: "",
    ratings: {},
  });

  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const average = useMemo(() => getAverage(form.ratings), [form.ratings]);

  const requiredReady = PRIMARY_FIELDS.every(
    (field) => typeof form.ratings[field.key] === "number"
  );

  const canSubmit =
    Boolean(businessId) &&
    form.name.trim().length >= 2 &&
    requiredReady &&
    !isSubmitting;

  const handleRatingChange = (key: RatingKey, value: number) => {
    setForm((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("יש למלא שם ואת כל הדירוגים הנדרשים.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");

    const reviewData = {
      businessId,
      clientName: form.name.trim(),
      clientEmail: form.email.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      comment: form.comment.trim(),
      rating: average,
      averageScore: average,
      ratings: {
        service: form.ratings.service,
        professionalism: form.ratings.professional,
        timeliness: form.ratings.timing,
        availability: form.ratings.availability,
        valueForMoney: form.ratings.value,
        goalAchievement: form.ratings.goal,
        overall: form.ratings.experience,
      },
    };

    try {
      const res = await API.post(`/business/${businessId}/reviews`, reviewData, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      const savedReview = res.data?.review || res.data;

      socket?.emit?.("review:new", {
        businessId,
        review: savedReview,
      });

      await onSuccess?.(savedReview);

      setForm({
        name: defaultName,
        email: defaultEmail,
        comment: "",
        ratings: {},
      });
      setShowMore(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "לא ניתן לשלוח את הביקורת. נסו שוב."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className={[
        "relative text-right text-slate-800",
        isModalLayout
          ? "flex max-h-full min-h-0 flex-col overflow-hidden bg-white"
          : "overflow-hidden rounded-[2rem] border border-violet-100 bg-white",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-fuchsia-100/60 blur-3xl" />

      <div className="relative shrink-0 border-b border-slate-100 p-6 sm:p-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-violet-700">
          <Icon name="rating" size={15} />
          ביקורת לקוח
        </div>

        <h3
          id="review-form-title"
          className="mt-4 text-3xl font-black tracking-tight text-slate-800"
        >
          כתיבת ביקורת
        </h3>

        <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">
          דרגו את החוויה ושתפו מה בולט. הביקורת שלכם עוזרת ללקוחות אחרים לבחור
          בביטחון.
        </p>
      </div>

      <div
        className={[
          "relative space-y-5 p-6 sm:p-7",
          isModalLayout ? "min-h-0 flex-1 overflow-y-auto overscroll-contain" : "",
        ].join(" ")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-800">
              השם שלכם *
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="השם שלכם"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-800">
              אימייל
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="you@example.com"
              dir="ltr"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-left text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>
        </div>

        <div className="space-y-3">
          {PRIMARY_FIELDS.map((field) => (
            <RatingRow
              key={field.key}
              field={field}
              value={form.ratings[field.key]}
              onChange={handleRatingChange}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100"
        >
          <span>
            {showMore ? "הסתרת פרטים נוספים" : "הוספת פרטים נוספים (אופציונלי)"}
          </span>
          <span className={showMore ? "rotate-180 transition" : "transition"}>
            ⌄
          </span>
        </button>

        {showMore && (
          <div className="space-y-3">
            {OPTIONAL_FIELDS.map((field) => (
              <RatingRow
                key={field.key}
                field={field}
                value={form.ratings[field.key]}
                onChange={handleRatingChange}
              />
            ))}
          </div>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-black text-slate-800">
            מה בולט במיוחד?
            <span className="font-bold text-slate-400"> אופציונלי</span>
          </span>

          <textarea
            value={form.comment}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                comment: event.target.value.slice(0, 300),
              }))
            }
            placeholder="שירות, יחס, תוצאות..."
            rows={5}
            maxLength={300}
            className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />

          <span className="mt-2 block text-left text-xs font-bold text-slate-400">
            {form.comment.length} / 300
          </span>
        </label>

        <div className="grid gap-4 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
            <Icon name="rating" size={22} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-800">ממוצע דירוג חי</p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              מחושב לפי הדירוגים שבחרתם
            </p>
          </div>

          <div className="text-right sm:text-left">
            <p className="text-3xl font-black text-violet-700">
              {average.toFixed(1)}
            </p>
            <p className="text-xs font-black text-slate-400">
              {getRatingLabel(average)}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}
      </div>

      <div
        className={[
          "relative flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7",
          isModalLayout ? "shrink-0" : "",
        ].join(" ")}
      >
        <p className="text-xs font-bold leading-5 text-slate-500">
          חובה: שם + חוויה כללית + שירות + מקצועיות.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-7 py-3 text-sm font-black text-black shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isSubmitting ? "שולח..." : "שליחת ביקורת"}
        </button>
      </div>
    </form>
  );
}
