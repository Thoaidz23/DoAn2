const mysql = require('mysql2');

// Tạo kết nối đến MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Tài khoản mặc định của MySQL trên XAMPP
  password: '', // Nếu không có mật khẩu thì để trống
  database: 'ttsshop' // Thay bằng tên cơ sở dữ liệu của bạn
});

// Kiểm tra kết nối
connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL: ' + err.stack);
    return;
  }
  console.log('Đã kết nối MySQL với id ' + connection.threadId);
});

module.exports = connection;
