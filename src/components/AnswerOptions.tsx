// src/components/AnswerOptions.tsx
import React from 'react';

type Props = {
  answers: string[];
  selectedAnswer: string | undefined;
  callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AnswerOptions: React.FC<Props> = ({ answers, selectedAnswer, callback }) => (
  <div>
    {answers?.map((answer, index) => (
      <div className="options-area ">
        <div key={index} className='option'>
          <label>
            <input
              type="radio"
              name="answer"
              value={answer}
              checked={selectedAnswer === answer}
              onChange={callback}
            />
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </label>
        </div>
      </div>
    ))}
  </div>
);

export default AnswerOptions;
