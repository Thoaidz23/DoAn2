const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  code_order: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total_price: Number,
  status: Number,
  paystatus: Number,
  method: Number,
  date: Date,
  shipping_info: {
    name_user: String,
    address: String,
    phone: String
  },
  items: [{
    product_id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }]
});

module.exports = mongoose.model('Order', orderSchema);
