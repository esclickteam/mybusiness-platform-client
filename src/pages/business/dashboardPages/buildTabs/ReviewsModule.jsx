import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import '../build/Build.css';
import './ReviewsModule.css';

import StarRatingChart from './StarRatingChart';
import ReviewForm from './ReviewForm';

const PARAMETERS = {
  service: '🤝 שירותיות',
  professional: '💼 מקצועיות',
  timing: '⏰ עמידה בזמנים',
  availability: '📞 זמינות',
  value: '💰 תמורה למחיר',
  goal: '🎯 השגת מטרה',
  experience: '🎉 חוויה כללית',
};

const PARAMETER_EXPLANATIONS = {
  goal: 'האם הלקוח קיבל את מה שרצה',
  service: 'האם התקשורת הייתה נעימה ומכבדת',
  professional: 'עד כמה היה ידע, ניסיון, ביצוע מדויק',
  timing: 'האם התחייבו לזמן והגיעו בזמן',
  availability: 'האם הייתה מענה מהיר ונגישות',
  value: 'האם המחיר תאם את הערך שקיבלתי',
  experience: 'תחושת שביעות רצון כללית',
};

const exampleReviews = [
  {
    id: 'ex1',
    user: 'שירה',
    date: '10.03.2025',
    comment:
      'חווית שירות מעולה! ענו לי מהר, המחיר היה הוגן, וגם עמדו בזמנים. בהחלט אמליץ לחברים!',
    service: "5",
    professional: "4.5",
    timing: "5",
    availability: "5",
    value: "4.5",
    goal: "5",
    experience: "4.5",
    isExample: true,
  },
  {
    id: 'ex2',
    user: 'אלון',
    date: '06.03.2025',
    comment:
      'השירות היה מקצועי מאוד, סבלני, ועם הסברים ברורים. ממליץ לכל מי שמחפש שירות איכותי באמת!',
    service: "5",
    professional: "5",
    timing: "5",
    availability: "4.5",
    value: "5",
    goal: "5",
    experience: "5",
    isExample: true,
  },
];

const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (half) stars.push('✩');
  while (stars.length < 5) stars.push('☆');
  return <span className="stars">{stars.join('')}</span>;
};

const ReviewCard = ({ review = {} }) => {
  const [showMore, setShowMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const text = review.comment || review.text || '';
  const isLong = text.length > 120;

  const average = Object.keys(PARAMETERS)
    .map((k) => parseFloat(review[k]))
    .filter((v) => !isNaN(v))
    .reduce((a, b, _, arr) => (a + b) / arr.length, 0);

  return (
    <div className="review-card enhanced">
      <div className="review-rating-line">
        ⭐ {average ? average.toFixed(1) : '—'} / 5
      </div>
      <div className="review-header">
        <strong>{review.user || 'אנונימי'}</strong>
        <div className="review-meta">
          {review.date && <span className="review-date">🗓️ {review.date}</span>}
          {review.isExample && <span className="example-tag">⭐ ביקורת לדוגמה</span>}
        </div>
      </div>
      <p className={`review-comment ${showMore ? 'expanded' : 'truncated'}`}>
        {showMore || !isLong ? text : text.slice(0, 120) + '...'}
        {isLong && !showMore && (
          <button className="read-more" onClick={() => setShowMore(true)}>
            קרא עוד
          </button>
        )}
      </p>
      <button className="styled-toggle" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'הסתר פירוט דירוג 🔽' : '📋 פירוט דירוג'}
      </button>
      {showDetails && (
        <div className="review-details-box">
          {Object.entries(PARAMETERS).map(
            ([key, label]) =>
              review[key] !== undefined && (
                <div key={key} className="review-detail-row">
                  <span>{label}</span>
                  <span>
                    <StarDisplay rating={parseFloat(review[key])} /> ({review[key]})
                  </span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

const ParameterTable = () => (
  <div className="parameter-table-box">
    <h3 className="section-subtitle">📋 מדדים מומלצים לדירוג לפי פרמטרים</h3>
    <table className="rating-parameters-table">
      <thead>
        <tr>
          <th>מדד</th>
          <th>הסבר קצר</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(PARAMETERS).map(([key, label]) => (
          <tr key={key}>
            <td>{label}</td>
            <td>{PARAMETER_EXPLANATIONS[key]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReviewsModule = ({ reviews = [], isPreview, currentUser, businessId, socket }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [liveReviews, setLiveReviews] = useState(reviews);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkReviewPermission = async () => {
      try {
        if (currentUser && businessId) {
          const res = await axios.get(
            `/reviews/can-review?businessId=${businessId}`
          );
          setCanReview(res.data.canReview);
        }
      } catch (err) {
        console.error('שגיאה בבדיקת הרשאה להשארת ביקורת:', err);
        setCanReview(false);
      }
    };

    checkReviewPermission();
  }, [currentUser, businessId]);

  useEffect(() => {
    if (!socket || !businessId) return;

    socket.emit('joinRoom', `business-${businessId}`);

    const handleNewReview = (review) => {
      setLiveReviews((prev) => [review, ...prev]);
    };

    socket.on('reviewCreated', handleNewReview);

    return () => {
      socket.off('reviewCreated', handleNewReview);
    };
  }, [socket, businessId]);

  const computedReviews =
    liveReviews.length > 0
      ? liveReviews.map((r) => {
          const values = Object.keys(PARAMETERS)
            .map((k) => parseFloat(r[k]))
            .filter((v) => typeof v === 'number' && !isNaN(v));
          const avg = values.length
            ? values.reduce((a, b) => a + b, 0) / values.length
            : typeof r.rating === 'number'
            ? r.rating
            : undefined;
          return { ...r, average: avg };
        })
      : currentUser
      ? exampleReviews
      : [];

  return (
    <div className="reviews-tab fade-slide" ref={contentRef}>
      {isPreview ? (
        <>
          <h2 className="section-title">מה אנשים חושבים עלינו?</h2>

          {currentUser && canReview && (
            <>
              <button
                className="add-review-btn"
                onClick={() => setShowReviewForm(true)}
              >
                💬 הוסף ביקורת
              </button>

              {showReviewForm && (
                <div className="review-form-wrapper">
                  <ReviewForm
                    businessId={businessId}
                    socket={socket}
                    onSuccess={(review) => {
                      // הוספה מידית של הביקורת החדשה לרשימה
                      setLiveReviews((prev) => [review, ...prev]);
                      setShowReviewForm(false);
                    }}
                  />
                </div>
              )}
            </>
          )}

          {currentUser && !canReview && (
            <p className="info-text">
              🛑 כדי להשאיר ביקורת, עליך לבצע הזמנה באתר מהעסק.
            </p>
          )}

          <p className="review-count">
            {computedReviews.length} ביקורות שנכתבו על העסק
          </p>
          <StarRatingChart reviews={computedReviews} />

          <div className="review-list">
            {computedReviews.map((r) => (
              <ReviewCard key={r.id || r.user} review={r} />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">🎨 עמוד הביקורות</h2>
          <div className="info-box">
            <h3>🧾 איך עובדות ביקורות?</h3>
            <p>
              הביקורות בעמוד זה נכתבות על ידי לקוחות אמיתיים שהתנסו בשירות שלך
              – הן לא ניתנות לעריכה או מחיקה מצדך.
            </p>
            <ul className="review-info-list">
              <li>✅ כל ביקורת כוללת ציון כללי מ-1 עד 5</li>
              <li>✅ ניתן להציג גם דירוג מפורט לפי קריטריונים</li>
              <li>✅ לקוחות יכולים להוסיף טקסט חופשי</li>
              <li>🚩 ניתן לדווח על ביקורת בעייתית</li>
            </ul>
            <ParameterTable />
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsModule;
