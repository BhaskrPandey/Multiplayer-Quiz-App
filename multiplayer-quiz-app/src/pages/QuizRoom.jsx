import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const QuizRoom = () => {
    const { roomId } = useParams();
    const [game, setGame] = useState(null);
    const [player, setPlayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10); // 10-second timer
    const [playerTurn, setPlayerTurn] = useState(null);

    useEffect(() => {
        console.log("Joining room:", roomId);
        socket.emit("joinGame", { roomId });

        socket.on("gameStarted", (gameData) => {
            console.log("Game started:", gameData);
            setGame(gameData);
            setPlayer(gameData.players.length === 1 ? "player1" : "player2");
            setPlayerTurn("player1"); // Set initial turn
            setTimeLeft(10);
        });

        socket.on("updateGame", (updatedGame) => {
            console.log("Game updated:", updatedGame);
            setGame(updatedGame);
            setPlayerTurn(updatedGame.turn);
            setTimeLeft(10);
        });

        socket.on("gameOver", (scores) => {
            console.log("Game Over:", scores);
            alert(`Game Over! Final Scores: ${JSON.stringify(scores)}`);
        });

        return () => {
            socket.off("gameStarted");
            socket.off("updateGame");
            socket.off("gameOver");
        };
    }, [roomId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleAnswer = (answer) => {
        if (playerTurn !== player) {
            alert("Wait for your turn!");
            return;
        }
        socket.emit("answer", { roomId, answer });
    };

    if (!game) return <h2>Loading game...</h2>;

    return (
        <div>
            <h2>Quiz Room: {roomId}</h2>
            <h3>Turn: {playerTurn}</h3>
            <h4>Time Left: {timeLeft}s</h4>

            {game.questions && game.currentQuestion < game.questions.length ? (
                <div>
                    <h3>{game.questions[game.currentQuestion].question}</h3>
                    {game.questions[game.currentQuestion].options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}>
                            {option}
                        </button>
                    ))}
                </div>
            ) : (
                <h2>Game Over</h2>
            )}

            <h3>Scores:</h3>
            <p>Player 1: {game.scores.player1}</p>
            <p>Player 2: {game.scores.player2}</p>
        </div>
    );
};

export default QuizRoom;
