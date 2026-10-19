import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getMetaLeadgenTos,
  type MetaLeadgenTosStatus,
} from "../../../../../api/metaCampaignsApi";
import { leadgenTosUrl } from "./leadgenTos";

type Props = {
  businessId: string | null;
  pageId: string;
  pageName?: string;
};

export default function LeadgenTosCard({ businessId, pageId, pageName }: Props) {
  const { t } = useTranslation();
  const c = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts);
  const [status, setStatus] = useState<MetaLeadgenTosStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(pageId);
  pageRef.current = pageId;
  const pageLabel = pageName || pageId;

  const load = useCallback(async () => {
    const requestedPageId = pageId;
    if (!businessId || !requestedPageId) {
      setStatus(null);
      return;
    }
    setLoading(true);
    try {
      const next = await getMetaLeadgenTos(businessId, requestedPageId);
      if (pageRef.current !== requestedPageId) return;
      if (next?.pageId && next.pageId !== requestedPageId) return;
      setStatus(next);
    } catch {
      if (pageRef.current !== requestedPageId) return;
      setStatus({
        success: false,
        pageId: requestedPageId,
        accepted: false,
        verified: false,
        status: "unavailable",
        tosUrl: leadgenTosUrl(requestedPageId),
      });
    } finally {
      if (pageRef.current === requestedPageId) setLoading(false);
    }
  }, [businessId, pageId]);

  useEffect(() => {
    setStatus(null);
  }, [pageId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onReturn = () => {
      if (document.visibilityState === "hidden") return;
      void load();
    };
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => {
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, [load]);

  const accepted = status?.accepted === true && status.verified === true;
  const tosUrl = status?.tosUrl || (pageId ? leadgenTosUrl(pageId) : "");
  const body = !pageId
    ? c("leadgenTosSelectPage")
    : loading && !status
      ? c("leadgenTosChecking")
      : status?.status === "accepted"
        ? c("leadgenTosAccepted", { page: pageLabel })
        : status?.status === "missing_permission"
          ? c("leadgenTosMissingPermission", { page: pageLabel })
          : status?.status === "demo"
            ? c("leadgenTosDemo")
            : status?.status === "unavailable"
              ? c("leadgenTosUnavailable", { page: pageLabel })
              : c("leadgenTosRequired", { page: pageLabel || c("facebookPage") });

  return (
    <div
      className="rounded-lg border border-[#CED0D4] bg-white px-3 py-3"
      data-testid="leadgen-tos-card"
      data-status={accepted ? "accepted" : status?.status || (pageId ? "loading" : "select-page")}
      data-page-id={pageId || ""}
    >
      <div className="flex items-start gap-2">
        {accepted ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#31A24C]" />
        ) : loading && !status ? (
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-[#65676B]" />
        ) : (
          <X className="mt-0.5 h-4 w-4 shrink-0 text-[#65676B]" />
        )}
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#050505]">
            {c("leadgenTosTitle")}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[#65676B]">{body}</p>
          {pageId && tosUrl && !accepted ? (
            <a
              href={tosUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="leadgen-tos-link"
              className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#1877F2] hover:underline"
            >
              {c("leadgenTosOpen")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {pageId ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="text-[13px] font-semibold text-[#1877F2] hover:underline disabled:opacity-60"
                onClick={() => void load()}
                disabled={loading}
              >
                {loading ? c("leadgenTosChecking") : c("leadgenTosRecheck")}
              </button>
              {!accepted ? (
                <span className="text-[12px] text-[#65676B]">{c("leadgenTosDraftOk")}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
