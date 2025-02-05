import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';

const generateSequence = (level) => {
  let sequence = [];
  let patternType = Math.random() > 0.5 ? 'arithmetic' : 'geometric';
  let start = Math.floor(Math.random() * 10) + 1;
  let commonDifference = Math.floor(Math.random() * 5) + 1;
  let commonRatio = Math.floor(Math.random() * 3) + 2;
  let length = level === 'easy' ? 6 : level === 'medium' ? 8 : 10;
  let missingCount = level === 'easy' ? 1 : level === 'medium' ? 2 : 3;

  if (patternType === 'arithmetic') {
    for (let i = 0; i < length; i++) {
      let num = start + i * commonDifference;
      if (level === 'easy') {
        num = Math.min(num, 99);
      }
      sequence.push(num);
    }
  } else {
    for (let i = 0; i < length; i++) {
      let num = start * Math.pow(commonRatio, i);
      if (level === 'easy') {
        num = Math.min(num, 99);
      }
      sequence.push(num);
    }
  }

  let missingIndices = [];
  while (missingIndices.length < missingCount) {
    let index = Math.floor(Math.random() * length);
    if (!missingIndices.includes(index)) {
      missingIndices.push(index);
    }
  }

  let puzzle = sequence.map((num, index) =>
    missingIndices.includes(index) ? null : num
  );

  return { sequence, puzzle, missingIndices };
};

function NumberTrailblazers() {
  const [level, setLevel] = useState('easy');
  const [gameData, setGameData] = useState(() => generateSequence('easy'));
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const confettiContainer = document.getElementById('confetti-container');

  useEffect(() => {
    setGameData(generateSequence(level));
    setSelectedInputIndex(null);
    setFeedback('');
  }, [level]);

  useEffect(() => {
    if (
      gameData.puzzle.every((num) => num !== null) &&
      gameData.puzzle.length > 0
    ) {
      checkSolution();
    }
  }, [gameData.puzzle]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  const handleInputChange = (number) => {
    if (selectedInputIndex === null) return;

    const newPuzzle = [...gameData.puzzle];
    newPuzzle[selectedInputIndex] = number;
    setGameData({ ...gameData, puzzle: newPuzzle });
    setSelectedInputIndex(null);
  };

  const checkSolution = () => {
    let correct = true;
    gameData.missingIndices.forEach((missingIndex, i) => {
      if (gameData.puzzle[missingIndex] !== gameData.sequence[missingIndex]) {
        correct = false;
      }
    });

    if (correct) {
      setFeedback('Correct! You cracked the code.');
      if (animationsEnabled) {
        setShowConfetti(true);
        ReactDOM.createRoot(confettiContainer).render(
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        );
        setTimeout(() => {
          setShowConfetti(false);
          ReactDOM.createRoot(confettiContainer).render(<></>);
          setGameData(generateSequence(level));
        }, 3000);
      } else {
        setGameData(generateSequence(level));
      }
    } else {
      setFeedback('Incorrect. Try again!');
      if (animationsEnabled) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
    }
  };

  const getAvailableNumbers = (index) => {
    const sequence = gameData.sequence;
    const missingIndex = gameData.missingIndices.find((i) => gameData.puzzle[i] === null);

    if (missingIndex === undefined) {
      return [];
    }

    const correctAnswer = sequence[missingIndex];
    let options = [correctAnswer];

    while (options.length < 3) {
      let randomOption = correctAnswer + Math.floor(Math.random() * 5) - 2;
      if (randomOption !== correctAnswer && !options.includes(randomOption)) {
        options.push(randomOption);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    setShake(false);
    setShowConfetti(false);
  };

  return (
    <div className={`game-container ${shake && animationsEnabled ? 'shake' : ''}`}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="top-controls">
        <Link to="/" className="home-icon">
          <img
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png"
            alt="Home"
            style={{ width: '32px', height: '32px' }}
          />
        </Link>
        <div className="animation-toggle-container">
          <button className="animation-toggle-button" onClick={toggleAnimations}>
            {animationsEnabled ? '✨' : '🚫'}
          </button>
        </div>
        <h2>Number Trailblazers</h2>
        <div className="level-select-container">
          <button
            className={`level-button easy ${level === 'easy' ? 'active' : ''}`}
            onClick={() => handleLevelChange('easy')}
          >
            E
          </button>
          <button
            className={`level-button medium ${
              level === 'medium' ? 'active' : ''
            }`}
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

      <div className="puzzle">
        {gameData.puzzle.map((num, index) => (
          <span key={index}>
            {num !== null ? (
              num + ' '
            ) : (
              <button
                className="missing-number-button"
                onClick={() => setSelectedInputIndex(index)}
              >
                ?
              </button>
            )}
          </span>
        ))}
      </div>

      {selectedInputIndex !== null && (
        <div className="options-container">
          {getAvailableNumbers(selectedInputIndex).map((number) => (
            <button
              key={number}
              className="option"
              onClick={() => handleInputChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
      )}
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default NumberTrailblazers;
