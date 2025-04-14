// controllers/productController.js
const connection = require('../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả sản phẩm từ cơ sở dữ liệu
const getProducts = (req, res) => {
  const query = 'SELECT id_sanpham, ten_sanpham, giasp, soluong, hinhanh FROM tbl_sanpham';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

module.exports = { getProducts };