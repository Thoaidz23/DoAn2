const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  items: [{
    product_id: mongoose.Schema.Types.ObjectId,
    group_product_id: mongoose.Schema.Types.ObjectId,
    price: Number,
    quantity: Number
  }]
});

module.exports = mongoose.model('Cart', cartSchema);
