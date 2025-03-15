import { useEffect, useState } from "react";

function Timer({ timeLimit = 15, onTimeout, key }) {
  const [time, setTime] = useState(timeLimit);

  useEffect(() => {
    setTime(timeLimit); // Reset time when component re-renders (new question)

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeout(); // Move to the next question
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer
  }, [key]); // Runs whenever `key` (question index) changes

  return <h3>⏳ Time Left: {time}s</h3>;
}

export default Timer;
