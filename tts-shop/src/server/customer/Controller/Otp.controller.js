// const nodemailer = require('nodemailer');
// const connection = require('../db');

// const sendOtp = (req, res) => {
//     const { email, name, phone, address, password } = req.body;
  
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const createdAt = new Date();
//     const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  
//     const sql = `
//       REPLACE INTO tbl_otp_signup (email, otp, created_at, expired_at, name, phone, address, password)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
//     connection.execute(
//       sql,
//       [email, otp, createdAt, expiredAt, name, phone, address, password],
//       (err) => {
//         if (err) return res.status(500).json({ message: 'Lỗi lưu OTP' });
  
//         const transporter = nodemailer.createTransport({
//           service: 'gmail',
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//           },
//         });
  
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: 'Mã OTP đăng ký tài khoản',
//           text: `Mã OTP của bạn là: ${otp}`,
//         };
  
//         transporter.sendMail(mailOptions, (error) => {
//           if (error) {
//             return res.status(500).json({ message: 'Gửi OTP thất bại' });
//           } else {
//             return res.json({ message: 'OTP đã được gửi đến email!' });
//           }
//         });
//       }
//     );
//   };
  

//   const verifyOtp = (req, res) => {
//     const { email, otp } = req.body;
  
//     connection.execute(
//       'SELECT * FROM tbl_otp_signup WHERE email = ? AND otp = ? AND expired_at > NOW()',
//       [email, otp],
//       (err, results) => {
//         if (err) return res.status(500).json({ message: 'Lỗi kiểm tra OTP' });
  
//         if (results.length === 0) {
//           return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
//         }
  
//         // Nếu đúng OTP, có thể tiếp tục tạo tài khoản chính thức trong bảng `tbl_user`
//         return res.json({ message: 'OTP hợp lệ', userInfo: results[0] });
//       }
//     );
//   };
  

// module.exports = { sendOtp, verifyOtp };
