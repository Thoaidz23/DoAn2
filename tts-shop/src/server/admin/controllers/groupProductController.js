// controllers/productController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả dòng sản phẩm
const getAllProducts = (req, res) => {
  const sql = 'SELECT g.name_group_product, g.image, b.name_category_brand, c.name_category_product FROM tbl_group_product g INNER JOIN tbl_category_brand b ON g.id_category_brand = b.id_category_brand INNER JOIN tbl_category_product c ON g.id_category_product = c.id_category_product';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Lấy chi tiết sản phẩm theo ID
const getGroupProductDetail = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id_product, 
      p.price, 
      p.quantity, 
      col.name_color, 
      r.name_ram, 
      rom.name_rom, 
      g.name_group_product AS name_product, 
      g.image, 
      g.content, 
      g.id_category_product, 
      g.id_category_brand 
    FROM tbl_product p
    INNER JOIN tbl_group_product g ON p.id_group_product = g.id_group_product
    INNER JOIN tbl_color col ON p.id_color = col.id_color
    INNER JOIN tbl_ram r ON p.id_ram = r.id_ram
    INNER JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    WHERE p.id_group_product = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(results); // trả về tất cả các sản phẩm của nhóm này
  });
};



// Thêm sản phẩm
const addProduct = (req, res) => {
  const { ten_sanpham, giasp, soluong, mota, id_dmsp } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  // Kiểm tra nếu id_dmsp không hợp lệ
  if (!id_dmsp) {
    return res.status(400).json({ error: "Danh mục sản phẩm không hợp lệ." });
  }

  const sql = `INSERT INTO tbl_sanpham (ten_sanpham, giasp, soluong, noidung, hinhanh, id_dmsp) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [ten_sanpham, giasp, soluong, mota, hinhanh, id_dmsp], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      return res.status(500).json({ error: "Lỗi khi thêm sản phẩm vào database", details: err.message || err.stack });
    }
    res.status(201).json({ message: "✅ Thêm sản phẩm thành công" });
  });
};


// Lấy tất cả danh mục sản phẩm
const getProductCag = (req, res) => {
  const sql = 'SELECT * FROM tbl_danhmucsanpham';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results); // Trả về danh sách danh mục
  });
};


module.exports = {
  getAllProducts,
  getGroupProductDetail, // Không cần 'this' ở đây
  addProduct,
  getProductCag
};
