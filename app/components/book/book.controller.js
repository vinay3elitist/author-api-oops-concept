const bookService = require("./book.services");
const asyncHandler = require("express-async-handlr");

exports.createBook = asyncHandler(async (req, res) => {
  const newBook = await bookService.createBook(req, res);
  res.status(201).json({ message: "New Book Registerd", newBook });
});

exports.getBooks = asyncHandler(async (req, res) => {
  const books = await bookService.getBooks();
  res.status(200).json({ message: "All Books", books });
});
