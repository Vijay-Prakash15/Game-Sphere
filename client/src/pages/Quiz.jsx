import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [step, setStep] = useState("setup"); // setup, playing, result
  const [category, setCategory] = useState("DSA");
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const startQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/quiz/questions/${category}/${difficulty}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.questions.length > 0) {
        setQuestions(data.questions);
        setStep("playing");
        setTimeLeft(45);
      } else {
        alert("No questions found for this category/difficulty.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (step === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (step === "playing" && timeLeft === 0) {
      handleAnswer(-1); // Timeout
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const handleAnswer = (selectedOptionIdx) => {
    const q = questions[currentIdx];
    const newAnswers = [...answers, {
        quizId: q._id,
        selectedAnswer: selectedOptionIdx,
        timeTaken: 45 - timeLeft
    }];
    setAnswers(newAnswers);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(45);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category, difficulty, answers: finalAnswers })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setStep("result");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "setup") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Trivia Quiz</h1>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg">
              <option value="DSA">Data Structures & Algorithms</option>
              <option value="Aptitude">Aptitude & Reasoning</option>
              <option value="WebDev">Web Development</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 border rounded-lg">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button onClick={startQuiz} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            {loading ? "Loading..." : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "playing") {
    const q = questions[currentIdx];
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 relative">
          <div className="flex justify-between items-center mb-6">
             <span className="text-gray-500 font-bold">Question {currentIdx + 1} of {questions.length}</span>
             <span className={`font-bold text-lg ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>⏳ {timeLeft}s</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-8">{q.question}</h2>

          <div className="flex flex-col gap-3">
            {q.options.map((opt, idx) => (
              <button 
                key={idx} 
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700"
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-3xl font-extrabold mb-2 text-slate-800">Quiz Completed!</h1>
          <p className="text-gray-500 mb-8">Here are your results</p>

          <div className="bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
            <span className="text-4xl font-black text-blue-600">{result.score}%</span>
          </div>

          <div className="flex justify-around mb-8 border-t border-b py-4 border-gray-100">
             <div>
                 <div className="text-xs font-bold text-gray-400 uppercase">Correct</div>
                 <div className="text-2xl font-bold text-green-500">{result.totalCorrect}</div>
             </div>
             <div>
                 <div className="text-xs font-bold text-gray-400 uppercase">Total</div>
                 <div className="text-2xl font-bold text-gray-800">{result.totalQuestions}</div>
             </div>
          </div>

          <div className="flex gap-4">
             <button onClick={() => setStep("setup")} className="flex-1 py-3 bg-gray-100 font-bold rounded-lg hover:bg-gray-200 text-gray-700 transition">Play Again</button>
             <button onClick={() => navigate("/home")} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Home</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
