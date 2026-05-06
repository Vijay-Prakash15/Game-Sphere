const express = require("express");
const router = express.Router();
const { getQuestions, submitQuiz } = require("../controllers/quizController");
const authMiddleware = require("../middleware/auth");

router.get("/questions/:category/:difficulty", authMiddleware, getQuestions);
router.post("/submit", authMiddleware, submitQuiz);

module.exports = router;
