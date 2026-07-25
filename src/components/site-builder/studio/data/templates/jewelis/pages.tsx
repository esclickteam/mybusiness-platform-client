import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { jewelisDefaultData, jewelisDemoProducts } from "./defaultData";
import { jewelisEditorCss } from "./editorCss";

export const jewelisPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "collections", label: "קולקציות", slug: "/collections" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "lookbook", label: "לוקבוק", slug: "/lookbook" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "journal", label: "יומן", slug: "/journal" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function JewelisPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="jewelis"
      layout="jewelGallery"
      defaultData={jewelisDefaultData}
      editorCss={jewelisEditorCss}
      demoProducts={jewelisDemoProducts}
      pages={jewelisPages}
    />
  );
}
