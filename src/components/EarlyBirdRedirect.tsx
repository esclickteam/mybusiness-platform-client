import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import BizuplyLoader from "./ui/BizuplyLoader";
import { billingCheckoutErrorMessage } from "../components/billing/billingCopy";

export default function EarlyBirdRedirect() {
  const { t, i18n } = useTranslation();
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
          language: i18n.language,
        });

        if (res.data?.url) {
          window.location.replace(res.data.url);
        } else {
          alert(
            billingCheckoutErrorMessage(
              t,
              res.data?.code,
              "leftover.errors.checkoutUnavailable"
            )
          );
        }
      } catch (err) {
        console.error("Early Bird redirect error:", err);
        const code =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { code?: string } } }).response?.data
                ?.code
            : undefined;
        alert(
          billingCheckoutErrorMessage(
            t,
            code,
            "leftover.errors.tryAgainSoon"
          )
        );
      }
    };

    setTimeout(goToCheckout, 600);
  }, [user, i18n.language, t]);

  return (
    <BizuplyLoader
      fullScreen
      label={t("billing.earlyBird.redirecting")}
    />
  );
}
