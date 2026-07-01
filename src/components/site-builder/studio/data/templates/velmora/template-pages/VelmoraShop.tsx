import React from "react";
import type { VelmoraPageId } from "../pages";

type Props = {
  onPageChange: (page: VelmoraPageId) => void;
};

export default function VelmoraShop({ onPageChange }: Props) {
  return (
    <main className="min-h-screen bg-[#f6f2ea] px-5 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <h1 className="[font-family:Georgia,serif] text-6xl">חנות</h1>
        <p className="mt-4 text-black/55">כאן נבנה את עמוד כל המוצרים.</p>

        <button
          type="button"
          onClick={() => onPageChange("home")}
          className="mt-8 border-b border-black"
        >
          חזרה לעמוד הבית
        </button>
      </div>
    </main>
  );
}