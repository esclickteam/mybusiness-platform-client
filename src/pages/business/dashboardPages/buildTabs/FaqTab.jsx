import React, { useState, useEffect } from 'react';
import '../Build.css';
import './FaqTab.css';
import { v4 as uuidv4 } from 'uuid';
import API from '@api'; // לוודא קיים

const FaqTab = ({ faqs, setFaqs, isPreview, currentUser }) => {
  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  const isValidUuid = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);

  useEffect(() => {
    const upgradedFaqs = faqs.map((faq) => {
      if (!isValidUuid(faq.id)) {
        return { ...faq, id: uuidv4() };
      }
      return faq;
    });
    const hasUpgrades = upgradedFaqs.some((faq, idx) => faq.id !== faqs[idx].id);
    if (hasUpgrades) {
      setFaqs(upgradedFaqs);
      saveFaqsToServer(upgradedFaqs);
    }
  }, []);

  const saveFaqsToServer = async (updatedFaqs) => {
    try {
      await API.put(`/business/${currentUser.businessId}`, { faqs: updatedFaqs });
      console.log("✅ נשמר לשרת");
    } catch (err) {
      console.error("❌ שגיאה בשמירה:", err);
    }
  };

  const toggleAnswer = (id) => {
    setOpenAnswers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const newEntry = { ...newFaq, id: uuidv4(), userId: currentUser.id };
    const updatedFaqs = [newEntry, ...faqs];

    setFaqs(updatedFaqs);
    saveFaqsToServer(updatedFaqs);
    setNewFaq({ question: '', answer: '' });
  };

  const handleDelete = (id) => {
    const updated = faqs.filter((faq) => faq.id !== id);
    setFaqs(updated);
    saveFaqsToServer(updated);
  };

  const handleSaveEdit = (id) => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) return;

    const updated = faqs.map((faq) =>
      faq.id === id ? { ...faq, question: editedFaq.question, answer: editedFaq.answer } : faq
    );
    setFaqs(updated);
    saveFaqsToServer(updated);
    setEditFaqId(null);
    setEditedFaq({ question: '', answer: '' });
  };

  return (
    <div className="faq-tab">
      {!isPreview && (
        <>
          <h2>הוספת שאלה ותשובה</h2>
          <form onSubmit={handleSubmit} className="faq-form">
            <input
              type="text"
              name="question"
              placeholder="שאלה"
              value={newFaq.question}
              onChange={handleChange}
            />
            <textarea
              name="answer"
              placeholder="תשובה"
              value={newFaq.answer}
              onChange={handleChange}
            />
            <button type="submit">הוסף</button>
          </form>
          <hr />
        </>
      )}

      <h3>שאלות ותשובות</h3>
      <div className="faq-list">
        {faqs.length === 0 ? (
          <p>אין עדיין שאלות</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="faq-card">
              {!isPreview && faq.userId === currentUser.id && (
                <div className="faq-actions-inline">
                  <button
                    className="inline-btn edit"
                    onClick={() => {
                      setEditFaqId(faq.id);
                      setEditedFaq({ question: faq.question, answer: faq.answer });
                    }}
                  >
                    ✏️ ערוך
                  </button>
                  <button
                    className="inline-btn delete"
                    onClick={() => handleDelete(faq.id)}
                  >
                    🗑️ מחק
                  </button>
                </div>
              )}

              {editFaqId === faq.id ? (
                <div className="faq-edit">
                  <input
                    type="text"
                    value={editedFaq.question}
                    onChange={(e) => setEditedFaq((prev) => ({ ...prev, question: e.target.value }))}
                    placeholder="עדכן את השאלה"
                  />
                  <textarea
                    value={editedFaq.answer}
                    onChange={(e) => setEditedFaq((prev) => ({ ...prev, answer: e.target.value }))}
                    placeholder="עדכן את התשובה"
                  />
                  <button
                    className="save-edit-btn"
                    onClick={() => handleSaveEdit(faq.id)}
                  >
                    💾 שמור
                  </button>
                </div>
              ) : (
                <>
                  <div className="faq-header">
                    <strong>שאלה:</strong> {faq.question}
                  </div>
                  <button
                    onClick={() => toggleAnswer(faq.id)}
                    className="toggle-answer-btn"
                  >
                    {openAnswers.includes(faq.id) ? 'הסתר תשובה' : 'הצג תשובה'}
                  </button>
                  <div className={`faq-answer-wrapper ${openAnswers.includes(faq.id) ? 'open' : ''}`}>
                    {openAnswers.includes(faq.id) && (
                      <p>
                        <strong>תשובה:</strong> {faq.answer}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FaqTab;
