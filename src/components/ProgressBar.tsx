// src/components/ProgressBar.tsx
import React from 'react';

type Props = {
  submittedAnswers: number;
  totalQuestions: number;
};

const ProgressBar: React.FC<Props> = ({ submittedAnswers, totalQuestions }) => {
  const progressPercentage = (submittedAnswers / totalQuestions) * 100;

  return (
    <div>
      <div style={{ width: '100%', backgroundColor: '#e0e0df', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: '#76c7c0',
            height: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            color: 'white'
          }}
        >
        </div>
      </div>
      <div style={{marginTop:'5px'}}>
        {submittedAnswers} / {totalQuestions} Answered
        </div>
    </div>
  );
};

export default ProgressBar;
