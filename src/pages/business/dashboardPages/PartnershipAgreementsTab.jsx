import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import API from "@api";
import PartnershipAgreement from "./SignAgreement";
import "./PartnershipAgreementsTab.css";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

export default function PartnershipAgreementsTab({ userBusinessId }) {
  const { t } = useTranslation();
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
        setError(t("leftover.collab.agreementsList.loadError"));
      } finally {
        setLoading(false);
      }
    }
    fetchAgreements();
  }, []);

  if (loading) return <BizuplyLoader fullScreen label={t("leftover.collab.agreementsList.loading")} />;
  if (error) return <p className="error">{error}</p>;

  if (selectedId)
    return (
      <div>
        <button className="back-btn" onClick={() => setSelectedId(null)}>
          ⬅ {t("leftover.collab.agreementsList.back")}
        </button>
        <PartnershipAgreement agreementId={selectedId} userBusinessId={userBusinessId} />
      </div>
    );

  if (agreements.length === 0) return <p>{t("leftover.collab.agreementsList.empty")}</p>;

  return (
    <div className="agreements-container">
      <h2>{t("leftover.collab.agreementsList.title")}</h2>
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