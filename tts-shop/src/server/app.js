const express = require('express');
const cors = require('cors');
const connection = require('./db'); // Import kết nối MySQL

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// API lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
  const query = "SELECT id_sanpham, ten_sanpham, giasp, soluong , hinhanh FROM tbl_sanpham";
  connection.query(query, (err, results) => {  // Dùng connection.query thay vì db.query
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
});

// Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
