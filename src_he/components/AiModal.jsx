import React, { useState, useEffect } from "react";
import { useAi } from "../context/AiContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./AiModal.css";  

export default function AiModal() {
  const { activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading } = useAi();
  const location = useLocation();
  const navigate = useNavigate();

  const [editedText, setEditedText] = useState("");

  const isBusinessManagementTab =
    location.pathname.startsWith("/business/") &&
    (location.pathname.includes("/dashboard") || location.pathname.includes("/chat"));

  useEffect(() => {
    if (activeSuggestion) setEditedText(activeSuggestion.text || "");
  }, [activeSuggestion]);

  if (!activeSuggestion || !isBusinessManagementTab) return null;

  const handleApprove = async () => {
    await approveSuggestion(activeSuggestion.id, editedText);
    closeModal();
    if (activeSuggestion.conversationId) {
      navigate(`/business/chat/${activeSuggestion.conversationId}`);
    }
  };

  return (
    <div className="ai-modal-overlay" onClick={closeModal} aria-modal="true" role="dialog">
      <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="ai-modal-title">New AI Message</h2>
        <textarea
          className="ai-modal-textarea"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          spellCheck={false}
        />
        <div className="ai-modal-buttons">
          <button
            className="ai-modal-button approve-btn"
            onClick={handleApprove}
            disabled={loading}
          >
            Approve and Send
          </button>
          <button
            className="ai-modal-button reject-btn"
            onClick={() => rejectSuggestion(activeSuggestion.id)}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="ai-modal-button close-btn"
            onClick={closeModal}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
