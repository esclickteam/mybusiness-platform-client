import React, { useState, useEffect } from "react";
import "../build/Build.css";
import "./MainTab.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

export default function MainTab({ businessDetails, socket }) {
  // הגנה על undefined
  const raw = businessDetails?.mainImages || [];
  const normalized = raw
    .map(item => {
      if (typeof item === "string") return { preview: item };
      if (item && item.preview) return item;
      if (item && item.url) return { preview: item.url };
      return null;
    })
    .filter(Boolean);
  const unique = dedupeByPreview(normalized);
  const toShow = unique.slice(0, 6);

  // סטייט ביקורות
  const initialReviews = businessDetails?.reviews || [];
  const [reviews, setReviews] = useState(initialReviews);

  // טעינת ביקורות ראשונית ב-useEffect
  useEffect(() => {
    async function fetchInitialReviews() {
      if (!businessDetails?._id) return;
      try {
        const res = await fetch(`/api/reviews/business/${businessDetails._id}?limit=2`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (e) {
        console.error("Failed to fetch initial reviews", e);
      }
    }
    fetchInitialReviews();
  }, [businessDetails?._id]);

  // עדכוני ביקורות בזמן אמת מ-socket (אופציונלי)
  useEffect(() => {
    if (!socket) return;

    function handleNewReview(newReview) {
      setReviews(prev => {
        const filtered = prev.filter(r => r.id !== newReview.id && r._id !== newReview._id);
        const updated = [newReview, ...filtered];
        return updated.slice(0, 2);
      });
    }

    socket.on("reviewCreated", handleNewReview);
    return () => socket.off("reviewCreated", handleNewReview);
  }, [socket]);

  const lastTwoReviews = reviews.slice(0, 2);

  return (
    <>
      {toShow.length === 0 ? (
        <div className="main-images-grid empty">
          <p className="no-images">אין תמונות להצגה</p>
        </div>
      ) : (
        <div className="main-images-grid">
          {toShow.map((item, i) => (
            <div key={item.preview} className="grid-item">
              <img src={item.preview} alt={`תמונה ראשית ${i + 1}`} className="grid-img" />
            </div>
          ))}
        </div>
      )}

      {lastTwoReviews.length > 0 && (
        <div className="reviews-section">
          <h3>ביקורות אחרונות</h3>
          {lastTwoReviews.map((review, i) => (
            <div key={review._id || review.id || i} className="review-card">
              <div className="review-header">
                <strong className="review-user">{review.authorName || review.userName || "לקוח"}</strong>
                <span className="star-text">⭐ {review.rating || review.averageScore}</span>
              </div>
              <p className="review-text">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
