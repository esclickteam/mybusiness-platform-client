import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";

export default function CreateWebsiteMethodPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const base = `/business/${businessId}/dashboard/website`;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f5f6fb] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(base)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לאתרים שלי
        </button>

        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-slate-500">אתר חדש</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            איך תרצו לבנות את האתר?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            בחרו אם להתחיל מתבנית מוכנה, או לתת ל־AI לבנות עבורכם אתר מותאם
            לפי כמה שאלות קצרות.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`${base}/templates`)}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">תבנית מוכנה</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              בחרו עיצוב מוכן מהגלריה, והמשיכו ישר לעריכה מלאה בעורך Bizuply.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-violet-700">
              מעבר לתבניות ←
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`${base}/create/ai`)}
            className="group rounded-2xl border border-violet-200 bg-gradient-to-br from-white via-white to-violet-50 p-6 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">בנייה עם AI</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ענו על כמה שאלות — ה־AI יבחר מבנה, תוכן, עיצוב ו־SEO, ויפתח את
              האתר בעורך מוכן לעריכה.
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-violet-700">
              התחלת שאלון ←
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
