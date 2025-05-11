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

  const sql = "INSERT INTO tbl_category_brand (name_category_brand) VALUES (?)";
  connection.query(sql, [name_category_brand], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    res.status(201).json({ message: "✅ Thêm thương hiệu thành công", insertedId: result.insertId });
  });
};

// Lấy 1 thương hiệu theo ID
const getCagbrandById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT id_category_brand, name_category_brand FROM tbl_category_brand WHERE id_category_brand = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi máy chủ" });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu." });
    res.status(200).json(results[0]);
  });
};

// Sửa thương hiệu
const updateCagbrand = (req, res) => {
  const { id } = req.params;  // Lấy ID từ URL
  const { name_category_brand } = req.body;

  if (!name_category_brand) {
    return res.status(400).json({ error: "Tên thương hiệu là bắt buộc" });
  }

  const sql = "UPDATE tbl_category_brand SET name_category_brand = ? WHERE id_category_brand = ?";
  connection.query(sql, [name_category_brand, id], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "✅ Sửa thương hiệu thành công!" });
    }
    return res.status(404).json({ error: "Không tìm thấy thương hiệu." });
  });
};

// Xóa danh mục thuong hieu theo ID
const deleteProductCategory = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tbl_category_brand WHERE id_category_brand = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Danh mục đã được xóa thành công." });
    } else {
      res.status(404).json({ message: "Danh mục không tìm thấy." });
    }
  });
};


module.exports = { getCagbrands, addCagbrand, getCagbrandById, updateCagbrand, deleteProductCategory };