import React, { useState } from "react";
import "../styles/ProductReview.scss";

const ProductReview = () => {
  const [filter, setFilter] = useState("Tất cả");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🆕 Thêm trạng thái modal
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0); // 🆕
  const reviews = [
    {
      name: "Tăng Quốc Anh",
      initials: "T",
      rating: 5,
      comment: "Dạ cho em hỏi là bản đã kích hoạt thì bị lỗi so với chưa kích hoạt k ạ",
      tags: ["Hiệu năng Siêu mạnh mẽ", "Thời lượng pin Cực khủng", "Chất lượng camera Chụp đẹp, chuyên nghiệp"],
      time: "6 tháng trước",
    },
    {
      name: "Nhan",
      initials: "N",
      rating: 5,
      comment: "Rất hài lòng!",
      tags: [],
      time: "8 tháng trước",
    },
    {
      name: "Lê Hoàng",
      initials: "L",
      rating: 4,
      comment: "Máy đẹp, hiệu năng ổn định nhưng hơi nóng khi chơi game lâu.",
      tags: ["Hiệu năng ổn", "Thiết kế đẹp"],
      time: "3 tháng trước",
    },
    {
      name: "Nguyễn Thị Mai",
      initials: "M",
      rating: 3,
      comment: "Chất lượng camera chưa đúng kỳ vọng, pin dùng được 1 ngày.",
      tags: ["Camera trung bình", "Pin tạm ổn"],
      time: "2 tháng trước",
    },
    {
      name: "Phạm Văn Bình",
      initials: "B",
      rating: 2,
      comment: "Mua về được 1 tuần thì máy bị đơ, phải mang bảo hành.",
      tags: ["Hiệu năng kém", "Lỗi phần mềm"],
      time: "1 tháng trước",
    },
  ];

  const totalReviews = reviews.length;
  const rating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = 5 - r.rating;
    if (idx >= 0 && idx < 5) ratingCounts[idx]++;
  });

  const getFilteredReviews = () => {
    switch (filter) {
      case "5 sao":
      case "4 sao":
      case "3 sao":
      case "2 sao":
      case "1 sao":
        return reviews.filter((r) => r.rating === parseInt(filter));
      default:
        return reviews;
    }
  };

  const filteredReviews = getFilteredReviews();
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 2);

  return (
    <div className="product-review-container">
      <div className="review-summary-container">
        <h2 className="review-title">Đánh giá Samsung Galaxy S24 FE 5G 8GB 128GB</h2>
        <div className="review-box">
          <div className="left-review">
            <div className="main-rating-review">
              <span className="score">{rating}</span>
              <span className="out-of-review">/5</span>
            </div>
            <div className="stars-review">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="star-review filled-review">★</span>
              ))}
            </div>
            <p className="total-reviews">{totalReviews} lượt đánh giá</p>
            <button className="write-btn-review" onClick={() => setShowModal(true)}>Viết đánh giá</button>
          </div>

          <div className="center-review">
            <div className="bar-group-review">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div className="bar-row" key={star}>
                  <span className="bar-label">{star} <span style={{ color: "#fcd34d" }}>★</span></span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(ratingCounts[5 - star] / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-count">{ratingCounts[5 - star]} đánh giá</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divider"></div>
        </div>
      </div>

      <div className="review-list-container">
        <div className="filter-header-review">
          <h3 className="filter-heading-review">Lọc đánh giá theo</h3>
          <div className="filter-buttons-review">
            {['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao'].map((label, i) => (
              <button
                key={i}
                className={`filter-btn ${filter === label ? 'active' : ''}`}
                onClick={() => {
                  setFilter(label);
                  setShowAllReviews(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="review-items-review">
          {displayedReviews.map((item, i) => (
            <div key={i} className="review-item-review">
              <div className="avatar">{item.initials}</div>
              <div className="content-review">
                <div className="top-row-review">
                  <span className="name-review">{item.name}</span>
                  <div className="stars-review">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={`star-review ${index < item.rating ? 'filled-review' : ''}`}>★</span>
                    ))}
                  </div>
                  <span className="label-review">
                    {item.rating === 5 ? 'Tuyệt vời' :
                      item.rating === 4 ? 'Tốt' :
                        item.rating === 3 ? 'Trung bình' :
                          item.rating === 2 ? 'Tệ' : 'Rất tệ'}
                  </span>
                </div>
                {item.tags.length > 0 && (
                  <div className="tag-list-review">
                    {item.tags.map((tag, j) => (
                      <span key={j} className="tag-review">{tag}</span>
                    ))}
                  </div>
                )}
                <p className="comment-review">{item.comment}</p>
                <div className="time-review">
                  <i className="clock-icon-review">🕒</i> Đánh giá đã đăng vào {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAllReviews && filteredReviews.length > 2 && (
          <div className="see-more-review-wrapper">
            <button className="see-more-review-btn" onClick={() => setShowAllReviews(true)}>
              Xem tất cả đánh giá ➜
            </button>
          </div>
        )}
      </div>

      {/* 🆕 Modal viết đánh giá */}
      {showModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>Đánh giá & nhận xét</h3>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            <h4 className="modal-product-title">Samsung Galaxy S24 FE 5G 8GB 128GB</h4>

            <div className="modal-section">
              <p>Đánh giá chung</p>
            <div className="modal-stars-row">
  {["Rất Tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"].map((label, i) => (
    <div
      key={i}
      className="modal-star-item"
      onMouseEnter={() => setHoveredStar(i + 1)}
      onMouseLeave={() => setHoveredStar(0)}
      onClick={() => setSelectedRating(i + 1)} // 🆕 click để chọn sao
    >
      <span className={`star ${
        hoveredStar >= i + 1 || selectedRating >= i + 1 ? 'yellow' : 'gray'
      }`}>★</span>
      <span>{label}</span>
    </div>
  ))}
</div>


            </div>

          

            <textarea className="modal-textarea" placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 kí tự)" />
            <button className="submit-review-btn">GỬI ĐÁNH GIÁ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
