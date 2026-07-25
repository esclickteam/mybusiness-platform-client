import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { linenhausDefaultData, linenhausDemoProducts } from "./defaultData";
import { linenhausEditorCss } from "./editorCss";

export const linenhausPages = [
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

export default function LinenhausPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="linenhaus"
      layout="softFold"
      defaultData={linenhausDefaultData}
      editorCss={linenhausEditorCss}
      demoProducts={linenhausDemoProducts}
      pages={linenhausPages}
    />
  );
}
