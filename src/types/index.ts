// src/types/index.ts
export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuestionState extends Question {
  answers: string[];
}
export interface ApiResponse {
  response_code: number;
  results: QuestionState[];
}