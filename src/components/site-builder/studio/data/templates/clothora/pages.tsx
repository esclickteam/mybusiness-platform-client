import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { clothoraDefaultData, clothoraDemoProducts } from "./defaultData";
import { clothoraEditorCss } from "./editorCss";

export const clothoraPages = [
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

export default function ClothoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="clothora"
      layout="runwayRail"
      defaultData={clothoraDefaultData}
      editorCss={clothoraEditorCss}
      demoProducts={clothoraDemoProducts}
      pages={clothoraPages}
    />
  );
}
