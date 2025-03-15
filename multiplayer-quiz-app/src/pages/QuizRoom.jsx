import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import Question from "../components/Question";

function QuizRoom() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [turn, setTurn] = useState("player1");

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setQuestions(data.results);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleAnswer = (selected) => {
    if (questions.length === 0) return;

    if (selected === questions[currentQuestion].correct_answer) {
      setScores((prev) => ({ ...prev, [turn]: prev[turn] + 1 }));
    }

    setTurn(turn === "player1" ? "player2" : "player1");

    if (turn === "player2") {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        navigate("/result", { state: { scores } });
      }
    }
  };

  const handleTimeout = () => {
    // Move to the next question automatically if time runs out
    setTurn(turn === "player1" ? "player2" : "player1");

    if (turn === "player2") {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        navigate("/result", { state: { scores } });
      }
    }
  };

  return (
    <div>
      <h2>Current Turn: {turn === "player1" ? "Player 1" : "Player 2"}</h2>

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <>
          <Timer key={currentQuestion} timeLimit={15} onTimeout={handleTimeout} />
          <Question data={questions[currentQuestion]} onAnswer={handleAnswer} />
        </>
      )}
    </div>
  );
}

export default QuizRoom;
