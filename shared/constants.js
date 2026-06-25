const GAME_CONFIG = {
  roomCodeLength: 6,
  roomExpireMinutes: 60,
  
  tictactoe: {
    moveTimeLimitSeconds: 5,
    boardSize: 3,
    pointsPerWin: 1
  },
  
  rps: {
    choiceTimeLimitSeconds: 5,
    revealDelaySeconds: 1,
    pointsPerWin: 1
  },
  
  guessNumber: {
    guessTimeLimitSeconds: 5,
    maxGuessesPerRound: 3,
    numberMin: 1,
    numberMax: 100,
    pointsPerWin: 1
  },
  
  quiz: {
    questionTimeLimitSeconds: 45,
    maxQuestionsPerSession: 15,
    minQuestionsForScore: 10
  },
  
  snake: {
    pointsPerFood: 10,
    initialLength: 3,
    boardWidth: 400,
    boardHeight: 400
  },
  
  matchFormat: {
    pointsToWin: 2,
    totalRounds: 3
  }
};

module.exports = { GAME_CONFIG };
