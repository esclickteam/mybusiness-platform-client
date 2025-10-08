```javascript
import React, { useState } from 'react';

const PARAMETERS = [
  { key: 'service', label: 'Service' },
  { key: 'professional', label: 'Professionalism' },
  { key: 'timing', label: 'Timeliness' },
  { key: 'availability', label: 'Availability' },
  { key: 'value', label: 'Value for Money' },
  { key: 'goal', label: 'Goal Achievement' },
  { key: 'experience', label: 'Overall Experience' },
];

const StarRating = ({ value, onChange }) => {
  const stars = [];

  for (let i = 0.5; i <= 5; i += 0.5) {
    stars.push(
      <span
        key={i}
        style={{ color: i <= value ? '#fbbf24' : '#e5e7eb', cursor: 'pointer', fontSize: '24px' }}
        onClick={() => onChange(i)}
      >
        {i % 1 === 0 ? '★' : '✩'}
      </span>
    );
  }

  return <div style={{ direction: 'ltr' }}>{stars}</div>;
};

const MultiParamRating = ({ onSubmit }) => {
  const [ratings, setRatings] = useState(() =>
    PARAMETERS.reduce((acc, p) => ({ ...acc, [p.key]: 0 }), {})
  );
  const [comment, setComment] = useState('');

  const handleChange = (param, value) => {
    setRatings((prev) => ({ ...prev, [param]: value }));
  };

  const handleSubmit = () => {
    const average =
      Object.values(ratings).reduce((sum, v) => sum + v, 0) / PARAMETERS.length;

    const review = {
      ...ratings,
      comment,
      average,
      date: new Date().toLocaleDateString(),
      id: Date.now(),
    };

    if (onSubmit) onSubmit(review);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Rate the Service</h2>
      {PARAMETERS.map((param) => (
        <div key={param.key} style={{ marginBottom: '1rem' }}>
          <label>{param.label}</label>
          <StarRating value={ratings[param.key]} onChange={(v) => handleChange(param.key, v)} />
        </div>
      ))}
      <textarea
        rows="4"
        placeholder="Add details / review"
        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        style={{
          marginTop: '1rem',
          background: 'linear-gradient(to right, #a855f7, #d946ef)',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '9999px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Submit Review
      </button>
    </div>
  );
};

export default MultiParamRating;
```