import type { PushPermission } from "./push";

export type PushToggleCopyKind =
  | "on-ready"
  | "on-unbound"
  | "on-other-context"
  | "need-rebind"
  | "blocked"
  | "unsupported"
  | "off";

export function resolvePushToggleCopy(input: {
  pushOn: boolean;
  serverReady: boolean;
  thisDeviceRegistered?: boolean | null;
  permission: PushPermission;
  subscribed: boolean;
  deviceCount: number;
  ios?: boolean;
}): { kind: PushToggleCopyKind; text: string } {
  if (input.permission === "denied") {
    return {
      kind: "blocked",
      text: "חסום בהגדרות הדפדפן/המכשיר",
    };
  }

  if (input.permission === "unsupported") {
    if (input.pushOn || input.deviceCount > 0) {
      return {
        kind: "on-other-context",
        text: `פעיל במכשיר מותקן · ${input.deviceCount} מכשיר רשום`,
      };
    }
    return {
      kind: "unsupported",
      text: input.ios
        ? "לא ניתן להפעיל מכאן — פתחו מ-Safari דרך האייקון במסך הבית"
        : "הדפדפן הזה לא תומך ב-Push",
    };
  }

  if (input.pushOn) {
    const bound =
      input.thisDeviceRegistered === true ||
      (input.thisDeviceRegistered !== false && input.serverReady);
    if (bound) {
      return {
        kind: "on-ready",
        text: `מופעל · ${input.deviceCount} מכשיר רשום`,
      };
    }
    return {
      kind: "on-unbound",
      text: "מופעל במכשיר, אבל עדיין לא רשום בשרת — לחץ בדיקה",
    };
  }

  if (input.permission === "granted" && !input.subscribed) {
    return {
      kind: "need-rebind",
      text: "יש הרשאה, אבל אין רישום במכשיר — לחץ לרישום מחדש",
    };
  }

  return {
    kind: "off",
    text: "כבוי — לחץ להפעלה לקבלת התראות לטלפון",
  };
}
