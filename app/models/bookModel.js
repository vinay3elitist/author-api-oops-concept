const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookname: { type: String, required: true },
  pages: { type: Number, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
