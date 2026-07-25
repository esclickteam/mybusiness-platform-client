import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { lumenwareDefaultData, lumenwareDemoProducts } from "./defaultData";
import { lumenwareEditorCss } from "./editorCss";

export const lumenwarePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function LumenwarePages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="lumenware"
      defaultData={lumenwareDefaultData}
      editorCss={lumenwareEditorCss}
      demoProducts={lumenwareDemoProducts}
      pages={lumenwarePages}
    />
  );
}
