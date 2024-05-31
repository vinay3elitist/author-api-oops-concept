const authorService = require("./author.services");
const asyncHandler = require("express-async-handlr");

/**
 * Author Registration
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 *
 * @returns {Object} Returns JSON response with registered author object
 * @desc Endpoint handler for registering a new author
 */
exports.register = asyncHandler(async (req, res) => {
  const author = await authorService.register(req.body);
  return res.status(201).json({
    message: "Author Registered Successfully",
    author: {
      _id: author.id,
      name: author.name,
      email: author.email,
      age: author.age,
    },
  });
});

/**
 * Author Login
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 *
 * @returns {Object} Returns JSON response of token
 * @desc Endpoint handler for logging the author
 */
exports.login = asyncHandler(async (req, res) => {
  const token = await authorService.login(req.body);
  return res.status(200).json({ token });
});

/**
 * Author Profile
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 *
 * @returns {Object} Returns JSON response with author details and populated books
 * @desc Endpoint handler for showing author's profile based on author's email
 */
exports.profile = asyncHandler(async (req, res) => {
  const author = await authorService.profile(req);
  return res.status(200).json({
    message: "Author Profile",
    author: {
      _id: author.id,
      name: author.name,
      email: author.email,
      age: author.age,
      books: author.books,
    },
  });
});
