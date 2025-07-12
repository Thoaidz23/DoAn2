import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductReview.scss";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ReviewModal from "../component/ReviewModal"; // đường dẫn đúng theo dự án của bạn
import WriteReviewButton from "../component/WriteReviewButton";

const ProductReview = ({productId}) => {
  const [filter, setFilter] = useState("Tất cả");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const { user } = useContext(AuthContext);

  // Hàm chuyển ngày tạo thành "3 tháng trước"
  const convertToTimeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // ngày

    if (diff < 1) return "hôm nay";
    if (diff === 1) return "1 ngày trước";
    if (diff < 30) return `${diff} ngày trước`;
    const months = Math.floor(diff / 30);
    return `${months} tháng trước`;
  };

  // Fetch đánh giá từ server
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
        const data = res.data.map((item) => ({
          ...item,
          tags: item.tags ? JSON.parse(item.tags) : [],
          time: convertToTimeAgo(item.created_at),
        }));
        setReviews(data);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
  const fetchPurchaseStatus = async () => {
    try {
      if (user?.id) {
        const res = await axios.get(`http://localhost:5000/api/reviews/check-purchased`, {
          params: {
            userId: user.id,
            groupProductId: productId,
          }
        });
        setHasPurchased(res.data.hasPurchased);
      }
    } catch (err) {
      console.error("Lỗi kiểm tra đã mua sản phẩm:", err);
    }
  };
  console.log("📤 Gửi request kiểm tra mua hàng với:", {
  userId: user?.id,
  groupProductId: productId,
});
  fetchPurchaseStatus();
}, [user, productId]);

useEffect(() => {
  const checkReviewed = async () => {
    if (user?.id) {
      const res = await axios.get(`http://localhost:5000/api/reviews/check-reviewed`, {
        params: {
          userId: user.id,
          groupProductId: productId
        }
      });
      setHasReviewed(res.data.reviewed);
      setExistingReview(res.data.review || null);
    }
  };

  checkReviewed();
}, [user, productId]);

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
const handleSubmitReview = async ({ rating, comment, tags }) => {
  setSubmitting(true);
  try {
    if (hasReviewed && existingReview?.id) {
      await axios.put(`http://localhost:5000/api/reviews/${existingReview.id}`, {
        rating,
        comment,
        tags,
      });
    } else {
      await axios.post("http://localhost:5000/api/reviews", {
        id_group_product: productId,
        id_user: user?.id || 0,
        initials: user?.name?.charAt(0).toUpperCase() || "K",
        rating,
        comment,
        tags,
      });
    }

    alert(hasReviewed ? "Đánh giá đã được cập nhật!" : "Đánh giá đã được gửi!");

    // Reload reviews
    const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
    const data = res.data.map((item) => ({
      ...item,
      tags: Array.isArray(item.tags)
        ? item.tags
        : item.tags
        ? JSON.parse(item.tags)
        : [],
      time: convertToTimeAgo(item.created_at),
    }));

    setReviews(data);
    setHasReviewed(true);
    setExistingReview(data.find((r) => r.id_user === user?.id) || null);
  } catch (err) {
    console.error(err);
    alert("Lỗi khi gửi đánh giá.");
  } finally {
    setSubmitting(false);
  }
};



  const tagSuggestions = ["Chất lượng tốt", "Giá cả hợp lý", "Dễ sử dụng", "Hiệu năng mượt mà", "Thiết kế đẹp", "Kết nối ổn định"];

  if (loading) {
    return <p>Đang tải đánh giá...</p>;
  }

  return (
    <div className="product-review-container">
      <div className="review-summary-container">
        <h2 className="review-title">Đánh giá sản phẩm</h2>
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
           <WriteReviewButton
          hasPurchased={hasPurchased}
          hasReviewed={hasReviewed}
          existingReview={existingReview}
          onSubmit={handleSubmitReview}
        />
                    

          </div>

          <div className="center-review">
            <div className="bar-group-review">
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="bar-row" key={star}>
                  <span className="bar-label">{star} <span style={{ color: "#fcd34d" }}>★</span></span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(ratingCounts[5 - star] / totalReviews) * 100}%` }}></div>
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
            <div className="avatar"><img src={item.avatar}></img></div>
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

      <ReviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitReview}
        initialComment={comment}
        initialRating={selectedRating}
        initialTags={tags}
        submitting={submitting}
      />

    </div>
  );
};

export default ProductReview;
