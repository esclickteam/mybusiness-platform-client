import React from "react";
import { useAi } from "../context/AiContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./AiModal.css";  

export default function AiModal() {
  const { activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading } = useAi();
  const location = useLocation();
  const navigate = useNavigate();

  const isBusinessManagementTab =
    location.pathname.startsWith("/business/") &&
    (location.pathname.includes("/dashboard") || location.pathname.includes("/chat"));

  if (!activeSuggestion || !isBusinessManagementTab) return null;

  const handleApprove = async () => {
    await approveSuggestion(activeSuggestion.id);
    closeModal();
    if (activeSuggestion.conversationId) {
      navigate(`/business/chat/${activeSuggestion.conversationId}`);
    }
  };

  return (
    <div className="ai-modal-overlay" onClick={closeModal} aria-modal="true" role="dialog">
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="ai-modal-title">הודעת AI חדשה</h2>
        <p className="ai-modal-text">{activeSuggestion.text}</p>
        <div className="ai-modal-buttons">
          <button
            className="ai-modal-button approve-btn"
            onClick={handleApprove}
            disabled={loading}
          >
            אשר ושלח
          </button>
          <button
            className="ai-modal-button reject-btn"
            onClick={() => rejectSuggestion(activeSuggestion.id)}
            disabled={loading}
          >
            דחה
          </button>
          <button
            className="ai-modal-button close-btn"
            onClick={closeModal}
            disabled={loading}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}
