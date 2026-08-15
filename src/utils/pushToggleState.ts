import type { PushPermission } from "./push";

export type PushToggleCopyKind =
  | "on-ready"
  | "on-unbound"
  | "need-rebind"
  | "blocked"
  | "off";

export function resolvePushToggleCopy(input: {
  pushOn: boolean;
  serverReady: boolean;
  thisDeviceRegistered?: boolean | null;
  permission: PushPermission;
  subscribed: boolean;
  deviceCount: number;
}): { kind: PushToggleCopyKind; text: string } {
  if (input.permission === "denied") {
    return {
      kind: "blocked",
      text: "חסום בהגדרות הדפדפן/המכשיר",
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
