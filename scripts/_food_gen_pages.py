"""Fragment: gen_pages for food templates."""


def _page_fn_name(pid: str) -> str:
    return "".join(part.capitalize() for part in pid.replace("-", "_").split("_")) + "Page"


def gen_pages(t):
    p = t["palette"]
    tid = t["id"]
    name = t["name"]
    layout = t["layout"]
    pages = t["pages"]
    pages_arr = "\n".join(
        f'  {{ id: "{pid}", label: "{label}", slug: "{slug}" }},'
        for pid, label, slug in pages
    )
    hero = hero_jsx(t)
    header = header_jsx(t)
    footer = footer_jsx(t)
    sec = LAYOUT_SECTIONS[layout]
    home_defs = paint(sec["home_defs"], p)
    page1_defs = paint(sec["page1_defs"], p)
    page2_defs = paint(sec["page2_defs"], p)
    about_defs = paint(sec["about_defs"], p)
    contact_defs = paint(sec["contact_defs"], p)
    home_bits = "\n      ".join(sec["home_uses"])
    page1_bits = "\n      ".join(sec["page1_uses"])
    page2_bits = "\n      ".join(sec["page2_uses"])
    about_bits = "\n      ".join(sec["about_uses"])
    contact_bits = "\n      ".join(sec["contact_uses"])

    p1_id = pages[1][0]
    p2_id = pages[2][0]
    about_id = pages[3][0]
    contact_id = pages[4][0]
    p1_fn = _page_fn_name(p1_id)
    p2_fn = _page_fn_name(p2_id)
    about_fn = _page_fn_name(about_id)
    contact_fn = _page_fn_name(contact_id)

    needs_use_state = "setOpen" in header or layout == "flameStack"
    react_import = (
        'import React, { useMemo, useState } from "react";'
        if needs_use_state
        else 'import React, { useMemo } from "react";'
    )
    open_line = "  const [open, setOpen] = useState(false);\n" if "setOpen" in header else ""

    page_content_block = "\n".join(
        [
            f'    home: <HomePage data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {p1_id}: <{p1_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {p2_id}: <{p2_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {about_id}: <{about_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
            f'    {contact_id}: <{contact_fn} data={{merged}} goTo={{goTo}} onCta={{() => goTo("contact")}} />,',
        ]
    )

    return f'''{react_import}
import {{ VisualPageStack }} from "../../../../runtime/VisualPageStack";
import {{ {tid}DefaultData }} from "./defaultData";
import {{ {tid}EditorCss }} from "./editorCss";
import {{ useTemplatePageNavigation }} from "../shared/useTemplatePageNavigation";
import {{ Reveal }} from "../shared/Reveal";

export const {tid}Pages = [
{pages_arr}
];

const allowedPages = {tid}Pages.map((p) => p.id);

type Props = {{
  initialPage?: string; initialPageId?: string; page?: string; pageId?: string;
  activePageId?: string; currentPageId?: string; mode?: "preview" | "edit" | "published";
  data?: Record<string, any>; onPageChange?: (pageId: string) => void;
  isPublic?: boolean; viewMode?: string; runtimeMode?: string;
}};

function v(data: Record<string, any>, key: string) {{
  return data?.[key] ?? ({tid}DefaultData as Record<string, any>)[key] ?? "";
}}

function Header({{ data, currentPage, goTo, onCta }}: {{ data: Record<string, any>; currentPage: string; goTo: (id: string) => void; onCta: () => void }}) {{
{open_line}  const nav = {tid}Pages.map((p) => [p.id, v(data, `nav${{p.id[0].toUpperCase()}}${{p.id.slice(1)}}`) || p.label] as const);
  return ({header}
  );
}}

function Hero({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return ({hero}
  );
}}

{home_defs}

{page1_defs}

{page2_defs}

{about_defs}

{contact_defs}

function Footer({{ data }}: {{ data: Record<string, any> }}) {{
  return ({footer}
  );
}}

function HomePage({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      <Hero data={{data}} goTo={{goTo}} onCta={{onCta}} />
      {home_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {p1_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {page1_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {p2_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {page2_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {about_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {about_bits}
      <Footer data={{data}} />
    </>
  );
}}

function {contact_fn}({{ data, goTo, onCta }}: {{ data: Record<string, any>; goTo: (id: string) => void; onCta: () => void }}) {{
  return (
    <>
      {contact_bits}
      <Footer data={{data}} />
    </>
  );
}}

export default function {name}Pages({{
  initialPage = "home", initialPageId, page, pageId, activePageId, currentPageId,
  mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode,
}}: Props) {{
  const merged = useMemo(() => ({{ ...{tid}DefaultData, ...(data ?? {{}}) }}), [data]);
  const {{ currentPage, goTo }} = useTemplatePageNavigation(
    {{ page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode }},
    {{ allowedPages, fallbackPage: "home" }},
  );
  const pageContent: Record<string, React.ReactNode> = {{
{page_content_block}
  }};
  return (
    <div dir="rtl" data-template-id={{mode === "preview" ? "{tid}-preview" : "{tid}"}} className="min-h-screen w-full overflow-x-hidden"
      style={{{{ background: "{p['bg']}", color: "{p['text']}" }}}}>
      <style dangerouslySetInnerHTML={{{{ __html: {tid}EditorCss }}}} />
      <Header data={{merged}} currentPage={{currentPage}} goTo={{goTo}} onCta={{() => goTo("contact")}} />
      <VisualPageStack activePageId={{currentPage}} pages={{Object.entries(pageContent).map(([id, content]) => ({{ id, content }}))}} />
    </div>
  );
}}
'''
