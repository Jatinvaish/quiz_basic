// src/components/Result.tsx
import React from 'react';

type Props = {
  correct: number;
  total: number;
};

const Result: React.FC<Props> = ({ correct, total }) => (
  <div>
    <h1>Result</h1>
    <p>Total Questions: {total}</p>
    <p>Correct Answers: {correct}</p>
    <p>Incorrect Answers: {total - correct}</p>
  </div>
);

export default Result;
