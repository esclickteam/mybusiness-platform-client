import React, { useState } from 'react';
import '../build/Build.css';
import './FaqTab.css';
import API from '@api';

const FaqTab = ({ faqs = [], setFaqs, isPreview }) => {
  const [openAnswers, setOpenAnswers] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editFaqId, setEditFaqId] = useState(null);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });

  const toggleAnswer = (faqId) => {
    setOpenAnswers(prev =>
      prev.includes(faqId)
        ? prev.filter(x => x !== faqId)
        : [...prev, faqId]
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
      setFaqs(prev => [added, ...(prev || [])]);
      setNewFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ שגיאה בהוספת שאלה:', err);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await API.delete(`/business/my/faqs/${faqId}`);
      setFaqs(prev => (prev || []).filter(faq => faq.faqId !== faqId));
    } catch (err) {
      console.error('❌ שגיאה במחיקת שאלה:', err);
    }
  };

  const handleSaveEdit = async (faqId) => {
    const { question, answer } = editedFaq;
    if (!question.trim() || !answer.trim()) return;

    try {
      const response = await API.put(`/business/my/faqs/${faqId}`, { question, answer });
      const updated = response.data.faq ?? response.data;
      setFaqs(prev => (prev || []).map(faq => faq.faqId === faqId ? updated : faq));
      setEditFaqId(null);
      setEditedFaq({ question: '', answer: '' });
    } catch (err) {
      console.error('❌ שגיאה בשמירת עריכה:', err);
    }
  };

  const saveFaqsToServer = async () => {
    try {
      console.log("faqs before save:", faqs);
      const safeFaqs = Array.isArray(faqs) ? faqs : [];  // Ensure faqs is an array
      const payload = safeFaqs.map(({ faqId, question, answer }) => ({ faqId, question, answer }));
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
        {faqs.length === 0 ? (
          <p>אין עדיין שאלות</p>
        ) : (
          (faqs || []).map(faq => (
            faq && (
              <div key={faq.faqId} className="faq-card">
                {!isPreview && (
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
                      onClick={() => handleSaveEdit(faq.faqId)}
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
                      onClick={() => toggleAnswer(faq.faqId)}
                      className="toggle-answer-btn"
                    >
                      {openAnswers.includes(faq.faqId)
                        ? 'הסתר תשובה'
                        : 'הצג תשובה'}
                    </button>
                    {openAnswers.includes(faq.faqId) && (
                      <div className="faq-answer-wrapper open">
                        <p>
                          <strong>תשובה:</strong> {faq.answer}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
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
