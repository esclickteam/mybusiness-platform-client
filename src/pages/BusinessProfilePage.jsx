import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function BusinessProfilePage() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await API.get(`/business/${businessId}`);
        setBusiness(res.data.business);
      } catch (err) {
        setError("שגיאה בטעינת פרטי העסק");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, [businessId]);

  if (loading) return <p>טוען פרופיל...</p>;
  if (error) return <p>{error}</p>;
  if (!business) return <p>העסק לא נמצא.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{business.businessName}</h1>
      <img
        src={business.logo || "/default-logo.png"}
        alt={`${business.businessName} לוגו`}
        style={{ maxWidth: 200, borderRadius: 8 }}
      />
      <p><b>קטגוריה:</b> {business.category}</p>
      <p><b>אזור פעילות:</b> {business.area || "לא מוגדר"}</p>
      <p><b>תיאור:</b> {business.description}</p>
      {/* הוסף שדות נוספים לפי הצורך */}
    </div>
  );
}
