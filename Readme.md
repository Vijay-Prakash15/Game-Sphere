Multiplayer Game Platform
STATUS: Pre-Development Planning • UPDATED: April 2026 • AUTHOR: Vijay Prakash Gupta

Architecture Overview
Game Rules & Mechanics
Database Schema
Real-time Communication Flow
API Endpoints
Implementation Roadmap
Time Limits & Constants

01. Game Mechanics
🎯 OVERALL POINTS SYSTEM (ALL GAMES)
1 point = 1 round win
Best-of-3 format: First player to 2 points closes the match
Match closes immediately when someone reaches 2 points (no need to play all 3 if one player is 2-0)
Final display: "Player A Wins 2-0" or "Player A Wins 2-1"

🎮 GAME 1: TIC TAC TOE
Players: 2
 Format: Best-of-3 rounds
 Time Limit: 5 seconds per move
Game Flow:
Round 1 starts
├─ Player A (X) vs Player B (O)
├─ Players alternate turns
├─ If Player A gets 3 in a row → Player A wins Round 1 (1 point)
├─ If Player B gets 3 in a row → Player B wins Round 1 (1 point)
├─ If board fills with no winner → Draw (no points to either)
└─ Round 1 ends

Player scores: A=1, B=0 (or A=0, B=1 or A=0, B=0)

If either player has 2 points → Match Over
Else → Round 2 starts (roles swap)

Move Validation:
Must be a valid empty cell
Must be made within 5 seconds (backend enforces timeout)
Invalid moves are rejected, time restarts
Timer pauses when waiting for opponent
Win Conditions per Round:
3 in a row (horizontal, vertical, diagonal) = 1 point
Draw (9 filled cells, no winner) = 0 points to both
Timeout (player doesn't move in 5 sec) = Opponent wins that round

🎮 GAME 2: ROCK PAPER SCISSORS
Players: 2
 Format: Best-of-3 rounds
 Time Limit: 5 seconds to choose
Game Flow:
Round 1 starts
├─ Both players choose R/P/S simultaneously (in a 5-sec window)
├─ Frontend shows "Waiting for opponent..." while both choose
├─ After 5 seconds (or both have chosen early), moves reveal
├─ Compare: R beats S, S beats P, P beats R
├─ If same choice → Draw
├─ Winner gets 1 point
└─ Round 1 ends

If either player has 2 points → Match Over
Else → Round 2 starts

Move Validation:
Server records both choices when received (or timeout = forfeit = opponent wins)
No partial reveals (client shows "Opponent chosen" until timer expires)
Timeout = opponent automatically wins that round
Win Conditions per Round:
R beats S, S beats P, P beats R = 1 point
Same choice = 0 points to both
Timeout = opponent wins that round

🎮 GAME 3: GUESS THE NUMBER
Players: 2 (roles alternate per round)
 Format: Best-of-3 rounds
 Max Guesses: 3 per round
 Time Limit: 5 seconds per guess (optional hint system)
Game Flow - Round 1 (Player A picks, Player B guesses):
Round 1 starts
├─ Player A enters a secret number (1-100) in private screen
├─ Player B sees: "Player A picked a number. Guess it!"
├─ Player B enters a guess (gets 3 attempts)
│  ├─ If guess is correct → Player B wins (1 point)
│  ├─ If guess is wrong → Show hint ("Too high" / "Too low")
│  │                       Player B can try again
│  └─ After 3 guesses, if none correct → Player A wins (1 point)
├─ If Player B doesn't guess in time (5 sec) → Guess counts as made
└─ Round 1 ends

Player scores: A=1, B=0 (or A=0, B=1)

Round 2 starts (ROLES SWAP)
├─ Player B enters secret number
├─ Player A guesses (3 attempts)
└─ Same logic applies

Round 3 starts (Player A picks again)
├─ Same as Round 1 logic

Move Validation:
Picker validation: Number must be 1-100 (integer)
Guesser validation: Guess must be 1-100, within 5 seconds
Hints: Strictly "Too high" or "Too low" (no actual numbers revealed)
Timeout: If guesser doesn't submit within 5 sec, that guess is wasted
Win Conditions per Round:
Correct guess within 3 attempts = Guesser wins (1 point)
3 guesses used, none correct = Picker wins (1 point)
Hint Examples:
Picker: 42
Guesser: 50
Hint: "Too high"

Guesser: 30
Hint: "Too low"

Guesser: 42
Hint: "Correct!" (or "You win!")


🎮 GAME 4: QUIZ (Single Player)
Player Count: 1
 Format: Continuous questions from a pool
 Time Limit: 45 seconds per question
 Difficulty Levels: Easy, Medium, Hard
Game Flow:
Quiz starts
├─ Display category selection (DSA / Aptitude / Web Dev)
├─ Display difficulty selection (Easy / Medium / Hard)
├─ Load ~10-15 questions from pool (shuffled)
├─ For each question:
│  ├─ Display question + 4 options (A, B, C, D)
│  ├─ Player selects answer within 45 seconds
│  ├─ If timeout → Mark as incorrect
│  └─ Move to next question
├─ After all questions:
│  ├─ Calculate: (Correct / Total) × 100 = Score %
│  ├─ Store result in database
│  └─ Show: "You scored 75% (9/12 correct)"
└─ Quiz ends

Scoring:
├─ 80-100% = "Excellent"
├─ 60-79% = "Good"
├─ 40-59% = "Average"
└─ 0-39% = "Poor"

Question Pool Structure:
Categories:
├─ DSA (Data Structures & Algorithms)
│  ├─ Easy: 25-30 questions
│  ├─ Medium: 25-30 questions
│  └─ Hard: 20-25 questions
├─ Aptitude (Logical Reasoning)
│  ├─ Easy: 25-30 questions
│  ├─ Medium: 25-30 questions
│  └─ Hard: 20-25 questions
└─ Web Dev
   ├─ Easy: 25-30 questions
   ├─ Medium: 25-30 questions
   └─ Hard: 20-25 questions

Total: ~100 questions minimum (can be more)

Validation:
Enforce 45-second timer server-side
Record answer selection
No reattempts (once submitted, move to next)
Store quiz result with timestamp

🎮 GAME 5: SNAKE (Single Player)
Player Count: 1
 Format: Endless (until death)
 Controls: Arrow keys or WASD
Game Flow:
Snake game starts
├─ Snake begins at center (length = 3)
├─ Food apple spawns randomly
├─ Player controls snake direction (up/down/left/right)
├─ Snake moves continuously
│  ├─ If snake eats food:
│  │  ├─ Snake grows +1 segment
│  │  ├─ Score += 10 points
│  │  └─ New food spawns
│  └─ If snake hits wall or itself:
│     └─ Game Over
├─ Display current score
├─ On game over:
│  ├─ Store final score in user profile
│  └─ Show: "Game Over! Score: 120"
└─ Game ends

Difficulty (Progressive):
Current approach: Simple constant speed
Future enhancement: Increase speed every 5 foods eaten

Scoring:
Food eaten = +10 points
Final score = Total points earned

02. Data Architecture
Collection: users
{
  _id: UUID,
  email: "player@example.com",
  username: "player_123",
  passwordHash: "bcrypt_hash",
  createdAt: ISODate,
  
  // Stats
  totalMatches: 45,
  totalWins: 28,
  totalLosses: 17,
  
  // Game-specific stats
  stats: {
    tictactoe: { wins: 10, losses: 5, totalRounds: 30 },
    rockpapersissors: { wins: 8, losses: 7, totalRounds: 30 },
    guessNumber: { wins: 10, losses: 5, totalRounds: 30 },
    quiz: { totalAttempts: 12, avgScore: 78.5 },
    snake: { bestScore: 240 }
  },
  
  avatar: "avatar_url",
  lastLogin: ISODate
}

Collection: gameRooms
{
  _id: UUID,
  code: "A7K9M2",
  creatorId: UUID_reference_to_users,
  gameType: "tic-tac-toe" | "rock-paper-scissors" | "guess-number",
  
  players: [
    { userId: UUID, joinedAt: ISODate, ready: true }
  ],
  
  status: "waiting" | "in_progress" | "completed",
  currentRound: 1 | 2 | 3,
  
  // Match progress
  p1Score: 0,
  p2Score: 0,
  
  createdAt: ISODate,
  expiresAt: ISODate,  // TTL: delete if expired
  completedAt: ISODate (optional)
}

Collection: matches (One record = one completed 3-round game)
{
  _id: UUID,
  roomId: UUID_reference_to_gameRooms,
  gameType: "tic-tac-toe" | "rock-paper-scissors" | "guess-number",
  
  player1Id: UUID,
  player2Id: UUID,
  
  rounds: [
    {
      roundNumber: 1,
      player1Move: "X" | "R" | number,
      player2Move: "O" | "P" | number,
      winner: "player1" | "player2" | "draw",
      duration: 45 // seconds
    },
    {
      roundNumber: 2,
      player1Move: "X",
      player2Move: "O",
      winner: "player1",
      duration: 38
    },
    {
      roundNumber: 3,
      player1Move: "O",
      player2Move: "X",
      winner: "player1",
      duration: 42
    }
  ],
  
  finalWinner: "player1" | "player2" | "draw",
  player1Score: 2,
  player2Score: 1,
  
  totalDuration: 125, // seconds
  completedAt: ISODate,
  createdAt: ISODate
}

Collection: quizzes
{
  _id: UUID,
  category: "DSA" | "Aptitude" | "WebDev",
  difficulty: "easy" | "medium" | "hard",
  
  question: "What is time complexity of binary search?",
  options: [
    "O(1)",
    "O(log n)",  // correct
    "O(n)",
    "O(n log n)"
  ],
  correctAnswer: 1,  // index of correct option
  
  explanation: "Binary search halves the search space each time...",
  
  createdAt: ISODate,
  updatedAt: ISODate
}

Collection: quizAttempts
{
  _id: UUID,
  userId: UUID,
  category: "DSA",
  difficulty: "medium",
  
  questions: [
    {
      quizId: UUID,
      selectedAnswer: 1,
      isCorrect: true,
      timeTaken: 23  // seconds
    },
    {
      quizId: UUID,
      selectedAnswer: 2,
      isCorrect: false,
      timeTaken: 45
    }
  ],
  
  totalCorrect: 9,
  totalQuestions: 12,
  score: 75, // percentage
  
  startedAt: ISODate,
  completedAt: ISODate
}

Collection: snakeScores
{
  _id: UUID,
  userId: UUID,
  score: 240,
  foodEaten: 24,
  duration: 185, // seconds
  playedAt: ISODate
}


03. Real-Time Infrastructure
Connection Events
CLIENT → SERVER
On Room Creation:
Event: "create-room"
Data: { gameType: "tic-tac-toe" }
Response: { roomCode: "A7K9M2", roomId: "uuid", expiresAt: timestamp }

On Room Join:
Event: "join-room"
Data: { code: "A7K9M2", userId: "uuid" }
Response: 
  Success: { roomId: "uuid", players: [...], gameType: "..." }
  Error: { error: "Invalid code" | "Room expired" | "Room full" }

Game Move (Tic Tac Toe):
Event: "make-move"
Data: { 
  roomId: "uuid", 
  round: 1, 
  position: 4,  // 0-8 on 3x3 grid
  player: "A"
}
Response: { success: true, board: [...], opponent_received: true }

Game Move (RPS):
Event: "submit-choice"
Data: { 
  roomId: "uuid", 
  round: 1, 
  choice: "R" | "P" | "S"
}
Response: { success: true, waiting_for_opponent: true }

Game Move (Guess Number):
Event: "submit-guess"
Data: { 
  roomId: "uuid", 
  round: 1, 
  guess: 42
}
Response: { success: true, hint: "Too low" | "Too high" | "Correct" }

SERVER → CLIENT (Broadcast Events)
Opponent Joined:
Event: "opponent-joined"
Data: { opponent: { userId: "uuid", username: "player_123" } }

Game Started:
Event: "game-started"
Data: { round: 1, gameType: "tic-tac-toe", youAre: "X" }

Opponent Moved:
Event: "opponent-move"
Data: { 
  round: 1, 
  position: 4, 
  board: [...]  // Tic tac toe board
}

Round Results:
Event: "round-result"
Data: {
  round: 1,
  winner: "player1" | "player2" | "draw",
  player1Score: 1,
  player2Score: 0,
  nextRoundStartsIn: 3  // seconds
}

Match Results:
Event: "match-result"
Data: {
  finalWinner: "player1" | "player2",
  p1Score: 2,
  p2Score: 1,
  matchId: "uuid",
  reward: "You won! +10 points to profile"
}

Opponent Disconnected:
Event: "opponent-left"
Data: { message: "Opponent disconnected. You win by default." }


04. API Specifications
Authentication
POST /api/auth/register
  Body: { email, password, username }
  Response: { userId, token, message: "Registration successful" }

POST /api/auth/login
  Body: { email, password }
  Response: { userId, token, user: { username, stats } }

POST /api/auth/logout
  Response: { message: "Logged out" }

User Profile
GET /api/user/profile/:userId
  Response: { 
    userId, email, username, 
    stats: { totalWins, totalMatches, ... },
    recentMatches: [...]
  }

PUT /api/user/profile
  Body: { username, avatar }
  Response: { message: "Profile updated" }

Game Rooms (REST - for setup; WebSocket for gameplay)
POST /api/rooms/create
  Body: { gameType: "tic-tac-toe" }
  Response: { roomCode: "A7K9M2", roomId: "uuid", expiresAt }

GET /api/rooms/:code
  Response: { roomId, gameType, players, status, expiresAt }

POST /api/rooms/:code/join
  Body: { userId }
  Response: { message: "Joined", roomId, opponent: {...} }

Match History
GET /api/matches/user/:userId
  Response: [
    {
      matchId: "uuid",
      opponent: { username, userId },
      gameType: "tic-tac-toe",
      result: "win" | "loss",
      score: "2-1",
      playedAt: ISODate
    }
  ]

GET /api/matches/:matchId
  Response: { 
    matchId, players, gameType, rounds: [...],
    finalWinner, completedAt
  }

Quiz
GET /api/quiz/questions/:category/:difficulty
  Response: [
    {
      quizId, category, difficulty, question, options: [...]
      // Note: DO NOT include correctAnswer
    }
  ]

POST /api/quiz/submit
  Body: { 
    category, difficulty, 
    answers: [ { quizId, selectedAnswer, timeTaken }, ... ]
  }
  Response: { 
    score: 75, 
    totalCorrect: 9,
    totalQuestions: 12,
    breakdown: [...]
  }

Leaderboard
GET /api/leaderboard/:gameType
  Response: [
    { rank: 1, username, wins, winRate, matchesPlayed },
    ...
  ]


05. Delivery Roadmap
Phase 1: Foundation (Weeks 1-2)
[ ] Frontend setup (React + Socket.io client)
[ ] Backend setup (Express + Socket.io server)
[ ] Database setup (MongoDB/PostgreSQL)
[ ] User authentication (JWT)
[ ] Room creation & join (REST API)
[ ] WebSocket connection initialization
[ ] No game logic yet — just infrastructure
Deliverable: Users can create rooms, get codes, and other users can join via code

Phase 2: Tic Tac Toe (Weeks 2-3)
[ ] Game board UI (3x3 grid)
[ ] Turn-based move handling
[ ] WebSocket move sync
[ ] 5-second timer per move
[ ] Win detection (3 in a row)
[ ] Draw detection (board full)
[ ] 3-round loop logic
[ ] Final winner calculation
[ ] Match saved to DB
Deliverable: Two players can play 3 rounds of Tic Tac Toe and see final result

Phase 3: Rock Paper Scissors (Weeks 3-4)
[ ] RPS UI (3 buttons: Rock, Paper, Scissors)
[ ] Simultaneous move handling
[ ] "Waiting for opponent..." state
[ ] Reveal logic (both submitted = reveal)
[ ] Win calculation (R > S, P > R, S > P)
[ ] Draw handling
[ ] 3-round loop logic
[ ] Match saved to DB
Deliverable: Two players can play 3 rounds of RPS

Phase 4: Guess the Number (Weeks 4-5)
[ ] Number input screen (for picker)
[ ] Guess input screen (for guesser)
[ ] 3-guess limit per round
[ ] Hint logic ("too high", "too low")
[ ] Role swap logic (A picks round 1, B picks round 2, etc.)
[ ] Win detection
[ ] 3-round loop
[ ] Match saved to DB
Deliverable: Full guess game working with role swaps

Phase 5: Single-Player Games (Weeks 5-6)
Quiz:
[ ] Category selection UI
[ ] Difficulty selection UI
[ ] Question loader + shuffling
[ ] 45-second timer per question
[ ] Answer selection (A/B/C/D)
[ ] Score calculation (% correct)
[ ] Results display
[ ] Quiz attempt saved to DB
Snake:
[ ] Canvas setup (2D context)
[ ] Snake initialization
[ ] Keyboard controls
[ ] Snake movement logic
[ ] Food spawning
[ ] Collision detection (walls, self)
[ ] Score tracking (+10 per food)
[ ] Game over state
[ ] Score saved to DB
Deliverable: Both single-player games fully playable

Phase 6: Points System & Polish (Weeks 6-7)
[ ] Add points calculation to all games
[ ] Round-by-round points display
[ ] Best-of-3 (close on 2 wins) logic
[ ] Final leaderboard screen
[ ] User stats updating
[ ] UI animations
[ ] Loading states
[ ] Error handling
Deliverable: Fully playable MVP with points system

PART 6: TIME LIMITS & CONSTANTS
// Game Configuration
const GAME_CONFIG = {
  // Room
  roomCodeLength: 6,
  roomExpireMinutes: 1,
  
  // Tic Tac Toe
  tictactoe: {
    moveTimeLimitSeconds: 5,
    boardSize: 3,
    pointsPerWin: 1
  },
  
  // Rock Paper Scissors
  rps: {
    choiceTimeLimitSeconds: 5,
    revealDelaySeconds: 1,
    pointsPerWin: 1
  },
  
  // Guess the Number
  guessNumber: {
    guessTimeLimitSeconds: 5,
    maxGuessesPerRound: 3,
    numberMin: 1,
    numberMax: 100,
    pointsPerWin: 1
  },
  
  // Quiz
  quiz: {
    questionTimeLimitSeconds: 45,
    maxQuestionsPerSession: 15,
    minQuestionsForScore: 10
  },
  
  // Snake
  snake: {
    pointsPerFood: 10,
    initialLength: 3,
    boardWidth: 400,
    boardHeight: 400
  },
  
  // Best-of-3
  matchFormat: {
    pointsToWin: 2,  // First to 2 wins
    totalRounds: 3   // Max 3 rounds (if needed)
  }
};


PART 7: SECURITY CONSIDERATIONS
Move Validation: Always validate moves server-side. Never trust client.
Time Limits: Enforce server-side timers, not just client-side
Room Codes: Use a salt when generating codes
WebSocket Auth: Verify JWT token in every WebSocket connection
Quiz Answers: Never send correct answers in API response until quiz is submitted
Disconnect Handling: If player disconnects, other player wins by default after 30 sec timeout

PART 8: TESTING CHECKLIST
[ ] Two players can join same room via code
[ ] Timer enforces 5-second limits in Tic Tac Toe
[ ] RPS reveals only after both have chosen or timeout
[ ] Guess game allows role swap correctly
[ ] Quiz enforces 45-second per question
[ ] Points system correctly calculates winners
[ ] Best-of-3 closes immediately on 2 wins
[ ] All games save results to DB correctly
[ ] WebSocket reconnection works
[ ] Opponent disconnect shows message

PART 9: FUTURE ENHANCEMENTS
[ ] Multiplayer leaderboard
[ ] Friend system
[ ] Achievements/Badges
[ ] Ranked mode
[ ] AI opponent for practice
[ ] In-game chat
[ ] Tournament mode
[ ] Mobile app

END OF SPECIFICATION

