import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

type Mode = "alert" | "confirm" | "prompt";

type Pending = {
  mode: Mode;
  title: string;
  message: string;
  defaultValue: string;
  resolve: (value: string | boolean | null) => void;
};

let opener: ((pending: Pending) => void) | null = null;

function openDialog(pending: Omit<Pending, "resolve">) {
  return new Promise<string | boolean | null>((resolve) => {
    if (!opener) {
      resolve(pending.mode === "confirm" ? false : null);
      return;
    }
    opener({ ...pending, resolve });
  });
}

export function bizAlert(message: string, title = "") {
  return openDialog({ mode: "alert", title, message, defaultValue: "" }).then(() => undefined);
}

export function bizConfirm(message: string, title = "") {
  return openDialog({ mode: "confirm", title, message, defaultValue: "" }).then(
    (value) => value === true
  );
}

export function bizPrompt(message: string, defaultValue = "", title = "") {
  return openDialog({ mode: "prompt", title, message, defaultValue }).then((value) =>
    typeof value === "string" ? value : null
  );
}

export function BizDialogHost() {
  const { t } = useTranslation();
  const [pending, setPending] = useState<Pending | null>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    opener = (next) => {
      setValue(next.defaultValue || "");
      setPending(next);
    };
    return () => {
      opener = null;
    };
  }, []);

  function finish(result: string | boolean | null) {
    pending?.resolve(result);
    setPending(null);
  }

  if (!pending || typeof document === "undefined") return null;

  const cancel = () => finish(pending.mode === "confirm" ? false : null);
  const accept = () => finish(pending.mode === "prompt" ? value : true);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#21172F]/40 p-4"
      onMouseDown={cancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="biz-dialog-title"
        dir={document.documentElement.dir || "rtl"}
        className="w-full max-w-md border border-violet-200 bg-white p-4 text-[#21172F] shadow-[0_18px_50px_rgba(33,23,47,0.18)]"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          } else if (event.key === "Enter") {
            event.preventDefault();
            accept();
          }
        }}
      >
        <h2 id="biz-dialog-title" className="text-base font-black">
          {pending.title || "BizUply"}
        </h2>
        {pending.message ? (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#3a314c]">{pending.message}</p>
        ) : null}
        {pending.mode === "prompt" ? (
          <input
            autoFocus
            className="mt-3 w-full border border-violet-200 bg-white px-3 py-2 text-sm text-[#21172F] outline-none focus:border-[#5B21B6]"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        ) : null}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {pending.mode !== "alert" ? (
            <button
              type="button"
              className="min-h-10 border border-violet-200 bg-white px-4 text-sm font-black text-[#21172F]"
              onClick={cancel}
            >
              {t("common.cancel")}
            </button>
          ) : null}
          <button
            type="button"
            autoFocus={pending.mode !== "prompt"}
            className="min-h-10 border border-[#5B21B6] bg-[#5B21B6] px-4 text-sm font-black text-white"
            onClick={accept}
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
