import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import {
  formatFileSize,
  supportsCaption,
  type StagedWhatsAppFile,
  validateWhatsAppFile,
  WHATSAPP_FILE_ACCEPT,
} from "./whatsappMedia";

type Props = {
  body: string;
  onBodyChange: (value: string) => void;
  disabled?: boolean;
  sending?: boolean;
  sessionOpen: boolean;
  hasTemplate: boolean;
  stagedFile: StagedWhatsAppFile | null;
  onStageFile: (file: StagedWhatsAppFile | null) => void;
  onSend: () => void;
};

export function WhatsAppMessageComposer({
  body,
  onBodyChange,
  disabled = false,
  sending = false,
  sessionOpen,
  hasTemplate,
  stagedFile,
  onStageFile,
  onSend,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    return () => {
      if (stagedFile?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(stagedFile.previewUrl);
      }
    };
  }, [stagedFile]);

  function insertEmoji(emojiData: EmojiClickData) {
    const el = textareaRef.current;
    if (!el) {
      onBodyChange(`${body}${emojiData.emoji}`);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = `${body.slice(0, start)}${emojiData.emoji}${body.slice(end)}`;
    onBodyChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + emojiData.emoji.length;
      el.setSelectionRange(caret, caret);
    });
  }

  function handlePickFile(file: File | null) {
    setFileError("");
    setShowAttachMenu(false);
    if (!file) return;

    const validationError = validateWhatsAppFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    const messageType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
          ? "audio"
          : "document";

    if (stagedFile?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(stagedFile.previewUrl);
    }

    const previewUrl =
      messageType === "image" || messageType === "video" || messageType === "audio"
        ? URL.createObjectURL(file)
        : "";

    onStageFile({
      file,
      previewUrl,
      messageType,
      mimeType: file.type,
      filename: file.name,
      size: file.size,
    });
  }

  const canSend =
    !disabled &&
    !sending &&
    (stagedFile || (sessionOpen && !hasTemplate && body.trim()) || hasTemplate);

  return (
    <div className="space-y-2">
      {stagedFile ? (
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-start gap-3">
            {stagedFile.messageType === "image" && stagedFile.previewUrl ? (
              <img
                src={stagedFile.previewUrl}
                alt={stagedFile.filename}
                className="h-20 w-20 rounded-lg object-cover"
              />
            ) : stagedFile.messageType === "video" && stagedFile.previewUrl ? (
              <video
                src={stagedFile.previewUrl}
                className="h-20 w-28 rounded-lg bg-black/5 object-cover"
                muted
                playsInline
              />
            ) : stagedFile.messageType === "audio" ? (
              <div className="grid h-20 w-full max-w-xs place-items-center rounded-lg bg-[#f0f2f5] px-3">
                <audio src={stagedFile.previewUrl} controls className="w-full" />
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-black/5 bg-[#f0f2f5] px-3 py-2">
                <span className="text-2xl">📄</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{stagedFile.filename}</p>
                  <p className="text-[11px] text-[#667781]">
                    {stagedFile.mimeType.split("/").pop()?.toUpperCase()} · {formatFileSize(stagedFile.size)}
                  </p>
                </div>
              </div>
            )}
            <button
              type="button"
              className="min-h-9 min-w-9 rounded-full text-lg text-slate-500"
              onClick={() => onStageFile(null)}
              aria-label="הסר קובץ"
            >
              ✕
            </button>
          </div>
          {stagedFile.messageType === "image" || stagedFile.messageType === "video" ? (
            <p className="mt-2 truncate text-[11px] text-[#667781]">
              {stagedFile.filename} · {formatFileSize(stagedFile.size)}
            </p>
          ) : null}
          {supportsCaption(stagedFile.messageType) ? (
            <p className="mt-1 text-[11px] text-[#667781]">ניתן להוסיף כיתוב לפני השליחה</p>
          ) : null}
        </div>
      ) : null}

      {fileError ? <p className="px-2 text-xs font-bold text-rose-700">{fileError}</p> : null}

      <div className="flex items-end gap-1 sm:gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-xl text-[#54656f] hover:bg-black/5"
            onClick={() => setShowAttachMenu((v) => !v)}
            disabled={disabled || !sessionOpen || hasTemplate}
            aria-label="צירוף קובץ"
          >
            📎
          </button>
          {showAttachMenu ? (
            <div className="absolute bottom-12 start-0 z-20 min-w-[160px] rounded-xl border border-black/5 bg-white p-1 shadow-lg">
              {[
                { label: "תמונה / וידאו", accept: "image/jpeg,image/png,video/mp4,video/3gpp" },
                { label: "מסמך", accept: WHATSAPP_FILE_ACCEPT },
                { label: "אודיו", accept: "audio/aac,audio/mp4,audio/mpeg,audio/amr,audio/ogg" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="block w-full rounded-lg px-3 py-2 text-start text-sm font-bold text-[#111b21] hover:bg-[#f0f2f5]"
                  onClick={() => {
                    if (!fileInputRef.current) return;
                    fileInputRef.current.accept = item.accept;
                    fileInputRef.current.click();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={WHATSAPP_FILE_ACCEPT}
            onChange={(e) => {
              handlePickFile(e.target.files?.[0] || null);
              e.currentTarget.value = "";
            }}
          />
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-xl text-[#54656f] hover:bg-black/5"
            onClick={() => setShowEmoji((v) => !v)}
            disabled={disabled}
            aria-label="בחירת אימוג'י"
          >
            😊
          </button>
          {showEmoji ? (
            <div className="absolute bottom-12 start-0 z-20 max-w-[min(100vw-1rem,320px)] overflow-hidden rounded-xl border border-black/5 shadow-lg">
              <EmojiPicker
                onEmojiClick={insertEmoji}
                theme={Theme.LIGHT}
                width="100%"
                height={360}
                searchPlaceholder="חיפוש אימוג'י"
                previewConfig={{ showPreview: false }}
              />
            </div>
          ) : null}
        </div>

        <textarea
          ref={textareaRef}
          className="max-h-36 min-h-[44px] min-w-0 flex-1 resize-none rounded-[24px] border-none bg-white px-4 py-2.5 text-[15px] leading-5 text-[#111b21] outline-none"
          placeholder={
            stagedFile
              ? supportsCaption(stagedFile.messageType)
                ? "כיתוב (אופציונלי)"
                : "הודעה"
              : sessionOpen
                ? "הודעה חופשית"
                : "מחוץ לחלון 24 שעות חובה לבחור תבנית"
          }
          value={body}
          rows={1}
          disabled={disabled || (!sessionOpen && !hasTemplate && !stagedFile)}
          onChange={(e) => onBodyChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
        />

        <button
          type="button"
          className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full bg-[#7C4DFF] text-lg font-black text-white disabled:opacity-50"
          disabled={!canSend}
          onClick={onSend}
          aria-label="שליחה"
        >
          {sending ? "…" : "➤"}
        </button>
      </div>
    </div>
  );
}
