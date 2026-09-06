import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import StoreProductsManager from "../../components/store/StoreProductsManager";
import { getTextDirection } from "../../i18n/localeUtils";

export default function StoreProductsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <main
      dir={getTextDirection(i18n.language)}
      className="
        min-h-screen bg-[#F7F8FC]
        px-4 py-6
        md:px-8 md:py-8
      "
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className="
            mb-6 overflow-hidden rounded-[34px]
            border border-slate-200 bg-white
            p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]
            md:p-7
          "
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div
                className="
                  inline-flex items-center gap-2 rounded-full
                  bg-violet-50 px-4 py-2
                  text-xs font-black text-violet-700
                  ring-1 ring-violet-100
                "
              >
                <ShoppingBag size={15} />
                {t("leftover.store.badge", "Store management")}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
                {t("leftover.store.title", "Products, categories, and store settings")}
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
                {t(
                  "leftover.store.hint",
                  "Add products once. They are saved on the server, appear automatically in the store grid, and each product gets an automatic product page matching the design you choose."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                inline-flex h-12 items-center justify-center gap-2
                rounded-2xl border border-slate-200 bg-white
                px-5 text-sm font-black text-slate-700
                shadow-sm transition hover:bg-slate-50
              "
            >
              <ArrowRight size={17} />
              {t("leftover.store.backStudio", "Back to Studio")}
            </button>
          </div>
        </div>

        <StoreProductsManager />
      </div>
    </main>
  );
}
