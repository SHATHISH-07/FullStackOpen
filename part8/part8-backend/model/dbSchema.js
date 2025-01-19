const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  born: { type: Number },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  published: { type: Number, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  genres: [{ type: String }],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  favoriteGenre: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

const Author = mongoose.model("Author", authorSchema);
const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Author, Book, User };
