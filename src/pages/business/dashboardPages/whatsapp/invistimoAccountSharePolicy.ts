import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

export const INVISTIMO_SHARE_PORTFOLIO_ID = "2915799725325699";
export const INVISTIMO_SHARE_WABA_ID = "1042912532080617";
export const INVISTIMO_SHARE_PHONE_NUMBER_ID = "1325815400610124";
export const STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID = "976924655507470";
/** Shared production Embedded Signup config. Coexistence and other customers stay on it. */
export const PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID = "1057504196895353";
/** Account-share config diagnosed for the existing INVISTIMO number. Not used by other customers. */
export const INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID = "1873773577318198";
export const INVISTIMO_SHARE_E164 = "+972515953390";
export const INVISTIMO_SHARE_CONFIRM_PHRASE =
  "SHARE_INVISTIMO_WHATSAPP_ACCOUNT_WITH_BIZUPLY";

export const INVISTIMO_SHARE_ALLOWED_EVENT = "FINISH";

export const INVISTIMO_SHARE_ABORT_EVENTS = [
  "FINISH_OBO_MIGRATION",
  "FINISH_ONLY_WABA",
  "CANCEL",
  "ERROR",
] as const;

const ABORT_SCREEN_HINTS = [
  /transfer ownership/i,
  /change (your )?partner/i,
  /migrate (your )?(number|phone)/i,
  /alternate (bsp|provider)/i,
  /re-?register/i,
  /create (a )?new (whatsapp|business) account/i,
  /new phone number/i,
  /disable (two.factor|2fa)/i,
  /verify (a )?new number/i,
];

export function isInvistimoShareTenant(businessId?: string | null): boolean {
  return String(businessId || "").trim() === INVISTIMO_BUSINESS_ID;
}

type ServerShareExtras = Record<string, unknown>;

function readObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(source: Record<string, unknown> | null, key: string): string {
  const value = source?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function serverShareExtrasFromSignup(signup: {
  extras?: unknown;
  invistimoAccountShare?: { extras?: unknown } | null;
} | null | undefined): ServerShareExtras | null {
  return (
    readObject(signup?.invistimoAccountShare?.extras) ||
    readObject(signup?.extras)
  );
}

export function serverShareExtrasMatchInvistimo(extras: ServerShareExtras | null): boolean {
  const setup = readObject(extras?.setup);
  const business = readObject(setup?.business);
  const phone = readObject(business?.phone);
  const waba = readObject(setup?.whatsAppBusinessAccount);
  const preverified = readObject(setup?.preVerifiedPhone);
  const ids = Array.isArray(preverified?.ids)
    ? preverified.ids.map((id) => String(id || "").replace(/\D/g, "")).filter(Boolean)
    : [];
  if (ids.length !== 1 || ids[0] !== INVISTIMO_SHARE_PHONE_NUMBER_ID) return false;
  if (ids.includes(STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID)) return false;
  if (readString(waba, "id") !== INVISTIMO_SHARE_WABA_ID) return false;
  if (readString(business, "id") !== INVISTIMO_SHARE_PORTFOLIO_ID) return false;
  const display = String(phone?.number || "").replace(/\D/g, "");
  if (display && !display.endsWith("515953390")) return false;
  if (readString(extras, "sessionInfoVersion") !== "3") return false;
  return true;
}

/**
 * The production config is the shared coexistence configuration.
 * The INVISTIMO share screen uses the v4 account-share configuration instead.
 * Every other customer keeps the config id the server returned.
 */
export function selectInvistimoShareConfigId(serverConfigId?: string | null):
  | { ok: true; configId: string }
  | { ok: false; reason: "config_unrecognized" } {
  const id = String(serverConfigId || "").trim();
  if (
    id === INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID ||
    id === PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID
  ) {
    return { ok: true, configId: INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID };
  }
  return { ok: false, reason: "config_unrecognized" };
}

export function planInvistimoShareLaunch(signup: {
  configId?: string | null;
  extras?: unknown;
  invistimoAccountShare?: { extras?: unknown } | null;
} | null | undefined):
  | { ok: true; configId: string; extras: ServerShareExtras }
  | {
      ok: false;
      reason: "server_extras_missing" | "server_extras_mismatch" | "config_unrecognized";
    } {
  const extras = serverShareExtrasFromSignup(signup);
  if (!extras) return { ok: false, reason: "server_extras_missing" };
  if (!serverShareExtrasMatchInvistimo(extras)) {
    return { ok: false, reason: "server_extras_mismatch" };
  }
  const config = selectInvistimoShareConfigId(signup?.configId);
  if (!config.ok) return config;
  return { ok: true, configId: config.configId, extras };
}

export function evaluateInvistimoShareEvent(event?: string | null): {
  allowComplete: boolean;
  abort: boolean;
  reason: string;
} {
  const name = String(event || "").trim();
  if (name === INVISTIMO_SHARE_ALLOWED_EVENT) {
    return { allowComplete: true, abort: false, reason: "share_finish" };
  }
  if (name === "FINISH_OBO_MIGRATION") {
    return {
      allowComplete: false,
      abort: true,
      reason: "ownership_or_provider_migration",
    };
  }
  if (name === "FINISH_ONLY_WABA") {
    return {
      allowComplete: false,
      abort: true,
      reason: "only_waba_sharing_requires_later_register",
    };
  }
  return { allowComplete: false, abort: true, reason: "unrecognized_or_cancelled" };
}

export function invistimoShareScreenRequiresAbort(text?: string | null): boolean {
  return ABORT_SCREEN_HINTS.some((pattern) => pattern.test(String(text || "")));
}

export function assertInvistimoShareAssets(assets: {
  phoneNumberId?: string;
  wabaId?: string;
  metaBusinessId?: string;
}): { ok: true } | { ok: false; reason: string } {
  const phone = String(assets.phoneNumberId || "").replace(/\D/g, "");
  const portfolio = String(assets.metaBusinessId || "").replace(/\D/g, "");
  if (phone !== INVISTIMO_SHARE_PHONE_NUMBER_ID) {
    return { ok: false, reason: "phone_mismatch" };
  }
  if (portfolio && portfolio !== INVISTIMO_SHARE_PORTFOLIO_ID) {
    return { ok: false, reason: "portfolio_mismatch" };
  }
  if (!String(assets.wabaId || "").trim()) {
    return { ok: false, reason: "waba_missing" };
  }
  return { ok: true };
}

export const INVISTIMO_SHARE_SCREENS = [
  {
    id: "facebook_login",
    titleKey: "whatsapp.settings.invistimoShareScreenLogin",
    meaningKey: "whatsapp.settings.invistimoShareScreenLoginMeaning",
    abortKey: "whatsapp.settings.invistimoShareScreenLoginAbort",
  },
  {
    id: "choose_portfolio",
    titleKey: "whatsapp.settings.invistimoShareScreenPortfolio",
    meaningKey: "whatsapp.settings.invistimoShareScreenPortfolioMeaning",
    abortKey: "whatsapp.settings.invistimoShareScreenPortfolioAbort",
  },
  {
    id: "choose_existing_number",
    titleKey: "whatsapp.settings.invistimoShareScreenNumber",
    meaningKey: "whatsapp.settings.invistimoShareScreenNumberMeaning",
    abortKey: "whatsapp.settings.invistimoShareScreenNumberAbort",
  },
  {
    id: "permissions",
    titleKey: "whatsapp.settings.invistimoShareScreenPerms",
    meaningKey: "whatsapp.settings.invistimoShareScreenPermsMeaning",
    abortKey: "whatsapp.settings.invistimoShareScreenPermsAbort",
  },
  {
    id: "finish_share",
    titleKey: "whatsapp.settings.invistimoShareScreenFinish",
    meaningKey: "whatsapp.settings.invistimoShareScreenFinishMeaning",
    abortKey: "whatsapp.settings.invistimoShareScreenFinishAbort",
  },
] as const;
