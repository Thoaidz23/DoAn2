import React, { useState } from "react";
import ReviewModal from "./ReviewModal";

const WriteReviewButton = ({
  hasPurchased = false,
  hasReviewed = false,
  existingReview = null,
  onSubmit,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return hasPurchased ? (
    <>
      <button className="write-btn-review" onClick={handleOpen}>
        {hasReviewed ? "Sửa đánh giá" : "Viết đánh giá"}
      </button>

      <ReviewModal
        show={showModal}
        onClose={handleClose}
        onSubmit={(data) => {
          onSubmit(data);
          handleClose();
        }}
        initialComment={existingReview?.comment || ""}
        initialRating={existingReview?.rating || 0}
        initialTags={existingReview?.tags || []}
      />
    </>
  ) : null;
};

export default WriteReviewButton;
