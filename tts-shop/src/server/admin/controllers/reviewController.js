const db = require("../../db");

// Lấy danh sách đánh giá theo id_group_product
exports.getReviewsByGroup = (req, res) => {
  const { id_group_product } = req.params;

  const sql = `
    SELECT r.*, u.name, u.avatar
    FROM tbl_reviews r
    JOIN tbl_user u ON u.id_user = r.id_user
    WHERE id_group_product = ? 
    ORDER BY created_at DESC
  `;

  db.query(sql, [id_group_product], (err, results) => {
    if (err) {
      console.error("Lỗi lấy đánh giá:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
};

// Xóa đánh giá
exports.deleteReview = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tbl_reviews WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi xóa đánh giá:", err);
      return res.status(500).json({ error: "Xóa thất bại" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    res.json({ message: "Xóa thành công" });
  });
};
