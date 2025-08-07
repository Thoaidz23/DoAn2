const db = require("../../db");

const getReviewsByProduct = (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT r.*, u.name, u.avatar
    FROM tbl_reviews r
    JOIN tbl_user u ON u.id_user = r.id_user
    WHERE id_group_product = ? 
    ORDER BY created_at DESC`;
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("❌ Lỗi truy vấn MySQL:", err);
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

// Kiểm tra người dùng đã mua sản phẩm chưa
const hasPurchasedProduct = (req, res) => {
  const { userId, groupProductId } = req.query;
  console.log('Billdetail',userId, groupProductId)
  const sql = `
    SELECT 1 FROM tbl_order_detail od
    JOIN tbl_order o ON o.code_order = od.code_order
    JOIN tbl_product p ON p.id_product = od.id_product
    WHERE o.id_user = ? AND p.id_group_product = ? AND o.status = 3
    LIMIT 1
  `;

  db.query(sql, [userId, groupProductId], (err, result) => {
    if (err) {
      console.error("❌ Lỗi kiểm tra mua hàng:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    return res.json({ hasPurchased: result.length > 0 });
  });
};
// Controller
const checkAlreadyReviewed = (req, res) => {
  const { userId, groupProductId } = req.query;

  const sql = `
    SELECT id, id_user, comment, rating, tags, created_at
    FROM tbl_reviews 
    WHERE id_user = ? AND id_group_product = ? 
    LIMIT 1
  `;

  db.query(sql, [userId, groupProductId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });

    if (result.length === 0) {
      return res.json({ reviewed: false, review: null });
    }

    const review = result[0];
    const createdAt = new Date(review.created_at);
    const now = new Date();
    
    const monthsDiff = (now.getFullYear() - createdAt.getFullYear()) * 12 + 
                       (now.getMonth() - createdAt.getMonth());

    const MAX_MONTHS = 2; // 👉 Thay đổi số tháng ở đây

    const editable = monthsDiff < MAX_MONTHS;

    return res.json({
      reviewed: true,
      review,
      editable
    });
  });
};


// PUT /api/reviews/:id
const updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment, tags } = req.body;

  const sql = `
    UPDATE tbl_reviews 
    SET rating = ?, comment = ?, tags = ?, created_at = NOW()
    WHERE id = ?
  `;
  const tagStr = typeof tags === 'string' ? tags : JSON.stringify(tags || []);

  db.query(sql, [rating, comment, tagStr, id], (err) => {
    if (err) return res.status(500).json({ error: "Lỗi khi cập nhật đánh giá" });
    return res.json({ message: "Đánh giá đã được cập nhật" });
  });
};


module.exports = {
  getReviewsByProduct,
  addReview,
  hasPurchasedProduct, // <-- xuất thêm
  checkAlreadyReviewed,
  updateReview
};
