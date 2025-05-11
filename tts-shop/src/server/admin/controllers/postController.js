const path = require('path');
const fs = require('fs');
const connection = require('../../db');   // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả bài viết từ cơ sở dữ liệu
const getPosts = (req, res) => {
  const query = 'SELECT p.id_post, p.title, p.author, p.image, p.content, c.name_category_post FROM tbl_post p LEFT JOIN tbl_category_post c ON p.id_category_post = c.id_category_post';

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Thêm mới bài viết
const addPost = (req, res) => {
  console.log("Request body:", req.body);
  console.log("File:", req.file);
  
  const { title, author, content, id_category_post } = req.body;
  const image = req.file;  // Lấy tệp ảnh đã được multer xử lý

  // Kiểm tra nếu thiếu tiêu đề, tác giả, nội dung, danh mục hoặc ảnh
  if (!title || !author || !content || !id_category_post || !image) {
    return res.status(400).json({ message: "Tiêu đề, tác giả, nội dung, danh mục và ảnh là bắt buộc." });
  }

  // Lấy tên ảnh từ multer (tệp đã được lưu trữ)
  const fileName = req.file.filename;

  // Thêm bài viết vào cơ sở dữ liệu
  const query = 'INSERT INTO tbl_post (title, author, content, id_category_post, image, date) VALUES (?, ?, ?, ?, ?, NOW())';
  const values = [title, author, content, id_category_post, fileName];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ khi thêm bài viết." });
    }
    res.status(201).json({ message: "Bài viết đã được thêm mới thành công!" });
  });
};

// Lấy thông tin bài viết theo ID để sửa
const getPostById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM tbl_post WHERE id_post = ?';  // Sửa lỗi cú pháp ở đây
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.json(results[0]);  // Trả về bài viết dưới dạng JSON
  });
};

// Sửa bài viết
const editPost = (req, res) => {
  const { id } = req.params;
  const { title, author, content, id_category_post } = req.body;
  const newImage = req.file ? req.file.filename : null;

  // Truy vấn ảnh cũ để xóa nếu có ảnh mới
  connection.query('SELECT image FROM tbl_post WHERE id_post = ?', [id], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn lấy bài viết:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy bài viết.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    }

    const oldImage = results[0].image;

    if (newImage && oldImage) {
      const oldImagePath = path.join(__dirname, '../../images/post', oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const query = newImage
      ? 'UPDATE tbl_post SET title = ?, author = ?, content = ?, id_category_post = ?, image = ?, date = NOW() WHERE id_post = ?'
      : 'UPDATE tbl_post SET title = ?, author = ?, content = ?, id_category_post = ?, date = NOW() WHERE id_post = ?';

    const params = newImage
      ? [title, author, content, id_category_post, newImage, id]
      : [title, author, content, id_category_post, id];

    connection.query(query, params, (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật bài viết:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật bài viết.' });
      }
      res.status(200).json({ message: 'Cập nhật bài viết thành công!' });
    });
  });
};

// Xóa bài viết
const deletePost = (req, res) => {
  const id_post = req.params.id;
  const sql = "DELETE FROM tbl_post WHERE id_post = ?";

  connection.query(sql, [id_post], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      return res.status(500).json({ error: "Lỗi khi xóa bài viết" });
    }
    res.json({ message: "Xóa bài viết thành công" });
  });
};

module.exports = { getPosts, addPost, getPostById, editPost, deletePost };
