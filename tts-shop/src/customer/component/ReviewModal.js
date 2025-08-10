import React, { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog"; // import thêm
import "../styles/BillDetail.scss";

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
  code_order,
  initialComment = "",
  initialRating = 0,
  initialTags = [],
  submitting = false,
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [tags, setTags] = useState(initialTags);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showConfirm, setShowConfirm] = useState(false); // thêm state popup

  useEffect(() => {
    if (show) {
      setComment(initialComment);
      setSelectedRating(initialRating);
      setTags(initialTags);
      setHoveredStar(0);
    }
  }, [show, initialComment, initialRating, initialTags]);

  const handleSendClick = () => {
    // Kiểm tra dữ liệu trước khi mở popup
    if (comment.trim().length < 10) {
      setMessage({ type: "error", text: "Vui lòng nhập tối thiểu 10 ký tự." });
      return;
    }
    if (selectedRating === 0) {
      setMessage({ type: "error", text: "Vui lòng chọn số sao đánh giá." });
      return;
    }
    setShowConfirm(true); // mở popup xác nhận
  };

  const confirmSend = () => {
    setShowConfirm(false);

    setMessage({ type: "success", text: "Gửi đánh giá thành công!" });

    onSubmit({ rating: selectedRating, comment, tags, code_order });

    // reset form
    setComment("");
    setSelectedRating(0);
    setTags([]);
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

        {message.text && (
          <div className={`review-message-box ${message.type}`}>
            <i className={`icon-${message.type}`}></i> {message.text}
          </div>
        )}

        <button
          className="submit-review-btn"
          disabled={submitting}
          onClick={handleSendClick}
        >
          {submitting ? "Đang gửi..." : "GỬI ĐÁNH GIÁ"}
        </button>
      </div>

      {/* Popup xác nhận */}
      <ConfirmDialog
        show={showConfirm}
        title="Xác nhận gửi đánh giá"
        message="Bạn có chắc muốn gửi đánh giá này?"
        onConfirm={confirmSend}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default ReviewModal;
