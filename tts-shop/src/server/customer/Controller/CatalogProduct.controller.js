const db = require('../../db');

const getPostsByCategory = async (req, res) => {
  const { id_category } = req.params;

  const sql = `
    SELECT p.*,c.name_category_post
    FROM tbl_post p
    JOIN tbl_category_post c ON c.id_category_post = p.id_category_post
    WHERE p.id_category_post = ?
    ORDER BY p.date DESC
  `;

  try {
    const posts = await new Promise((resolve, reject) => {
      db.query(sql, [id_category], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Lỗi khi truy vấn bài viết:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi truy vấn bài viết.',
    });
  }
};

module.exports = {
  getPostsByCategory,
};
