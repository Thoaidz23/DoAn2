// ReviewList.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const ReviewList = () => {
  const { id_group_product } = useParams(); // lấy từ URL
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/reviews/${id_group_product}`);
    const data = await res.json();
    console.log("REVIEW DATA:", data);

    // đảm bảo data là mảng
    if (Array.isArray(data)) {
      setReviews(data);
    } else if (data.reviews && Array.isArray(data.reviews)) {
      setReviews(data.reviews);
    } else {
      setReviews([]);
    }
  } catch (err) {
    console.error("Lỗi khi lấy đánh giá:", err);
    setReviews([]);
  }
};

const handleToggleStatus = async (id, currentStatus) => {
  const actionText = currentStatus === 1 ? "hiện lại" : "ẩn";
  if (!window.confirm(`Bạn có chắc muốn ${actionText} đánh giá này?`)) return;

  try {
    const res = await fetch(`http://localhost:5000/api/reviews/${id}/toggle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lock_reviews: currentStatus === 1 ? 0 : 1 })
    });

    if (res.ok) {
      alert(`Đã ${actionText} đánh giá`);
      setReviews(reviews.map(r =>
        r.id === id ? { ...r, lock_reviews: currentStatus === 1 ? 0 : 1 } : r
      ));
    } else {
      alert("Cập nhật thất bại");
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Lỗi mạng hoặc server");
  }
};


  useEffect(() => {
    fetchReviews();
  }, [id_group_product]);

  return (
  <div className="container mt-4">
    <h3 className="text-center mb-4" style={{width:"100%",height:"30px"}}>Quản lý đánh giá sản phẩm</h3>

    {reviews.length === 0 ? (
      <p className="text-center text-muted">Không có đánh giá nào.</p>
    ) : (
      <div style={{width:"100%",marginTop:"-250px"}}>
        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          className="w-100"
        >
          <thead className="text-center align-middle">
            <tr>
              <th>STT</th>
              <th>Người dùng</th>
              <th>Số sao</th>
              <th>Bình luận</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {reviews.map((r, idx) => (
              <tr key={r.id}>
                <td>{idx + 1}</td>
                <td>{r.name || "Ẩn danh"}</td>
                <td>{r.rating} ⭐</td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                
                  <td>
                  {r.lock_reviews === 1 ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleStatus(r.id, r.lock_reviews)}
                    >
                      Đã ẩn
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleToggleStatus(r.id, r.lock_reviews)}
                    >
                      Ẩn
                    </Button>
                  )}
                </td>

                
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </div>
);

};

export default ReviewList;
