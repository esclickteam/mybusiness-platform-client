import React from 'react';
import './ReviewDistributionChart.css'; // אפשר להפריד לקובץ CSS ייעודי אם תרצה

const PARAMETERS = {
  service: '🤝 שירותיות',
  professional: '💼 מקצועיות',
  timing: '⏰ עמידה בזמנים',
  availability: '📞 זמינות',
  value: '💰 תמורה למחיר',
  goal: '🎯 השגת מטרה',
  experience: '🎉 חוויה כללית',
};

// מציג כוכבים לפי ציון (כולל חצי)
const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < full; i++) stars.push('★');
  if (half) stars.push('☆');
  while (stars.length < 5) stars.push('✩');

  return <span className="stars">{stars.join('')}</span>;
};

export default function StarRatingChart({ reviews = [] }) {
  const data = Object.entries(PARAMETERS).map(([key, label]) => {
    const values = reviews
      .map(r => parseFloat(r[key]))
      .filter(v => !isNaN(v));

    const average = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

    return {
      key,
      label,
      average: Number(average.toFixed(1)),
    };
  });

  return (
    <div className="star-rating-chart">
      {data.map(({ key, label, average }) => (
        <div key={key} className="star-row">
          <span className="param-label">{label}</span>
          <div className="star-display">
            <StarDisplay rating={average} />
            <span className="score">({average})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
