import React from "react";
import ReviewsModule from "../ReviewsModule.jsx";

export default function ReviewsSection({ reviews, setReviews, currentUser, renderTopBar }) {
  // Sorts the reviews by date descending (most recent first)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Retrieves only the last 2 reviews
  const lastTwoReviews = sortedReviews.slice(0, 2);

  return (
    <>
      <div className="form-column">
        {/* All reviews in the regular tab */}
        <ReviewsModule
          reviews={reviews}
          setReviews={setReviews}
          currentUser={currentUser}
          isPreview={false}
        />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        {/* Only the last 2 reviews in the main tab */}
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