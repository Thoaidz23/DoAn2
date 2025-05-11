const db = require('../../db'); // Kết nối MySQL

exports.getAllPosts = (req, res) => {
  const sql = `
    SELECT p.*, c.*
    FROM tbl_post p
    JOIN tbl_category_post c ON p.id_category_post = c.id_category_post
    ORDER BY p.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn bài viết:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
};
