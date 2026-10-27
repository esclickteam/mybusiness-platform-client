import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Info, Loader2, MessageCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  inspectPageWhatsAppNumber,
  listPageWhatsAppNumbers,
  requestPageWhatsAppCode,
  verifyPageWhatsAppCode,
  type MetaPageWhatsAppResult,
} from "../../../../../api/metaCampaignsApi";
import { metaBtnPrimary, metaBtnSecondary, metaInputClass } from "./metaAdsUi";
import {
  MAX_VERIFY_ATTEMPTS,
  PAGE_WHATSAPP_COUNTRIES,
  composeWhatsAppPhone,
  displayWhatsAppNumber,
  findLinkedNumber,
  numbersEqual,
  splitPhoneInput,
  type PageWhatsAppCountry,
  type PageWhatsAppNumber,
} from "./pageWhatsAppNumber";

type Step = "list" | "add" | "verify";

type Props = {
  businessId: string | null;
  pageId: string;
  pageName?: string;
  selectedPhone?: string;
  onSelect: (number: PageWhatsAppNumber) => void;
};

function readApiError(error: unknown, fallback: string) {
  const response = (error as {
    response?: { data?: MetaPageWhatsAppResult & { error?: string } };
  })?.response?.data;
  return response?.message || response?.error || fallback;
}

export default function PageWhatsAppNumberPicker({
  businessId,
  pageId,
  pageName,
  selectedPhone,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const c = (key: string, opts?: Record<string, unknown>) =>
    t(`metaCampaigns.adsManager.chrome.${key}`, opts);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [numbers, setNumbers] = useState<PageWhatsAppNumber[]>([]);
  const [step, setStep] = useState<Step>("list");
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [country, setCountry] = useState<PageWhatsAppCountry>(
    PAGE_WHATSAPP_COUNTRIES[0]
  );
  const [national, setNational] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState("");

  const selected = useMemo(
    () => findLinkedNumber(numbers, selectedPhone),
    [numbers, selectedPhone]
  );

  const loadNumbers = async (selectPhone?: string) => {
    if (!businessId || !pageId) return [];
    setLoading(true);
    setError("");
    try {
      const data = await listPageWhatsAppNumbers(businessId, pageId);
      const next = data.numbers || [];
      setNumbers(next);
      const match = findLinkedNumber(next, selectPhone || selectedPhone);
      if (match) onSelect(match);
      else if (!selectPhone && !selectedPhone && next.length === 1) {
        onSelect(next[0]);
      }
      if (!next.length && !selectPhone) setStep("add");
      else setStep("list");
      return next;
    } catch (err) {
      setError(readApiError(err, c("pageWaLoadFailed")));
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId || !pageId) return;
    void loadNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, pageId]);

  const composedPhone = composeWhatsAppPhone(country, national);

  const closeAdd = () => {
    setStep("list");
    setError("");
    setNotice("");
    setCode("");
    setBusy(false);
  };

  const applyResult = async (result: MetaPageWhatsAppResult, phone: string) => {
    if (result.numbers) setNumbers(result.numbers);
    if (result.linked && result.number) {
      onSelect(result.number);
      setSuccess(c("pageWaConnected"));
      setStep("list");
      setNotice(
        result.alreadyLinkedToThisPage ? c("pageWaAlreadyOnPage") : ""
      );
      setCode("");
      setPendingPhone("");
      return;
    }
    if (result.needsVerification || result.codeSent) {
      setPendingPhone(phone);
      setStep("verify");
      setNotice(result.message || c("pageWaCodeSent"));
      setError("");
      return;
    }
    setError(result.message || c("pageWaConnectFailed"));
  };

  const submitNumber = async () => {
    if (!businessId || !pageId || !composedPhone || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const inspected = await inspectPageWhatsAppNumber(
        businessId,
        pageId,
        composedPhone
      );
      if (inspected.linked) {
        await applyResult(inspected, composedPhone);
        return;
      }
      const requested = await requestPageWhatsAppCode(
        businessId,
        pageId,
        composedPhone
      );
      await applyResult(requested, composedPhone);
    } catch (err) {
      setError(readApiError(err, c("pageWaConnectFailed")));
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async () => {
    if (!businessId || !pageId || !pendingPhone || busy) return;
    if (attempts >= MAX_VERIFY_ATTEMPTS) {
      setError(c("pageWaTooManyAttempts"));
      return;
    }
    setBusy(true);
    setError("");
    try {
      setAttempts((n) => n + 1);
      const verified = await verifyPageWhatsAppCode(
        businessId,
        pageId,
        pendingPhone,
        code
      );
      if (verified.linked) {
        await loadNumbers(pendingPhone);
        await applyResult(verified, pendingPhone);
        return;
      }
      setError(verified.message || c("pageWaInvalidCode"));
    } catch (err) {
      setError(readApiError(err, c("pageWaInvalidCode")));
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    if (!businessId || !pageId || !pendingPhone || busy) return;
    setBusy(true);
    setError("");
    try {
      const requested = await requestPageWhatsAppCode(
        businessId,
        pageId,
        pendingPhone
      );
      await applyResult(requested, pendingPhone);
      setAttempts(0);
      setCode("");
    } catch (err) {
      setError(readApiError(err, c("pageWaResendFailed")));
    } finally {
      setBusy(false);
    }
  };

  const openAdd = () => {
    const split = splitPhoneInput(selectedPhone || "");
    setCountry(split.country);
    setNational(split.national);
    setPendingPhone("");
    setCode("");
    setAttempts(0);
    setNotice("");
    setError("");
    setSuccess("");
    setStep("add");
    setMenuOpen(false);
  };

  if (!pageId) {
    return (
      <p className="text-[13px] text-[#65676B]">{c("pageWaNeedPage")}</p>
    );
  }

  return (
    <div className="space-y-3" data-testid="page-whatsapp-picker">
      <div>
        <p className="text-[15px] font-bold text-[#050505]">{c("pageWaTitle")}</p>
        <p className="mt-1 text-[13px] text-[#65676B]">{c("pageWaHint")}</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[13px] text-[#65676B]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {c("pageWaLoading")}
        </div>
      ) : null}

      {success ? (
        <div
          data-testid="page-whatsapp-success"
          className="rounded-lg border border-[#A6D9B3] bg-[#E7F6EC] px-3 py-2 text-[13px] text-[#050505]"
        >
          {success}
        </div>
      ) : null}

      {notice && step === "list" ? (
        <div className="rounded-lg border border-[#F5D78E] bg-[#FFF8E5] px-3 py-2 text-[13px] text-[#050505]">
          {notice}
        </div>
      ) : null}

      {step === "list" && numbers.length ? (
        <div className="overflow-hidden rounded-xl border border-[#C6D9F1] bg-[#F0F6FF]">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-[#050505]">
                  WhatsApp
                </span>
                <span className="block truncate text-[13px] text-[#65676B]" dir="ltr">
                  {selected?.displayNumber ||
                    displayWhatsAppNumber(selectedPhone || "") ||
                    c("pageWaChooseNumber")}
                </span>
              </span>
            </div>
          </div>
          <div className="px-3 pb-3">
            <button
              type="button"
              data-testid="page-whatsapp-selected"
              className={`${metaInputClass} flex items-center justify-between text-start`}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span dir="ltr">
                {selected?.displayNumber ||
                  displayWhatsAppNumber(selectedPhone || "") ||
                  c("pageWaChooseNumber")}
              </span>
              <ChevronDown className="h-4 w-4 text-[#65676B]" />
            </button>
            {menuOpen ? (
              <div className="mt-1 overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-lg">
                {numbers.map((number) => (
                  <button
                    key={number.id}
                    type="button"
                    className={[
                      "flex w-full items-center justify-between px-3 py-2.5 text-start text-[14px]",
                      numbersEqual(number.phone, selectedPhone)
                        ? "bg-[#E7F3FF] font-semibold"
                        : "hover:bg-[#F0F2F5]",
                    ].join(" ")}
                    onClick={() => {
                      onSelect(number);
                      setMenuOpen(false);
                      setNotice("");
                      setSuccess("");
                    }}
                  >
                    <span dir="ltr">{number.displayNumber}</span>
                  </button>
                ))}
                <button
                  type="button"
                  data-testid="page-whatsapp-connect-another"
                  className="w-full border-t border-[#E4E6EB] px-3 py-2.5 text-start text-[14px] font-semibold text-[#1877F2] hover:bg-[#F0F2F5]"
                  onClick={openAdd}
                >
                  {c("pageWaConnectAnother")}
                </button>
              </div>
            ) : null}
          </div>
          <div className="mx-3 mb-3 flex gap-2 rounded-lg border border-[#E4E6EB] bg-white px-3 py-2 text-[12px] text-[#65676B]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1877F2]" />
            <p>{c("pageWaLimitHint")}</p>
          </div>
        </div>
      ) : null}

      {error && step === "list" ? (
        <p className="text-[13px] text-[#F02849]">{error}</p>
      ) : null}

      {step === "list" && !loading && !numbers.length ? (
        <button
          type="button"
          data-testid="page-whatsapp-empty-add"
          className={`${metaBtnSecondary} w-full`}
          onClick={openAdd}
        >
          {c("pageWaConnectAnother")}
        </button>
      ) : null}

      {step === "add" || step === "verify" ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          data-testid="page-whatsapp-modal"
        >
          <div className="flex max-h-[92vh] w-full max-w-[720px] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-xl">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-[#E4E6EB] px-4 py-3">
                <h3 className="text-[17px] font-bold text-[#050505]">
                  {step === "verify" ? c("pageWaCodeTitle") : c("pageWaModalTitle")}
                </h3>
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-[#F0F2F5]"
                  onClick={closeAdd}
                  aria-label={c("pageWaCancel")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 overflow-y-auto px-4 py-4">
                <p className="text-[14px] text-[#65676B]">
                  {step === "verify" ? c("pageWaCodeHint") : c("pageWaModalHint")}
                </p>
                {step === "add" ? (
                  <div className="grid grid-cols-[minmax(0,8rem)_1fr] gap-2">
                    <label className="text-end text-[13px] font-semibold text-[#050505]">
                      {c("pageWaCountry")}
                      <select
                        className={`${metaInputClass} mt-1`}
                        dir="ltr"
                        value={country.dial}
                        onChange={(e) => {
                          const next =
                            PAGE_WHATSAPP_COUNTRIES.find(
                              (row) => row.dial === e.target.value
                            ) || PAGE_WHATSAPP_COUNTRIES[0];
                          setCountry(next);
                        }}
                      >
                        {PAGE_WHATSAPP_COUNTRIES.map((row) => (
                          <option key={`${row.iso}-${row.dial}`} value={row.dial}>
                            +{row.dial} {row.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-end text-[13px] font-semibold text-[#050505]">
                      {c("pageWaPhone")}
                      <input
                        className={`${metaInputClass} mt-1`}
                        data-testid="page-whatsapp-phone"
                        dir="ltr"
                        inputMode="tel"
                        value={national}
                        onChange={(e) => setNational(e.target.value)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="block text-end text-[13px] font-semibold text-[#050505]">
                    {c("pageWaCode")}
                    <input
                      className={`${metaInputClass} mt-1`}
                      data-testid="page-whatsapp-code"
                      dir="ltr"
                      inputMode="numeric"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    />
                  </label>
                )}
                {error ? (
                  <p
                    data-testid="page-whatsapp-error"
                    className="text-[13px] text-[#F02849]"
                  >
                    {error}
                  </p>
                ) : null}
                {notice && step === "verify" ? (
                  <p className="text-[13px] text-[#65676B]">{notice}</p>
                ) : null}
                {pageName ? (
                  <p className="text-[12px] text-[#8A8D91]">{pageName}</p>
                ) : null}
              </div>
              <div className="flex justify-start gap-2 border-t border-[#E4E6EB] px-4 py-3">
                {step === "verify" ? (
                  <button
                    type="button"
                    className={metaBtnSecondary}
                    disabled={busy}
                    onClick={() => void resendCode()}
                  >
                    {c("pageWaResend")}
                  </button>
                ) : null}
                <button
                  type="button"
                  data-testid="page-whatsapp-continue"
                  className={metaBtnPrimary}
                  disabled={
                    busy ||
                    (step === "add" ? !composedPhone : code.length < 4)
                  }
                  onClick={() =>
                    void (step === "verify" ? submitCode() : submitNumber())
                  }
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    c("pageWaContinue")
                  )}
                </button>
              </div>
            </div>
            <div className="hidden w-[240px] shrink-0 bg-[#E8F8EF] sm:block" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
