// Controller: PostController.js
const db = require('../../db'); // Đảm bảo đã kết nối DB đúng

const getPostById = (req, res) => {
  const { id_post } = req.params;
  const sql = `
    SELECT * FROM tbl_post
    WHERE id_post = ?
  `;
  db.query(sql, [id_post], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
    if (result.length === 0) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    res.json(result[0]); // Trả về bài viết
  });
};

module.exports = { getPostById };
