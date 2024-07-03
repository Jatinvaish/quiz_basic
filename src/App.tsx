// src/components/App.tsx
import React, { useCallback } from 'react';
import Question from './components/Question';
import AnswerOptions from './components/AnswerOptions';
import ProgressBar from './components/ProgressBar';
import Result from './components/Results';
import { useQuiz } from './context/QuizContext';
import '../src/App.css';

//define total question static as per instruction
const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const { state, dispatch, resetGame } = useQuiz();
  const { loading, questions, number, userAnswers, score, gameOver, selectedAnswer, hasSubmitted, feedback, submittedAnswers } = state;

  const handleAnswerSelection = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SELECT_ANSWER', payload: e.currentTarget.value });
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    dispatch({ type: 'SUBMIT_ANSWER' });
  }, [dispatch]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, [dispatch]);

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
  }, [dispatch]);

  const handleFinalSubmit = useCallback(() => {
    dispatch({ type: 'FINAL_SUBMIT' });
  }, [dispatch]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Submitted':
        return { color: 'green', fontWeight: 'bold' };
      case 'Not Answered':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return {};
    }
  };
  const status = hasSubmitted[number]
    ? 'Submitted'
    : 'Not Answered';

  return (
    <div className="quiz-app">
      <h2>Agreem Tech Task</h2>
      {
        loading ? (
          <p>Loading Questions...</p>
        ) : gameOver ? (
          <>
            <Result correct={score} total={TOTAL_QUESTIONS} />
            <button style={{ backgroundColor: '#f0364b' }} className="submit-button" onClick={resetGame}>Reset Questions</button>
          </>
        ) : (
          <>
            <div className="quiz-info">
              <div className="category">Category: <span ><b> {questions[number].category}</b></span></div>
              <div className="count">Questions Count: <span>{questions?.length}</span></div>
            </div>
            <div className="quiz-area">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
                <p>Question {number + 1}</p>
                <p style={getStatusStyle(status)}>{status}</p>
              </div>
              <Question question={questions[number].question} />

            </div>

            <AnswerOptions
              answers={questions[number].answers}
              selectedAnswer={selectedAnswer}
              callback={handleAnswerSelection}
            />
            {feedback[number] && <div className='feedback-div'>
              {feedback[number]}
            </div>}
            <div className='button-div'>
              <button style={{ backgroundColor: '#5b6152' }} className="submit-button" disabled={number === 0} onClick={prevQuestion}>Previous Question</button>
              <button style={{ backgroundColor: '#0b0b45' }} className="submit-button" disabled={!selectedAnswer || hasSubmitted[number]} onClick={handleSubmit}>Submit Answer</button>
              <button style={{ backgroundColor: '#860047' }} className="submit-button" disabled={number === TOTAL_QUESTIONS - 1} onClick={nextQuestion}>Next Question</button>
              {submittedAnswers === TOTAL_QUESTIONS && (
                <button
                  style={{ backgroundColor: '#5b60ff' }} className="submit-button"
                  disabled={submittedAnswers !== TOTAL_QUESTIONS}
                  onClick={handleFinalSubmit}
                >
                  Final Submit
                </button>
              )}
            </div>
            <ProgressBar submittedAnswers={submittedAnswers} totalQuestions={TOTAL_QUESTIONS} />
          </>
        )
      }
    </div>
  );
};

export default App;