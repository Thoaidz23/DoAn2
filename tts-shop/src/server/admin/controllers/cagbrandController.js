// controllers/cagbrandbrandController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả từ cơ sở dữ liệu
const getCagbrands = (req, res) => {
  const query = 'SELECT id_dmth, ten_dmth FROM tbl_danhmucthuonghieu';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

module.exports = { getCagbrands };