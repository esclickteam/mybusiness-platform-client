import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { kickoraDefaultData, kickoraDemoProducts } from "./defaultData";
import { kickoraEditorCss } from "./editorCss";

export const kickoraPages = [
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

export default function KickoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="kickora"
      layout="streetDrop"
      defaultData={kickoraDefaultData}
      editorCss={kickoraEditorCss}
      demoProducts={kickoraDemoProducts}
      pages={kickoraPages}
    />
  );
}
