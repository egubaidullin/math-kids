import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';

// Define enums/constants for figure attributes
const SHAPES = ['🔵', '🟥', '🟡', '🟢', '🔺', '🔷'];
const COLORS = ['red', 'blue', 'yellow', 'green']; // Example colors

// Function to generate a random element from an array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Function to generate a base figure
const generateFigure = () => ({
  shape: getRandomElement(SHAPES),
  color: getRandomElement(COLORS),
});

// Function to generate a sequence based on a rule
const generateSequence = (level) => {
  const sequenceLength = level === 'easy' ? 4 : level === 'medium' ? 6 : 8;
  const visibleLength = sequenceLength;
  let sequence = [];

  // For simplicity, let's focus on shape-based rules for now
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(generateFigure());
  }

  const visibleSequence = sequence.slice(0, visibleLength);

  // Determine the correct answer pair based on the sequence
  const correctAnswer = [generateFigure(), generateFigure()];

  return { sequence: visibleSequence, correctAnswer };
};

// Function to generate answer options
const generateOptions = (correctAnswer) => {
  let newOptions = [correctAnswer];
  while (newOptions.length < 4) {
    const randomOption = [generateFigure(), generateFigure()];
    if (
      !newOptions.some(
        (option) =>
          option[0].shape === randomOption[0].shape &&
          option[1].shape === randomOption[1].shape
      )
    ) {
      newOptions.push(randomOption);
    }
  }
  return newOptions.sort(() => Math.random() - 0.5);
};

function PatternPathfinder() {
  const [level, setLevel] = useState('easy');
  const [gameData, setGameData] = useState(generateSequence('easy'));
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [shake, setShake] = useState(false);
    const confettiContainer = document.getElementById('confetti-container');

  useEffect(() => {
    const newGameData = generateSequence(level);
    setGameData(newGameData);
    setOptions(generateOptions(newGameData.correctAnswer));
    setSelectedOption(null);
    setFeedback('');
    setShowHint(false);
  }, [level]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const isCorrect =
      option[0].shape === gameData.correctAnswer[0].shape &&
      option[1].shape === gameData.correctAnswer[1].shape;

    if (isCorrect) {
            setFeedback('Correct! You found the pattern.');
            if (animationsEnabled) {
              setShowConfetti(true);
              ReactDOM.createRoot(confettiContainer).render(
                <Confetti width={window.innerWidth} height={window.innerHeight} />
              );
              setTimeout(() => {
                setShowConfetti(false);
                ReactDOM.createRoot(confettiContainer).render(<></>);
                const newGameData = generateSequence(level);
                setGameData(newGameData);
                setOptions(generateOptions(newGameData.correctAnswer));
                setSelectedOption(null);
                setFeedback('');
                setShowHint(false);
              }, 3000);
            } else {
              const newGameData = generateSequence(level);
              setGameData(newGameData);
              setOptions(generateOptions(newGameData.correctAnswer));
              setSelectedOption(null);
              setFeedback('');
              setShowHint(false);
            }
          } else {
            setFeedback('Incorrect. Try again!');
            if (animationsEnabled) {
              setShake(true);
              setTimeout(() => setShake(false), 300);
            }
          }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const getHint = () => {
    return `The pattern continues with: ${gameData.correctAnswer[0].shape} ${gameData.correctAnswer[1].shape}.
    Look closely at the last two shapes in the sequence. The game is designed to simply repeat those last two shapes. So, the correct answer is just those two shapes repeated.`;
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="top-controls">
        <Link to="/" className="home-icon">
          <img
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png"
            alt="Home"
            style={{ width: '32px', height: '32px' }}
          />
        </Link>
        <h2>Pattern Pathfinder</h2>
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
        {gameData.sequence.map((figure, index) => (
          <span key={index}>{figure.shape} </span>
        ))}
        ? ?
      </div>

      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option[0].shape} {option[1].shape}
          </button>
        ))}
      </div>

      <button onClick={toggleHint}>
        <img
          src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4a1.png"
          alt="Hint"
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {showHint && <p>{getHint()}</p>}
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default PatternPathfinder;
