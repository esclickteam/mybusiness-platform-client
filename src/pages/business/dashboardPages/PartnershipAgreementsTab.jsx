import React, { useState, useEffect } from "react";
import API from "@api";
import PartnershipAgreement from "./SignAgreement";
import "./PartnershipAgreementsTab.css";

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
        setError("Error loading agreements");
      } finally {
        setLoading(false);
      }
    }
    fetchAgreements();
  }, []);

  if (loading) return <p>Loading agreements...</p>;
  if (error) return <p className="error">{error}</p>;

  if (selectedId)
    return (
      <div>
        <button className="back-btn" onClick={() => setSelectedId(null)}>
          ⬅ Back to agreements list
        </button>
        <PartnershipAgreement agreementId={selectedId} userBusinessId={userBusinessId} />
      </div>
    );

  if (agreements.length === 0) return <p>No agreements to display</p>;

  return (
    <div className="agreements-container">
      <h2>Partnership Agreements</h2>
      <ul className="agreements-list">
        {agreements.map((agreement) => (
          <li key={agreement._id} className="agreement-item">
            <button
              onClick={() => setSelectedId(agreement._id)}
              className="agreement-btn"
            >
              {agreement.title} - Status: {agreement.status} <br />
              {agreement.startDate
                ? `From: ${new Date(agreement.startDate).toLocaleDateString()}`
                : ""}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
