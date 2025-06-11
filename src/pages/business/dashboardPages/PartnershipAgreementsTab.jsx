import React, { useState, useEffect } from "react";
import API from "@api";
import PartnershipAgreement from "./SignAgreement";

export default function PartnershipAgreementsTab({ userBusinessId }) {
  const [agreements, setAgreements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAgreements() {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/partnershipAgreements");
        setAgreements(res.data || []);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת ההסכמים");
      } finally {
        setLoading(false);
      }
    }
    fetchAgreements();
  }, []);

  if (loading) return <p>טוען הסכמים...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (selectedId)
    return (
      <div>
        <button onClick={() => setSelectedId(null)} style={{ marginBottom: 10 }}>
          ⬅ חזור לרשימת ההסכמים
        </button>
        <PartnershipAgreement agreementId={selectedId} userBusinessId={userBusinessId} />
      </div>
    );

  if (agreements.length === 0)
    return <p>אין הסכמים להצגה</p>;

  return (
    <div>
      <h2>הסכמי שיתוף פעולה</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {agreements.map((agreement) => (
          <li key={agreement._id} style={{ marginBottom: 10 }}>
            <button
              onClick={() => setSelectedId(agreement._id)}
              style={{
                width: "100%",
                textAlign: "right",
                padding: "10px 15px",
                borderRadius: 5,
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {agreement.title} - סטטוס: {agreement.status} <br />
              {agreement.startDate ? `מתאריך: ${new Date(agreement.startDate).toLocaleDateString()}` : ""}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
