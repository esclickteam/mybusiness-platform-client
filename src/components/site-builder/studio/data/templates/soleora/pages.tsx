import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { soleoraDefaultData, soleoraDemoProducts } from "./defaultData";
import { soleoraEditorCss } from "./editorCss";

export const soleoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "collections", label: "קולקציות", slug: "/collections" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "lookbook", label: "גלריה", slug: "/lookbook" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "journal", label: "מגזין", slug: "/journal" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function SoleoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="soleora"
      layout="lastBench"
      defaultData={soleoraDefaultData}
      editorCss={soleoraEditorCss}
      demoProducts={soleoraDemoProducts}
      pages={soleoraPages}
    />
  );
}
