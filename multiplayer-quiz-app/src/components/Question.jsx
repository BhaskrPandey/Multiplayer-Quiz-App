function Question({ data, onAnswer }) {
  if (!data || !data.question) {
    return <p>Loading question...</p>;
  }

  const options = [...data.incorrect_answers, data.correct_answer].sort(); // Randomize options

  return (
    <div>
      <h3 dangerouslySetInnerHTML={{ __html: data.question }}></h3>
      {options.map((opt, index) => (
        <button
          key={index}
          onClick={() => onAnswer(opt)}
          dangerouslySetInnerHTML={{ __html: opt }}
        ></button>
      ))}
    </div>
  );
}

export default Question;
