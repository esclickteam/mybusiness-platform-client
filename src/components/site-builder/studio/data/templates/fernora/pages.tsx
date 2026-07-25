import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { fernoraDefaultData, fernoraDemoProducts } from "./defaultData";
import { fernoraEditorCss } from "./editorCss";

export const fernoraPages = [
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

export default function FernoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="fernora"
      layout="greenhouseGrid"
      defaultData={fernoraDefaultData}
      editorCss={fernoraEditorCss}
      demoProducts={fernoraDemoProducts}
      pages={fernoraPages}
    />
  );
}
