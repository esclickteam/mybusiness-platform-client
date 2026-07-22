import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import html2pdf from "html2pdf.js";
import API from "../api";
import BizuplyLoader from "../components/ui/BizuplyLoader";

type IdLike = string | { _id?: string } | null | undefined;

type SignatureSide = {
  signed?: boolean;
  signedAt?: string | Date | null;
  signatureDataUrl?: string;
};

type AgreementSignatures = {
  createdBy?: SignatureSide;
  invitedBusiness?: SignatureSide;
};

type BusinessSnapshot = {
  businessName?: string;
};

type Proposal = {
  _id?: string;
  title?: string;
  description?: string;
  fromBusinessName?: string;
  toBusinessName?: string;
  contactName?: string;
  phone?: string;
  giving?: string[] | string;
  receiving?: string[] | string;
  type?: string;
  payment?: string;
  amount?: string | number;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  cancelAnytime?: boolean;
  confidentiality?: boolean;
};

type PartnershipAgreement = {
  _id?: string;
  createdByBusinessId?: IdLike;
  invitedBusinessId?: IdLike;
  title?: string;
  description?: string;
  type?: string;
  payment?: string;
  amount?: string | number;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  cancelAnytime?: boolean;
  confidentiality?: boolean;
  proposal?: Proposal;
  proposalId?: Proposal;
  sender?: BusinessSnapshot;
  receiver?: BusinessSnapshot;
  signatures?: AgreementSignatures;
  status?: string;
};

type ApiAgreementResponse =
  | PartnershipAgreement
  | {
      success?: boolean;
      agreement?: PartnershipAgreement;
      message?: string;
      error?: string;
    };

type PartnershipAgreementViewProps = {
  agreementId: IdLike;
  currentBusinessId?: IdLike;
  onClose?: () => void;
};

type UserSide = "createdBy" | "invitedBusiness" | null;

function safeCssValue(value: string, fallback: string) {
  if (!value) return fallback;

  const lower = value.toLowerCase();

  if (
    lower.indexOf("oklch") !== -1 ||
    lower.indexOf("lab(") !== -1 ||
    lower.indexOf("lch(") !== -1 ||
    lower.indexOf("color-mix") !== -1 ||
    lower.indexOf("var(") !== -1
  ) {
    return fallback;
  }

  return value;
}

function shrinkPx(value: string, factor: number, minPx = 0) {
  const match = value.match(/^([\d.]+)px$/);

  if (!match) return value;

  const nextValue = Math.max(Number(match[1]) * factor, minPx);

  return `${nextValue}px`;
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function waitForImagesToLoad(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const finish = () => resolve();

        img.onload = finish;
        img.onerror = finish;

        const currentSrc = img.getAttribute("src");

        if (currentSrc) {
          img.setAttribute("src", currentSrc);
        } else {
          resolve();
        }
      });
    })
  );
}

function makeCloneFitOneA4Page(clone: HTMLElement) {
  const allElements = [
    clone,
    ...Array.from(clone.querySelectorAll<HTMLElement>("*")),
  ];

  allElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    element.style.boxShadow = "none";
    element.style.textShadow = "none";
    element.style.outline = "none";

    element.style.paddingTop = shrinkPx(element.style.paddingTop, 0.58);
    element.style.paddingRight = shrinkPx(element.style.paddingRight, 0.62);
    element.style.paddingBottom = shrinkPx(element.style.paddingBottom, 0.58);
    element.style.paddingLeft = shrinkPx(element.style.paddingLeft, 0.62);

    element.style.marginTop = shrinkPx(element.style.marginTop, 0.45);
    element.style.marginRight = shrinkPx(element.style.marginRight, 0.45);
    element.style.marginBottom = shrinkPx(element.style.marginBottom, 0.45);
    element.style.marginLeft = shrinkPx(element.style.marginLeft, 0.45);

    element.style.gap = shrinkPx(element.style.gap, 0.5);
    element.style.rowGap = shrinkPx(element.style.rowGap, 0.5);
    element.style.columnGap = shrinkPx(element.style.columnGap, 0.5);

    if (tagName === "p" || tagName === "span" || tagName === "strong") {
      element.style.fontSize = shrinkPx(element.style.fontSize, 0.78, 7);
      element.style.lineHeight = "1.18";
    }

    if (tagName === "h2") {
      element.style.fontSize = shrinkPx(element.style.fontSize, 0.74, 14);
      element.style.lineHeight = "1.05";
      element.style.marginTop = "0px";
      element.style.marginBottom = "4px";
    }

    if (tagName === "h3") {
      element.style.fontSize = shrinkPx(element.style.fontSize, 0.72, 13);
      element.style.lineHeight = "1.05";
      element.style.marginTop = "0px";
      element.style.marginBottom = "5px";
    }

    if (tagName === "img") {
      element.style.maxHeight = "58px";
      element.style.width = "100%";
      element.style.objectFit = "contain";
    }
  });

  const signatureAreas = Array.from(
    clone.querySelectorAll<HTMLElement>("[data-pdf-signature-area='true']")
  );

  signatureAreas.forEach((area) => {
    area.style.minHeight = "72px";
    area.style.height = "72px";
    area.style.padding = "6px";
  });

  clone.style.width = "760px";
  clone.style.maxWidth = "760px";
  clone.style.padding = "10px";
  clone.style.margin = "0px";
  clone.style.backgroundColor = "#ffffff";
  clone.style.direction = "rtl";
  clone.style.textAlign = "right";
}

function buildPdfSafeClone(sourceElement: HTMLElement) {
  const clone = sourceElement.cloneNode(true) as HTMLElement;

  const sourceElements = [
    sourceElement,
    ...Array.from(sourceElement.querySelectorAll<HTMLElement>("*")),
  ];

  const cloneElements = [
    clone,
    ...Array.from(clone.querySelectorAll<HTMLElement>("*")),
  ];

  cloneElements.forEach((cloneElement, index) => {
    const source = sourceElements[index];

    if (!source) return;

    const computed = window.getComputedStyle(source);
    const tagName = cloneElement.tagName.toLowerCase();

    cloneElement.removeAttribute("class");

    cloneElement.style.boxSizing = "border-box";
    cloneElement.style.fontFamily = "Arial, Helvetica, sans-serif";

    cloneElement.style.color = safeCssValue(computed.color, "#111827");
    cloneElement.style.backgroundColor = safeCssValue(
      computed.backgroundColor,
      "#ffffff"
    );
    cloneElement.style.borderColor = safeCssValue(
      computed.borderColor,
      "#e5e7eb"
    );

    cloneElement.style.borderStyle = computed.borderStyle || "solid";
    cloneElement.style.borderWidth = computed.borderWidth || "0px";
    cloneElement.style.borderRadius = computed.borderRadius || "0px";

    cloneElement.style.padding = computed.padding;
    cloneElement.style.margin = computed.margin;

    cloneElement.style.display = computed.display;
    cloneElement.style.flexDirection = computed.flexDirection;
    cloneElement.style.alignItems = computed.alignItems;
    cloneElement.style.justifyContent = computed.justifyContent;
    cloneElement.style.gap = computed.gap;

    cloneElement.style.gridTemplateColumns = computed.gridTemplateColumns;
    cloneElement.style.gridTemplateRows = computed.gridTemplateRows;
    cloneElement.style.columnGap = computed.columnGap;
    cloneElement.style.rowGap = computed.rowGap;

    cloneElement.style.width = computed.width;
    cloneElement.style.maxWidth = computed.maxWidth;
    cloneElement.style.minWidth = computed.minWidth;

    cloneElement.style.height = computed.height;
    cloneElement.style.minHeight = computed.minHeight;

    cloneElement.style.fontSize = computed.fontSize;
    cloneElement.style.fontWeight = computed.fontWeight;
    cloneElement.style.lineHeight = computed.lineHeight;
    cloneElement.style.letterSpacing = computed.letterSpacing;
    cloneElement.style.textTransform = computed.textTransform;
    cloneElement.style.textAlign = computed.textAlign;
    cloneElement.style.whiteSpace = computed.whiteSpace;

    cloneElement.style.direction = "rtl";
    cloneElement.style.textAlign = "right";

    cloneElement.style.boxShadow = "none";
    cloneElement.style.textShadow = "none";
    cloneElement.style.outline = "none";

    if (tagName === "img") {
      const imgElement = cloneElement as HTMLImageElement;

      imgElement.crossOrigin = "anonymous";
      imgElement.style.backgroundColor = "#ffffff";
      imgElement.style.objectFit = "contain";
      imgElement.style.maxWidth = "100%";
      imgElement.style.height = "auto";
      imgElement.style.display = "block";
    }
  });

  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#111827";
  clone.style.width = `${sourceElement.scrollWidth}px`;
  clone.style.maxWidth = `${sourceElement.scrollWidth}px`;
  clone.style.direction = "rtl";
  clone.style.textAlign = "right";

  return clone;
}

export default function PartnershipAgreementView({
  agreementId,
  currentBusinessId,
  onClose,
}: PartnershipAgreementViewProps) {
  const [agreement, setAgreement] = useState<PartnershipAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState("");

  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const signatureWrapperRef = useRef<HTMLDivElement | null>(null);

  const [signaturePadWidth, setSignaturePadWidth] = useState(0);
  const signaturePadHeight = 220;

  const normalizeId = (value: IdLike): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value._id) return String(value._id);
    return "";
  };

  const getAgreementId = (): string => normalizeId(agreementId);

  const normalizeAgreementResponse = (res: { data?: ApiAgreementResponse }) => {
    const data = res?.data;

    if (!data) return null;

    if ("agreement" in data && data.agreement) {
      return data.agreement;
    }

    return data as PartnershipAgreement;
  };

  const getApiErrorMessage = (err: any, fallback: string) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      fallback
    );
  };

  const formatDate = (dateValue?: string | Date | null): string => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("he-IL");
  };

  const formatList = (value?: string[] | string): string => {
    if (!value) return "—";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    return value || "—";
  };

  const translateStatus = (status?: string): string => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "מאושר";
      case "pending":
        return "ממתין לאישור";
      case "rejected":
        return "נדחה";
      case "signed":
        return "נחתם";
      case "draft":
        return "טיוטה";
      default:
        return status || "—";
    }
  };

  const translateAgreementType = (agreementType?: string): string => {
    switch ((agreementType || "").toLowerCase()) {
      case "two-sided":
      case "two sided":
        return "דו־צדדי";
      case "one-sided":
      case "one sided":
        return "חד־צדדי";
      default:
        return agreementType || "—";
    }
  };

  const yesNo = (value?: boolean): string => {
    return value ? "כן" : "לא";
  };

  const userSideLabel = (side: UserSide): string => {
    if (side === "createdBy") return "שולח ההסכם";
    if (side === "invitedBusiness") return "מקבל ההסכם";
    return "";
  };

  const fetchAgreement = async () => {
    const idStr = getAgreementId();

    if (!idStr) {
      setAgreement(null);
      setError("חסר מזהה הסכם");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/partnershipAgreements/${idStr}`);
      const agreementData = normalizeAgreementResponse(res);
      setAgreement(agreementData);
    } catch (err: any) {
      console.error("❌ Error loading agreement:", err);
      setAgreement(null);
      setError(getApiErrorMessage(err, "שגיאה בטעינת ההסכם"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementId]);

  useLayoutEffect(() => {
    if (!showSign) return;

    const element = signatureWrapperRef.current;
    if (!element) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(element.clientWidth);
      if (nextWidth > 0) setSignaturePadWidth(nextWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [showSign]);

  const proposal = useMemo(() => {
    return agreement?.proposal || agreement?.proposalId || null;
  }, [agreement]);

  const permissionData = useMemo(() => {
    const createdByBusinessId = normalizeId(agreement?.createdByBusinessId);
    const invitedBusinessId = normalizeId(agreement?.invitedBusinessId);
    const userBusinessId = normalizeId(currentBusinessId);

    const isCreator =
      Boolean(createdByBusinessId) && createdByBusinessId === userBusinessId;

    const isInvited =
      Boolean(invitedBusinessId) && invitedBusinessId === userBusinessId;

    const userSide: UserSide = isCreator
      ? "createdBy"
      : isInvited
        ? "invitedBusiness"
        : null;

    const userSigned = userSide
      ? Boolean(agreement?.signatures?.[userSide]?.signed)
      : false;

    return {
      userSide,
      userSigned,
      canSign: Boolean(userSide) && !userSigned,
    };
  }, [agreement, currentBusinessId]);

  async function handleSaveSignature() {
    if (saving) return;

    if (!permissionData.userSide) {
      setError("אין לך הרשאה לחתום על ההסכם הזה");
      return;
    }

    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setError("יש לחתום לפני השמירה");
      return;
    }

    const idStr = getAgreementId();

    if (!idStr) {
      setError("חסר מזהה הסכם");
      return;
    }

    const signatureDataUrl = sigPadRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    setSaving(true);
    setError("");

    try {
      const signRes = await API.post(`/partnershipAgreements/${idStr}/sign`, {
        signatureDataUrl,
      });

      const signedAgreement = normalizeAgreementResponse(signRes);

      if (signedAgreement) {
        setAgreement(signedAgreement);
      } else {
        await fetchAgreement();
      }

      setShowSign(false);
      setSignaturePadWidth(0);
    } catch (err: any) {
      console.error("❌ Error saving signature:", err);
      setError(getApiErrorMessage(err, "שגיאה בשמירת החתימה"));
    } finally {
      setSaving(false);
    }
  }

  const downloadPdf = async () => {
    const element = document.getElementById("agreement-content");

    if (!element) {
      setError("תוכן ההסכם לא נמצא");
      return;
    }

    let pdfContainer: HTMLDivElement | null = null;

    try {
      setDownloadingPdf(true);
      setError("");

      const fileName = `partnership-agreement-${
        agreement?._id || getAgreementId() || "document"
      }.pdf`;

      const cleanClone = buildPdfSafeClone(element);

      makeCloneFitOneA4Page(cleanClone);

      pdfContainer = document.createElement("div");
      pdfContainer.style.position = "fixed";
      pdfContainer.style.left = "0";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "760px";
      pdfContainer.style.backgroundColor = "#ffffff";
      pdfContainer.style.opacity = "0";
      pdfContainer.style.pointerEvents = "none";
      pdfContainer.style.zIndex = "-1";
      pdfContainer.style.overflow = "hidden";
      pdfContainer.style.direction = "rtl";
      pdfContainer.style.textAlign = "right";

      pdfContainer.appendChild(cleanClone);
      document.body.appendChild(pdfContainer);

      await waitForImagesToLoad(cleanClone);
      await waitForNextPaint();

      await html2pdf()
        .set({
          margin: [0.12, 0.12, 0.12, 0.12],
          filename: fileName,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0,
            windowWidth: 760,
            windowHeight: cleanClone.scrollHeight,
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: [".pdf-avoid-break"],
          },
        })
        .from(cleanClone)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          const totalPages = pdf.internal.getNumberOfPages();

          if (totalPages > 1) {
            for (let page = totalPages; page > 1; page -= 1) {
              pdf.deletePage(page);
            }
          }
        })
        .save();
    } catch (pdfError) {
      console.error("❌ Error downloading PDF:", pdfError);
      setError("שגיאה בהורדת PDF");
    } finally {
      if (pdfContainer) {
        pdfContainer.remove();
      }

      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return <BizuplyLoader fullScreen label="טוען את ההסכם..." />;
  }

  if (!agreement) {
    return (
      <div dir="rtl" className="w-full rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error || "ההסכם לא נמצא"}
        </div>

        {onClose && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              סגור
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!proposal) {
    return (
      <div dir="rtl" className="w-full rounded-3xl bg-white p-6 shadow-xl">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          נתוני ההצעה חסרים
        </div>
      </div>
    );
  }

  const senderSigned = Boolean(agreement.signatures?.createdBy?.signed);
  const receiverSigned = Boolean(agreement.signatures?.invitedBusiness?.signed);

  return (
    <div
      dir="rtl"
      className="w-full rounded-3xl bg-white p-4 text-right shadow-2xl sm:p-6 lg:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">
            שיתוף פעולה
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">
            הסכם שיתוף פעולה
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            בדוק את פרטי ההסכם וחתום עליו דיגיטלית.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
            {translateStatus(agreement.status)}
          </span>

          {permissionData.userSigned && (
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              חתמת
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div
        id="agreement-content"
        className="rounded-3xl border border-gray-100 bg-gray-50 p-5 sm:p-7"
        style={{ direction: "rtl", textAlign: "right" }}
      >
        <div className="pdf-avoid-break rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-950">פרטי ההסכם</h3>

            <p className="mt-1 text-sm text-gray-500">
              מזהה הסכם: {agreement._id || getAgreementId()}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              label="מעסק"
              value={
                proposal.fromBusinessName ||
                agreement.sender?.businessName ||
                "—"
              }
            />

            <InfoCard
              label="לעסק"
              value={
                proposal.toBusinessName ||
                agreement.receiver?.businessName ||
                "—"
              }
            />

            <InfoCard
              label="איש קשר"
              value={proposal.contactName || "—"}
            />

            <InfoCard label="טלפון" value={proposal.phone || "—"} />

            <InfoCard
              label="סוג שיתוף פעולה"
              value={translateAgreementType(proposal.type || agreement.type)}
            />

            <InfoCard
              label="תשלום / עמלה"
              value={proposal.payment || agreement.payment || "—"}
            />

            <InfoCard
              label="סכום"
              value={String(proposal.amount || agreement.amount || "—")}
            />

            <InfoCard
              label="תקופת ההסכם"
              value={`${formatDate(
                proposal.startDate || agreement.startDate
              )} – ${formatDate(proposal.endDate || agreement.endDate)}`}
            />

            <InfoCard
              label="ניתן לביטול בכל זמן"
              value={yesNo(proposal.cancelAnytime || agreement.cancelAnytime)}
            />

            <InfoCard
              label="סעיף סודיות"
              value={yesNo(proposal.confidentiality || agreement.confidentiality)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              תיאור
            </p>

            <p
              className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-800"
              dir="auto"
            >
              {proposal.description || agreement.description || "—"}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                מה אתה מספק
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-800" dir="auto">
                {formatList(proposal.giving)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                מה אתה מקבל
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-800" dir="auto">
                {formatList(proposal.receiving)}
              </p>
            </div>
          </div>
        </div>

        <div className="pdf-avoid-break mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-xl font-black text-gray-950">חתימות</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SignatureBox
              title="שולח ההסכם"
              signed={senderSigned}
              signedAt={agreement.signatures?.createdBy?.signedAt}
              signatureDataUrl={
                agreement.signatures?.createdBy?.signatureDataUrl
              }
              formatDate={formatDate}
            />

            <SignatureBox
              title="מקבל ההסכם"
              signed={receiverSigned}
              signedAt={agreement.signatures?.invitedBusiness?.signedAt}
              signatureDataUrl={
                agreement.signatures?.invitedBusiness?.signatureDataUrl
              }
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-gray-500">
          {permissionData.userSide ? (
            <span>
              אתה חותם בתור{" "}
              <strong className="text-gray-900">
                {userSideLabel(permissionData.userSide)}
              </strong>
            </span>
          ) : (
            <span className="font-semibold text-red-600">
              אין לך הרשאה לחתום על ההסכם הזה.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={downloadPdf}
            disabled={downloadingPdf}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloadingPdf ? "מכין PDF..." : "הורד PDF"}
          </button>

          {permissionData.canSign && !showSign && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSignaturePadWidth(0);
                setShowSign(true);
              }}
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              חתום על ההסכם
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-black"
            >
              סגור
            </button>
          )}
        </div>
      </div>

      {permissionData.userSigned && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          כבר חתמת על ההסכם הזה.
        </div>
      )}

      {showSign && (
        <div className="mt-6 rounded-3xl border border-purple-100 bg-purple-50 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-black text-gray-950">
              הוסף חתימה
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              צייר את החתימה שלך למטה ולאחר מכן שמור אותה.
            </p>
          </div>

          <div
            ref={signatureWrapperRef}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-inner"
          >
            {signaturePadWidth > 0 ? (
              <SignatureCanvas
                ref={sigPadRef}
                penColor="black"
                clearOnResize={false}
                canvasProps={{
                  width: signaturePadWidth,
                  height: signaturePadHeight,
                  className: "block touch-none bg-white",
                }}
              />
            ) : (
              <div
                className="flex items-center justify-center bg-white text-sm font-semibold text-gray-400"
                style={{ height: signaturePadHeight }}
              >
                טוען משטח חתימה...
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => sigPadRef.current?.clear()}
              disabled={saving}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              נקה
            </button>

            <button
              type="button"
              onClick={() => {
                setShowSign(false);
                setSignaturePadWidth(0);
                setError("");
              }}
              disabled={saving}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              ביטול
            </button>

            <button
              type="button"
              onClick={handleSaveSignature}
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "שומר..." : "שמור חתימה"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-900" dir="auto">
        {value}
      </p>
    </div>
  );
}

function SignatureBox({
  title,
  signed,
  signedAt,
  signatureDataUrl,
  formatDate,
}: {
  title: string;
  signed: boolean;
  signedAt?: string | Date | null;
  signatureDataUrl?: string;
  formatDate: (dateValue?: string | Date | null) => string;
}) {
  return (
    <div className="pdf-avoid-break rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-gray-950">{title}</p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            signed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {signed ? "נחתם" : "טרם נחתם"}
        </span>
      </div>

      <div
        data-pdf-signature-area="true"
        className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-3"
      >
        {signed && signatureDataUrl ? (
          <img
            src={signatureDataUrl}
            alt={`חתימת ${title}`}
            className="block max-h-24 max-w-full object-contain"
          />
        ) : (
          <span className="text-sm font-medium text-gray-400">
            עדיין אין חתימה
          </span>
        )}
      </div>

      {signedAt && (
        <p className="mt-3 text-xs font-medium text-gray-500">
          נחתם בתאריך: {formatDate(signedAt)}
        </p>
      )}
    </div>
  );
}