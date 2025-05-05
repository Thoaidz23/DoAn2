const path = require('path');
const fs = require('fs');
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả từ cơ sở dữ liệu
const getBanners = (req, res) => {
  const query = 'SELECT id_banner, name, image FROM tbl_banner';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Thêm mới banner
const addBanner = (req, res) => {
  console.log("Request body:", req.body);
  console.log("File:", req.file);
  const { name } = req.body;
  const image = req.file;  // Lấy tệp ảnh đã được multer xử lý

  // Kiểm tra nếu thiếu tên hoặc ảnh
  if (!name || !image) {
    return res.status(400).json({ message: "Tên và ảnh banner là bắt buộc." });
  }

  // Thêm banner vào cơ sở dữ liệu
  const fileName = req.file.filename; 
  const query = 'INSERT INTO tbl_banner (name, image) VALUES (?, ?)';
  connection.query(query, [name, fileName], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi thêm banner." });
    }
    res.status(201).json({ message: "Banner đã được thêm mới thành công!" });
  });
};

// Lấy thông tin banner theo ID để sửa
const getBannerById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tbl_banner WHERE id_banner = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }
    res.json(results[0]);  // Trả về banner dưới dạng JSON
  });
};

// Sửa banner
const editBanner = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const newImage = req.file ? req.file.filename : null;

  // Truy vấn ảnh cũ để xóa nếu có ảnh mới
  connection.query('SELECT image FROM tbl_banner WHERE id_banner = ?', [id], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn lấy banner:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy banner.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy banner.' });
    }

    const oldImage = results[0].image;

    if (newImage && oldImage) {
      const oldImagePath = path.join(__dirname, '../../images/banner', oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const query = newImage
      ? 'UPDATE tbl_banner SET name = ?, image = ? WHERE id_banner = ?'
      : 'UPDATE tbl_banner SET name = ? WHERE id_banner = ?';

    const params = newImage ? [name, newImage, id] : [name, id];

    connection.query(query, params, (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật banner:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật banner.' });
      }
      res.status(200).json({ message: 'Cập nhật banner thành công!' });
    });
  });
};

const deleteBanner = (req, res) => {
  const id_banner = req.params.id;
  const sql = "DELETE FROM tbl_banner WHERE id_banner = ?";

  connection.query(sql, [id_banner], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa banner:", err);
      return res.status(500).json({ error: "Lỗi khi xóa banner" });
    }
    res.json({ message: "Xóa banner thành công" });
  });
};

module.exports = {
  getBanners,
  addBanner,
  getBannerById,
  editBanner,
  deleteBanner
};
