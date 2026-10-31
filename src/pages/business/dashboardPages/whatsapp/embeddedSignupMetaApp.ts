import type { WhatsAppEmbeddedSignupConfig } from "../../../../api/whatsappApi";
import type { WhatsAppConnectionPath } from "./embeddedSignupCoexistence";

export function resolveEmbeddedSignupMetaApp(
  signup: WhatsAppEmbeddedSignupConfig | null | undefined,
  path: WhatsAppConnectionPath
): { appId: string; configId: string } {
  if (path === "coexistence") {
    const appId = String(signup?.coexistence?.appId || "").trim();
    const configId = String(signup?.coexistence?.configId || "").trim();
    if (appId && configId) {
      return { appId, configId };
    }
  }
  return {
    appId: String(signup?.appId || "").trim(),
    configId: String(signup?.configId || "").trim(),
  };
}
