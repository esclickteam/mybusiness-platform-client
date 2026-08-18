import React, { useLayoutEffect } from "react";

type Lang = { code: string; label: string; dir?: string };

function dirFor(lang?: Lang, code?: string) {
  const explicit = String(lang?.dir || "").toLowerCase();
  if (explicit === "ltr" || explicit === "rtl") return explicit;
  const resolved = String(code || lang?.code || "he").toLowerCase();
  return resolved === "en" || resolved.startsWith("en-") ? "ltr" : "rtl";
}

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
  const pathCode =
    typeof window === "undefined"
      ? ""
      : String(window.location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
  const fromUrl = list.find((lang) => lang.code === pathCode);
  const active = fromUrl?.code || current || list[0]?.code;
  const activeLang = list.find((lang) => lang.code === active) || list[0];

  useLayoutEffect(() => {
    if (typeof document === "undefined" || !active) return;
    const nextDir = dirFor(activeLang, active);
    document.documentElement.lang = active;
    document.documentElement.dir = nextDir;
    document.documentElement.setAttribute("lang", active);
    document.documentElement.setAttribute("dir", nextDir);
    if (document.body) document.body.setAttribute("dir", nextDir);
  }, [active, activeLang]);

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
      data-bizuply-plugin="multi-language"
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
