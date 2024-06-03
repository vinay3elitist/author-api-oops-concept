const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../../models/authorModel");

/**
 * @class AuthorService
 * @desc Service class for handling operations related to authors registration, login and their profile.
 */
class AuthorService {
  constructor() {
    this.bcrypt = bcrypt;
    this.Author = Author;
  }

  // check if author exists
  async ifAuthorExists(data) {
    const { email } = data;
    return await Author.findOne({ email });
  }

  /**
   * Registers a new author.
   *
   * @param {Object} data - Contains author's registration data.
   * @param {string} data.name - The author's name.
   * @param {string} data.email - The author's email.
   * @param {string} data.password - The author's password.
   * @param {number} data.age - The author's age.
   *
   * @returns {Promise<Object>} - A promise that resolves to the registered author object.
   * @desc Register the author
   * @throws Will throw an error if the registration fails.
   */
  register(data) {
    return new Promise((resolve, reject) => {
      try {
        const { name, email, password, age } = data;
        const hashedPassword = this.bcrypt.hashSync(password, 10);
        const author = this.Author.create({
          name,
          email,
          password: hashedPassword,
          age,
        });
        resolve(author);
      } catch (error) {
        reject(error);
      }
    });
  }

  // validate password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Login a author
   *
   * @param {Object} author - Contains author's login data.
   * @param {string} author.name - The author's name.
   * @param {string} author.email - The author's email.
   * @param {string} author.password - The author's password.
   * @param {number} author.age - The author's age.
   *
   * @returns {Promise} - A promise that resolves with the token for authentication or rejects with an error.
   *
   * @throws {Error} - Throws an error if token not generated.
   * @desc Generates a token and Logins the author
   */
  login(author) {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(
          { _id: author._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10m",
          }
        );
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves and populates the author's book information.
   *
   * @param {Object} author - The author object for which to retrieve and populate the book information.
   * @returns {Promise} - A promise that resolves to the populated author object or rejects with an error.
   *
   * @throws {Error} - Throws an error if the author is not found or if there is an issue populating the book information.
   *
   * @desc This function retrieves the author's book information by populating the 'books' field of the author object.
   * The function returns a promise that resolves to the populated author object or rejects with an error.
   */
  profile(author) {
    return new Promise(async (resolve, reject) => {
      try {
        await author.populate({
          path: "books",
          select: ["bookname", "pages"],
        });
        await author.save();
        resolve(author);
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * @class AuthorService
 * @desc Service class for handling operations related to authors registration, login and their books.
 */
// class AuthorService extends AuthControllerFunctions {
//   constructor() {
//     super();
//   }
//   /**
//    *
//    * @param {Object} data Contains author's registration data
//    * @returns {Object} Returns registered author object
//    * @desc Register the author if author does not already exist
//    */
//   async register(data) {
//     super.validateRegistrationData(data);
//     super.ifAuthorExists(data);

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const author = await Author.create({
//       name,
//       email,
//       password: hashedPassword,
//       age,
//     });
//     return author;
//   }

//   /**
//    *
//    * @param {Object} data Contains author's login data
//    * @returns {Object} Returns token for authentication
//    * @desc Login the author if author credentials are valid
//    */
//   async login(data) {
//     const { email, password } = data;
//     this.validateLoginData(data);
//     const author = this.findAuthorByEmail(email);

//     if (!author && !(await bcrypt.compare(password, author.password))) {
//       res.status(401);
//       throw new Error("Invalid Credentials");
//     }

//     const token = this.generateToken(author, password);
//     return token;
//   }

//   /**
//    *
//    * @param {Object} req Contains request data to find author
//    * @returns {Object} Returns the author with populated books array
//    * @desc Shows the Profile of the author with author's books
//    */
//   async profile(data) {
//     try {
//       const { email } = data;
//       // Find author by email
//       const author = await this.findAuthorByEmail(email);

//       // Check if author exists
//       if (!author) {
//         throw new Error("Author not found");
//       }

//       // Populate the books array
//       await author.populate({
//         path: "books",
//         select: ["bookname", "pages"],
//       });
//       await author.save();

//       // Return the populated author object
//       return author;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

module.exports = new AuthorService();
