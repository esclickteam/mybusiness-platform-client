import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { acceptSiteInvite, getSiteInvite } from "../api/mySitesApi";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import { getTextDirection } from "../i18n/localeUtils";

export default function WebsiteInviteAcceptPage() {
  const { token = "" } = useParams<{ token: string }>();
  const { user, initialized } = useAuth() as {
    user: { businessId?: string; role?: string } | null;
    initialized: boolean;
  };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [invite, setInvite] = useState<{
    toEmail: string;
    mode: "share" | "transfer";
    role?: "editor" | "viewer";
  } | null>(null);
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [siteName, setSiteName] = useState("");
  const [done, setDone] = useState(false);
  const siteFallback = t("leftover.invite.siteFallback", "the website");

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/website-invite/${token}`)}`, {
        replace: true,
      });
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSiteInvite(token);
        if (!alive) return;
        setInvite(data.invite);
        setSiteName(data.site?.name || siteFallback);
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || t("leftover.invite.loadFailed", "Could not load the invitation"));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [initialized, user, token, navigate]);

  async function handleAccept() {
    try {
      setAccepting(true);
      setError("");
      const result = await acceptSiteInvite(token);
      setDone(true);

      const businessId = result.site?.businessId || user?.businessId;
      if (businessId) {
        window.setTimeout(() => {
          navigate(`/business/${businessId}/dashboard/website`, { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || t("leftover.invite.acceptFailed", "Could not accept the invitation"));
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div
      dir={pageDir}
      className="flex min-h-screen items-center justify-center bg-[#f5f6fb] px-4 py-10"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          {t("leftover.invite.title", "Website invitation on Bizuply")}
        </h1>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
            <BizuplyLoader size="sm" compact />
            {t("leftover.invite.loading", "Loading invitation...")}
          </div>
        ) : error && !invite ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-3 text-sm text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
            <Link
              to="/"
              className="inline-flex text-sm font-semibold text-slate-700 hover:underline"
            >
              {t("leftover.invite.home", "Back to home")}
            </Link>
          </div>
        ) : done ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {t("leftover.invite.accepted", "The invitation was accepted. Taking you to My websites...")}
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-slate-600">
              {t("leftover.invite.invitedTo", "You were invited to {{name}}", {
                name: siteName || siteFallback,
              })}
              {invite?.toEmail ? (
                <>
                  {" "}
                  {t("leftover.invite.forEmail", "for {{email}}", { email: invite.toEmail })}
                </>
              ) : null}
              .
            </p>

            <div className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
              {invite?.mode === "transfer" ? (
                <p>
                  {t(
                    "leftover.invite.transfer",
                    "This is a full ownership transfer — after you accept, the site will appear only in your account."
                  )}
                </p>
              ) : (
                <p>
                  {t("leftover.invite.share", "This is an additional share — you will get {{role}} access to the site.", {
                    role:
                      invite?.role === "viewer"
                        ? t("leftover.invite.viewer", "view")
                        : t("leftover.invite.editor", "edit"),
                  })}
                </p>
              )}
            </div>

            {error ? (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-4 py-2.5 text-sm font-semibold text-black hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50 disabled:opacity-60"
            >
              {accepting ? <BizuplyLoader size="xs" compact /> : null}
              {t("leftover.invite.accept", "Accept invitation")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}