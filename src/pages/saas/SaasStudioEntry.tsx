import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

export default function SaasStudioEntry() {
  const { templateSlug = "", publicSlug = "" } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    API.post("/saas-owner/open-studio", { templateSlug, publicSlug })
      .then((response) => {
        if (!alive) return;
        const path = String(response.data?.editorPath || "");
        if (!path.startsWith("/business/")) {
          setError("העורך לא נפתח");
          return;
        }
        navigate(path, { replace: true });
      })
      .catch(() => {
        if (alive) setError("החשבון הזה אינו בעל העותק, או שאין לו הרשאת עיצוב.");
      });
    return () => {
      alive = false;
    };
  }, [templateSlug, publicSlug, navigate]);

  if (error) return <main className="mx-auto max-w-lg p-8 text-sm">{error}</main>;
  return <main className="mx-auto max-w-lg p-8 text-sm">פותח את עיצוב המערכת…</main>;
}
