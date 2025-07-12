const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../../db'); // db.js dùng mysql2 bình thường

// Đổi mật khẩu
const changePassword = (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  // Kiểm tra xác thực user từ token
  const token = req.headers.authorization.split(" ")[1];  // Lấy token từ header
  jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err || decoded.userId !== parseInt(userId)) {

      return res.status(403).json({ message: "Không có quyền thực hiện thao tác này." });
    }

    // Kiểm tra mật khẩu cũ
    connection.execute('SELECT * FROM tbl_user WHERE id_user = ?', [userId], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        return res.status(500).json({ message: 'Lỗi server' });
      }

      // Kiểm tra xem kết quả truy vấn có trả về người dùng không
      if (results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const user = results[0];  // Lấy thông tin người dùng đầu tiên từ kết quả truy vấn

      // So sánh mật khẩu cũ
      bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Lỗi xác thực mật khẩu' });
        }

        if (!isMatch) {
          return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
        }

        // Mã hóa mật khẩu mới
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
          }

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          connection.execute(
            'UPDATE tbl_user SET password = ? WHERE id_user = ?',
            [hashedPassword, userId],
            (err, result) => {
              if (err) {
                return res.status(500).json({ message: 'Lỗi server khi thay đổi mật khẩu' });
              }

              return res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công!' });
            }
          );
        });
      });
    });
  });
};

module.exports = { changePassword };
