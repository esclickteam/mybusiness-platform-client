export const LEADGEN_TOS_URL = "https://www.facebook.com/ads/leadgen/tos";

export function leadgenTosUrl(pageId: string) {
  const id = pageId.trim();
  if (!id) return LEADGEN_TOS_URL;
  const url = new URL(LEADGEN_TOS_URL);
  url.searchParams.set("page_id", id);
  return url.toString();
}

export function leadgenTosBlocksPublish(status?: {
  demoSafe?: boolean;
  verified?: boolean;
  accepted?: boolean;
  status?: string;
} | null) {
  if (!status || status.demoSafe) return false;
  if (status.status === "unavailable") return false;
  return !(
    status.verified === true &&
    status.accepted === true &&
    status.status === "accepted"
  );
}
