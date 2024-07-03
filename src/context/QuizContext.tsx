import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { QuestionState } from '../types';
import { fetchQuizQuestions } from '../utils/api';


// make a Context provider for make a app better
type State = {
  loading: boolean; //for load time
  questions: QuestionState[]; // question array
  number: number; // current question's number
  userAnswers: (string | undefined)[]; // user's answer
  score: number; // score on final submission
  gameOver: boolean;// at final submission
  selectedAnswer: string | undefined;// sending selected answer
  submittedAnswers: number;// send real submited answer
  hasSubmitted: boolean[];// set answer submition's conformation
  feedback: string[];// sending feedback if correctr than correct else real answer
};

type Action =
  | { type: 'START_GAME'; payload: QuestionState[] }
  | { type: 'LOAD_STATE'; payload: State }
  | { type: 'RESET_GAME' }
  | { type: 'SELECT_ANSWER'; payload: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'FINAL_SUBMIT' };

const initialState: State = {
  loading: false,
  questions: [],
  number: 0,
  userAnswers: [],
  score: 0,
  gameOver: true,
  selectedAnswer: undefined,
  submittedAnswers: 0,
  hasSubmitted: [],
  feedback: [],
};

const QuizContext = createContext<{ state: State; dispatch: React.Dispatch<Action>; resetGame: () => void } | undefined>(undefined);

const quizReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        loading: false,
        questions: action.payload,
        score: 0,
        userAnswers: Array(action.payload.length).fill(undefined),
        number: 0,
        selectedAnswer: undefined,
        submittedAnswers: 0,
        hasSubmitted: Array(action.payload.length).fill(false),
        feedback: Array(action.payload.length).fill(''),
        gameOver: false,
      };
    case 'LOAD_STATE':
      return { ...action.payload, loading: false };
    case 'RESET_GAME':
      return initialState;
    case 'SELECT_ANSWER':
      return { ...state, selectedAnswer: action.payload };
    case 'SUBMIT_ANSWER':
      if (state.selectedAnswer && !state.hasSubmitted[state.number]) {
        const isCorrect = state.questions[state.number].correct_answer === state.selectedAnswer;
        const newFeedback = isCorrect ? 'Correct!' : `Incorrect! The correct answer is: ${state.questions[state.number].correct_answer}`;

        const newAnswers = [...state.userAnswers];
        newAnswers[state.number] = state.selectedAnswer;

        const newSubmitted = [...state.hasSubmitted];
        newSubmitted[state.number] = true;

        const newFeedbackArr = [...state.feedback];
        newFeedbackArr[state.number] = newFeedback;

        return {
          ...state,
          userAnswers: newAnswers,
          hasSubmitted: newSubmitted,
          feedback: newFeedbackArr,
          score: isCorrect ? state.score + 1 : state.score,
          submittedAnswers: state.submittedAnswers + 1,
        };
      }
      return state;
    case 'NEXT_QUESTION':
      return { ...state, number: Math.min(state.number + 1, state.questions.length - 1), selectedAnswer: state.userAnswers[state.number + 1] };
    case 'PREV_QUESTION':
      return { ...state, number: Math.max(state.number - 1, 0), selectedAnswer: state.userAnswers[state.number - 1] };
    case 'FINAL_SUBMIT':
      return { ...state, gameOver: true };
    default:
      return state;
  }
};

type QuizProviderProps = {
  children: ReactNode;
};

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    } else {
      const fetchQuestions = async () => {
        try {
          const newQuestions = await fetchQuizQuestions(10);
          dispatch({ type: 'START_GAME', payload: newQuestions });
        } catch (error) {
          alert('Failed to load questions. Please try again later.');
        }
      };

      fetchQuestions();
    }
  }, []);

  useEffect(() => {
     localStorage.setItem('quizState', JSON.stringify(state));
  }, [state]);

  const resetGame = async () => {
    localStorage.removeItem('quizState');
    dispatch({ type: 'RESET_GAME' });
    try {
      const newQuestions = await fetchQuizQuestions(10);
      dispatch({ type: 'START_GAME', payload: newQuestions });
    } catch (error) {
      alert('Failed to load questions. Please try again later.');
    }
  };

  return (
    <QuizContext.Provider value={{ state, dispatch, resetGame }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
