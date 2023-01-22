const mongoose = require("mongoose");

const Book = mongoose.model('Book', {
  id: Number,
  title: String,
  author: String,
  publishedAt: Number,
  price: Number,
  rental: Number,
});

module.exports = Book;