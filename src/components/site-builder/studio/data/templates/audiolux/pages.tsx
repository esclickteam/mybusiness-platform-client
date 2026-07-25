import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { audioluxDefaultData, audioluxDemoProducts } from "./defaultData";
import { audioluxEditorCss } from "./editorCss";

export const audioluxPages = [
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

export default function AudioluxPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="audiolux"
      layout="soundStage"
      defaultData={audioluxDefaultData}
      editorCss={audioluxEditorCss}
      demoProducts={audioluxDemoProducts}
      pages={audioluxPages}
    />
  );
}
