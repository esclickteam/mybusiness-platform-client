import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get("/auth/me", { withCredentials: true });
        const user = data.user || data; // תלוי איך השרת מחזיר
        setUser(user);
        // אם אתם מחזירים טוקן חדש יש לעדכן גם אותו:
        // setToken(data.accessToken);

        if (user.role === "business" && user.businessId) {
          navigate(`/business/${user.businessId}/dashboard`);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Failed to fetch user after payment:", err);
        navigate("/login");
      }
    }
    fetchUser();
  }, [navigate, setUser, setToken]);

  return <div>טוען נתונים לאחר תשלום, אנא המתן...</div>;
}
