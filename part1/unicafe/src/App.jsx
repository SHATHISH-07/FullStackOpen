import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, total }) => {
  if (total === 0) {
    return <p>No feedback given</p>;
  }

  const average = (good - bad) / total;
  const positivePercentage = (good / total) * 100;

  return (
    <table>
      <tbody>
        <StatisticLine text={"good"} value={good} />
        <StatisticLine text={"neutral"} value={neutral} />
        <StatisticLine text={"bad"} value={bad} />
        <StatisticLine text={"all"} value={total} />
        <StatisticLine text={"average"} value={average.toFixed(1)} />
        <StatisticLine
          text={"positive"}
          value={`${positivePercentage.toFixed(1)} %`}
        />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const goodCount = () => {
    // console.log("good", good);

    const updatedGood = good + 1;

    setGood(updatedGood);
    setTotal(updatedGood + neutral + bad);
  };

  const neutralCount = () => {
    // console.log("neutral", neutral);

    const updatedNeutral = neutral + 1;

    setNeutral(updatedNeutral);
    setTotal(updatedNeutral + good + bad);
  };

  const badCount = () => {
    // console.log("bad", bad);

    const updatedBad = bad + 1;

    setBad(updatedBad);
    setTotal(updatedBad + good + neutral);
  };

  return (
    <div>
      <h1>Give feedback</h1>

      <Button handleClick={goodCount} text={"good"} />
      <Button handleClick={neutralCount} text={"neutral"} />
      <Button handleClick={badCount} text={"bad"} />

      <h2>Statistics</h2>

      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
};

export default App;
