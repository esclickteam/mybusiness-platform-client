import React from "react";
import ShinoraPages from "./pages";
import { shinoraDefaultData } from "./defaultData";

export default function ShinoraPreview() {
  return (
    <div className="h-full w-full overflow-hidden rounded-[28px] bg-[#fbf4ef] shadow-2xl">
      <div className="h-[294%] w-[294%] origin-top scale-[0.34]">
        <ShinoraPages data={shinoraDefaultData} page="home" />
      </div>
    </div>
  );
}
