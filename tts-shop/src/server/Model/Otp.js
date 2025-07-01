const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['signup', 'forgot_password'],
    required: true
  },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expired_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },

  // Dữ liệu user tạm thời
  user_data: {
    name: String,
    phone: String,
    address: String,
    password: String // nên hash trước khi lưu vào đây
  }
});

module.exports = mongoose.model('Otp', otpSchema);
