const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../../db'); // db.js dùng mysql2 bình thường


// Đăng ký
const register = (req, res) => {
  const { name, email, phone, address, password } = req.body;
  // Trả về mã HEX ngẫu nhiên
  const getRandomHexColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 60;

    // Chuyển từ HSL → RGB → HEX
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // grayscale
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `${toHex(r)}${toHex(g)}${toHex(b)}`; // không cần dấu #
  };



  // Kiểm tra điều kiện mật khẩu
  const hasWhitespace = /\s/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  if (hasWhitespace) {
    return res.status(400).json({ message: 'Mật khẩu không được chứa khoảng trắng' });
  }

  if (!hasUppercase) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất một chữ in hoa' });
  }

  if (!hasSpecialChar) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất một ký tự đặc biệt' });
  }

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
      const nameParts =name.split(' ');
      const firstName = nameParts?.[nameParts.length - 1];

      const color = getRandomHexColor();
      const avatar = `https://ui-avatars.com/api/?name=${firstName}&background=${color}&color=fff&rounded=true&size=40`;


      connection.execute(
        'INSERT INTO tbl_user (name, email, phone, address, password, role, lock_account,avatar) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
        [name, email, phone, address, hashedPassword, 3, 0, avatar], // `lock_account = 0` cho phép đăng nhập

        (err, result) => {
          if (err) {
            console.error("Lỗi thêm người dùng:", err);
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

    // Kiểm tra trạng thái tài khoản
    if (user.lock_account === 1) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

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
          avatar: user.avatar,
        } 
      });
    });
  });
};


module.exports = { register, login };
