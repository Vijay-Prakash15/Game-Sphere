import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

const Snake = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // moving up
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    setSnake(initSnake);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setFood(generateFood(initSnake));
    setGameOver(false);
    setGameStarted(true);
  };

  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameOver) return;
    
    switch (e.key) {
      case "ArrowUp":
      case "w":
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
      case "s":
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
      case "a":
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
      case "d":
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, [direction, gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prev;
        }

        // Self collision
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          handleGameOver();
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 120); // Speed
    return () => clearInterval(intervalId);
  }, [direction, food, gameStarted, gameOver, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    if (score > highScore) {
        setHighScore(score);
    }
    API.post("/user/snake/score", {
      score,
      foodEaten: Math.floor(score / 10),
      duration: 0
    }).catch(err => console.error("Error saving snake score:", err));
  };

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.fillStyle = "#1e293b"; // slate-800
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!gameStarted && !gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Press Start to Play", CANVAS_SIZE/2, CANVAS_SIZE/2);
        return;
    }

    const cellSize = CANVAS_SIZE / GRID_SIZE;

    // Draw Food
    ctx.fillStyle = "#ef4444"; // red-500
    ctx.beginPath();
    ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#22c55e" : "#4ade80"; // head is darker green
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

  }, [snake, food, gameStarted, gameOver]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
         🐛 Snake
      </h1>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center">
         <div className="w-full flex justify-between px-4 mb-4 font-bold text-slate-600">
             <div>Score: <span className="text-blue-600">{score}</span></div>
             <div>High Score: <span className="text-purple-600">{highScore}</span></div>
         </div>

         <div className="relative rounded-xl overflow-hidden shadow-inner border-4 border-slate-800 bg-slate-800" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
             <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />
             
             {gameOver && (
                 <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white">
                     <h2 className="text-4xl font-black mb-2 text-red-500">Game Over</h2>
                     <p className="text-lg mb-6">You scored {score} points!</p>
                     <button onClick={resetGame} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg hover:-translate-y-1 transition">
                         Play Again
                     </button>
                 </div>
             )}
         </div>
         
         {!gameStarted && !gameOver && (
            <div className="mt-8 flex gap-4 w-full">
                <button onClick={() => navigate("/home")} className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition">
                    Back to Home
                </button>
                <button onClick={resetGame} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition">
                    Start Game
                </button>
            </div>
         )}
         
         {gameStarted && (
             <div className="mt-6 text-sm text-slate-400 font-semibold text-center">
                 Use <kbd className="bg-slate-100 px-2 py-1 rounded mx-1">W</kbd><kbd className="bg-slate-100 px-2 py-1 rounded mx-1">A</kbd><kbd className="bg-slate-100 px-2 py-1 rounded mx-1">S</kbd><kbd className="bg-slate-100 px-2 py-1 rounded mx-1">D</kbd> or Arrow Keys to move
             </div>
         )}
      </div>
    </div>
  );
};

export default Snake;
