import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ProductixPages from "./pages";

export default function ProductixPreview() {
  return (
    <div dir={templateDir()} data-template-id="productix" className="min-h-screen w-full overflow-x-hidden">
      <ProductixPages initialPage="home" mode="preview" />
    </div>
  );
}
