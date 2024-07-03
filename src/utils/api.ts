// // src/utils/api.ts
import { Question, QuestionState } from '../types';

export const fetchQuizQuestions = async (amount: number): Promise<QuestionState[]> => {
  const endpoint = `https://opentdb.com/api.php?amount=${amount}`;
  const data = await fetch(endpoint).then(response => response.json());
  
  if (data.response_code !== 0) {
    throw new Error("Failed to fetch quiz questions");
  }

  return data.results.map((question:Question) => ({
    ...question,
    answers: [question.correct_answer, ...question.incorrect_answers],
  }));
};
