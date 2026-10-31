import React from "react";
import type { WhatsAppConnectionPath } from "./embeddedSignupCoexistence";

export type WhatsAppCoexistencePathPickerCopy = {
  cloudTitle: string;
  cloudBody: string;
  appTitle: string;
  appBody: string;
  limitsTitle: string;
  limits: string[];
};

type Props = {
  path: WhatsAppConnectionPath;
  onChange: (path: WhatsAppConnectionPath) => void;
  disabled?: boolean;
  copy: WhatsAppCoexistencePathPickerCopy;
};

export default function WhatsAppCoexistencePathPicker({
  path,
  onChange,
  disabled,
  copy,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <PathCard
          selected={path === "cloud_api"}
          disabled={disabled}
          title={copy.cloudTitle}
          body={copy.cloudBody}
          onSelect={() => onChange("cloud_api")}
        />
        <PathCard
          selected={path === "coexistence"}
          disabled={disabled}
          title={copy.appTitle}
          body={copy.appBody}
          onSelect={() => onChange("coexistence")}
        />
      </div>
      {path === "coexistence" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-black">{copy.limitsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-xs font-medium">
            {copy.limits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PathCard({
  selected,
  disabled,
  title,
  body,
  onSelect,
}: {
  selected: boolean;
  disabled?: boolean;
  title: string;
  body: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`rounded-xl border px-4 py-3 text-start ${
        selected
          ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-medium text-slate-600">{body}</p>
    </button>
  );
}
