import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { sportifyaDefaultData, sportifyaDemoProducts } from "./defaultData";
import { sportifyaEditorCss } from "./editorCss";

export const sportifyaPages = [
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

export default function SportifyaPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="sportifya"
      layout="athleticStack"
      defaultData={sportifyaDefaultData}
      editorCss={sportifyaEditorCss}
      demoProducts={sportifyaDemoProducts}
      pages={sportifyaPages}
    />
  );
}
