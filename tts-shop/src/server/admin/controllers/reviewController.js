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

// Toggle ẩn/hiện đánh giá
exports.toggleReviewStatus = (req, res) => {
  const { id } = req.params;
  const { lock_reviews } = req.body; // 0 = hiện, 1 = ẩn

  const sql = "UPDATE `tbl_reviews` SET `lock_reviews` = ? WHERE id = ?";
  db.query(sql, [lock_reviews, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật đánh giá:", err);
      return res.status(500).json({ error: "Cập nhật thất bại" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    res.json({ message: "Cập nhật thành công" });
  });
};
