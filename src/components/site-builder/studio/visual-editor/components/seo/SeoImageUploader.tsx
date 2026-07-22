import React, { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { uploadMediaToCloudinary } from "../../../utils/uploadMediaToCloudinary";
import { seoFieldClass } from "./SeoUi";
import BizuplyLoader from "../../../../../../components/ui/BizuplyLoader";

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  businessId?: string;
  accept?: string;
  previewAspect?: "square" | "social";
  placeholder?: string;
};

export default function SeoImageUploader({
  label,
  hint,
  value,
  onChange,
  businessId,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/vnd.microsoft.icon,.ico",
  previewAspect = "social",
  placeholder = "https://...",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const result = await uploadMediaToCloudinary({
        file,
        businessId,
        source: "seo-settings",
      });
      onChange(result.secureUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "העלאת התמונה נכשלה",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const aspectClass =
    previewAspect === "square" ? "aspect-square max-w-[120px]" : "aspect-[1.91/1]";

  return (
    <div className="space-y-2">
      <span className="text-sm font-black text-slate-800">{label}</span>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-l from-slate-50/80 to-white p-3">
        <div className="flex flex-wrap items-start gap-3">
          <div
            className={[
              "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
              aspectClass,
              previewAspect === "square" ? "w-[120px]" : "min-w-[160px] flex-1",
            ].join(" ")}
          >
            {value ? (
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 p-3 text-slate-400">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[10px] font-bold">אין תמונה</span>
              </div>
            )}
          </div>

          <div className="flex min-w-[180px] flex-1 flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0] || null)}
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-600 to-sky-500 px-4 text-sm font-black text-white shadow-sm transition hover:from-blue-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <BizuplyLoader size="xs" compact /> מעלה...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> העלאה מהמחשב
                </>
              )}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" /> הסרת תמונה
              </button>
            ) : null}

            <p className="text-[11px] font-semibold leading-5 text-slate-500">
              {hint || "PNG, JPG, WEBP או ICO — נשמר ב-Cloudinary"}
            </p>
          </div>
        </div>

        <label className="mt-3 block space-y-1.5">
          <span className="text-[11px] font-black text-slate-500">
            או הדביקי כתובת URL
          </span>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={seoFieldClass}
            placeholder={placeholder}
            dir="ltr"
          />
        </label>
      </div>

      {error ? (
        <p className="text-xs font-bold text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}