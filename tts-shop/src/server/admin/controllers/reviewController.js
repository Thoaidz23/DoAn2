const db = require("../../db");

// Lấy danh sách đánh giá theo id_group_product
exports.getReviewsByGroup = (req, res) => {
  const { id_group_product } = req.params;

  const sql = `
    SELECT r.*, u.name, u.avatar, r1.name_ram, r2.name_rom,c.name_color, gp.name_group_product
    FROM tbl_reviews r
    JOIN tbl_user u ON u.id_user = r.id_user
    JOIN tbl_product p ON p.id_product = r.id_product
    JOIN tbl_group_product gp ON gp.id_group_product = r.id_group_product
    LEFT JOIN tbl_color c ON c.id_color = p.id_color
    LEFT JOIN tbl_ram r1 ON r1.id_ram = p.id_ram
    LEFT JOIN tbl_rom r2 ON r2.id_rom = p.id_rom
    WHERE r.id_group_product = ? 
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
