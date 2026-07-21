import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { gridlineDefaultData } from "./defaultData";
import { gridlineEditorCss } from "./editorCss";

export const gridlinePages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#f4f4f0",
  surface: "#ecece6",
  text: "#111111",
  muted: "#666660",
  accent: "#111111",
  border: "#11111122",
  dark: "#111111",
  light: "#f4f4f0",
};

export default createRectTemplatePages({
  id: "gridline",
  variant: "gridline",
  theme,
  pages: gridlinePages,
  defaultData: gridlineDefaultData,
  editorCss: gridlineEditorCss,
  
});
