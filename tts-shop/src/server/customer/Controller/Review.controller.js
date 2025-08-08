const db = require("../../db");

const getReviewsByProduct = (req, res) => {
  const { productId } = req.params;

  const sql = `
   SELECT 
  r.*, 
  u.name, 
  u.avatar,
  ram.name_ram,
  rom.name_rom,
  c.name_color
FROM tbl_reviews r
JOIN tbl_user u ON u.id_user = r.id_user
LEFT JOIN tbl_product p ON p.id_product = r.id_product
LEFT JOIN tbl_ram ram ON ram.id_ram = p.id_ram
LEFT JOIN tbl_rom rom ON rom.id_rom = p.id_rom
LEFT JOIN tbl_color c ON c.id_color = p.id_color
WHERE r.id_group_product = ?
ORDER BY r.created_at DESC
`;
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
  console.log("📦 Nhận được body:", req.body);
  try {
    const {
      id_group_product,
      id_user,
      initials,
      rating,
      comment,
      code_order,
      tags,
      id_product
    } = req.body;

    // Kiểm tra đã đánh giá đơn hàng này chưa
    const checkSql = `
      SELECT 1 FROM tbl_reviews 
      WHERE id_user = ? AND id_group_product = ? AND code_order = ?
      LIMIT 1
    `;

    const [rows] = await db.promise().query(checkSql, [id_user, id_group_product, code_order]);

    console.log("🔍 Kết quả kiểm tra đã đánh giá:", rows);

    
    if (rows.length > 0) {
      return res.status(400).json({ error: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi" });
    }

    if (!id_group_product || !id_user || !rating || !comment) {
      return res.status(400).json({ error: "Thiếu thông tin đánh giá" });
    }
    if (!id_product) {
      return res.status(400).json({ error: "Thiếu id_product để lưu đánh giá" });
    }

    const tagString = typeof tags === 'string' ? tags : JSON.stringify(tags || []);

    const sql = `
      INSERT INTO tbl_reviews (id_group_product, id_user, initials, rating, comment, tags, created_at, code_order,id_product)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;
    const [result] = await db.promise().execute(sql, [
  id_group_product,
  id_user,
  initials,
  rating,
  comment,
  tagString,
  code_order,
  id_product,
]);

console.log("✅ Kết quả insert:", result);

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
 const { userId, groupProductId, code_order } = req.query;

const sql = `
  SELECT id, id_user, comment, rating, tags, created_at,code_order
  FROM tbl_reviews 
  WHERE id_user = ? AND id_group_product = ? AND code_order = ?
  ORDER BY created_at DESC
  LIMIT 1
`;

db.query(sql, [userId, groupProductId, code_order], (err, result) => {
  if (err) return res.status(500).json({ error: "Lỗi server" });

  if (result.length === 0) {
    return res.json({ reviewed: false, review: null });
  }

  const review = result[0];
  const createdAt = new Date(review.created_at);
  const now = new Date();

  const monthsDiff = (now.getFullYear() - createdAt.getFullYear()) * 12 +
                     (now.getMonth() - createdAt.getMonth());

  const MAX_MONTHS = 2;

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
