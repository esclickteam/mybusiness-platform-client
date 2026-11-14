import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BizuplyLoader from "./ui/BizuplyLoader";

export default function AffiliateAutoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { replace: true, state: { reason: "affiliate-password" } });
  }, [navigate]);

  return <BizuplyLoader fullScreen label="Loading affiliate page..." />;
}
