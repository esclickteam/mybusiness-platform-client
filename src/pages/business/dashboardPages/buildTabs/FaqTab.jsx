"use client";

import React, { useEffect, useState } from "react";
import "../build/Build.css";
import "./FaqTab.css";
import API from "@api";

const FaqTab = ({
  faqs = [],
  setFaqs = () => {},
  isPreview,
  navigate,
  businessId,
}) => {
  useEffect(() => {
    if (typeof setFaqs !== "function") {
      console.error("❌ setFaqs is not a function", setFaqs);
    }
  }, [setFaqs]);

  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: "", answer: "" });

  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  /* =====================
     Accordion toggle
  ===================== */
  const toggleAnswer = (id) => {
    setOpenAnswers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* =====================
     Add FAQ
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    try {
      const res = await API.post("/business/my/faqs", newFaq);
      const added = res.data.faq ?? res.data;

      setFaqs((prev) => [added, ...(prev || [])]);
      setNewFaq({ question: "", answer: "" });
    } catch (err) {
      console.error("❌ Error adding FAQ:", err);
    }
  };

  /* =====================
     Delete FAQ
  ===================== */
  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;

    try {
      await API.delete(`/business/my/faqs/${id}`);
      setFaqs((prev) =>
        (prev || []).filter((f) => (f.faqId ?? f._id) !== id)
      );
    } catch (err) {
      console.error("❌ Error deleting FAQ:", err);
    }
  };

  /* =====================
     Save edit
  ===================== */
  const handleSaveEdit = async (id) => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) return;

    try {
      const res = await API.put(`/business/my/faqs/${id}`, editedFaq);
      const updated = res.data.faq ?? res.data;

      setFaqs((prev) =>
        (prev || []).map((f) =>
          (f.faqId ?? f._id) === id ? updated : f
        )
      );

      setEditFaqId(null);
      setEditedFaq({ question: "", answer: "" });
    } catch (err) {
      console.error("❌ Error saving edit:", err);
    }
  };

  return (
    <div className="faq-tab">
      {/* ================= ADD ================= */}
      {!isPreview && (
        <>
          <h2 className="faq-title">Add a new question</h2>

          <form className="faq-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Question"
              value={newFaq.question}
              onChange={(e) =>
                setNewFaq((p) => ({ ...p, question: e.target.value }))
              }
            />
            <textarea
              placeholder="Answer"
              value={newFaq.answer}
              onChange={(e) =>
                setNewFaq((p) => ({ ...p, answer: e.target.value }))
              }
            />
            <button type="submit">➕ Add FAQ</button>
          </form>

          <hr />
        </>
      )}

      {/* ================= LIST ================= */}
      <h3 className="faq-subtitle">Questions & Answers</h3>

      <div className="faq-list">
        {safeFaqs.length === 0 && (
          <p className="faq-empty">No questions yet</p>
        )}

        {safeFaqs.map((faq) => {
          const id = faq.faqId ?? faq._id;
          const isOpen = openAnswers.includes(id);

          return (
            <div key={id} className={`faq-card ${isOpen ? "open" : ""}`}>
              {/* Actions */}
              {!isPreview && editFaqId !== id && (
                <div className="faq-actions">
                  <button
                    className="icon-btn"
                    title="Edit"
                    onClick={() => {
                      setEditFaqId(id);
                      setEditedFaq({
                        question: faq.question,
                        answer: faq.answer,
                      });
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn danger"
                    title="Delete"
                    onClick={() => handleDelete(id)}
                  >
                    🗑️
                  </button>
                </div>
              )}

              {/* EDIT MODE */}
              {editFaqId === id ? (
                <div className="faq-edit">
                  <input
                    value={editedFaq.question}
                    onChange={(e) =>
                      setEditedFaq((p) => ({
                        ...p,
                        question: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    value={editedFaq.answer}
                    onChange={(e) =>
                      setEditedFaq((p) => ({
                        ...p,
                        answer: e.target.value,
                      }))
                    }
                  />

                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(id)}>
                      💾 Save
                    </button>
                    <button
                      className="secondary"
                      onClick={() => setEditFaqId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="faq-header"
                    onClick={() => toggleAnswer(id)}
                  >
                    <span className="faq-question">{faq.question}</span>
                    <span className="faq-arrow">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= VIEW PUBLIC PROFILE ================= */}
      {!isPreview &&
        safeFaqs.length > 0 &&
        navigate &&
        businessId && (
          <button
            type="button"
            className="view-profile-btn"
            onClick={() =>
              navigate(`/business/${businessId}?tab=reviews`)
            }
          >
            👀 View Public Profile
          </button>
        )}
    </div>
  );
};

export default FaqTab;
