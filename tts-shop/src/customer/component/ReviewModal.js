import React, { useState } from "react";
import "../styles/ProductReview.scss";

const tagSuggestions = [
  "Chất lượng tốt",
  "Giá cả hợp lý",
  "Dễ sử dụng",
  "Hiệu năng mượt mà",
  "Thiết kế đẹp",
  "Kết nối ổn định",
];

const ReviewModal = ({
  show,
  onClose,
  onSubmit,
  initialComment = "",
  initialRating = 0,
  initialTags = [],
  submitting = false,
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [tags, setTags] = useState(initialTags);

  const handleSubmit = () => {
    if (comment.trim().length < 10) {
      alert("Vui lòng nhập tối thiểu 10 ký tự.");
      return;
    }

    if (selectedRating === 0) {
      alert("Vui lòng chọn số sao đánh giá.");
      return;
    }

    onSubmit({ rating: selectedRating, comment, tags });
  };

  if (!show) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="modal-header">
          <h3>Đánh giá & nhận xét</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        <h4 className="modal-product-title">Sản phẩm</h4>

        <div className="modal-section">
          <p>Đánh giá chung</p>
          <div className="modal-stars-row">
            {["Rất Tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"].map((label, i) => (
              <div
                key={i}
                className="modal-star-item"
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedRating(i + 1)}
              >
                <span className={`star ${hoveredStar >= i + 1 || selectedRating >= i + 1 ? 'yellow' : 'gray'}`}>★</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tag-selector">
          <p>Chọn những điểm bạn hài lòng:</p>
          <div className="tag-buttons">
            {tagSuggestions.map((tag, i) => (
              <button
                key={i}
                type="button"
                className={`tag-button ${tags.includes(tag) ? "selected" : ""}`}
                onClick={() =>
                  setTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="modal-textarea"
          placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 10 kí tự)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="submit-review-btn"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Đang gửi..." : "GỬI ĐÁNH GIÁ"}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
