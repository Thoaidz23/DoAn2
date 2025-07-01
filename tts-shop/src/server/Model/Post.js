const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  content: String,
  date: Date,
  category: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String
  }
});

module.exports = mongoose.model('Post', postSchema);
