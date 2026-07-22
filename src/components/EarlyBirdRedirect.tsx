import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import BizuplyLoader from "./ui/BizuplyLoader";

export default function EarlyBirdRedirect() {
  const { user } = useAuth();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!user?.userId) return;
    if (startedRef.current) return;

    startedRef.current = true;

    const goToCheckout = async () => {
      try {
        const res = await API.post("/stripe/create-checkout-session", {
          userId: user.userId,
          plan: "monthly",
        });

        if (res.data?.url) {
          window.location.replace(res.data.url);
        } else {
          alert("לא ניתן לפתוח את מסך התשלום כרגע");
        }
      } catch (err) {
        console.error("Early Bird redirect error:", err);
        alert("אירעה שגיאה, נסה שוב בעוד רגע");
      }
    };

    setTimeout(goToCheckout, 600);
  }, [user]);

  return (
    <BizuplyLoader
      fullScreen
      label="Your exclusive offer is ready — taking you to payment…"
    />
  );
}
