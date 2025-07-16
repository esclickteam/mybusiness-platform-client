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
        setUser(data);
        // אפשר לעדכן גם טוקן אם צריך
        navigate(data.role === "business" ? `/business/${data.businessId}/dashboard` : "/dashboard");
      } catch (err) {
        console.error("Failed to fetch user after payment:", err);
        navigate("/login");
      }
    }
    fetchUser();
  }, [navigate, setUser]);

  return <div>טוען נתונים לאחר תשלום, אנא המתן...</div>;
}