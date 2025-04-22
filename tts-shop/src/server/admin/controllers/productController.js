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

// Thêm sản phẩm
const addProduct = (req, res) => {
  const { ten_sanpham, giasp, soluong, mota, id_dmsp } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  // Kiểm tra nếu id_dmsp không hợp lệ
  if (!id_dmsp) {
    return res.status(400).json({ error: "Danh mục sản phẩm không hợp lệ." });
  }

  const sql = `INSERT INTO tbl_sanpham (ten_sanpham, giasp, soluong, noidung, hinhanh, id_dmsp) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [ten_sanpham, giasp, soluong, mota, hinhanh, id_dmsp], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi khi thêm sản phẩm vào database", details: err.message || err.stack });
    }
    res.status(201).json({ message: "✅ Thêm sản phẩm thành công" });
  });
};


// Lấy tất cả danh mục sản phẩm
const getProductCag = (req, res) => {
  const sql = 'SELECT * FROM tbl_danhmucsanpham';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results); // Trả về danh sách danh mục
  });
};


module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  getProductCag // 🟢 Quan trọng: export ra ngoài
};