const db = require('../../db');
const bcrypt = require('bcrypt');

exports.resetPassword = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email và mật khẩu không được để trống" });
  }

  // Mã hóa mật khẩu
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi mã hóa mật khẩu" });
    }

    // Cập nhật mật khẩu trong CSDL
    const sql = 'UPDATE tbl_user SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Lỗi SQL:", err);
        return res.status(500).json({ message: "Lỗi máy chủ khi cập nhật mật khẩu" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng với email này" });
      }

      return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công" });
    });
  });
};
