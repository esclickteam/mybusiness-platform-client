import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { toolhausDefaultData, toolhausDemoProducts } from "./defaultData";
import { toolhausEditorCss } from "./editorCss";

export const toolhausPages = [
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

export default function ToolhausPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="toolhaus"
      layout="industrialYard"
      defaultData={toolhausDefaultData}
      editorCss={toolhausEditorCss}
      demoProducts={toolhausDemoProducts}
      pages={toolhausPages}
    />
  );
}
