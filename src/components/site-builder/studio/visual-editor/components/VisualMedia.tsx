import React from "react";

import {
  readVisualContent,
  type VisualContentItem,
} from "../utils/visualData";

import {
  getVideoMimeType,
  normalizeVisualMediaType,
} from "../utils/visualMediaUtils";

export type VisualMediaMode = "edit" | "preview";

export type VisualMediaProps = {
  id: string;
  data?: Record<string, any>;
  mode?: VisualMediaMode;

  fallbackSrc?: string;
  fallbackAlt?: string;
  fallbackMediaType?: "image" | "video" | "raw" | string;

  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;

  imageProps?: Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "alt" | "className" | "style"
  >;

  videoProps?: Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "src" | "className" | "style" | "children"
  >;

  editable?: boolean;
  label?: string;
};

function getVisualContentItem(
  data: Record<string, any> | undefined,
  id: string,
): VisualContentItem {
  if (!data || !id) return {};

  return readVisualContent(data)[id] || {};
}

export default function VisualMedia({
  id,
  data,
  mode = "preview",
  fallbackSrc = "",
  fallbackAlt = "",
  fallbackMediaType,
  className = "",
  wrapperClassName = "",
  style,
  imageProps,
  videoProps,
  editable = true,
  label = "תמונה / וידאו",
}: VisualMediaProps) {
  const item = getVisualContentItem(data, id);

  const src = String(item.src || fallbackSrc || "");
  const alt = String(item.alt ?? fallbackAlt ?? "");

  const mediaType =
    normalizeVisualMediaType(
      item.mediaType || item.resourceType || fallbackMediaType,
      src,
    ) || "image";

  const visualAttrs =
    editable && id
      ? {
          "data-visual-editable": "true",
          "data-visual-edit-id": id,
          "data-visual-edit-type": "image",
          "data-visual-edit-label": label,
          "data-visual-media-type": mediaType,
          "data-resource-type": mediaType,
          "data-image-field": id,
        }
      : {};

  if (!src) {
    return (
      <div
        {...visualAttrs}
        className={[
          "flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm font-black text-slate-400",
          wrapperClassName,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
      >
        אין מדיה
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <video
        {...visualAttrs}
        {...videoProps}
        className={className}
        style={style}
        autoPlay={videoProps?.autoPlay ?? true}
        muted={videoProps?.muted ?? true}
        loop={videoProps?.loop ?? true}
        playsInline={videoProps?.playsInline ?? true}
        controls={videoProps?.controls ?? false}
        preload={videoProps?.preload ?? "auto"}
        title={alt}
        aria-label={alt}
      >
        <source src={src} type={getVideoMimeType(src)} />
      </video>
    );
  }

  return (
    <img
      {...visualAttrs}
      {...imageProps}
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={imageProps?.loading ?? "lazy"}
      decoding={imageProps?.decoding ?? "async"}
    />
  );
}
