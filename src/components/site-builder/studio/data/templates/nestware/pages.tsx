import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { nestwareDefaultData, nestwareDemoProducts } from "./defaultData";
import { nestwareEditorCss } from "./editorCss";

export const nestwarePages = [
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

export default function NestwarePages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="nestware"
      layout="roomShelf"
      defaultData={nestwareDefaultData}
      editorCss={nestwareEditorCss}
      demoProducts={nestwareDemoProducts}
      pages={nestwarePages}
    />
  );
}
