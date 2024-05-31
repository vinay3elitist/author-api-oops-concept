const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../../models/authorModel");

/**
 * @class AuthorService
 * @desc Service class for handling operations related to authors registration, login and their books.
 */
class AuthorService {
  /**
   *
   * @param {Object} data Contains author's registration data
   * @returns {Object} Returns registered author object
   * @desc Register the author if author does not already exist
   */
  async register(data) {
    const { name, email, password, age } = data;
    if (!name || !email || !password || !age) {
      res.status(400);
      throw new Error("All fileds are mandatory");
    }

    const authorExist = await Author.findOne({ email });
    if (authorExist) {
      res.status(400);
      throw new Error("Author already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const author = await Author.create({
      name,
      email,
      password: hashedPassword,
      age,
    });
    return author;
  }

  /**
   *
   * @param {Object} data Contains author's login data
   * @returns {Object} Returns token for authentication
   * @desc Login the author if author credentials are valid
   */
  async login(data) {
    const { email, password } = data;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fileds are mandatory");
    }

    const author = await Author.findOne({ email });
    if (author && (await bcrypt.compare(password, author.password))) {
      const token = jwt.sign(
        {
          author: {
            name: author.name,
            email: author.email,
            age: author.age,
            id: author.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      return token;
    } else {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
  }

  /**
   *
   * @param {Object} req Contains request data to find author
   * @returns {Object} Returns the author with populated books array
   * @desc Shows the Profile of the author with author's books
   */
  async profile(req) {
    const { email } = req.body;
    const author = await Author.findOne({ email }).populate({
      path: "books",
      select: ["bookname", "pages"],
    });

    if (author.id === req.author.id) {
      return author;
    } else {
      res.status(400);
      throw new Error("Author not found or Cannot access other Author's Profile");
    }
  }
}

module.exports = new AuthorService();
