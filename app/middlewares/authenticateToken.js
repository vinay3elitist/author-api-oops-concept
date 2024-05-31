const jwt = require("jsonwebtoken");

const authenticateAuthor = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.author = decoded.author;
    next();
  });
};

module.exports = authenticateAuthor;
