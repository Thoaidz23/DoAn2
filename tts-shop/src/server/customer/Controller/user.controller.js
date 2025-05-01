const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../../db'); // db.js dùng mysql2 bình thường

// Đăng ký
const register = (req, res) => {
  const { name, email, phone, address, password } = req.body;

  connection.execute('SELECT * FROM tbl_user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn email:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
      }

      connection.execute(
        'INSERT INTO tbl_user (name, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, address, hashedPassword,2],
        (err, result) => {
          if (err) {
            console.error("Lỗi thêm người dùng:", err);
            console.log("Chi tiết lỗi SQL:", err.sqlMessage);
            return res.status(500).json({ message: 'Lỗi server khi thêm người dùng' });
          }

          return res.status(201).json({ message: 'Đăng ký thành công!' });
        }
      );
    });
  });
};

// Đăng nhập
const login = (req, res) => {
  const { email, password } = req.body;

  connection.execute('SELECT * FROM tbl_user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn email:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi xác thực mật khẩu' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu không chính xác' });
      }

      const token = jwt.sign(
        { userId: user.id_user, role: user.role },
        process.env.JWT_SECRET || 'yourSecretKey',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id_user,
          name: user.name,
          email: user.email,
          role: user.role,
        } 
      });
    });
  });
};



module.exports = { register, login };
