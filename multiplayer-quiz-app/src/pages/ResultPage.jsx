import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores } = location.state || { scores: { player1: 0, player2: 0 } };

  return (
    <div>
      <h2>Game Over!</h2>
      <p>Player 1 Score: {scores.player1}</p>
      <p>Player 2 Score: {scores.player2}</p>
      {scores.player1 > scores.player2 && <h3>🎉 Player 1 Wins!</h3>}
      {scores.player1 < scores.player2 && <h3>🎉 Player 2 Wins!</h3>}
      {scores.player1 === scores.player2 && <h3>🤝 It's a Tie!</h3>}
      <button onClick={() => navigate("/")}>Play Again</button>
    </div>
  );
}

export default ResultPage;
