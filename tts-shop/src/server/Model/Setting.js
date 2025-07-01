const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  banners: [{
    name: String,
    image: String
  }],
  footer: {
    title: String,
    content: String
  }
});

module.exports = mongoose.model('Setting', settingSchema);
