// src/pages/business/dashboardPages/build/buildTabs/FaqTab.jsx
import React, { useState, useEffect } from 'react';
// סגנונות כלליים של עמוד הבניה
import '../Build.css';
// סגנונות ספציפיים לטאב שאלות ותשובות
import './FaqTab.css';

import { v4 as uuidv4 } from 'uuid';

const FaqTab = ({ faqs, setFaqs, isPreview, currentUser }) => {
  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  const isValidUuid = (id) => {
    return (
      typeof id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        id
      )
    );
  };

  useEffect(() => {
    const upgradedFaqs = faqs.map((faq) => {
      if (!isValidUuid(faq.id)) {
        console.warn(
          `🔄 ממיר id ישן ל-uuid עבור שאלה: "${faq.question}"`
        );
        return { ...faq, id: uuidv4() };
      }
      return faq;
    });

    const hasUpgrades = upgradedFaqs.some(
      (faq, idx) => faq.id !== faqs[idx].id
    );
    if (hasUpgrades) {
      setFaqs(upgradedFaqs);
    }
  }, []); // ריצה פעם אחת על mount

  if (!Array.isArray(faqs)) {
    console.error('⚠️ faqs אינו מערך:', faqs);
    return <p>שגיאה בטעינת שאלות</p>;
  }

  const toggleAnswer = (id) => {
    setOpenAnswers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const newEntry = {
      ...newFaq,
      id: uuidv4(),
      userId: currentUser.id,
    };

    setFaqs([newEntry, ...faqs]);
    setNewFaq({ question: '', answer: '' });
  };

  const handleDelete = (id) => {
    const updated = faqs.filter((faq) => faq.id !== id);
    setFaqs(updated);
  };

  const handleSaveEdit = (id) => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) return;

    const updated = faqs.map((faq) =>
      faq.id === id
        ? { ...faq, question: editedFaq.question, answer: editedFaq.answer }
        : faq
    );
    setFaqs(updated);
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
                      setEditedFaq({
                        question: faq.question,
                        answer: faq.answer,
                      });
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
                    onChange={(e) =>
                      setEditedFaq((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    placeholder="עדכן את השאלה"
                  />
                  <textarea
                    value={editedFaq.answer}
                    onChange={(e) =>
                      setEditedFaq((prev) => ({
                        ...prev,
                        answer: e.target.value,
                      }))
                    }
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
                    {openAnswers.includes(faq.id)
                      ? 'הסתר תשובה'
                      : 'הצג תשובה'}
                  </button>
                  <div
                    className={`faq-answer-wrapper ${
                      openAnswers.includes(faq.id) ? 'open' : ''
                    }`}
                  >
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
