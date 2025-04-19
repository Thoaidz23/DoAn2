// controllers/productController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả sản phẩm
const getAllProducts = (req, res) => {
  const sql = 'SELECT * FROM tbl_sanpham';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Lấy chi tiết sản phẩm theo ID
const getProductById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tbl_sanpham WHERE id_sanpham = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(results[0]);
  });
};

module.exports = {
  getAllProducts,
  getProductById
};