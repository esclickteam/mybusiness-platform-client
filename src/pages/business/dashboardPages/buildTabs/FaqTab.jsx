import React, { useState, useEffect } from 'react';
import '../build/Build.css';
import './FaqTab.css';
import { v4 as uuidv4 } from 'uuid';
import API from '@api';

const FaqTab = ({ faqs, setFaqs, isPreview, currentUser }) => {
  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  const isValidUuid = (id) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);

  // Update missing UUIDs in faqId
  useEffect(() => {
    const upgradedFaqs = faqs.map((faq) => {
      if (!isValidUuid(faq.faqId)) {
        return { ...faq, faqId: uuidv4() };
      }
      return faq;
    });
    const hasUpgrades = upgradedFaqs.some((faq, idx) => faq.faqId !== faqs[idx].faqId);
    if (hasUpgrades) {
      setFaqs(upgradedFaqs);
    }
  }, [faqs, setFaqs]);

  // Save all FAQs to server (bulk)
  const saveFaqsToServer = async () => {
    try {
      const cleanFaqs = faqs.map(({ faqId, question, answer }) => ({
        faqId,
        question: question || '',
        answer:   answer || '',
      }));
      console.log('📤 cleanFaqs לשמירה:', cleanFaqs);
      await API.put('/business/my/faqs', { faqs: cleanFaqs });
      alert('✅ כל השאלות נשמרו!');
    } catch (err) {
      console.error('❌ שגיאה בשמירה:', err);
      alert('❌ שגיאה בשמירה');
    }
  };

  const toggleAnswer = (faqId) => {
    setOpenAnswers((prev) =>
      prev.includes(faqId) ? prev.filter((x) => x !== faqId) : [...prev, faqId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const newEntry = { ...newFaq, faqId: uuidv4() };
    try {
      await API.post('/business/my/faqs', newEntry);
      setFaqs([newEntry, ...faqs]);
      setNewFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ שגיאה בהוספת שאלה:', err);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await API.delete(`/business/my/faqs/${faqId}`);
      setFaqs(faqs.filter((faq) => faq.faqId !== faqId));
    } catch (err) {
      console.error('❌ שגיאה במחיקת שאלה:', err);
    }
  };

  const handleSaveEdit = async (faqId) => {
    if (!editedFaq.question.trim() || !editedFaq.answer.trim()) return;

    try {
      const updated = faqs.map((faq) =>
        faq.faqId === faqId
          ? { ...faq, question: editedFaq.question, answer: editedFaq.answer }
          : faq
      );
      await API.put(`/business/my/faqs/${faqId}`, {
        question: editedFaq.question,
        answer:   editedFaq.answer
      });
      setFaqs(updated);
      setEditFaqId(null);
      setEditedFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ שגיאה בשמירת עריכה:', err);
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
        {faqs.length === 0 ? (
          <p>אין עדיין שאלות</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.faqId} className="faq-card">
              {!isPreview && faq.faqId && (
                <div className="faq-actions-inline">
                  <button
                    className="inline-btn edit"
                    onClick={() => {
                      setEditFaqId(faq.faqId);
                      setEditedFaq({ question: faq.question, answer: faq.answer });
                    }}
                  >
                    ✏️ ערוך
                  </button>
                  <button
                    className="inline-btn delete"
                    onClick={() => handleDelete(faq.faqId)}
                  >
                    🗑️ מחק
                  </button>
                </div>
              )}

              {editFaqId === faq.faqId ? (
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
                  <button className="save-edit-btn" onClick={() => handleSaveEdit(faq.faqId)}>
                    💾 שמור עריכה
                  </button>
                </div>
              ) : (
                <>
                  <div className="faq-header">
                    <strong>שאלה:</strong> {faq.question}
                  </div>
                  <button onClick={() => toggleAnswer(faq.faqId)} className="toggle-answer-btn">
                    {openAnswers.includes(faq.faqId) ? 'הסתר תשובה' : 'הצג תשובה'}
                  </button>
                  <div className={`faq-answer-wrapper ${openAnswers.includes(faq.faqId) ? 'open' : ''}`}>
                    {openAnswers.includes(faq.faqId) && (
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

      {!isPreview && faqs.length > 0 && (
        <button className="save-all-button" onClick={saveFaqsToServer}>
          💾 שמור
        </button>
      )}
    </div>
  );
};

export default FaqTab;
