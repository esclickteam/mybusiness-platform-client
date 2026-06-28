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

function escapeHtml(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeDataImage(value?: string) {
  if (!value) return "";

  if (
    value.startsWith("data:image/png;base64,") ||
    value.startsWith("data:image/jpeg;base64,") ||
    value.startsWith("data:image/jpg;base64,") ||
    value.startsWith("data:image/webp;base64,")
  ) {
    return value;
  }

  return "";
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

    return date.toLocaleDateString("en-US");
  };

  const formatList = (value?: string[] | string): string => {
    if (!value) return "—";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    return value || "—";
  };

  const fetchAgreement = async () => {
    const idStr = getAgreementId();

    if (!idStr) {
      setAgreement(null);
      setError("Missing agreement ID");
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
      setError(getApiErrorMessage(err, "Error loading the agreement"));
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
      setError("You are not authorized to sign this agreement");
      return;
    }

    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setError("Please sign first");
      return;
    }

    const idStr = getAgreementId();

    if (!idStr) {
      setError("Missing agreement ID");
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
      setError(getApiErrorMessage(err, "Error saving signature"));
    } finally {
      setSaving(false);
    }
  }

  const downloadPdf = async () => {
    if (!agreement || !proposal) {
      setError("Agreement data is missing");
      return;
    }

    let pdfContainer: HTMLDivElement | null = null;

    const senderSignature = safeDataImage(
      agreement.signatures?.createdBy?.signatureDataUrl
    );

    const receiverSignature = safeDataImage(
      agreement.signatures?.invitedBusiness?.signatureDataUrl
    );

    const senderSigned = Boolean(agreement.signatures?.createdBy?.signed);
    const receiverSigned = Boolean(agreement.signatures?.invitedBusiness?.signed);

    const fileName = `partnership-agreement-${
      agreement?._id || getAgreementId() || "document"
    }.pdf`;

    const infoCard = (label: string, value: string | number) => {
      return `
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:16px;
          padding:16px;
          box-sizing:border-box;
          min-height:76px;
        ">
          <div style="
            font-size:11px;
            font-weight:800;
            color:#9ca3af;
            text-transform:uppercase;
            letter-spacing:0.08em;
            margin-bottom:10px;
          ">
            ${escapeHtml(label)}
          </div>

          <div style="
            font-size:14px;
            font-weight:700;
            color:#111827;
            line-height:1.5;
            direction:auto;
          ">
            ${escapeHtml(value)}
          </div>
        </div>
      `;
    };

    const signatureHtml = ({
      title,
      signed,
      signatureDataUrl,
      signedAt,
    }: {
      title: string;
      signed: boolean;
      signatureDataUrl?: string;
      signedAt?: string | Date | null;
    }) => {
      return `
        <div style="
          border:1px solid #e5e7eb;
          background:#f9fafb;
          border-radius:18px;
          padding:18px;
          width:48%;
          box-sizing:border-box;
          break-inside:avoid;
          page-break-inside:avoid;
        ">
          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:14px;
          ">
            <div style="font-size:16px;font-weight:800;color:#111827;">
              ${escapeHtml(title)}
            </div>

            <div style="
              background:${signed ? "#d1fae5" : "#e5e7eb"};
              color:${signed ? "#047857" : "#4b5563"};
              border-radius:999px;
              padding:7px 14px;
              font-size:12px;
              font-weight:800;
            ">
              ${signed ? "Signed" : "Not signed"}
            </div>
          </div>

          <div style="
            height:135px;
            border:1px dashed #d1d5db;
            background:#ffffff;
            border-radius:16px;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:10px;
            box-sizing:border-box;
            overflow:hidden;
          ">
            ${
              signed && signatureDataUrl
                ? `<img
                    src="${signatureDataUrl}"
                    alt="${escapeHtml(title)} Signature"
                    style="
                      display:block;
                      max-width:100%;
                      max-height:110px;
                      width:auto;
                      height:auto;
                      object-fit:contain;
                      background:#ffffff;
                    "
                  />`
                : `<span style="font-size:14px;color:#9ca3af;font-weight:600;">
                    No signature yet
                  </span>`
            }
          </div>

          ${
            signedAt
              ? `<div style="
                  margin-top:14px;
                  font-size:13px;
                  color:#64748b;
                  font-weight:600;
                ">
                  Signed at: ${escapeHtml(formatDate(signedAt))}
                </div>`
              : ""
          }
        </div>
      `;
    };

    try {
      setDownloadingPdf(true);
      setError("");

      pdfContainer = document.createElement("div");
      pdfContainer.style.position = "fixed";
      pdfContainer.style.left = "-10000px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "900px";
      pdfContainer.style.background = "#ffffff";
      pdfContainer.style.zIndex = "-1";

      pdfContainer.innerHTML = `
        <div style="
          width:900px;
          background:#ffffff;
          color:#111827;
          font-family:Arial, Helvetica, sans-serif;
          padding:28px;
          box-sizing:border-box;
          direction:ltr;
        ">
          <div style="
            border-bottom:1px solid #e5e7eb;
            padding-bottom:22px;
            margin-bottom:28px;
          ">
            <div style="
              color:#7c3aed;
              font-size:12px;
              font-weight:900;
              letter-spacing:0.25em;
              text-transform:uppercase;
              margin-bottom:8px;
            ">
              Partnership
            </div>

            <h1 style="
              font-size:30px;
              line-height:1.2;
              margin:0;
              font-weight:900;
              color:#111827;
            ">
              Partnership Agreement
            </h1>

            <div style="
              margin-top:8px;
              font-size:14px;
              color:#6b7280;
            ">
              Review the agreement details and signatures.
            </div>

            <div style="margin-top:14px;">
              <span style="
                display:inline-block;
                background:#f5f3ff;
                color:#7c3aed;
                border-radius:999px;
                padding:8px 14px;
                font-size:12px;
                font-weight:800;
                margin-right:8px;
              ">
                ${escapeHtml(agreement.status)}
              </span>

              ${
                permissionData.userSigned
                  ? `<span style="
                      display:inline-block;
                      background:#ecfdf5;
                      color:#047857;
                      border-radius:999px;
                      padding:8px 14px;
                      font-size:12px;
                      font-weight:800;
                    ">
                      You signed
                    </span>`
                  : ""
              }
            </div>
          </div>

          <div style="
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:24px;
            padding:24px;
            margin-bottom:24px;
            box-sizing:border-box;
            break-inside:avoid;
            page-break-inside:avoid;
          ">
            <h2 style="
              font-size:22px;
              margin:0 0 8px 0;
              font-weight:900;
              color:#111827;
            ">
              Agreement Details
            </h2>

            <div style="font-size:13px;color:#64748b;margin-bottom:22px;">
              Agreement ID: ${escapeHtml(agreement._id || getAgreementId())}
            </div>

            <div style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:14px;
            ">
              ${infoCard(
                "From Business",
                proposal.fromBusinessName || agreement.sender?.businessName || "—"
              )}
              ${infoCard(
                "To Business",
                proposal.toBusinessName || agreement.receiver?.businessName || "—"
              )}
              ${infoCard("Contact Person", proposal.contactName || "—")}
              ${infoCard("Phone", proposal.phone || "—")}
              ${infoCard(
                "Collaboration Type",
                proposal.type || agreement.type || "—"
              )}
              ${infoCard(
                "Payment / Commission",
                proposal.payment || agreement.payment || "—"
              )}
              ${infoCard("Amount", proposal.amount || agreement.amount || "—")}
              ${infoCard(
                "Agreement Period",
                `${formatDate(
                  proposal.startDate || agreement.startDate
                )} – ${formatDate(proposal.endDate || agreement.endDate)}`
              )}
              ${infoCard(
                "Cancelable Anytime",
                proposal.cancelAnytime || agreement.cancelAnytime ? "Yes" : "No"
              )}
              ${infoCard(
                "Confidentiality Clause",
                proposal.confidentiality || agreement.confidentiality
                  ? "Yes"
                  : "No"
              )}
            </div>

            <div style="
              margin-top:16px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:16px;
              padding:16px;
              box-sizing:border-box;
            ">
              <div style="
                font-size:11px;
                font-weight:800;
                color:#9ca3af;
                text-transform:uppercase;
                letter-spacing:0.08em;
                margin-bottom:10px;
              ">
                Description
              </div>

              <div style="
                font-size:14px;
                line-height:1.7;
                color:#1f2937;
                direction:auto;
              ">
                ${escapeHtml(proposal.description || agreement.description)}
              </div>
            </div>

            <div style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:14px;
              margin-top:16px;
            ">
              ${infoCard("What You Will Provide", formatList(proposal.giving))}
              ${infoCard("What You Will Receive", formatList(proposal.receiving))}
            </div>
          </div>

          <div style="
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:24px;
            padding:24px;
            box-sizing:border-box;
            break-inside:avoid;
            page-break-inside:avoid;
          ">
            <h2 style="
              font-size:22px;
              margin:0 0 20px 0;
              font-weight:900;
              color:#111827;
            ">
              Signatures
            </h2>

            <div style="
              display:flex;
              gap:18px;
              align-items:stretch;
              justify-content:space-between;
            ">
              ${signatureHtml({
                title: "Sender",
                signed: senderSigned,
                signatureDataUrl: senderSignature,
                signedAt: agreement.signatures?.createdBy?.signedAt,
              })}

              ${signatureHtml({
                title: "Receiver",
                signed: receiverSigned,
                signatureDataUrl: receiverSignature,
                signedAt: agreement.signatures?.invitedBusiness?.signedAt,
              })}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(pdfContainer);

      const images = Array.from(pdfContainer.querySelectorAll("img"));

      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve();
                return;
              }

              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      await new Promise((resolve) => window.setTimeout(resolve, 150));

      await html2pdf()
        .set({
          margin: [0.35, 0.35, 0.35, 0.35],
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
            windowWidth: 900,
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
          },
        })
        .from(pdfContainer)
        .save();
    } catch (pdfError) {
      console.error("❌ Error downloading PDF:", pdfError);
      setError("Error downloading PDF");
    } finally {
      if (pdfContainer) {
        pdfContainer.remove();
      }

      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
        <p className="text-sm font-medium text-gray-600">
          Loading agreement...
        </p>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="w-full rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error || "Agreement not found"}
        </div>

        {onClose && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="w-full rounded-3xl bg-white p-6 shadow-xl">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          Proposal data is missing
        </div>
      </div>
    );
  }

  const senderSigned = Boolean(agreement.signatures?.createdBy?.signed);
  const receiverSigned = Boolean(agreement.signatures?.invitedBusiness?.signed);

  return (
    <div className="w-full rounded-3xl bg-white p-4 shadow-2xl sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">
            Partnership
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">
            Partnership Agreement
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review the agreement details and sign digitally.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
            {agreement.status || "—"}
          </span>

          {permissionData.userSigned && (
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              You signed
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
        style={{ direction: "ltr" }}
      >
        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-950">
              Agreement Details
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Agreement ID: {agreement._id || getAgreementId()}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              label="From Business"
              value={
                proposal.fromBusinessName ||
                agreement.sender?.businessName ||
                "—"
              }
            />

            <InfoCard
              label="To Business"
              value={
                proposal.toBusinessName ||
                agreement.receiver?.businessName ||
                "—"
              }
            />

            <InfoCard
              label="Contact Person"
              value={proposal.contactName || "—"}
            />

            <InfoCard label="Phone" value={proposal.phone || "—"} />

            <InfoCard
              label="Collaboration Type"
              value={proposal.type || agreement.type || "—"}
            />

            <InfoCard
              label="Payment / Commission"
              value={proposal.payment || agreement.payment || "—"}
            />

            <InfoCard
              label="Amount"
              value={String(proposal.amount || agreement.amount || "—")}
            />

            <InfoCard
              label="Agreement Period"
              value={`${formatDate(
                proposal.startDate || agreement.startDate
              )} – ${formatDate(proposal.endDate || agreement.endDate)}`}
            />

            <InfoCard
              label="Cancelable Anytime"
              value={
                proposal.cancelAnytime || agreement.cancelAnytime ? "Yes" : "No"
              }
            />

            <InfoCard
              label="Confidentiality Clause"
              value={
                proposal.confidentiality || agreement.confidentiality
                  ? "Yes"
                  : "No"
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {proposal.description || agreement.description || "—"}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                What You Will Provide
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-800">
                {formatList(proposal.giving)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                What You Will Receive
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-800">
                {formatList(proposal.receiving)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-xl font-black text-gray-950">Signatures</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SignatureBox
              title="Sender"
              signed={senderSigned}
              signedAt={agreement.signatures?.createdBy?.signedAt}
              signatureDataUrl={
                agreement.signatures?.createdBy?.signatureDataUrl
              }
              formatDate={formatDate}
            />

            <SignatureBox
              title="Receiver"
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
              You are signing as{" "}
              <strong className="text-gray-900">
                {permissionData.userSide === "createdBy"
                  ? "Sender"
                  : "Receiver"}
              </strong>
            </span>
          ) : (
            <span className="font-semibold text-red-600">
              You are not authorized to sign this agreement.
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
            {downloadingPdf ? "Preparing PDF..." : "Download PDF"}
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
              Sign Agreement
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-black"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {permissionData.userSigned && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          You already signed this agreement.
        </div>
      )}

      {showSign && (
        <div className="mt-6 rounded-3xl border border-purple-100 bg-purple-50 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-black text-gray-950">
              Add Your Signature
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Draw your signature below, then save it.
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
                Loading signature pad...
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
              Clear
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
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveSignature}
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Signature"}
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

      <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
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
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-gray-950">{title}</p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            signed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {signed ? "Signed" : "Not signed"}
        </span>
      </div>

      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-3">
        {signed && signatureDataUrl ? (
          <img
            src={signatureDataUrl}
            alt={`${title} Signature`}
            className="max-h-24 max-w-full object-contain"
          />
        ) : (
          <span className="text-sm font-medium text-gray-400">
            No signature yet
          </span>
        )}
      </div>

      {signedAt && (
        <p className="mt-3 text-xs font-medium text-gray-500">
          Signed at: {formatDate(signedAt)}
        </p>
      )}
    </div>
  );
}