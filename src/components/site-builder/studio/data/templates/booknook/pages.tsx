import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { booknookDefaultData, booknookDemoProducts } from "./defaultData";
import { booknookEditorCss } from "./editorCss";

export const booknookPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

export default function BooknookPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="booknook"
      defaultData={booknookDefaultData}
      editorCss={booknookEditorCss}
      demoProducts={booknookDemoProducts}
      pages={booknookPages}
    />
  );
}
