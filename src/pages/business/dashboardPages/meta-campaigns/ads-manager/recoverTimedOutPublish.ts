import type { MetaCampaignPublishRecord, MetaPublishResult } from "../../../../../api/metaCampaignsApi";

export function isPublishTimeoutError(error: unknown): boolean {
  const err = error as {
    isTimeout?: boolean;
    code?: string;
    message?: string;
    response?: { data?: { code?: string } };
  };
  if (err?.isTimeout) return true;
  const code = String(err?.code || err?.response?.data?.code || "");
  if (
    code === "NETWORK_TIMEOUT" ||
    code === "ECONNABORTED" ||
    code === "META_TIMEOUT" ||
    code === "LEADGEN_TOS_UNVERIFIED" ||
    code === "PUBLISH_IN_PROGRESS"
  ) {
    return true;
  }
  return /timeout of \d+ms|Network timeout|חרגה ממגבלת הזמן/i.test(
    String(err?.message || "")
  );
}

export function publishRecordToResult(
  publish: MetaCampaignPublishRecord
): MetaPublishResult {
  return {
    success: Boolean(publish.metaAdId) && publish.publishStatus === "submitted",
    campaignId: publish.metaCampaignId || "",
    adSetId: publish.metaAdSetId || "",
    creativeId: publish.metaCreativeId || "",
    adId: publish.metaAdId || "",
    status: publish.displayStatus || publish.metaEffectiveStatus || "",
    effectiveStatus: publish.metaEffectiveStatus,
    configuredStatus: publish.metaConfiguredStatus,
    adsManagerUrl: publish.adsManagerUrl,
    publish,
  };
}

export async function recoverTimedOutPublish(
  error: unknown,
  resumeId: string,
  wait: (publishId: string) => Promise<MetaCampaignPublishRecord | null | undefined>
): Promise<MetaPublishResult> {
  if (!resumeId || !isPublishTimeoutError(error)) {
    throw error;
  }
  const waited = await wait(resumeId);
  if (!waited) throw error;
  if (waited.publishStatus === "submitted" && waited.metaAdId) {
    return publishRecordToResult(waited);
  }
  if (
    waited.publishStatus === "failed" ||
    waited.publishStatus === "partial_failed"
  ) {
    const failed = new Error(
      waited.lastError || waited.lastMetaErrorMessage || "Publish failed"
    ) as Error & {
      response?: { data?: { error?: string; publish?: MetaCampaignPublishRecord; failedStage?: string; code?: string } };
    };
    failed.response = {
      data: {
        error: waited.lastError || waited.lastMetaErrorMessage,
        publish: waited,
        failedStage: waited.failedStage,
        code: waited.lastMetaErrorCode || "PUBLISH_FAILED",
      },
    };
    throw failed;
  }
  throw error;
}
