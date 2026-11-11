<<<<<<< HEAD
# 🎮 GameSphere

**A real-time, full-stack multiplayer & single-player gaming platform**

GameSphere lets players authenticate, create or join game lobbies via room codes, compete head-to-head over WebSockets, play classic single-player arcade games, and track their stats on global leaderboards.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://game-sphere-three.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/github-repo-blue)](https://github.com/Vijay-Prakash15/Game-Sphere)
[![Status](https://img.shields.io/badge/status-pre--development%20planning-orange)]()

**🔗 Live App:** [game-sphere-three.vercel.app](https://game-sphere-three.vercel.app/)
**📦 Repository:** [Vijay-Prakash15/Game-Sphere](https://github.com/Vijay-Prakash15/Game-Sphere)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Games & Mechanics](#-games--mechanics)
  - [Points System](#overall-points-system-all-games)
  - [Tic Tac Toe](#1-tic-tac-toe)
  - [Rock Paper Scissors](#2-rock-paper-scissors)
  - [Guess the Number](#3-guess-the-number)
  - [Quiz](#4-quiz-single-player)
  - [Snake](#5-snake-single-player)
- [Database Schema](#-database-schema)
- [Real-Time Communication (WebSocket Events)](#-real-time-communication-websocket-events)
- [REST API Reference](#-rest-api-reference)
- [Configuration & Constants](#️-configuration--constants)
- [Security Considerations](#-security-considerations)
- [Testing Checklist](#-testing-checklist)
- [Delivery Roadmap](#️-delivery-roadmap)
- [Future Enhancements](#-future-enhancements)
- [Getting Started](#-getting-started)
- [Author](#-author)

---

## 🧭 Overview

GameSphere combines competitive PvP gameplay with solo arcade experiences in a single platform:

- **Real-time PvP**: Tic Tac Toe, Rock Paper Scissors, and Guess the Number, played over WebSockets with room-code based matchmaking.
- **Single-player**: A category/difficulty-based Quiz engine and a classic Snake arcade game.
- **Persistent profiles**: Every match, quiz attempt, and Snake run is recorded against a user profile, feeding global leaderboards and per-game statistics.
- **Best-of-3 format**: All PvP games share one unified scoring model — first to 2 round wins takes the match.

---

## 🏗️ Architecture

GameSphere follows a split architecture with a real-time layer sitting alongside a traditional REST API:

```mermaid
graph TD
    A[React Client] -- REST: auth, rooms, quiz, matches --> B[Express API Server]
    A -- WebSocket: gameplay events --> C[Socket.io Server]
    B --> D[(MongoDB / PostgreSQL)]
    C --> D
    B --- C
    D --> E[Users]
    D --> F[Game Rooms]
    D --> G[Matches]
    D --> H[Quizzes / Quiz Attempts]
    D --> I[Snake Scores]
```

**Design principles:**

| Principle | Implementation |
|---|---|
| Server-authoritative gameplay | All moves, timers, and win conditions are validated server-side — the client never decides outcomes. |
| Separation of concerns | REST handles account/lobby setup; WebSockets handle only live gameplay events. |
| Stateless auth | JWT tokens verified on both REST requests and WebSocket connection handshakes. |
| Ephemeral lobbies | Game rooms use a TTL (`expiresAt`) so abandoned rooms are automatically cleaned up. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Socket.io Client |
| Backend | Node.js + Express + Socket.io Server |
| Database | MongoDB (or PostgreSQL) |
| Auth | JWT (JSON Web Tokens) + bcrypt password hashing |
| Hosting | Vercel (frontend) |

---

## 🎮 Games & Mechanics

### Overall Points System (All Games)

All PvP games share a unified **Best-of-3** scoring model:

- 1 point = 1 round win
- First player to **2 points** wins and closes the match immediately (no need to play a 3rd round if it's already 2–0)
- Final results are displayed as `Player A Wins 2-0` or `Player A Wins 2-1`

---

### 1. Tic Tac Toe

| Property | Value |
|---|---|
| Players | 2 |
| Format | Best-of-3 rounds |
| Move Time Limit | 5 seconds |

**Flow:** Players alternate placing X/O on a 3×3 grid. A round ends on 3-in-a-row (win), a full board (draw), or a move timeout (opponent auto-wins the round). Roles/symbols swap between rounds; the match ends the moment either player reaches 2 points.

**Validation rules:**
- Move must target a valid, empty cell
- Move must be submitted within 5 seconds (enforced server-side)
- Invalid moves are rejected and the timer restarts
- The timer pauses while waiting on the opponent

---

### 2. Rock Paper Scissors

| Property | Value |
|---|---|
| Players | 2 |
| Format | Best-of-3 rounds |
| Choice Time Limit | 5 seconds |

**Flow:** Both players submit Rock/Paper/Scissors simultaneously within a 5-second window. The UI shows "Waiting for opponent…" until both choices are in (or the timer expires), then choices are revealed together — no partial reveals are ever sent to the client.

**Validation rules:**
- Server records both choices independently; a missed choice is a forfeit (opponent wins the round)
- Same choice from both players = draw, no points awarded
- R beats S, S beats P, P beats R

---

### 3. Guess the Number

| Property | Value |
|---|---|
| Players | 2 (roles alternate each round) |
| Format | Best-of-3 rounds |
| Max Guesses | 3 per round |
| Guess Time Limit | 5 seconds |

**Flow:** One player (the *Picker*) secretly selects a number between 1–100. The other player (the *Guesser*) gets up to 3 attempts, receiving a `"Too high"` / `"Too low"` hint after each incorrect guess. A correct guess within 3 attempts wins the round for the Guesser; exhausting all 3 without success wins the round for the Picker.

**Roles swap every round** — e.g. Player A picks in Round 1, Player B picks in Round 2, and Round 3 (if needed) reverts to Player A.

**Validation rules:**
- Picker's number must be an integer between 1–100
- Guesser's guess must be an integer between 1–100, submitted within 5 seconds
- Hints are strictly `"Too high"` / `"Too low"` — the actual number is never revealed early
- A missed timer counts as a wasted guess attempt

---

### 4. Quiz (Single Player)

| Property | Value |
|---|---|
| Players | 1 |
| Question Time Limit | 45 seconds |
| Difficulty Levels | Easy / Medium / Hard |
| Categories | DSA, Aptitude, Web Dev |

**Flow:** The player selects a category and difficulty, then answers 10–15 shuffled multiple-choice questions (4 options each) drawn from a pool of 100+ questions. Each question must be answered within 45 seconds or it's automatically marked incorrect. The final score is calculated as `(Correct / Total) × 100`.

**Scoring bands:**

| Score Range | Rating |
|---|---|
| 80–100% | Excellent |
| 60–79% | Good |
| 40–59% | Average |
| 0–39% | Poor |

**Validation rules:**
- 45-second timer enforced server-side
- No re-attempts once an answer is submitted
- Correct answers are **never** included in the question payload sent to the client — only revealed via the scoring response after submission

---

### 5. Snake (Single Player)

| Property | Value |
|---|---|
| Players | 1 |
| Format | Endless, until death |
| Controls | Arrow keys / WASD |

**Flow:** The snake starts at the center of the board with a length of 3. Eating food grows the snake by 1 segment and awards +10 points, spawning new food. The game ends when the snake collides with a wall or itself, and the final score is persisted to the player's profile.

**Planned enhancement:** progressive difficulty — speed increases every 5 food items eaten.

---

## 🗄️ Database Schema

<details>
<summary><strong>users</strong></summary>

```js
{
  _id: UUID,
  email: "player@example.com",
  username: "player_123",
  passwordHash: "bcrypt_hash",
  createdAt: ISODate,

  totalMatches: 45,
  totalWins: 28,
  totalLosses: 17,

  stats: {
    tictactoe: { wins: 10, losses: 5, totalRounds: 30 },
    rockpaperscissors: { wins: 8, losses: 7, totalRounds: 30 },
    guessNumber: { wins: 10, losses: 5, totalRounds: 30 },
    quiz: { totalAttempts: 12, avgScore: 78.5 },
    snake: { bestScore: 240 }
  },

  avatar: "avatar_url",
  lastLogin: ISODate
}
```
</details>

<details>
<summary><strong>gameRooms</strong></summary>

```js
{
  _id: UUID,
  code: "A7K9M2",
  creatorId: UUID_ref_users,
  gameType: "tic-tac-toe" | "rock-paper-scissors" | "guess-number",

  players: [{ userId: UUID, joinedAt: ISODate, ready: true }],

  status: "waiting" | "in_progress" | "completed",
  currentRound: 1 | 2 | 3,

  p1Score: 0,
  p2Score: 0,

  createdAt: ISODate,
  expiresAt: ISODate,     // TTL: room auto-deleted if expired
  completedAt: ISODate    // optional
}
```
</details>

<details>
<summary><strong>matches</strong> — one record per completed 3-round game</summary>

```js
{
  _id: UUID,
  roomId: UUID_ref_gameRooms,
  gameType: "tic-tac-toe" | "rock-paper-scissors" | "guess-number",

  player1Id: UUID,
  player2Id: UUID,

  rounds: [
    { roundNumber: 1, player1Move: "X", player2Move: "O", winner: "player1", duration: 45 },
    { roundNumber: 2, player1Move: "X", player2Move: "O", winner: "player1", duration: 38 },
    { roundNumber: 3, player1Move: "O", player2Move: "X", winner: "player1", duration: 42 }
  ],

  finalWinner: "player1" | "player2" | "draw",
  player1Score: 2,
  player2Score: 1,

  totalDuration: 125,      // seconds
  completedAt: ISODate,
  createdAt: ISODate
}
```
</details>

<details>
<summary><strong>quizzes</strong></summary>

```js
{
  _id: UUID,
  category: "DSA" | "Aptitude" | "WebDev",
  difficulty: "easy" | "medium" | "hard",

  question: "What is time complexity of binary search?",
  options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
  correctAnswer: 1,    // index of correct option

  explanation: "Binary search halves the search space each time...",

  createdAt: ISODate,
  updatedAt: ISODate
}
```
</details>

<details>
<summary><strong>quizAttempts</strong></summary>

```js
{
  _id: UUID,
  userId: UUID,
  category: "DSA",
  difficulty: "medium",

  questions: [
    { quizId: UUID, selectedAnswer: 1, isCorrect: true, timeTaken: 23 },
    { quizId: UUID, selectedAnswer: 2, isCorrect: false, timeTaken: 45 }
  ],

  totalCorrect: 9,
  totalQuestions: 12,
  score: 75,           // percentage

  startedAt: ISODate,
  completedAt: ISODate
}
```
</details>

<details>
<summary><strong>snakeScores</strong></summary>

```js
{
  _id: UUID,
  userId: UUID,
  score: 240,
  foodEaten: 24,
  duration: 185,        // seconds
  playedAt: ISODate
}
```
</details>

---

## 📡 Real-Time Communication (WebSocket Events)

### Client → Server

| Event | Payload | Response |
|---|---|---|
| `create-room` | `{ gameType }` | `{ roomCode, roomId, expiresAt }` |
| `join-room` | `{ code, userId }` | `{ roomId, players, gameType }` or `{ error }` |
| `make-move` *(Tic Tac Toe)* | `{ roomId, round, position, player }` | `{ success, board, opponent_received }` |
| `submit-choice` *(RPS)* | `{ roomId, round, choice: "R" \| "P" \| "S" }` | `{ success, waiting_for_opponent }` |
| `submit-guess` *(Guess Number)* | `{ roomId, round, guess }` | `{ success, hint: "Too low" \| "Too high" \| "Correct" }` |

### Server → Client (Broadcast)

| Event | Payload |
|---|---|
| `opponent-joined` | `{ opponent: { userId, username } }` |
| `game-started` | `{ round, gameType, youAre }` |
| `opponent-move` | `{ round, position, board }` |
| `round-result` | `{ round, winner, player1Score, player2Score, nextRoundStartsIn }` |
| `match-result` | `{ finalWinner, p1Score, p2Score, matchId, reward }` |
| `opponent-left` | `{ message: "Opponent disconnected. You win by default." }` |

---

## 🔌 REST API Reference

### Authentication

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ email, password, username }` | `{ userId, token, message }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ userId, token, user }` |
| `POST` | `/api/auth/logout` | — | `{ message }` |

### User Profile

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/user/profile/:userId` | — | `{ userId, email, username, stats, recentMatches }` |
| `PUT` | `/api/user/profile/:userId` | `{ username, avatar }` | `{ message }` |

### Game Rooms *(REST for setup, WebSocket for live play)*

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/rooms/create` | `{ gameType }` | `{ roomCode, roomId, expiresAt }` |
| `GET` | `/api/rooms/:roomId` | — | `{ roomId, gameType, players, status, expiresAt }` |
| `POST` | `/api/rooms/:roomId/join` | `{ userId }` | `{ message, roomId, opponent }` |

### Match History

| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/api/matches/user/:userId` | Array of `{ matchId, opponent, gameType, result, score, playedAt }` |
| `GET` | `/api/matches/:matchId` | `{ matchId, players, gameType, rounds, finalWinner, completedAt }` |

### Quiz

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/quiz/questions/:category/:difficulty` | — | Array of `{ quizId, category, difficulty, question, options }` *(no correct answer included)* |
| `POST` | `/api/quiz/submit` | `{ category, difficulty, answers: [{ quizId, selectedAnswer, timeTaken }] }` | `{ score, totalCorrect, totalQuestions, breakdown }` |

### Leaderboard

| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/api/leaderboard/:gameType` | Array of `{ rank, username, wins, winRate, matchesPlayed }` |

---

## ⚙️ Configuration & Constants

```js
const GAME_CONFIG = {
  room: {
    roomCodeLength: 6,
    roomExpireMinutes: 1
  },
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
    pointsToWin: 2,     // first to 2 wins
    totalRounds: 3       // max rounds if needed
  }
};
```

---

## 🔒 Security Considerations

- **Server-side move validation** — the client is never trusted for outcomes; every move, guess, and choice is verified on the backend.
- **Enforced timers** — all time limits (5s moves, 45s quiz questions) are enforced server-side, not just visually on the client.
- **Salted room codes** — room codes are generated with a salt to prevent guessing/collision.
- **WebSocket authentication** — JWT tokens are verified on every WebSocket connection, not just on initial REST login.
- **Hidden quiz answers** — correct answers are never included in the question payload; they're only used server-side during grading.
- **Disconnect handling** — if a player disconnects mid-match, the opponent wins by default after a 30-second grace period.

---

## ✅ Testing Checklist

- [ ] Two players can join the same room via code
- [ ] Timer enforces 5-second limits in Tic Tac Toe
- [ ] RPS reveals only after both players have chosen, or on timeout
- [ ] Guess the Number correctly swaps picker/guesser roles each round
- [ ] Quiz enforces the 45-second per-question limit
- [ ] Points system correctly calculates round and match winners
- [ ] Best-of-3 closes immediately once a player reaches 2 points
- [ ] All completed games persist correctly to the database
- [ ] WebSocket reconnection works as expected
- [ ] Opponent disconnect triggers the correct default-win message

---

## 🗺️ Delivery Roadmap

| Phase | Weeks | Deliverable |
|---|---|---|
| **1. Foundation** | 1–2 | Users can create rooms, get codes, and join via code (infra only, no game logic) |
| **2. Tic Tac Toe** | 2–3 | Two players can play 3 rounds of Tic Tac Toe with a final result |
| **3. Rock Paper Scissors** | 3–4 | Two players can play 3 rounds of RPS |
| **4. Guess the Number** | 4–5 | Full guess game with correct role swapping |
| **5. Single-Player Games** | 5–6 | Quiz and Snake fully playable end-to-end |
| **6. Points System & Polish** | 6–7 | Fully playable MVP with points, leaderboard, animations, and error handling |

<details>
<summary>Expand full task breakdown</summary>

**Phase 1 — Foundation**
- Frontend setup (React + Socket.io client)
- Backend setup (Express + Socket.io server)
- Database setup (MongoDB/PostgreSQL)
- User authentication (JWT)
- Room creation & join (REST API)
- WebSocket connection initialization

**Phase 2 — Tic Tac Toe**
- 3×3 grid UI, turn-based move handling, WebSocket move sync
- 5-second move timer, win/draw detection, 3-round loop, match persisted to DB

**Phase 3 — Rock Paper Scissors**
- RPS UI, simultaneous move handling, "waiting for opponent" state
- Reveal logic, win calculation, draw handling, 3-round loop, match persisted to DB

**Phase 4 — Guess the Number**
- Picker/guesser input screens, 3-guess limit, hint logic
- Role-swap logic, win detection, 3-round loop, match persisted to DB

**Phase 5 — Single-Player Games**
- *Quiz:* category/difficulty selection, question loader + shuffling, 45s timer, scoring, attempt persisted to DB
- *Snake:* canvas setup, movement logic, keyboard controls, food spawning, collision detection, score tracking, score persisted to DB

**Phase 6 — Points System & Polish**
- Points calculation across all games, round-by-round display, best-of-3 closing logic
- Final leaderboard screen, user stats updates, UI animations, loading states, error handling

</details>

---

## 🚀 Future Enhancements

- [ ] Multiplayer leaderboard
- [ ] Friend system
- [ ] Achievements / badges
- [ ] Ranked mode
- [ ] AI opponent for practice
- [ ] In-game chat
- [ ] Tournament mode
- [ ] Mobile app

---

## 🏁 Getting Started

```bash
# Clone the repository
git clone https://github.com/Vijay-Prakash15/Game-Sphere.git
cd Game-Sphere

# Install dependencies (client & server)
npm install

# Configure environment variables
# (JWT secret, database connection string, client/server ports, etc.)
cp .env.example .env

# Run the development servers
npm run dev
```

> ⚠️ **Note:** This project is currently in the **Pre-Development Planning** stage — the setup steps above assume the standard structure described in this specification and may need to be adapted as the codebase evolves.

---

## 👤 Author

**Vijay Prakash Gupta**
🔗 [GitHub Profile](https://github.com/Vijay-Prakash15)

---

<p align="center">Made with ❤️ for real-time multiplayer fun</p>
=======
# 🌌 GameSphere

GameSphere is a real-time, full-stack multiplayer and single-player gaming platform. It allows users to authenticate, create or join game lobbies via room codes, play real-time player-vs-player (PvP) games using WebSockets, play classic single-player arcade games, and track user profile stats on global leaderboards.

---

## 🏗️ Architecture Overview

GameSphere uses a split-monorepo architecture with a React-based frontend client, a Node.js/Express backend server, a MongoDB database, and a shared module to keep configuration, event names, and game verification rules perfectly in sync.

```mermaid
graph TD
    Client[React Frontend] <-->|HTTP REST / JWT| Server[Express Backend]
    Client <-->|WebSockets / Socket.io| SocketHandler[Socket.io Server]
    Server <-->|Mongoose ODM| DB[(MongoDB)]
    SocketHandler <-->|Real-time Loops| DB
    Shared[Shared Logic] -.->|Imports constants, rules, events| Client
    Shared -.->|Imports constants, rules, events| Server
```

---

## 🎮 Game Suite & Mechanics

The platform integrates a total of 5 games categorized into multiplayer PvP and single-player PvE formats.

### 👥 Multiplayer Games (PvP)
All multiplayer games utilize a **Best-of-3 rounds** format. The match ends immediately when a player reaches **2 points**. A backend timer enforces a **5-second timeout** per move/action.

1. **Tic Tac Toe**
   - **Format:** Turn-based 3x3 grid.
   - **Rules:** Players alternate placing symbols (`X` and `O`). First to align 3 in a row (horizontal, vertical, or diagonal) wins the round.
   - **Time Limit:** 5 seconds per turn. If a player fails to move, the opponent wins that round.

2. **Rock Paper Scissors**
   - **Format:** Simultaneous selection.
   - **Rules:** Both players pick Rock (`R`), Paper (`P`), or Scissors (`S`) within a 5-second window. The choices are kept hidden until both choose or time expires, after which a reveal determines the round winner.
   - **Time Limit:** 5 seconds to select. Forfeiting due to timeout counts as a round loss.

3. **Guess the Number**
   - **Format:** Alternating picker and guesser roles.
   - **Rules:** 
     - *Round 1:* Player A enters a secret number (1–100). Player B gets up to 3 attempts to guess it.
     - *Round 2:* Roles swap; Player B picks, Player A guesses.
     - *Round 3:* Player A picks again.
     - Hints ("Too high" / "Too low") are provided to the guesser.
   - **Time Limit:** 5 seconds per pick or guess.

---

### 👤 Single-Player Games (PvE)
Single-player game statistics (e.g. high scores and averages) are updated directly on the user's profile database entry.

1. **Quiz**
   - **Format:** Category and difficulty-based test.
   - **Categories:** Data Structures & Algorithms (DSA), Aptitude, and Web Development.
   - **Difficulties:** Easy, Medium, and Hard.
   - **Rules:** Shuffled set of questions with 4 options. A 45-second backend timer is enforced per question. Final score percentage and performance reviews are shown at completion.

2. **Snake**
   - **Format:** Classic 2D grid canvas arcade game.
   - **Controls:** Arrow Keys / WASD controls.
   - **Rules:** Snake grows (+1 segment) and updates score (+10 points) upon eating food. Running into walls or the snake's own tail results in game over. Includes progressive speed scaling.

---

## 🛠️ Technology Stack

### Frontend Client
* **Core:** React 19 (Vite Single Page Application)
* **Styling:** Tailwind CSS 3, PostCSS, Autoprefixer
* **Routing:** React Router DOM v7
* **State Management:** Zustand (for lightweight user/room stores)
* **Real-time Client:** Socket.io-client
* **HTTP Client:** Axios
* **Icons:** React Icons

### Backend Server
* **Environment:** Node.js, Express 5
* **Real-time Server:** Socket.io (WebSocket transport protocol)
* **Database Driver:** Mongoose (MongoDB Object Modeling)
* **Security:** JWT (JSON Web Tokens) for sessions, bcryptjs for password encryption, and custom Express Rate Limiters.

### Shared Modules
* **`constants.js`:** Shared configuration limits (e.g., game timers, grid sizes, match formats).
* **`eventNames.js`:** Shared socket event names to prevent drift between client and server triggers.
* **`gameRules.js`:** Shared win checks, choice evaluation, and hints validation helper logic.

---

## 📂 Project Directory Structure

```text
GameSphere/
├── client/              # React Frontend Client (Vite, Tailwind, Zustand)
│   ├── public/          # Static public assets
│   ├── src/             # Frontend source code
│   │   ├── assets/      # Media & styles
│   │   ├── components/  # Reusable UI components (e.g., ProtectedRoute)
│   │   ├── games/       # Multiplayer PvP UI components
│   │   │   ├── guessNumber/
│   │   │   ├── rps/
│   │   │   └── ticTacToe/
│   │   ├── pages/       # Route pages (Home, Lobby, GameRoom, Quiz, Snake, Result)
│   │   ├── services/    # REST API services (api, auth, quiz, room)
│   │   ├── socket/      # Socket.io client setup
│   │   ├── store/       # Zustand store implementations (userStore)
│   │   ├── utils/       # Shared utility helpers
│   │   ├── App.jsx      # Core React component wrapper
│   │   ├── index.css    # Tailwind CSS index
│   │   ├── main.jsx     # Frontend entry script
│   │   └── routes.jsx   # Client routing table
│   ├── package.json     # Frontend dependencies & configurations
│   └── vite.config.js   # Vite server settings
│
├── server/              # Node.js/Express Backend Server
│   ├── src/             # Backend source code
│   │   ├── config/      # DB and server configs
│   │   ├── controllers/ # REST controllers (auth, user, room, match, quiz)
│   │   ├── middleware/  # Middlewares (auth, errorHandler, rateLimiter)
│   │   ├── models/      # Mongoose schemas (User, GameRoom, Match, Question, etc.)
│   │   ├── routes/      # Express endpoints (auth, user, rooms, matches, quiz)
│   │   ├── sockets/     # Socket.io game events orchestrator (gameHandler.js)
│   │   ├── utils/       # Utility files (generateRoomCode.js)
│   │   ├── app.js       # Express app configurations & CORS configurations
│   │   └── server.js    # Entrypoint script: launches servers, DB and WebSockets
│   └── package.json     # Server dependencies & launch scripts
│
├── shared/              # Synchronized game logic shared across stacks
│   ├── constants.js     # Shared configuration variables
│   ├── eventNames.js    # Uniform Socket.io event name mappings
│   └── gameRules.js     # Shared win checkers & hint generators
│
└── Readme.md            # Project documentation (this file)
```

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

GameSphere maps data across 6 primary collections:

### 1. `User` (`users` collection)
Stores profile credentials, login logs, and cumulative statistics.
```javascript
{
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalMatches: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  stats: {
    tictactoe: { wins: Number, losses: Number, totalRounds: Number },
    rockpaperscissors: { wins: Number, losses: Number, totalRounds: Number },
    guessNumber: { wins: Number, losses: Number, totalRounds: Number },
    quiz: { totalAttempts: Number, avgScore: Number },
    snake: { bestScore: Number }
  },
  avatar: String,
  lastLogin: Date
}
```

### 2. `GameRoom` (`gamerooms` collection)
Holds real-time room metadata for multiplayer match setup.
```javascript
{
  code: { type: String, required: true, unique: true },
  gameType: { type: String, enum: ["tic-tac-toe", "rock-paper-scissors", "guess-number"] },
  players: [
    {
      userId: { type: ObjectId, ref: "User" },
      name: String,
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ["waiting", "in-progress", "completed"], default: "waiting" },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. `Match` (`matches` collection)
Persists a history of completed multiplayer matches containing round-by-round logs.
```javascript
{
  roomId: { type: ObjectId, ref: "GameRoom" },
  gameType: { type: String, enum: ["tic-tac-toe", "rock-paper-scissors", "guess-number"] },
  players: [{ type: ObjectId, ref: "User" }],
  rounds: [
    {
      roundNumber: Number,
      moves: [
        {
          userId: { type: ObjectId, ref: "User" },
          move: Schema.Types.Mixed // Grid index, R/P/S choice, or guessed number
        }
      ],
      winner: { type: ObjectId, ref: "User" }, // null for draws
      completedAt: Date
    }
  ],
  winner: { type: ObjectId, ref: "User" }, // null for draws
  scores: {
    player1Score: Number,
    player2Score: Number
  },
  completedAt: { type: Date, default: Date.now }
}
```

### 4. `Question` (`questions` collection)
Stores static single-player Quiz questions.
```javascript
{
  category: { type: String, enum: ["DSA", "Aptitude", "WebDev"] },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  question: String,
  options: [String],
  correctAnswer: Number, // Index of correct option (0-3)
  explanation: String
}
```

### 5. `QuizAttempt` (`quizattempts` collection)
Persists history and breakdowns of single-player Quiz sessions.
```javascript
{
  userId: { type: ObjectId, ref: "User" },
  category: String,
  difficulty: String,
  questions: [
    {
      quizId: { type: ObjectId, ref: "Question" },
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeTaken: Number
    }
  ],
  totalCorrect: Number,
  totalQuestions: Number,
  score: Number, // Percentage
  completedAt: { type: Date, default: Date.now }
}
```

### 6. `SnakeScore` (`snakescores` collection)
Persists Snake game records.
```javascript
{
  userId: { type: ObjectId, ref: "User" },
  score: Number,
  foodEaten: Number,
  duration: Number, // in seconds
  playedAt: { type: Date, default: Date.now }
}
```

---

## 📡 REST API Specifications

### Authentication API
* `POST /api/auth/register` - Registers a new user.
  - **Body:** `{ name, email, password }`
* `POST /api/auth/login` - Authenticates user & returns token.
  - **Body:** `{ email, password }`
  - **Response:** `{ success: true, token, user }`

### User Profiles API
* `GET /api/user/profile/:userId` - Fetches user statistics and recent matches.
* `PUT /api/user/profile` - Updates username/avatar. Requires Auth headers.

### Rooms API
* `POST /api/rooms/create` - Creates a new room. Requires Auth headers.
  - **Body:** `{ gameType }`
* `GET /api/rooms/:code` - Verifies existence of code and fetches details.
* `POST /api/rooms/:code/join` - Checks capacity and joins a room. Requires Auth.

### Matches API
* `GET /api/matches/user/:userId` - Retrieves complete match logs for a specific player.
* `GET /api/matches/:matchId` - Fetches detailed info about a specific match.

### Quiz API
* `GET /api/quiz/questions/:category/:difficulty` - Shuffles and loads 10–15 quiz questions. Correct answers are stripped to prevent cheating.
* `POST /api/quiz/submit` - Validates answers, logs attempt, calculates score, and updates user profile average.
  - **Body:** `{ category, difficulty, answers: [{ quizId, selectedAnswer, timeTaken }] }`

### Leaderboard API
* `GET /api/user/leaderboard/:gameType` - Returns top players ranked by wins or high-scores.

---

## 🔌 Real-Time WebSockets Communication

Socket.io matches state across connections. When a client connects, it must pass a JWT authorization header or handshake payload.

### Socket Connection Events
* **`create-room`:** Client requests a code. Backend sends room payload.
* **`join-room`:** Client registers with room code. Broadcasts `opponent-joined` to other room members.
* **`make-move` / `submit-choice` / `submit-guess`:** Sends active game inputs.
* **`game-state-sync`:** Emitted by the server to update the board, score, and whose turn it is.
* **`game-started`:** Emitted when two players are ready, triggering the match.
* **`round-result`:** Broadcasts round outcomes, individual point awards, and round transitions.
* **`match-result`:** Emitted when a player reaches 2 wins, indicating match completion, database saving, and redirect coordinates.
* **`opponent-disconnected`:** Emitted when a client socket drops. The other player gets declared winner by default after a 30s grace window.

---

## 🚀 Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 1. Set Up the Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Set Up the Client
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the client:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Security Considerations

1. **Server-Side Validation:** All game logic (such as checking matching grid slots or verifying if Rock beats Scissors) is executed and validated on the backend.
2. **Strict Timers:** Move timers (5-seconds) are handled server-side through timers. Client UI elements show synchronization bars but do not count as authoritative timers.
3. **Cheat Prevention:** Correct answers in the single-player Quiz API are never sent to the client browser until the quiz is submitted and validated on the backend.
4. **JWT Verification:** Custom auth checks are executed both on standard HTTP routers and on initial socket connections. Invalid tokens are rejected instantly.

---

## 🎯 Verification & Testing checklist

* [ ] **Auth Check:** Register a new user, log in, and ensure JWT is stored in local storage.
* [ ] **Room Routing:** Create a multiplayer room, verify a 6-character code is generated, and verify that a second player joining via code is successfully added to the game lobby.
* [ ] **Turn Syncing:** Run two browser sessions side-by-side. Make a move on Player A's window, check if it displays instantly on Player B's window, and check that Player A is locked from making further moves.
* [ ] **Timer Validation:** Wait 5 seconds on Tic-Tac-Toe without playing. Verify that the turn changes, a round win is awarded to the opponent, and a round score is shown.
* [ ] **Match Over:** Win two consecutive rounds in RPS. Check that the lobby closes, results write to MongoDB, and players are redirected to `/result/:roomCode`.
* [ ] **Quiz Logic:** Fetch a Quiz session, answer all questions, and confirm details log in the database.
* [ ] **Snake Game:** Start a Snake session, verify collision ends game, and verify scores sync to profile stats.
>>>>>>> 4a25bb3 (somechange file)
