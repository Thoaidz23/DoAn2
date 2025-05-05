// controllers/postController.js
const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả từ cơ sở dữ liệu
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

module.exports = { getPosts };