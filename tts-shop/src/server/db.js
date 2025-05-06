const mysql = require('mysql2');

// Tạo pool kết nối đến MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ttsshop',
  waitForConnections: true,
  connectionLimit: 10,     // Số lượng kết nối tối đa
  queueLimit: 0
});

// Kiểm tra kết nối (tuỳ chọn)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.stack);
    return;
  }
  console.log('✅ Kết nối pool MySQL thành công với ID:', connection.threadId);
  connection.release(); // Trả kết nối lại pool
});

module.exports = pool;
