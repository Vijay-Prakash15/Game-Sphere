import React from "react";

const TicTacToe = ({ gameState, myId, onMakeMove }) => {
  const { board, turnIndex, players } = gameState;
  const myIndex = players.findIndex((p) => p.userId === myId);
  const isMyTurn = myIndex === turnIndex;
  const mySymbol = myIndex === 0 ? "X" : "O";

  const handleCellClick = (index) => {
    if (!isMyTurn || board[index]) return;
    onMakeMove({ position: index });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Tic Tac Toe</h2>
      <div className="mb-4 text-lg">
        {isMyTurn ? <span className="text-green-600 font-bold">Your Turn ({mySymbol})</span> : <span className="text-gray-500">Opponent's Turn...</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg shadow-md">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={!isMyTurn || cell !== null}
            className={`w-24 h-24 bg-white text-5xl font-bold flex items-center justify-center rounded-md shadow-sm transition
              ${!isMyTurn || cell ? "cursor-not-allowed" : "hover:bg-blue-50"}
              ${cell === "X" ? "text-blue-500" : "text-red-500"}
            `}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
