"use client";

import React from "react";
import StoreProductsManager from "../../components/store/StoreProductsManager";

export default function StoreProductsPage() {
  return (
    <main
      dir="rtl"
      className="
        min-h-screen bg-[#F7F8FC]
        px-4 py-6
        md:px-8 md:py-8
      "
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 inline-flex rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700">
            ניהול חנות
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            מוצרים, קטגוריות והגדרות חנות
          </h1>

          <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
            כאן מוסיפים מוצרים פעם אחת. המוצרים נשמרים בשרת, מופיעים אוטומטית
            בגריד החנות באתר, וכל מוצר מקבל דף מוצר אוטומטי לפי העיצוב שבחרת.
          </p>
        </div>

        <StoreProductsManager />
      </div>
    </main>
  );
}