import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Multiplayer Quiz</h1>
      <button onClick={() => navigate("/quiz")}>Start Quiz</button>
    </div>
  );
}

export default Home;
