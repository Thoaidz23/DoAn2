const connection = require('../../db');

// Lấy tất cả footer
const getAllFooters = (req, res) => {
  const query = 'SELECT * FROM tbl_footer';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy dữ liệu footer:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
    res.json(results);
  });
};

// Cập nhật footer theo ID
const updateFooterById = (req, res) => {
  const { id } = req.params; // Lấy ID từ params
  const { title, content } = req.body; // Lấy dữ liệu từ body

  // Kiểm tra dữ liệu có hợp lệ không
  if (!title || !content) {
    return res.status(400).json({ error: 'Thiếu dữ liệu yêu cầu (title, content)' });
  }

  const query = 'UPDATE tbl_footer SET title = ?, content = ? WHERE id_footer = ?';
  connection.query(query, [title, content, id], (err, results) => {
    if (err) {
      console.error('Lỗi khi cập nhật footer:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật footer' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy footer với id này' });
    }

    res.json({ message: 'Cập nhật footer thành công' });
  });
};

module.exports = {
  getAllFooters,
  updateFooterById,
};
