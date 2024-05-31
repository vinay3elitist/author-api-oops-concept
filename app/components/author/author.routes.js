const express = require("express");
const authController = require("./author.controller");
const authenticateAuthor = require("../../middlewares/authenticateToken");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateAuthor, authController.profile);

module.exports = router;
