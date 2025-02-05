import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';

function MagicSquare() {
  const [square, setSquare] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [userInput, setUserInput] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [magicSum, setMagicSum] = useState(15);
  const [isComplete, setIsComplete] = useState(false);
  const [hasWon, setHasWon] = useState(null);
  const [shake, setShake] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiContainer = document.getElementById('confetti-container');

  useEffect(() => {
    generateMagicSquare(difficulty);
  }, [difficulty]);

  const generateMagicSquare = (level) => {
    // Step 1: Generate a complete magic square
    const completeSquare = [
      [8, 1, 6],
      [3, 5, 7],
      [4, 9, 2],
    ];

    // Step 2: Determine the number of missing numbers based on difficulty
    let missingCount;
    switch (level) {
      case 'easy':
        missingCount = 2;
        break;
      case 'medium':
        missingCount = 4;
        break;
      case 'hard':
        missingCount = 6;
        break;
      default:
        missingCount = 2;
    }

    // Step 3: Randomly remove numbers
    const newSquare = completeSquare.map((row) => [...row]); // Create a copy
    const newUserInput = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    let removedCount = 0;
    while (removedCount < missingCount) {
      const rowIndex = Math.floor(Math.random() * 3);
      const colIndex = Math.floor(Math.random() * 3);

      if (newSquare[rowIndex][colIndex] !== null) {
        newSquare[rowIndex][colIndex] = null;
        newUserInput[rowIndex][colIndex] = ''; // Initialize user input
        removedCount++;
      }
    }

    setSquare(newSquare);
    setUserInput(newUserInput);
    setSelectedCell(null);
    setIsComplete(false);
    setHasWon(null);
    setShake(false);
    setShowConfetti(false);
    setMagicSum(15); // Magic sum is always 15 for a 3x3 magic square with numbers 1-9
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (square[rowIndex][colIndex] === null) {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  const handleNumberSelect = (number) => {
    if (selectedCell) {
      const newUserInput = [...userInput];
      newUserInput[selectedCell.row][selectedCell.col] = number;
      setUserInput(newUserInput);
      setSelectedCell(null);
    }
  };

  const checkMagicSquare = () => {
    const completedSquare = square.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === null) {
          const inputValue = parseInt(userInput[rowIndex][colIndex]);
          return isNaN(inputValue) ? 0 : inputValue; // Treat empty inputs as 0 for validation
        } else {
          return cell;
        }
      })
    );

    let magicSum = 0;
    for (let i = 0; i < 3; i++) {
      magicSum = magicSum + completedSquare[0][i];
    }

    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      if (completedSquare[i].reduce((a, b) => a + b, 0) !== magicSum) {
        setHasWon(false);
        if (animationsEnabled) {
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }
        return;
      }
      if (completedSquare[0][i] + completedSquare[1][i] + completedSquare[2][i] !== magicSum) {
        setHasWon(false);
        if (animationsEnabled) {
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }
        return;
      }
    }
    if (completedSquare[0][0] + completedSquare[1][1] + completedSquare[2][2] !== magicSum) {
      setHasWon(false);
      if (animationsEnabled) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
      return;
    }
    if (completedSquare[0][2] + completedSquare[1][1] + completedSquare[2][0] !== magicSum) {
      setHasWon(false);
      if (animationsEnabled) {
        setShake(true);
        setTimeout(() => setShake(false), 300);
      }
      return;
    }

    setIsComplete(true);
    setHasWon(true);
    if (animationsEnabled) {
      setShowConfetti(true);
      ReactDOM.createRoot(confettiContainer).render(
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      );
      setTimeout(() => {
        setShowConfetti(false);
        ReactDOM.createRoot(confettiContainer).render(<></>);
        generateMagicSquare(difficulty); // Generate new square after win
      }, 3000);
    } else {
      generateMagicSquare(difficulty); // Generate new square after win
    }
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    setShake(false);
    setShowConfetti(false);
  };

  const numberPanel = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      <div className="options-container">
        {numbers.map((number) => (
          <div
            key={number}
            className={`option`}
            onClick={() => handleNumberSelect(number)}
          >
            {number}
          </div>
        ))}
      </div>
    );
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
        <h2>Magic Square Game</h2>
        <div className="level-select-container">
          <button
            className={`level-button easy ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('easy')}
          >
            E
          </button>
          <button
            className={`level-button medium ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('medium')}
          >
            M
          </button>
          <button
            className={`level-button hard ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleDifficultyChange('hard')}
          >
            H
          </button>
        </div>
      </div>
      <div className="magic-square">
        {square.map((row, rowIndex) => (
          <div key={rowIndex} className="magic-square-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`magic-square-cell ${
                  selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex
                    ? 'selected'
                    : ''
                } ${cell === null ? 'missing' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell === null ? (
                  userInput[rowIndex][colIndex] !== '' ? userInput[rowIndex][colIndex] : '?'
                ) : (
                  cell
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedCell && numberPanel()}
      <button className="check-button" onClick={checkMagicSquare}>
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png" alt="Check" style={{ width: '24px', height: '24px' }} />
      </button>
      {isComplete && hasWon !== null && (
        <div className={`result-message ${hasWon ? 'win' : 'lose'}`}>
          {hasWon ? 'Congratulations! You won!' : 'Sorry, try again!'}
        </div>
      )}
    </div>
  );
}

export default MagicSquare;
