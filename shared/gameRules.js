const checkTicTacToeWin = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Returns "X" or "O"
    }
  }
  return null;
};

const checkRPSWin = (p1Move, p2Move) => {
  if (p1Move === p2Move) return "draw";
  if (
    (p1Move === "R" && p2Move === "S") ||
    (p1Move === "S" && p2Move === "P") ||
    (p1Move === "P" && p2Move === "R")
  ) {
    return "player1";
  }
  return "player2";
};

const getGuessHint = (guess, secretNumber) => {
  if (guess === secretNumber) return "Correct!";
  return guess > secretNumber ? "Too high" : "Too low";
};

module.exports = {
  checkTicTacToeWin,
  checkRPSWin,
  getGuessHint
};
