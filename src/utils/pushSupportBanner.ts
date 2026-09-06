import i18n from "../i18n/i18n";
import { isIos } from "./push";

export type PushSupportBannerKind = "ios-webview" | "ios-install" | "unsupported";

export function isIosWebkitBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!isIos()) return false;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|YaBrowser/i.test(
    navigator.userAgent
  );
}

export function resolvePushSupportBanner(input: {
  supported: boolean;
  ios: boolean;
  standalone: boolean;
  deviceCount: number;
}): { kind: PushSupportBannerKind; text: string } | null {
  if (!input.supported && input.ios) {
    const extra =
      input.deviceCount > 0
        ? ` ${i18n.t("leftover.pushBanner.alreadyActive")}`
        : "";
    return {
      kind: "ios-webview",
      text: i18n.t("leftover.pushBanner.iosSafari") + extra,
    };
  }

  if (!input.supported) {
    return {
      kind: "unsupported",
      text: i18n.t("leftover.pushBanner.unsupported"),
    };
  }

  if (input.ios && !input.standalone) {
    return {
      kind: "ios-install",
      text: i18n.t("leftover.pushBanner.iosInstall"),
    };
  }

  return null;
}

export function isPushOnFromServerOnly(input: {
  supported: boolean;
  master: boolean;
  entitled: boolean;
  deviceCount: number;
}): boolean {
  return (
    !input.supported &&
    input.master &&
    input.entitled &&
    input.deviceCount > 0
  );
}
