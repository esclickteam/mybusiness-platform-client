import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { horizonDefaultData } from "./defaultData";
import { horizonEditorCss } from "./editorCss";

export const horizonPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "נכסים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#f7f3ed",
  surface: "#fffdf9",
  text: "#1c1c1c",
  muted: "#6b645c",
  accent: "#b8956b",
  border: "#1c1c1c18",
  dark: "#1c1c1c",
  light: "#f7f3ed",
};

export default createRectTemplatePages({
  id: "horizon",
  variant: "horizon",
  theme,
  pages: horizonPages,
  defaultData: horizonDefaultData,
  editorCss: horizonEditorCss,
  
});
