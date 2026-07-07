import React from "react";

import NadlanistPages from "./pages";
import { nadlanistDefaultData } from "./defaultData";

export default function NadlanistPreview() {
  return (
    <div
      dir="ltr"
      data-template-id="nadlanist-preview"
      className="h-screen min-h-screen w-full overflow-hidden bg-[#10100e] text-[#f6efe3]"
    >
      <NadlanistPages
        initialPage="home"
        mode="preview"
        defaultData={nadlanistDefaultData}
      />
    </div>
  );
}