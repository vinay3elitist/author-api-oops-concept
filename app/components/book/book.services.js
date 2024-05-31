const Book = require("../../models/bookModel");
const Author = require("../../models/authorModel");

class BookService {
  async createBook(req, res) {
    const { bookname, pages, email } = req.body;
    if (!bookname || !pages || !email) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }

    const authorExist = await Author.findOne({ email });
    if (!authorExist) {
      res.status(400);
      throw new Error("Author not exist");
    }

    const bookAvailable = await Book.findOne({ bookname });
    if (bookAvailable) {
      res.status(400);
      throw new Error("Book already exist");
    }

    const newBook = await Book.create({
        bookname,
        pages,
        author: authorExist.id,
    });
    await newBook.save();
    authorExist.books.push(newBook.id);
    await authorExist.save();
    
    return newBook;
  }

  async getBooks() {
    const books = await Book.find().populate({
      path: "author",
      select: "name",
    });

    return books;
  }
}

module.exports = new BookService();
