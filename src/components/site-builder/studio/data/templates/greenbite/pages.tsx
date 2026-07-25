import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { greenbiteDefaultData, greenbiteDemoProducts } from "./defaultData";
import { greenbiteEditorCss } from "./editorCss";

export const greenbitePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function GreenbitePages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="greenbite"
      defaultData={greenbiteDefaultData}
      editorCss={greenbiteEditorCss}
      demoProducts={greenbiteDemoProducts}
      pages={greenbitePages}
    />
  );
}
