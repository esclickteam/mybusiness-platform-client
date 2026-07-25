import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { wheeloraDefaultData, wheeloraDemoProducts } from "./defaultData";
import { wheeloraEditorCss } from "./editorCss";

export const wheeloraPages = [
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

export default function WheeloraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="wheelora"
      layout="veloTrack"
      defaultData={wheeloraDefaultData}
      editorCss={wheeloraEditorCss}
      demoProducts={wheeloraDemoProducts}
      pages={wheeloraPages}
    />
  );
}
