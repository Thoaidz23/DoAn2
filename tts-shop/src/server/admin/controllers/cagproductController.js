// controllers/cagproductController.js
const connection = require('../../db');  // Kết nối MySQL

// Lấy tất cả danh mục sản phẩm
const getCagproducts = (req, res) => {
  const query = 'SELECT id_category_product, name_category_product FROM tbl_category_product';

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
};

// Thêm danh mục sản phẩm
const addProductCategory = (req, res) => {
  const { name_category_product } = req.body;

  if (!name_category_product) {
    return res.status(400).json({ error: "Tên danh mục là bắt buộc" });
  }

  const sql = `INSERT INTO tbl_category_product (name_category_product) VALUES (?)`;

  connection.query(sql, [name_category_product], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    res.json({ message: "✅ Thêm danh mục thành công", insertedId: result.insertId });
  });
};

// Lấy danh mục theo ID
const getProductCategoryById = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM tbl_category_product WHERE id_category_product = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi máy chủ." });
    if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy danh mục." });
    res.json(result[0]);
  });
};

// Cập nhật danh mục
const updateProductCategory = (req, res) => {
  const { id } = req.params;
  const { name_category_product } = req.body;

  if (!name_category_product) {
    return res.status(400).json({ message: "Tên danh mục không được để trống." });
  }

  const query = "UPDATE tbl_category_product SET name_category_product = ? WHERE id_category_product = ?";

  connection.query(query, [name_category_product, id], (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Cập nhật thành công." });
    } else {
      res.status(404).json({ message: "Danh mục không tìm thấy." });
    }
  });
};

// Xóa danh mục sản phẩm theo ID
const deleteProductCategory = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tbl_category_product WHERE id_category_product = ?";

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


// Export đồng bộ
module.exports = {
  getCagproducts,
  addProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory
};
