import React from "react";
import ProductixPages from "./pages";

export default function ProductixPreview() {
  return (
    <div dir="rtl" data-template-id="productix" className="min-h-screen w-full overflow-x-hidden">
      <ProductixPages initialPage="home" mode="preview" />
    </div>
  );
}
