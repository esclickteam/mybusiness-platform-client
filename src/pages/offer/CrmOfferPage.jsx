import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Users,
  ClipboardList,
  Filter,
  History,
  StickyNote,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";

const CRM_FEATURES = [
  { icon: ClipboardList, label: "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ-pipeline 뿯ֽ뿯ֽ뿯ֽ" },
  { icon: Users, label: "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ/뿯ֽ뿯ֽ뿯ֽ뿯ֽ" },
  { icon: StickyNote, label: "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ, 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ" },
  { icon: Filter, label: "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ" },
  { icon: History, label: "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ CRM" },
  { icon: LayoutDashboard, label: "뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ CRM" },
];

/**
 * Hidden private offer page for the CRM-only plan (89뿯₽/mo).
 *
 * Reachable ONLY via a direct link (/offer/crm) that we hand out to specific
 * leads. It is intentionally NOT linked anywhere public (nav / footer /
 * pricing / sitemap) and is marked noindex,nofollow.
 */
export default function CrmOfferPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = user?._id || user?.userId || user?.id;

  const startCheckout = async () => {
    setError("");

    // Not logged in 뿯↽ use the existing secure signup-first checkout flow.
    if (!userId) {
      navigate("/register?plan=crm_only");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/stripe/create-checkout-session", {
        plan: "crm_only",
      });
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }
      setError("뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ. 뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ.");
    } catch (err) {
      const code = err?.response?.data?.code;
      if (code === "SUBSCRIPTION_ALREADY_ACTIVE") {
        setError(
          "뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ. 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ."
        );
      } else {
        setError(
          err?.response?.data?.error ||
            "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ. 뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12"
    >
      <Helmet>
        <title>CRM 뿯ֽ뿯ֽ뿯ֽ뿯ֽ — BizUply</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>

      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-sm font-bold text-emerald-700">
            뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ
          </span>
          <h1 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
            CRM 뿯ֽ뿯ֽ뿯ֽ뿯ֽ
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ.
          </p>

          <div className="mt-6 flex items-end justify-center gap-2">
            <span className="text-5xl font-black text-slate-900">89 뿯₽</span>
            <span className="mb-2 text-lg font-semibold text-slate-500">
              / 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ.
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {CRM_FEATURES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {label}
              </span>
              <Check
                size={18}
                className="ms-auto text-emerald-500"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={startCheckout}
          disabled={loading}
          className="mt-8 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ…" : "뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ CRM"}
        </button>

        <p className="mt-4 text-center text-xs font-medium text-slate-400">
          뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ Stripe 뿯½ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ뿯ֽ 뿯ֽ뿯ֽ.
        </p>
      </div>
    </div>
  );
}
