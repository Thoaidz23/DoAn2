// controllers/orderController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả don hang từ cơ sở dữ liệu
const getOrders = (req, res) => {
  const query = 'SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date FROM tbl_order o JOIN tbl_user u ON o.id_user = u.id_user';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

module.exports = { getOrders };