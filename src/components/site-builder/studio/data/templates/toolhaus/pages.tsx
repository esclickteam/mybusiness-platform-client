import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { toolhausDefaultData, toolhausDemoProducts } from "./defaultData";
import { toolhausEditorCss } from "./editorCss";

export const toolhausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function ToolhausPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="toolhaus"
      defaultData={toolhausDefaultData}
      editorCss={toolhausEditorCss}
      demoProducts={toolhausDemoProducts}
      pages={toolhausPages}
    />
  );
}
