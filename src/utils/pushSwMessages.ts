export const SW_SCOPE = "/";
export const SW_SCRIPT_VERSION = 8;
export const SW_URL = `/service-worker.js?v=${SW_SCRIPT_VERSION}`;

export function shouldForceRebindOnSwMessage(type: unknown): boolean {
  // Browser rotated the endpoint. Do not force-rebind on SW_ACTIVATED —
  // that is what orphaned the live iPhone token in v7.
  return type === "PUSH_SUBSCRIPTION_CHANGED";
}
