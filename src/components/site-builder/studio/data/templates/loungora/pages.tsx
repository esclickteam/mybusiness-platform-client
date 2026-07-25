import React from "react";
import RichStoreSiteRuntime from "../shared/RichStoreSiteRuntime";
import { loungoraDefaultData, loungoraDemoProducts } from "./defaultData";
import { loungoraEditorCss } from "./editorCss";

export const loungoraPages = [
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

export default function LoungoraPages(props: any) {
  return (
    <RichStoreSiteRuntime
      {...props}
      templateId="loungora"
      layout="quietLounge"
      defaultData={loungoraDefaultData}
      editorCss={loungoraEditorCss}
      demoProducts={loungoraDemoProducts}
      pages={loungoraPages}
    />
  );
}
