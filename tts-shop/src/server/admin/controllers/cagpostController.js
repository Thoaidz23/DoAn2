// controllers/cagpostController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả từ cơ sở dữ liệu
const getCagposts = (req, res) => {
  const query = 'SELECT id_category_post, name_category_post FROM tbl_category_post';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Thêm danh mục bài viết
const addCagpost = (req, res) => {
  const { name_category_post } = req.body;
  
  // Kiểm tra tên danh mục bài viết không được để trống
  if (!name_category_post) {
    return res.status(400).json({ error: "Tên danh mục bài viết là bắt buộc" });
  }

  // Câu lệnh SQL thêm danh mục bài viết vào cơ sở dữ liệu
  const sql = "INSERT INTO tbl_category_post (name_category_post) VALUES (?)";
  
  connection.query(sql, [name_category_post], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    // Trả về thông báo thành công
    res.status(201).json({ message: "✅ Thêm danh mục bài viết thành công", insertedId: result.insertId });
  });
};

// Lấy 1 danh mục bài viết theo ID
const getCagpostById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT id_category_post, name_category_post FROM tbl_category_post WHERE id_category_post = ?";
  
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi máy chủ" });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy danh mục bài viết." });
    res.status(200).json(results[0]);
  });
};

// Sửa danh mục bài viết
const updateCagpost = (req, res) => {
  const { id } = req.params;  // Lấy ID từ URL
  const { name_category_post } = req.body;

  if (!name_category_post) {
    return res.status(400).json({ error: "Tên danh mục bài viết là bắt buộc" });
  }

  const sql = "UPDATE tbl_category_post SET name_category_post = ? WHERE id_category_post = ?";
  connection.query(sql, [name_category_post, id], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "✅ Sửa danh mục bài viết thành công!" });
    }
    return res.status(404).json({ error: "Không tìm thấy danh mục bài viết." });
  });
};

// Xóa danh mục bài viết theo ID
const deleteCagpost = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tbl_category_post WHERE id_category_post = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Danh mục bài viết đã được xóa thành công." });
    } else {
      res.status(404).json({ message: "Danh mục bài viết không tìm thấy." });
    }
  });
};



module.exports = { getCagposts, addCagpost, getCagpostById, updateCagpost, deleteCagpost };