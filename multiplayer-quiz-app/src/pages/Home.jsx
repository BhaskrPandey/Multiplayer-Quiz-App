import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 6);
    socket.emit("createGame", { roomId: newRoomId });
    socket.on("gameCreated", ({ roomId }) => navigate(`/quiz/${roomId}`));
  };

  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("joinGame", { roomId });
      socket.on("gameStarted", () => navigate(`/quiz/${roomId}`));
      socket.on("error", (msg) => alert(msg));
    }
  };

  return (
    <div>
      <h1>Multiplayer Quiz</h1>
      <button onClick={createRoom}>Create Game</button>
      <input type="text" placeholder="Enter Game Code" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={joinRoom}>Join Game</button>
    </div>
  );
}

export default Home;
