import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

const generateQuestion = (level, operations) => {
  let maxNumber;
  switch (level) {
    case 'easy':
      maxNumber = 10;
      break;
    case 'medium':
      maxNumber = 100;
      break;
    case 'hard':
      maxNumber = 1000;
      break;
    default:
      maxNumber = 10;
  }

  const availableOperations = [];
  if (operations.includes('addsub')) availableOperations.push('+', '-');
  if (operations.includes('muldiv')) availableOperations.push('*', '/');
  
  if (availableOperations.length === 0) {
    return generateQuestion(level, ['addsub']);
  }

  const operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
  let num1, num2, answer;

  if (operation === '+') {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
    answer = num1 + num2;
  } else if (operation === '-') {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * num1) + 1;
    answer = num1 - num2;
  } else if (operation === '*') {
    num1 = Math.floor(Math.random() * maxNumber) + 1;
    num2 = Math.floor(Math.random() * maxNumber) + 1;
    answer = num1 * num2;
  } else {
    num2 = Math.floor(Math.random() * (maxNumber/2)) + 1;
    num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    answer = num1 / num2;
  }

  const options = [answer];
  const maxDistractor = level === 'easy' ? 20 : 
                      level === 'medium' ? 200 : 2000;
  
  while (options.length < 3) {
    let randomOption = Math.floor(Math.random() * maxDistractor) + 1;
    if (randomOption !== answer && !options.includes(randomOption)) {
      options.push(randomOption);
    }
  }

  return {
    num1,
    num2,
    operation,
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

function MathGame() {
  const [level, setLevel] = useState('easy');
  const [operations, setOperations] = useState(['addsub']);
  const [question, setQuestion] = useState(() => generateQuestion('easy', ['addsub']));
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const timerRef = useRef(null);
  const confettiContainer = document.getElementById('confetti-container');

  useEffect(() => {
    setTimeLeft(30);
    setQuestion(generateQuestion(level, operations));
    setSelectedOption(null);
  }, [level, operations]);

  useEffect(() => {
    const tick = () => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setQuestion(generateQuestion(level, operations));
          setSelectedOption(null);
          return 30;
        }
        return prev - 1;
      });
    };

    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [level, operations]);

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    clearInterval(timerRef.current);

    if (option === question.answer) {
      setScore(prev => prev + 10);
      if (animationsEnabled) {
        setShowConfetti(true);
        ReactDOM.createRoot(confettiContainer).render(
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        );
        setTimeout(() => {
          setShowConfetti(false);
          ReactDOM.createRoot(confettiContainer).render(<></>);
        }, 3000);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
      if (animationsEnabled) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    }

    setTimeout(() => {
      setQuestion(generateQuestion(level, operations));
      setSelectedOption(null);
      setTimeLeft(30);
    }, 1000);
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  const handleOperationChange = (operation) => {
    let newOperations = [...operations];
    if (newOperations.includes(operation)) {
      newOperations = newOperations.filter(op => op !== operation);
    } else {
      newOperations = [...newOperations, operation];
    }

    if (newOperations.length === 0) {
      newOperations = ['addsub'];
    }
    setOperations(newOperations);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    setShake(false);
    setShowConfetti(false);
  };

  const progressBarStyle = {
    width: `${(timeLeft / 30) * 100}%`,
  };

  return (
    <div className={`game-container ${shake && animationsEnabled ? 'shake' : ''}`}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="top-controls">
        <Link to="/" className="home-icon">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png" alt="Home" style={{ width: '32px', height: '32px' }} />
        </Link>
        <div className="animation-toggle-container">
          <button className="animation-toggle-button" onClick={toggleAnimations}>
            {animationsEnabled ? '✨' : '🚫'}
          </button>
        </div>
        <h2>Math Game</h2>
        <div className="level-select-container">
          <button
            className={`level-button easy ${level === 'easy' ? 'active' : ''}`}
            onClick={() => handleLevelChange('easy')}
          >
            E
          </button>
          <button
            className={`level-button medium ${level === 'medium' ? 'active' : ''}`}
            onClick={() => handleLevelChange('medium')}
          >
            M
          </button>
          <button
            className={`level-button hard ${level === 'hard' ? 'active' : ''}`}
            onClick={() => handleLevelChange('hard')}
          >
            H
          </button>
        </div>
      </div>

      <div className="operation-select-container">
        <div
          className={`operation-button ${operations.includes('addsub') ? 'active' : ''}`}
          onClick={() => handleOperationChange('addsub')}
        >
          + -
        </div>
        <div
          className={`operation-button ${operations.includes('muldiv') ? 'active' : ''}`}
          onClick={() => handleOperationChange('muldiv')}
        >
          * /
        </div>
      </div>

      <div className="question">
        {question.num1} {question.operation} {question.num2} = ?
      </div>

      <div className="options-container">
        {question.options.map((option, index) => (
          <div
            key={`${question.num1}-${question.operation}-${question.num2}-${option}-${index}`}
            className={`option ${
              selectedOption === option
                ? option === question.answer
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="score">Score: {score}</div>
      
      <div className="progress-bar-container">
        <div className="progress-bar" style={progressBarStyle}></div>
      </div>
    </div>
  );
}

export default MathGame;
