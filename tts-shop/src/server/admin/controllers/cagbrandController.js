// controllers/cagbrandbrandController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả từ cơ sở dữ liệu
const getCagbrands = (req, res) => {
  const query = 'SELECT id_category_brand, name_category_brand FROM tbl_category_brand';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Thêm thương hiệu
const addCagbrand = (req, res) => {
  const { name_category_brand } = req.body;
  if (!name_category_brand) return res.status(400).json({ error: "Tên thương hiệu là bắt buộc" });

  const sql = "INSERT INTO tbl_name_category (name_category_brand) VALUES (?)";
  connection.query(sql, [name_category_brand], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    res.status(201).json({ message: "✅ Thêm thương hiệu thành công", insertedId: result.insertId });
  });
};


module.exports = { getCagbrands, addCagbrand };