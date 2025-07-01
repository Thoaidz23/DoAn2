const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  group_product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupProduct' },
  ram: String,
  rom: String,
  colors: [String],
  images: [String]
});

module.exports = mongoose.model('Product', productSchema);
