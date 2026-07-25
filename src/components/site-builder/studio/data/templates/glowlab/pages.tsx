import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { glowlabDefaultData, glowlabDemoProducts } from "./defaultData";
import { glowlabEditorCss } from "./editorCss";

export const glowlabPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function GlowlabPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="glowlab"
      defaultData={glowlabDefaultData}
      editorCss={glowlabEditorCss}
      demoProducts={glowlabDemoProducts}
      pages={glowlabPages}
    />
  );
}
