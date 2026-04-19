const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { getMe } = require("../controllers/authController");
const { validateRegister } = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

// routes
router.post("/register", validateRegister, register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;