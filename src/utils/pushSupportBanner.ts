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
        ? " ההתראות כבר פעילות מהאייקון במסך הבית."
        : "";
    return {
      kind: "ios-webview",
      text:
        "באייפון Push עובד רק מ-Safari אחרי הוספה למסך הבית, ואז פתיחה מהאייקון. Chrome/Edge באייפון לא תומכים." +
        extra,
    };
  }

  if (!input.supported) {
    return {
      kind: "unsupported",
      text: "הדפדפן לא תומך בהתראות Push. נסה/י Chrome / Edge / Firefox מעודכן.",
    };
  }

  if (input.ios && !input.standalone) {
    return {
      kind: "ios-install",
      text: "באייפון חייבים להתקין את BizUply למסך הבית (Safari → שיתוף → הוסף למסך הבית) ואז לפתוח מהאייקון — אחרת Push לטלפון לא יעבוד.",
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
