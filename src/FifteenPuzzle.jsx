import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './FifteenPuzzle.css';
import Confetti from 'react-confetti';
import ReactDOM from 'react-dom';

function FifteenPuzzle() {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [state, setState] = useState(1);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiContainer = document.getElementById('confetti-container');
  const puzzleRef = useRef(null);

  const SIZE = 4;
  const NUM_TILES = SIZE * SIZE;

  useEffect(() => {
    solve();
  }, []);

  const generatePuzzle = () => {
    let tiles = Array.from({ length: NUM_TILES }, (_, i) => i);
    let solvable = false;
    let inversions = 0;

    while (!solvable) {
      for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
      }

      inversions = 0;
      for (let i = 0; i < NUM_TILES; i++) {
        for (let j = i + 1; j < NUM_TILES; j++) {
          if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
            inversions++;
          }
        }
      }

      if (SIZE % 2 === 0) {
        const blankRow = 1 + Math.floor(tiles.indexOf(0) / SIZE);
        solvable = (inversions + blankRow) % 2 === 0;
      } else {
        solvable = inversions % 2 === 0;
      }
    }

    return tiles;
  };

  const getMatrixPosition = (index) => {
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    return { row, col };
  };

  const getTileStyle = (row, col) => ({
    left: (col * 80 + 1 * col + 1) + 'px',
    top: (row * 80 + 1 * row + 1) + 'px',
  });

  const solve = () => {
    if (state === 0) {
      return;
    }

    let newTiles = [];
    let n = 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        let tileValue = n <= 15 ? n++ : 0;
        newTiles.push(tileValue);
      }
    }
    setTiles(newTiles);
    setPuzzleSolved(false);
    setMoves(0);
  };

  const shiftCell = (tileIndex) => {
    if (state === 0) return;

    const tile = puzzleRef.current.querySelector(`#tile-${tileIndex}`);
    if (!tile || tile.className === 'empty') return;

    const adjacent = getAdjacentCells(tileIndex);
    const emptyAdjacent = adjacent.find(adjIndex => tiles[adjIndex] === 0);

    if (emptyAdjacent !== undefined) {
      const newTiles = [...tiles];
      const emptyIndex = tiles.indexOf(0);
      [newTiles[tileIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[tileIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);
      setTimeout(checkOrder, 150);
    }
  };

  const getAdjacentCells = (tileIndex) => {
    const { row, col } = getMatrixPosition(tileIndex);
    const adjacent = [];
    if (row < 3) adjacent.push((row + 1) * SIZE + col);
    if (row > 0) adjacent.push((row - 1) * SIZE + col);
    if (col < 3) adjacent.push(row * SIZE + col + 1);
    if (col > 0) adjacent.push(row * SIZE + col - 1);
    return adjacent;
  };

  const checkOrder = () => {
    if (tiles[15] !== 0) return;

    let n = 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const index = i * SIZE + j;
        if (n <= 15 && tiles[index] !== n) {
          return;
        }
        n++;
      }
    }

    setPuzzleSolved(true);
    if (animationsEnabled) {
      setShowConfetti(true);
      ReactDOM.createRoot(confettiContainer).render(
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      );
      setTimeout(() => {
        setShowConfetti(false);
        ReactDOM.createRoot(confettiContainer).render(<></>);
        newGame();
      }, 3000);
    } else {
      newGame();
    }
  };

  const newGame = () => {
    if (state === 0) return;

    puzzleRef.current.removeAttribute('class');
    setState(0);
    setPuzzleSolved(false);
    setMoves(0);

    const scrambledTiles = generatePuzzle();
    setTiles(scrambledTiles);
    setState(1);
  };

  const tileClicked = (tileIndex) => {
    if (state === 1) {
      puzzleRef.current.className = 'animate';
      shiftCell(tileIndex);
    }
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="top-controls">
        <Link to="/" className="home-icon">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png" alt="Home" style={{ width: '32px', height: '32px' }} />
        </Link>
        <h2>Fifteen Puzzle</h2>
      </div>
      <div className="controls-container">
        <button className="game-button" onClick={newGame}>New Game</button>
        <button className="game-button" onClick={solve}>Solve</button>
      </div>
      <div id="puzzle" ref={puzzleRef} className={puzzleSolved ? 'solved' : ''}>
        {tiles.map((tileValue, index) => {
          const { row, col } = getMatrixPosition(index);
          const tileStyle = getTileStyle(row, col);
          return (
            <span
              key={index}
              id={`tile-${index}`}
              className={`tile ${tileValue === 0 ? 'empty' : 'number'} ${(row % 2 === 0 && col % 2 > 0 || row % 2 > 0 && col % 2 === 0) ? 'dark' : 'light'}`}
              style={tileStyle}
              onClick={() => tileClicked(index)}
            >
              {tileValue !== 0 ? tileValue : ''}
            </span>
          );
        })}
      </div>
      {puzzleSolved && <div className="success-message">Congratulations, You did it!</div>}
      <div className="moves-count">Moves: {moves}</div>
    </div>
  );
}

export default FifteenPuzzle;
