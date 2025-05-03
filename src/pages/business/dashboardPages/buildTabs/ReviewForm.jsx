import { useState } from 'react';
import api from '../../../../api';
import './ReviewForm.css';

const ratingFields = [
  { key: 'service', label: '🤝 שירותיות' },
  { key: 'professional', label: '💼 מקצועיות' },
  { key: 'timing', label: '⏰ עמידה בזמנים' },
  { key: 'availability', label: '📞 זמינות' },
  { key: 'value', label: '💰 תמורה למחיר' },
  { key: 'goal', label: '🎯 השגת מטרה' },
  { key: 'experience', label: '🎉 חוויה כללית' },
];

const ReviewForm = ({ businessId, onSubmit }) => {
  const [ratings, setRatings] = useState({});
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (key, value) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const calculateAverage = () => {
    const values = ratingFields.map(({ key }) => parseFloat(ratings[key] || 0));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / ratingFields.length).toFixed(1);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const reviewData = {
      businessId,
      ...ratings,
      comment: text,
      averageScore: calculateAverage(),
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);
      // השתמש ב־api (כפי שהיבאת במעל)
      const res = await api.post('/reviews', reviewData);
      console.log('✅ ביקורת נשמרה:', res.data);
      onSubmit(res.data);
      setRatings({});
      setText('');
    } catch (err) {
      console.error('❌ שגיאה בשליחת ביקורת:', err);
      alert('אירעה שגיאה בשליחת הביקורת. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>📝 השאר ביקורת על השירות</h3>

      {ratingFields.map(({ key, label }) => (
        <div key={key} className="rating-row">
          <label>{label}</label>
          <select
            value={ratings[key] || ''}
            onChange={e => handleRatingChange(key, Number(e.target.value))}
            required
          >
            <option value="">בחר דירוג</option>
            {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(n => (
              <option key={n} value={n}>
                {'★'.repeat(Math.round(n))}{'☆'.repeat(5 - Math.round(n))} ({n})
              </option>
            ))}
          </select>
        </div>
      ))}

      <label>✍️ חוות דעת</label>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows="4"
        placeholder="כתוב כאן את החוויה שלך עם השירות..."
        required
      />

      <div className="average-score">
        ⭐ ציון ממוצע: {calculateAverage()} / 5
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'שולח...' : 'שלח ביקורת'}
      </button>
    </form>
  );
};

export default ReviewForm;
