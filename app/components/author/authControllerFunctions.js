const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../../models/authorModel");

/**
 * @class AuthControllerFunctions
 * @desc Super class contains methods which inherited by subclass
 */
class AuthControllerFunctions {
  constructor() {}

  validateRegistrationData(data) {
    const { name, email, password, age } = data;
    if (!name || !email || !password || !age) {
      throw new Error("All fields are mandatory");
    }
  }

  validateLoginData(data) {
    const { email, password } = data;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fileds are mandatory");
    }
  }

  async ifAuthorExists(email) {
    const authorExist = await Author.findOne({ email });
    if (authorExist) {
      res.status(400);
      throw new Error("Author already exist");
    }
  }

  async findAuthorByEmail(email) {
    const author = await Author.findOne({ email });
    return author;
  }

  async generateToken(author, password) {
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
  }
}

// Export the AuthControllerFunctions class
module.exports = AuthControllerFunctions;
