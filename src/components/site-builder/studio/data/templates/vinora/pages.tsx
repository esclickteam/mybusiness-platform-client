import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { vinoraDefaultData, vinoraDemoProducts } from "./defaultData";
import { vinoraEditorCss } from "./editorCss";

export const vinoraPages = [
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

export default function VinoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="vinora"
      layout="cellarVault"
      defaultData={vinoraDefaultData}
      editorCss={vinoraEditorCss}
      demoProducts={vinoraDemoProducts}
      pages={vinoraPages}
    />
  );
}
