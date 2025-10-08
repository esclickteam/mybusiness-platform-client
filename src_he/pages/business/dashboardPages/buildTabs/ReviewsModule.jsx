```javascript
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import '../build/Build.css';
import './ReviewsModule.css';

import StarRatingChart from './StarRatingChart';
import ReviewForm from './ReviewForm';

const PARAMETERS = {
  service: '🤝 Service',
  professional: '💼 Professionalism',
  timing: '⏰ Timeliness',
  availability: '📞 Availability',
  value: '💰 Value for Money',
  goal: '🎯 Goal Achievement',
  experience: '🎉 Overall Experience',
};

const PARAMETER_EXPLANATIONS = {
  goal: 'Did the customer get what they wanted?',
  service: 'Was the communication pleasant and respectful?',
  professional: 'How knowledgeable, experienced, and precise was the execution?',
  timing: 'Did they commit to a time and arrive on time?',
  availability: 'Was there a quick response and accessibility?',
  value: 'Did the price match the value I received?',
  experience: 'Overall satisfaction feeling',
};

const exampleReviews = [
  {
    id: 'ex1',
    user: 'Shira',
    date: '10.03.2025',
    comment:
      'Excellent service experience! They responded quickly, the price was fair, and they met the deadlines. I will definitely recommend to friends!',
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
    user: 'Alon',
    date: '06.03.2025',
    comment:
      'The service was very professional, patient, and with clear explanations. I recommend it to anyone looking for truly quality service!',
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
        <strong>{review.user || 'Anonymous'}</strong>
        <div className="review-meta">
          {review.date && <span className="review-date">🗓️ {review.date}</span>}
          {review.isExample && <span className="example-tag">⭐ Example Review</span>}
        </div>
      </div>
      <p className={`review-comment ${showMore ? 'expanded' : 'truncated'}`}>
        {showMore || !isLong ? text : text.slice(0, 120) + '...'}
        {isLong && !showMore && (
          <button className="read-more" onClick={() => setShowMore(true)}>
            Read more
          </button>
        )}
      </p>
      <button className="styled-toggle" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Rating Details 🔽' : '📋 Rating Details'}
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
    <h3 className="section-subtitle">📋 Recommended Rating Metrics by Parameters</h3>
    <table className="rating-parameters-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Short Explanation</th>
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
        console.error('Error checking review permission:', err);
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
          <h2 className="section-title">What do people think of us?</h2>

          {currentUser && canReview && (
            <>
              <button
                className="add-review-btn"
                onClick={() => setShowReviewForm(true)}
              >
                💬 Add Review
              </button>

              {showReviewForm && (
                <div className="review-form-wrapper">
                  <ReviewForm
                    businessId={businessId}
                    socket={socket}
                    onSuccess={(review) => {
                      // Immediately add the new review to the list
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
              🛑 To leave a review, you must place an order on the business's website.
            </p>
          )}

          <p className="review-count">
            {computedReviews.length} reviews written about the business
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
          <h2 className="section-title">🎨 Reviews Page</h2>
          <div className="info-box">
            <h3>🧾 How do reviews work?</h3>
            <p>
              The reviews on this page are written by real customers who have experienced your service – they cannot be edited or deleted by you.
            </p>
            <ul className="review-info-list">
              <li>✅ Each review includes an overall rating from 1 to 5</li>
              <li>✅ Detailed ratings can also be displayed by criteria</li>
              <li>✅ Customers can add free text</li>
              <li>🚩 You can report a problematic review</li>
            </ul>
            <ParameterTable />
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsModule;
```