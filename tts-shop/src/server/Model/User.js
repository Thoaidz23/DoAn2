const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  password: String,
  role: {
    type: String, // "admin" | "user"
    default: "user"
  },
  lock_account: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
