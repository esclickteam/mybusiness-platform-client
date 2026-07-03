import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MonitorSmartphone, Sparkles } from "lucide-react";

import AelinePages from "./pages";

export default function AelinePreview() {
  const navigate = useNavigate();

  function handleUseTemplate() {
    localStorage.setItem("bizuply-selected-template-id", "aeline");
    navigate(`/dashboard/website?templateId=aeline`);
  }

  return (
    <main className="min-h-screen bg-[#f4f1e9] p-4 text-black">
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-center justify-between gap-4 rounded-[28px] border border-black/10 bg-white px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-[-0.06em]">
                Aeline
              </h1>
              <p className="truncate text-xs font-bold text-black/45">
                AI consulting website template
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseTemplate}
            className="inline-flex h-12 shrink-0 items-center gap-3 rounded-full bg-black px-6 text-sm font-black text-white transition hover:bg-[#3dff88] hover:text-black"
          >
            השתמשי בתבנית
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <section className="overflow-hidden rounded-[34px] border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-black/40">
              <MonitorSmartphone className="h-4 w-4" />
              Preview
            </div>
          </div>

          <div className="h-[calc(100vh-180px)] overflow-y-auto bg-[#f4f1e9]">
            <AelinePages />
          </div>
        </section>
      </div>
    </main>
  );
}