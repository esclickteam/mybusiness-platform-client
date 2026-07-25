import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { vitaraDefaultData, vitaraDemoProducts } from "./defaultData";
import { vitaraEditorCss } from "./editorCss";

export const vitaraPages = [
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

export default function VitaraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="vitara"
      layout="doseGrid"
      defaultData={vitaraDefaultData}
      editorCss={vitaraEditorCss}
      demoProducts={vitaraDemoProducts}
      pages={vitaraPages}
    />
  );
}
