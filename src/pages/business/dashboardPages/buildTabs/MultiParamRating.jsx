import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const PARAMETER_KEYS = [
  { key: 'service', labelKey: 'service' },
  { key: 'professional', labelKey: 'professionalism' },
  { key: 'timing', labelKey: 'punctuality' },
  { key: 'availability', labelKey: 'availability' },
  { key: 'value', labelKey: 'value' },
  { key: 'goal', labelKey: 'goal' },
  { key: 'experience', labelKey: 'experience' },
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
  const { t } = useTranslation();
  const [ratings, setRatings] = useState(() =>
    PARAMETER_KEYS.reduce((acc, p) => ({ ...acc, [p.key]: 0 }), {})
  );
  const [comment, setComment] = useState('');

  const handleChange = (param, value) => {
    setRatings((prev) => ({ ...prev, [param]: value }));
  };

  const handleSubmit = () => {
    const average =
      Object.values(ratings).reduce((sum, v) => sum + v, 0) / PARAMETER_KEYS.length;

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
      <h2>{t("leftover.ratingChrome.title")}</h2>
      {PARAMETER_KEYS.map((param) => (
        <div key={param.key} style={{ marginBottom: '1rem' }}>
          <label>{t(`leftover.ratingChrome.${param.labelKey}`)}</label>
          <StarRating value={ratings[param.key]} onChange={(v) => handleChange(param.key, v)} />
        </div>
      ))}
      <textarea
        rows="4"
        placeholder={t("leftover.ratingChrome.commentPh")}
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
        {t("leftover.ratingChrome.submit")}
      </button>
    </div>
  );
};

export default MultiParamRating;
