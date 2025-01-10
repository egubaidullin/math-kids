import React, { useState, useEffect, useRef } from 'react';
    import Confetti from 'react-confetti';
    import ReactDOM from 'react-dom';

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

      const num1 = Math.floor(Math.random() * maxNumber) + 1;
      const num2 = Math.floor(Math.random() * maxNumber) + 1;
      const availableOperations = [];

      if (operations.includes('addsub')) {
        availableOperations.push('+', '-');
      }
      if (operations.includes('muldiv')) {
        availableOperations.push('*', '/');
      }

      const operation = availableOperations[Math.floor(Math.random() * availableOperations.length)];
      let answer;

      if (operation === '+') {
        answer = num1 + num2;
      } else if (operation === '-') {
        answer = Math.max(num1, num2) - Math.min(num1, num2);
      } else if (operation === '*') {
        answer = num1 * num2;
      } else {
          answer = Math.floor(Math.max(num1, num2) / Math.min(num1, num2))
      }

      if (answer < 0) {
        return generateQuestion(level, operations);
      }

      const options = [answer];
      while (options.length < 3) {
        const randomOption = Math.floor(Math.random() * (maxNumber * 2)) + 1;
        if (!options.includes(randomOption)) {
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

    function App() {
      const [level, setLevel] = useState('easy');
      const [operations, setOperations] = useState(['addsub']);
      const [question, setQuestion] = useState(generateQuestion('easy', ['addsub']));
      const [selectedOption, setSelectedOption] = useState(null);
      const [score, setScore] = useState(0);
      const [timeLeft, setTimeLeft] = useState(30);
      const [showConfetti, setShowConfetti] = useState(false);
      const [shake, setShake] = useState(false);
      const [showLevelOptions, setShowLevelOptions] = useState(false);
      const timerRef = useRef(null);
      const confettiContainer = document.getElementById('confetti-container');

      useEffect(() => {
        setTimeLeft(30);
        setQuestion(generateQuestion(level, operations));
        setSelectedOption(null);
      }, [level, operations]);

      useEffect(() => {
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              setQuestion(generateQuestion(level, operations));
              setSelectedOption(null);
              return 30;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(timerRef.current);
      }, [level, question, operations]);

      const handleOptionSelect = (option) => {
        setSelectedOption(option);
        clearInterval(timerRef.current);

        if (option === question.answer) {
          setScore((prevScore) => prevScore + 10);
          setShowConfetti(true);
          ReactDOM.createRoot(confettiContainer).render(
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          );
          setTimeout(() => {
            setShowConfetti(false);
            ReactDOM.createRoot(confettiContainer).render(<></>);
          }, 3000);
        } else {
          setScore((prevScore) => Math.max(0, prevScore - 5));
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }

        setTimeout(() => {
          setQuestion(generateQuestion(level, operations));
          setSelectedOption(null);
          setTimeLeft(30);
        }, 1000);
      };

      const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        setShowLevelOptions(true);
      };

      const handleOperationChange = (operation) => {
        let newOperations = [...operations];
        if (newOperations.includes(operation)) {
          newOperations = newOperations.filter((op) => op !== operation);
        } else {
          newOperations = [...newOperations, operation];
        }

        if (newOperations.length === 0) {
          newOperations = ['addsub'];
        }
        setOperations(newOperations);
      };

      const progressBarStyle = {
        width: `${(timeLeft / 30) * 100}%`,
      };

      return (
        <div className={`game-container ${shake ? 'shake' : ''}`}>
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
            {showLevelOptions && (
              <div className="level-options-container">
                <div
                  className="level-option"
                  onClick={() => handleOperationChange('addsub')}
                  style={{ backgroundColor: operations.includes('addsub') ? '#e0e0e0' : 'transparent' }}
                >
                  + -
                </div>
                <div
                  className="level-option"
                  onClick={() => handleOperationChange('muldiv')}
                  style={{ backgroundColor: operations.includes('muldiv') ? '#e0e0e0' : 'transparent' }}
                >
                  * /
                </div>
              </div>
            )}
          </div>
          <div className="question">
            {question.num1} {question.operation} {question.num2} = ?
          </div>
          <div className="options-container">
            {question.options.map((option, index) => (
              <div
                key={index}
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

    export default App;
