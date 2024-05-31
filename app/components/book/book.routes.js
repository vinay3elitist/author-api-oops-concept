const express = require("express");
const bookController = require("./book.controller");
const authenticateAuthor = require("../../middlewares/authenticateToken");

const router = express.Router();

router.use(authenticateAuthor);
router.post("/books", bookController.createBook);
router.get("/books", bookController.getBooks);

module.exports = router;
