import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

export const INVISTIMO_SHARE_PORTFOLIO_ID = "2915799725325699";
export const INVISTIMO_SHARE_WABA_ID = "1042912532080617";
export const INVISTIMO_SHARE_PHONE_NUMBER_ID = "976924655507470";
export const INVISTIMO_SHARE_E164 = "+972515953390";

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

export function buildInvistimoAccountShareExtras() {
  return {
    setup: {
      business: {
        id: INVISTIMO_SHARE_PORTFOLIO_ID,
        phone: { code: 972, number: "515953390" },
      },
      whatsAppBusinessAccount: { id: INVISTIMO_SHARE_WABA_ID },
      preVerifiedPhone: { ids: [INVISTIMO_SHARE_PHONE_NUMBER_ID] },
    },
    featureType: "",
    sessionInfoVersion: "3" as const,
  };
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
