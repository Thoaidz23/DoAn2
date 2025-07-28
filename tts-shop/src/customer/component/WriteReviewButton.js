  import React, { useState,useEffect } from "react";
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


useEffect(() => {
  const targetId = localStorage.getItem("scrollToId");
  if (!targetId) return;

  const interval = setInterval(() => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "center" });
      localStorage.removeItem("scrollToId");
      clearInterval(interval);
    }
  }, 50); // kiểm tra mỗi 50ms

  setTimeout(() => clearInterval(interval), 2000); // timeout 2s
}, []);


    return hasPurchased ? (
      <>
       <>
  <button
    className="write-btn-review"
    onClick={handleOpen}
    id="write-review-btn"
  >
    {hasReviewed ? "Sửa đánh giá" : "Viết đánh giá"}
  </button>

  <style>
    {`
      .write-btn-review {
        background: #02705c ;
        padding: 5px;
        border-radius: 8px;
        font-weight: 400;
        color: white;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
      }
    `}
  </style>
</>


        <ReviewModal
          show={showModal}
          onClose={handleClose}
          onSubmit={(data) => {
            onSubmit(data);
            handleClose();
            localStorage.setItem("scrollToId", "write-review-btn");
            window.location.reload();
          }}
          initialComment={existingReview?.comment || ""}
          initialRating={existingReview?.rating || 0}
        initialTags={
    Array.isArray(existingReview?.tags)
      ? existingReview.tags
      : typeof existingReview?.tags === "string"
      ? JSON.parse(existingReview.tags)
      : []
  }

        />
      </>
    ) : null;
  };

  export default WriteReviewButton;
