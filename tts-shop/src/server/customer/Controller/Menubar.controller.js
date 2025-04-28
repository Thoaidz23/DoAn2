const db = require('../../db');

// Lấy danh sách danh mục sản phẩm
exports.getAllCategories = (req, res) => {
  const query = 'SELECT * FROM tbl_category_product';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
    res.json(results);
  });
};

// Lấy danh sách thương hiệu theo danh mục sản phẩm
exports.getBrandsByCategory = (req, res) => {
  const categoryId = req.params.id;
  const query = `
    SELECT DISTINCT b.id_category_brand, b.name_category_brand
    FROM tbl_group_product g
    JOIN tbl_category_brand b ON g.id_category_brand = b.id_category_brand
    WHERE g.id_category_product = ?`; // Thêm điều kiện WHERE để lọc theo categoryId

  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
    res.json(results);
  });
};
