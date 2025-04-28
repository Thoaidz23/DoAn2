const db = require('../../db');

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM tbl_sanpham WHERE id_sanpham = ?';

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }

    res.json(results[0]);
  });
};
