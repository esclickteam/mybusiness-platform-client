import React from "react";

type Lang = { code: string; label: string; dir?: string };

export default function LanguageSwitcherWidget({
  languages,
  current,
}: {
  languages: Lang[];
  current?: string;
}) {
  const list = languages?.length ? languages : [
    { code: "he", label: "HE", dir: "rtl" },
    { code: "en", label: "EN", dir: "ltr" },
  ];
  const active = current || list[0]?.code;

  function hrefFor(code: string) {
    const path = typeof window === "undefined" ? "/" : window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    if (list.some((lang) => lang.code === parts[0])) {
      parts[0] = code;
      return `/${parts.join("/")}${window.location.search || ""}`;
    }
    return `/${code}${path === "/" ? "" : path}${window.location.search || ""}`;
  }

  return (
    <div
      data-bizuply-widget="language-switcher"
      data-bizuply-plugin-runtime="true"
      className="fixed top-3 left-3 z-[2147482400] flex gap-1 rounded-full bg-white/95 p-1 text-xs shadow"
    >
      {list.map((lang) => (
        <a
          key={lang.code}
          href={hrefFor(lang.code)}
          className={
            lang.code === active
              ? "rounded-full bg-slate-900 px-2 py-1 font-bold text-white"
              : "rounded-full px-2 py-1 text-slate-600"
          }
        >
          {lang.label || lang.code.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
