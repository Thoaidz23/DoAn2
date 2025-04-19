const db = require('../../db');

// Lấy tất cả sản phẩm
const getProducts = (req, res) => {
  const query = 'SELECT * FROM tbl_sanpham';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
};
const { getProductById } = require('../Controller/product.controller');

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;

  const productQuery = "SELECT * FROM tbl_sanpham WHERE id = ?";
  const specsQuery = "SELECT thuoctinh, giatri FROM tbl_thongsokythuat WHERE id_sanpham = ?";

  db.query(productQuery, [productId], (err, productResult) => {
    if (err) return res.status(500).json({ error: err });
    if (productResult.length === 0) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const product = productResult[0];

    db.query(specsQuery, [productId], (err, specsResult) => {
      if (err) return res.status(500).json({ error: err });

      product.thongsokythuat = specsResult;
      res.json(product);
    });
  });
};
// controller/product.controller.js
export const getFeaturedProducts = (req, res) => {
  const sql = `
    SELECT id_sanpham, tensanpham, dungluong, giaban, hinhanh 
    FROM tbl_sanpham 
    WHERE noibat = 1 
    LIMIT 20
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn sản phẩm" });
    res.json(results);
  });
};

// controller/post.controller.js
export const getLatestPosts = (req, res) => {
  const sql = `
    SELECT id_baiviet, tieude, mota, hinhanh 
    FROM tbl_baiviet 
    ORDER BY ngaydang DESC 
    LIMIT 8
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn bài viết" });
    res.json(results);
  });
};


module.exports = { getProducts, getProductById };
