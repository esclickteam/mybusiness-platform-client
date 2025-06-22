import React, { useState, useEffect } from "react";
import "../build/Build.css";
import "./MainTab.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

export default function MainTab({ businessDetails, socket }) {
  // תמונות - נרמל ומנקה כפילויות, חותך ל-6
  const raw = businessDetails.mainImages || [];
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

  // ביקורות - סטייט פנימי כדי לעדכן בזמן אמת (אם יש socket)
  const [reviews, setReviews] = useState(businessDetails.reviews || []);

  // האזנה לעדכוני ביקורות בזמן אמת דרך socket.io
  useEffect(() => {
    if (!socket) return;

    function handleNewReview(newReview) {
      setReviews(prev => {
        const filtered = prev.filter(r => r.id !== newReview.id && r._id !== newReview._id);
        const updated = [newReview, ...filtered];
        return updated.slice(0, 2);
      });
    }

    socket.on("new_review", handleNewReview);
    return () => socket.off("new_review", handleNewReview);
  }, [socket]);

  // תמיד להציג רק 2 ביקורות אחרונות
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
          {lastTwoReviews.map(review => (
            <div key={review._id || review.id} className="review-item">
              <strong>{review.authorName || review.userName || "לקוח"}</strong> - ⭐ {review.rating}
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
