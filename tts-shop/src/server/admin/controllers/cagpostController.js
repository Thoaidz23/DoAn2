// controllers/cagpostController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả sản phẩm từ cơ sở dữ liệu
const getCagposts = (req, res) => {
  const query = 'SELECT id_dmbv, ten_dmbv FROM tbl_danhmucbaiviet';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

module.exports = { getCagposts };