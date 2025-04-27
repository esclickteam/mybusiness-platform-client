import React from "react";
import ReviewsModule from "../ReviewsModule.jsx";

export default function ReviewsSection({ reviews, setReviews, currentUser, renderTopBar }) {
  return (
    <>
      <div className="form-column">
        <ReviewsModule reviews={reviews} setReviews={setReviews} currentUser={currentUser} isPreview={false} />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        <ReviewsModule reviews={reviews} setReviews={setReviews} currentUser={currentUser} isPreview />
      </div>
    </>
  );
}
