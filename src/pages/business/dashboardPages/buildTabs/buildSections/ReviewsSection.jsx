import React from "react";
import ReviewsModule from "../ReviewsModule.jsx";

export default function ReviewsSection({ reviews, setReviews, currentUser, renderTopBar }) {
  // ממיין את הביקורות לפי תאריך יורד (הכי חדש קודם)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  // שולף רק את 2 הביקורות האחרונות
  const lastTwoReviews = sortedReviews.slice(0, 2);

  return (
    <>
      <div className="form-column">
        {/* כל הביקורות בטאב הרגיל */}
        <ReviewsModule
          reviews={reviews}
          setReviews={setReviews}
          currentUser={currentUser}
          isPreview={false}
        />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        {/* רק 2 הביקורות האחרונות בטאב הראשי */}
        <ReviewsModule
          reviews={lastTwoReviews}
          setReviews={setReviews}
          currentUser={currentUser}
          isPreview={true}
        />
      </div>
    </>
  );
}
