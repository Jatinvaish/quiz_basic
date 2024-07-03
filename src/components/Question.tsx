// src/components/Question.tsx
import React from 'react';

type Props = {
  question: string;
};

const Question: React.FC<Props> = ({ question }) => (
  <div dangerouslySetInnerHTML={{ __html: question }} />
);

export default Question;
