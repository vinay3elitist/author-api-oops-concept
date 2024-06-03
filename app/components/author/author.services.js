const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../../models/authorModel");
const AuthControllerFunctions = require("./authControllerFunctions");

/**
 * @class AuthorService
 * @desc Service class for handling operations related to authors registration, login and their books.
 */
class AuthorService extends AuthControllerFunctions {
  constructor() {
    super();
  }
  /**
   *
   * @param {Object} data Contains author's registration data
   * @returns {Object} Returns registered author object
   * @desc Register the author if author does not already exist
   */
  async register(data) {
    super.validateRegistrationData(data);
    super.ifAuthorExists(data);

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
    this.validateLoginData(data);
    const author = this.findAuthorByEmail(email);

    if (!author && !(await bcrypt.compare(password, author.password))) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    const token = this.generateToken(author, password);
    return token;
  }

  /**
   *
   * @param {Object} req Contains request data to find author
   * @returns {Object} Returns the author with populated books array
   * @desc Shows the Profile of the author with author's books
   */
  async profile(req) {
    try {
      const { email } = req.body;
      // Find author by email
      const author = await this.findAuthorByEmail(email);

      // Check if author exists
      if (!author) {
        throw new Error("Author not found");
      }

      // Populate the books array
      await author.populate({
        path: "books",
        select: ["bookname", "pages"],
      });
      await author.save();

      // Return the populated author object
      return author;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthorService();
