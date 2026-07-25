import React from "react";
import StoreSiteRuntime from "../shared/StoreSiteRuntime";
import { petoraDefaultData, petoraDemoProducts } from "./defaultData";
import { petoraEditorCss } from "./editorCss";

export const petoraPages = [
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

export default function PetoraPages(props: any) {
  return (
    <StoreSiteRuntime
      {...props}
      templateId="petora"
      layout="playfulPets"
      defaultData={petoraDefaultData}
      editorCss={petoraEditorCss}
      demoProducts={petoraDemoProducts}
      pages={petoraPages}
    />
  );
}
