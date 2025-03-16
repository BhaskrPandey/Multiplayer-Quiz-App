const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let games = {}; // Store game states

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create a new game
  socket.on("createGame", ({ roomId }) => {
    games[roomId] = {
        players: [socket.id],
        questions: [
            { question: "What is 2 + 2?", options: ["3", "4", "5"], correct_answer: "4" },
            { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris"], correct_answer: "Paris" }
        ],
        currentQuestion: 0,
        scores: { player1: 0, player2: 0 },
        turn: "player1"
    };
    socket.join(roomId);
    io.to(socket.id).emit("gameCreated", { roomId });
});


  // Join an existing game
  socket.on("joinGame", ({ roomId }) => {
    if (games[roomId] && games[roomId].players.length < 2) {
      games[roomId].players.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit("gameStarted", games[roomId]);
    } else {
      io.to(socket.id).emit("error", "Room is full or doesn't exist");
    }
  });

  // Handle answer selection
  socket.on("answer", ({ roomId, answer }) => {
    if (games[roomId]) {
      let game = games[roomId];

      if (answer === game.questions[game.currentQuestion].correct_answer) {
        game.scores[game.turn]++;
      }

      game.turn = game.turn === "player1" ? "player2" : "player1";

      if (game.turn === "player1") {
        game.currentQuestion++;
      }

      if (game.currentQuestion < game.questions.length) {
        io.to(roomId).emit("updateGame", game);
      } else {
        io.to(roomId).emit("gameOver", game.scores);
        delete games[roomId]; // Cleanup game after finish
      }
    }
  });

  socket.on("submitAnswer", ({ roomId, answer, player }) => {
    const game = games[roomId];
    if (!game) return;

    const correctAnswer = game.questions[game.currentQuestion].correct_answer;

    if (answer === correctAnswer) {
        game.scores[player] += 1;
    }

    game.currentQuestion++;

    if (game.currentQuestion < game.questions.length) {
        io.to(roomId).emit("updateGame", game);
    } else {
        io.to(roomId).emit("gameOver", game.scores);
        delete games[roomId]; // Clean up game after finishing
    }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
