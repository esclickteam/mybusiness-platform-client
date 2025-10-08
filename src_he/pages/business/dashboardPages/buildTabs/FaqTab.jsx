// src/components/FaqTab.jsx
"use client";

import React, { useState } from 'react';
import '../build/Build.css';
import './FaqTab.css';
import API from '@api';

// ערך דיפולטי בטוח ל־setFaqs!
const FaqTab = ({ faqs = [], setFaqs = () => {}, isPreview }) => {
  // DEBUG: תראה בקונסולה בכל Mount מה קיבלת
  React.useEffect(() => {
    console.log("FaqTab mount! faqs:", faqs, "setFaqs typeof:", typeof setFaqs);
    if (typeof setFaqs !== "function") {
      console.error("❌ setFaqs שהועבר ל־FaqTab הוא לא פונקציה!", setFaqs);
    }
  }, [faqs, setFaqs]);

  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  // ודא ש־faqs תמיד מערך
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
      setFaqs(prev => [added, ...(prev || [])]); // הגנה: prev תמיד מערך
      setNewFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ שגיאה בהוספת שאלה:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/business/my/faqs/${id}`);
      setFaqs(prev => (prev || []).filter(faq => (faq.faqId ?? faq._id) !== id));
    } catch (err) {
      console.error('❌ שגיאה במחיקת שאלה:', err);
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
      console.error('❌ שגיאה בשמירת עריכה:', err);
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
      alert('✅ כל השאלות נשמרו!');
    } catch (err) {
      console.error('❌ שגיאה בשמירה:', err);
      alert('❌ שגיאה בשמירה');
    }
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
        {safeFaqs.length === 0 ? (
          <p>אין עדיין שאלות</p>
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
                      ✏️ ערוך
                    </button>
                    <button
                      className="inline-btn delete"
                      onClick={() => handleDelete(id)}
                    >
                      🗑️ מחק
                    </button>
                  </div>
                )}

                {editFaqId === id ? (
                  <div className="faq-edit">
                    <input
                      type="text"
                      value={editedFaq.question}
                      onChange={e => setEditedFaq(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="עדכן את השאלה"
                    />
                    <textarea
                      value={editedFaq.answer}
                      onChange={e => setEditedFaq(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="עדכן את התשובה"
                    />
                    <button
                      className="save-edit-btn"
                      onClick={() => handleSaveEdit(id)}
                    >
                      💾 שמור עריכה
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="faq-header">
                      <strong>שאלה:</strong> {faq.question}
                    </div>
                    <button
                      onClick={() => toggleAnswer(id)}
                      className="toggle-answer-btn"
                    >
                      {openAnswers.includes(id) ? 'הסתר תשובה' : 'הצג תשובה'}
                    </button>
                    {openAnswers.includes(id) && (
                      <div className="faq-answer-wrapper open">
                        <p><strong>תשובה:</strong> {faq.answer}</p>
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
          💾 שמור הכל
        </button>
      )}
    </div>
  );
};

export default FaqTab;
