// src/components/FaqTab.jsx
"use client";

import React, { useState } from 'react';
import '../build/Build.css';
import './FaqTab.css';
import API from '@api';

// Safe default value for setFaqs!
const FaqTab = ({ faqs = [], setFaqs = () => {}, isPreview }) => {
  // DEBUG: log what you received on mount
  React.useEffect(() => {
    console.log("FaqTab mount! faqs:", faqs, "setFaqs typeof:", typeof setFaqs);
    if (typeof setFaqs !== "function") {
      console.error("❌ setFaqs passed to FaqTab is not a function!", setFaqs);
    }
  }, [faqs, setFaqs]);

  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  // Ensure faqs is always an array
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  const toggleAnswer = (id) => {
    setOpenAnswers(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { question, answer } = newFaq;
    if (!question.trim() || !answer.trim()) return;

    try {
      const response = await API.post('/business/my/faqs', { question, answer });
      const added = response.data.faq ?? response.data;
      setFaqs(prev => [added, ...(prev || [])]); // safeguard: prev always array
      setNewFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ Error adding FAQ:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/business/my/faqs/${id}`);
      setFaqs(prev => (prev || []).filter(faq => (faq.faqId ?? faq._id) !== id));
    } catch (err) {
      console.error('❌ Error deleting FAQ:', err);
    }
  };

  const handleSaveEdit = async (id) => {
    const { question, answer } = editedFaq;
    if (!question.trim() || !answer.trim()) return;

    try {
      const response = await API.put(`/business/my/faqs/${id}`, { question, answer });
      const updated = response.data.faq ?? response.data;
      setFaqs(prev =>
        (prev || []).map(faq =>
          (faq.faqId ?? faq._id) === id ? updated : faq
        )
      );
      setEditFaqId(null);
      setEditedFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ Error saving edit:', err);
    }
  };

  const saveFaqsToServer = async () => {
    try {
      const payload = safeFaqs.map(f => ({
        id: f.faqId ?? f._id,
        question: f.question,
        answer: f.answer
      }));
      await API.put('/business/my/faqs', { faqs: payload });
      alert('✅ All FAQs saved!');
    } catch (err) {
      console.error('❌ Error saving:', err);
      alert('❌ Error saving');
    }
  };

  return (
    <div className="faq-tab">
      {!isPreview && (
        <>
          <h2>Add Question and Answer</h2>
          <form onSubmit={handleSubmit} className="faq-form">
            <input
              type="text"
              name="question"
              placeholder="Question"
              value={newFaq.question}
              onChange={handleChange}
            />
            <textarea
              name="answer"
              placeholder="Answer"
              value={newFaq.answer}
              onChange={handleChange}
            />
            <button type="submit">Add</button>
          </form>
          <hr />
        </>
      )}

      <h3>Questions & Answers</h3>
      <div className="faq-list">
        {safeFaqs.length === 0 ? (
          <p>No questions yet</p>
        ) : (
          safeFaqs.map(faq => {
            const id = faq.faqId ?? faq._id;
            return (
              <div key={id} className="faq-card">
                {!isPreview && (
                  <div className="faq-actions-inline">
                    <button
                      className="inline-btn edit"
                      onClick={() => {
                        setEditFaqId(id);
                        setEditedFaq({ question: faq.question, answer: faq.answer });
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="inline-btn delete"
                      onClick={() => handleDelete(id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {editFaqId === id ? (
                  <div className="faq-edit">
                    <input
                      type="text"
                      value={editedFaq.question}
                      onChange={e => setEditedFaq(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Update question"
                    />
                    <textarea
                      value={editedFaq.answer}
                      onChange={e => setEditedFaq(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Update answer"
                    />
                    <button
                      className="save-edit-btn"
                      onClick={() => handleSaveEdit(id)}
                    >
                      💾 Save Edit
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="faq-header">
                      <strong>Question:</strong> {faq.question}
                    </div>
                    <button
                      onClick={() => toggleAnswer(id)}
                      className="toggle-answer-btn"
                    >
                      {openAnswers.includes(id) ? 'Hide Answer' : 'Show Answer'}
                    </button>
                    {openAnswers.includes(id) && (
                      <div className="faq-answer-wrapper open">
                        <p><strong>Answer:</strong> {faq.answer}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {!isPreview && safeFaqs.length > 0 && (
        <button className="save-all-button" onClick={saveFaqsToServer}>
          💾 Save All
        </button>
      )}
    </div>
  );
};

export default FaqTab;
