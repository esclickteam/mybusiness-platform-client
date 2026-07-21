import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { steelworksDefaultData } from "./defaultData";
import { steelworksEditorCss } from "./editorCss";

export const steelworksPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#1a1a1a",
  surface: "#222",
  text: "#f0f0f0",
  muted: "#aaa",
  accent: "#ff6b2c",
  border: "#ffffff18",
  dark: "#0d0d0d",
  light: "#f0f0f0",
};

export default createRectTemplatePages({
  id: "steelworks",
  variant: "steelworks",
  theme,
  pages: steelworksPages,
  defaultData: steelworksDefaultData,
  editorCss: steelworksEditorCss,
  
});
