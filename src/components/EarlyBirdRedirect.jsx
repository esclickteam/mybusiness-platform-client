import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

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
          // ⬅️ replace = לא מאפשר חזרה אחורה
          window.location.replace(res.data.url);
        } else {
          alert("לא ניתן לפתוח את מסך התשלום כרגע");
        }
      } catch (err) {
        console.error("Early Bird redirect error:", err);
        alert("אירעה שגיאה, נסה שוב בעוד רגע");
      }
    };

    // ⏳ השהיה קצרה כדי שה-Skeleton יורגש
    setTimeout(goToCheckout, 600);
  }, [user]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ ...styles.skeleton, ...styles.title }} />
        <div style={{ ...styles.skeleton, ...styles.line }} />
        <div style={{ ...styles.skeleton, ...styles.lineShort }} />
        <div style={{ ...styles.skeleton, ...styles.button }} />

        <p style={styles.note}>
          מכינים עבורך את מסך התשלום המאובטח
        </p>
      </div>
    </div>
  );
}

/* =====================
   🎨 Inline Skeleton Styles
===================== */

const shimmer = {
  background: "linear-gradient(100deg, #e5e7eb 40%, #f3f4f6 50%, #e5e7eb 60%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite",
};

const styles = {
  page: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #f6f7fb, #e8ebf8)",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  note: {
    marginTop: 16,
    fontSize: 14,
    color: "#6b7280",
  },
  skeleton: {
    ...shimmer,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    height: 28,
    width: "70%",
    margin: "0 auto 20px",
  },
  line: {
    height: 14,
    width: "100%",
  },
  lineShort: {
    height: 14,
    width: "60%",
    margin: "0 auto",
  },
  button: {
    height: 44,
    width: "100%",
    borderRadius: 12,
    marginTop: 20,
  },
};

/* 🌀 keyframes */
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;
document.head.appendChild(styleSheet);
