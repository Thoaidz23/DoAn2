const db = require("../../db");

const getReviewsByProduct = (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT r.*, u.name
    FROM tbl_reviews r
    JOIN tbl_user u ON u.id_user = r.id_user
    WHERE id_group_product = ? 
    ORDER BY created_at DESC`;
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("❌ Lỗi truy vấn MySQL:", err); // Log lỗi chi tiết
      return res.status(500).json({ error: "Lỗi khi truy vấn đánh giá" });
    }

    res.status(200).json(result);
  });
};

// Thêm đánh giá mới
const addReview = async (req, res) => {
  try {
    const {
      id_group_product,
      id_user,
      initials,
      rating,
      comment,
      tags
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id_group_product || !id_user || !rating || !comment) {
      return res.status(400).json({ error: "Thiếu thông tin đánh giá" });
    }

    // Ép tags về string nếu là object (tránh lỗi mảng)
    const tagString = typeof tags === 'string' ? tags : JSON.stringify(tags || []);

    const sql = `
      INSERT INTO tbl_reviews (id_group_product, id_user, initials, rating, comment, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.execute(sql, [
      id_group_product,
      id_user,
      initials,
      rating,
      comment,
      tagString
    ]);

    return res.status(201).json({ message: "Đánh giá đã được thêm thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm đánh giá:", err);
    return res.status(500).json({ error: "Lỗi server" });
  }
};



module.exports = {
  getReviewsByProduct,
  addReview
};
