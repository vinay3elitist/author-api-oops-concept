const authorService = require("./author.services");
const ResponseService = require("../../../helper/response.service");
// const asyncHandler = require("express-async-handlr");

class AuthorController {
  /**
   * Handles author registration.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void}
   *
   * @throws Will throw an error if any required field is missing or if author already exists.
   * @desc Controller for author registration
   */
  static async register(req, res, next) {
    try {
      const { name, email, password, age } = req.body;
      // check if any required fields are missing and if missing, send a bad request response
      if (!name || !email || !password || !age) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("BAD_REQUEST"),
            message: "All fields are mandatory",
          },
          res
        );
      }

      // Check if author exists
      const authorExist = await authorService.ifAuthorExists(req.body);
      // If author exist, send a bad request response
      if (authorExist) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("BAD_REQUEST"),
            message: "Author already exist",
          },
          res
        );
      }

      // Register a new author
      authorService
        .register(req.body)
        .then((author) => {
          // If author is registered successfully, send a response with the author data
          return ResponseService.send(
            {
              status: ResponseService.getCode("OK"),
              data: {
                _id: author.id,
                name: author.name,
                email: author.email,
                age: author.age,
                books: author.books,
              },
              message: "Author registered successfully",
            },
            res
          );
        })
        .catch((error) => {
          // If any error occurs during the process, pass it to the next middleware
          next(error);
        });
    } catch (error) {
      // If any error occurs during the process, pass it to the next middleware
      next(error);
    }
  }

  /**
   * Handles author login.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void}
   *
   * @throws Will throw an error if any required field is missing or if author does not exist or if Credentials are invalid.
   * @desc Controller for author login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      // check if any required fields are missing and if missing, send a bad request response
      if (!email || !password) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("BAD_REQUEST"),
            message: "All fields are mandatory",
          },
          res
        );
      }

      // Check if author exists
      const authorExist = await authorService.ifAuthorExists(req.body);
      // If author does not exist, send a bad request response
      if (!authorExist) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("BAD_REQUEST"),
            message: "Author not found",
          },
          res
        );
      }

      // compare author's password with author's hashed password stored in database
      const comparePassword = await authorService.comparePassword(
        password,
        authorExist.password
      );
      // If password is wrong, send a invalid credentials response
      if (!comparePassword) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("INVALID_CREDS"),
            message: "Invalid Password",
          },
          res
        );
      }

      // Login a author and generate token
      authorService
        .login(authorExist)
        .then((token) => {
          // If token is generated successfully, send a response with the token
          return ResponseService.send(
            {
              status: ResponseService.getCode("OK"),
              data: token,
              message: "LoggedIn successfully",
            },
            res
          );
        })
        .catch((error) => {
          // If any error occurs during the process, pass it to the next middleware
          next(error);
        });
    } catch (error) {
      // If any error occurs during the process, pass it to the next middleware
      next(error);
    }
  }

  /**
   * Handles author profile retrieval.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void}
   *
   * @throws Will throw an error if author does not exist.
   * @desc Controller for retrieving author profile
   */
  static async profile(req, res, next) {
    try {
      // Check if author exists
      const authorExist = await authorService.ifAuthorExists(req.body);

      // If author does not exist, send a bad request response
      if (!authorExist) {
        return ResponseService.send(
          {
            status: ResponseService.getCode("BAD_REQUEST"),
            message: "Author not found",
          },
          res
        );
      }

      // Fetch author profile
      authorService
        .profile(authorExist)
        .then((author) => {
          // If author profile is fetched successfully, send a response with the profile data
          return ResponseService.send(
            {
              status: ResponseService.getCode("OK"),
              data: {
                _id: author.id,
                name: author.name,
                email: author.email,
                age: author.age,
                books: author.books,
              },
              message: "Author Profile",
            },
            res
          );
        })
        .catch((error) => {
          // If any error occurs during the process, pass it to the next middleware
          next(error);
        });
    } catch (error) {
      // If any error occurs during the process, pass it to the next middleware
      next(error);
    }
  }
}

module.exports = AuthorController;

// /**
//  * Author Registration
//  *
//  * @param {Object} req Express request object
//  * @param {Object} res Express response object
//  *
//  * @returns {Object} Returns JSON response with registered author object
//  * @desc Endpoint handler for registering a new author
//  */
// exports.register = asyncHandler(async (req, res) => {
//   const author = await authorService.register(req.body);
//   return res.status(201).json({
//     message: "Author Registered Successfully",
//     author: {
//       _id: author.id,
//       name: author.name,
//       email: author.email,
//       age: author.age,
//     },
//   });
// });

// /**
//  * Author Login
//  *
//  * @param {Object} req Express request object
//  * @param {Object} res Express response object
//  *
//  * @returns {Object} Returns JSON response of token
//  * @desc Endpoint handler for logging the author
//  */
// exports.login = asyncHandler(async (req, res) => {
//   const token = await authorService.login(req.body);
//   return res.status(200).json({ token });
// });

// /**
//  * Author Profile
//  *
//  * @param {Object} req Express request object
//  * @param {Object} res Express response object
//  *
//  * @returns {Object} Returns JSON response with author details and populated books
//  * @desc Endpoint handler for showing author's profile based on author's email
//  */
// exports.profile = asyncHandler(async (req, res) => {
//   const author = await authorService.profile(req.body);
//   return res.status(200).json({
//     message: "Author Profile",
//     author: {
//       _id: author.id,
//       name: author.name,
//       email: author.email,
//       age: author.age,
//       books: author.books,
//     },
//   });
// });
