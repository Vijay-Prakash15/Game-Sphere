const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");

exports.getQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.params;
    
    // In a real app, questions would be seeded into the DB. 
    // If no questions exist in DB for testing, return dummy questions:
    let questions = await Question.find({ category, difficulty });
    
    if (questions.length === 0) {
        // Dummy questions generator
        questions = Array.from({ length: 5 }, (_, i) => ({
            _id: `dummy_${i}`,
            category,
            difficulty,
            question: `Sample ${difficulty} ${category} Question ${i + 1}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 1, // Only used on backend typically
        }));
    }

    // Remove correct answers from response
    const safeQuestions = questions.map(q => {
        const copy = q.toObject ? q.toObject() : q;
        delete copy.correctAnswer;
        return copy;
    });

    res.json({ success: true, questions: safeQuestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { category, difficulty, answers } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Answers are required" });
    }

    // Batch query DB questions
    const dbQuizIds = answers
      .map(ans => ans.quizId)
      .filter(id => id && !id.toString().startsWith("dummy"));

    const dbQuestions = await Question.find({ _id: { $in: dbQuizIds } });
    const questionMap = new Map(dbQuestions.map(q => [q._id.toString(), q]));

    let correctCount = 0;
    
    const processedAnswers = answers.map(ans => {
      let isCorrect = false;
      const quizIdStr = ans.quizId.toString();
      
      if (quizIdStr.startsWith("dummy")) {
        isCorrect = (ans.selectedAnswer === 1);
      } else {
        const dbQ = questionMap.get(quizIdStr);
        if (dbQ && dbQ.correctAnswer === ans.selectedAnswer) {
          isCorrect = true;
        }
      }
      
      if (isCorrect) correctCount++;
      return { ...ans, isCorrect };
    });

    const score = Math.round((correctCount / answers.length) * 100);

    const attempt = new QuizAttempt({
        userId,
        category,
        difficulty,
        questions: processedAnswers,
        totalCorrect: correctCount,
        totalQuestions: answers.length,
        score,
        completedAt: new Date()
    });
    
    await attempt.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
        const attempts = user.stats.quiz.totalAttempts || 0;
        const currentAvg = user.stats.quiz.avgScore || 0;
        user.stats.quiz.avgScore = ((currentAvg * attempts) + score) / (attempts + 1);
        user.stats.quiz.totalAttempts = attempts + 1;
        await user.save();
    }

    res.json({ success: true, score, totalCorrect: correctCount, totalQuestions: answers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
