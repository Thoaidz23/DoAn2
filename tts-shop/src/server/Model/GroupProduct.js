const mongoose = require('mongoose');

const groupProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  content: String,
  is_del: { type: Boolean, default: false },
  category_product: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    icon: String
  },
  category_brand: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String
  },
  parameters: [{
    attribute: String,
    value: String
  }]
});

module.exports = mongoose.model('GroupProduct', groupProductSchema);
