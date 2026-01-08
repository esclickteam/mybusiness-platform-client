import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";

export default function EarlyBirdRedirect() {
  const { user } = useAuth();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!user?.userId) return;
    if (startedRef.current) return;

    startedRef.current = true;

    const goToCheckout = async () => {
      try {
        const res = await API.post(
          "/stripe/create-checkout-session",
          {
            userId: user.userId,
            plan: "monthly",
          }
        );

        if (res.data?.url) {
          window.location.replace(res.data.url); // ⬅️ חשוב: replace
        } else {
          alert("Checkout unavailable");
        }
      } catch (err) {
        console.error("Early Bird redirect error:", err);
        alert("Something went wrong");
      }
    };

    goToCheckout();
  }, [user]);

  return (
    <p style={{ padding: 40, fontSize: 16 }}>
      Redirecting to secure checkout…
    </p>
  );
}
