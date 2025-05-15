const db = require('../../db'); // Đảm bảo db sử dụng mysql.createPool
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

exports.sendOtp = (req, res) => {
  const { email, mode } = req.body; // Lấy mode từ request

  // Kiểm tra xem email có được gửi lên không
  if (!email) return res.status(400).json({ message: "Thiếu email" });

  // Kiểm tra nếu mode không phải "forgot-password" và "register", trả về lỗi
  if (!['forgot-password', 'register'].includes(mode)) {
    return res.status(400).json({ message: "Mode không hợp lệ" });
  }

  // 1. Kiểm tra email có tồn tại trong bảng người dùng hay không
  db.query('SELECT * FROM tbl_user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn email:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra email" });
    }

    if (mode === 'register' && results.length > 0) {
      // Nếu mode là đăng ký và email đã tồn tại, không cho đăng ký lại
      return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" });
    }

    if (mode === 'forgot-password' && results.length === 0) {
      // Nếu mode là quên mật khẩu và email không tồn tại, không thể phục hồi
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }

    // 2. Tạo mã OTP và thời gian hết hạn
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // Hết hạn sau 5 phút

    // 3. Cấu hình và gửi email OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'truongthuong1512@gmail.com', // Thay đổi với email của bạn
        pass: 'lljvbafslfcjbltv'  // Thay đổi với mật khẩu ứng dụng của bạn
      }
    });

    const mailOptions = {
      from: 'truongthuong1512@gmail.com',
      to: email,
      subject: 'Mã xác thực OTP',
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã sẽ hết hạn sau 5 phút.</p>`
    };

    // Gửi OTP qua email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Lỗi gửi email:", err);
        return res.status(500).json({ message: 'Không gửi được email' });
      }

      // Lưu OTP vào cơ sở dữ liệu
      db.query(
        'INSERT INTO tbl_otp_forgot_password (email, otp, expired_at) VALUES (?, ?, ?)',
        [email, otp, expiresAt],
        (error, results) => {
          if (error) {
            console.error("Lỗi lưu OTP:", error);
            return res.status(500).json({ message: "Không lưu được OTP" });
          }

          return res.status(200).json({ message: 'OTP đã được gửi qua email' });
        }
      );
    });
  });
};


// Xác thực OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  // Kiểm tra các tham số gửi lên
  if (!email || !otp) {
    return res.status(400).json({ message: "Thiếu email hoặc mã OTP" });
  }

  // Kiểm tra OTP trong cơ sở dữ liệu
  db.query(
    'SELECT otp, expired_at FROM tbl_otp_forgot_password WHERE email = ? ORDER BY expired_at DESC LIMIT 1;',
    [email],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn OTP:", err);
        return res.status(500).json({ message: "Lỗi server khi xác thực OTP" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy OTP cho email này" });
      }

      const savedOtp = results[0].otp;
      const expiresAt = new Date(results[0].expired_at);

      // Kiểm tra OTP có chính xác không
      if (savedOtp !== otp) {
        return res.status(400).json({ message: "Mã OTP không đúng" });
      }

      // Kiểm tra xem OTP đã hết hạn chưa
      if (Date.now() > expiresAt.getTime()) {
        return res.status(400).json({ message: "Mã OTP đã hết hạn" });
      }

      return res.status(200).json({ message: "Xác thực OTP thành công" });
    }
  );
};

// Xóa OTP
exports.deleteOtp = (req, res) => {
  const { email } = req.body; // Lấy email từ body của request

  // Kiểm tra nếu email không được cung cấp
  if (!email) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  // Thực thi câu lệnh DELETE
  db.query(
    'DELETE FROM tbl_otp_forgot_password WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa OTP:", err);
        return res.status(500).json({ message: "Lỗi server khi xóa OTP" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy bản ghi OTP cho email này" });
      }

      return res.status(200).json({ message: "Xóa OTP thành công" });
    }
  );
};

