import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ShulteTables.css';

function ShulteTables() {
  const [gridSize, setGridSize] = useState(5);
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState(new Set());
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [lastClickedCell, setLastClickedCell] = useState(null);

  // Options state
  const [options, setOptions] = useState({
    groups: 1,
    inverseCount: false,
    showHover: false,
    showTrace: false,
    showHitResult: false,
    shuffleNumbers: true,
    turnNumbers: false,
    spinNumbers: false
  });

  useEffect(() => {
    let timer;
    if (isGameActive && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isGameActive, startTime, gridSize, options]);

  useEffect(() => {
    if (!isGameActive) {
      generateInitialNumbers();
    }
  }, [gridSize, options, isGameActive]);

  const generateInitialNumbers = () => {
    const total = gridSize * gridSize;
    let nums = Array.from({ length: total }, (_, i) => i + 1);
    
    if (options.inverseCount) {
      nums.reverse();
    }

    if (options.shuffleNumbers) {
      nums = shuffleArray([...nums]);
    }

    if (options.groups > 1) {
      nums = generateGroupedNumbers(nums);
    }

    setNumbers(nums);
  };

  const generateNumbers = () => {
    const total = gridSize * gridSize;
    let nums = Array.from({ length: total }, (_, i) => i + 1);
    
    if (options.inverseCount) {
      nums.reverse();
    }

    if (options.shuffleNumbers) {
      nums = shuffleArray([...nums]);
    }

    if (options.groups > 1) {
      nums = generateGroupedNumbers(nums);
    }

    return nums;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateGroupedNumbers = (numbers) => {
    const groupSize = Math.floor(numbers.length / options.groups);
    let groupedNumbers = [];
    
    for (let i = 0; i < options.groups; i++) {
      const start = i * groupSize;
      const end = start + groupSize;
      groupedNumbers = [...groupedNumbers, ...numbers.slice(start, end)];
    }
    
    return groupedNumbers;
  };

  const startGame = () => {
    const nums = generateNumbers();
    setNumbers(nums);
    setCurrentNumber(options.inverseCount ? gridSize * gridSize : 1);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsGameActive(true);
    setSelectedNumbers(new Set());
    setLastClickedCell(null);
  };

  const handleNumberClick = (number, index) => {
    if (!isGameActive) return;

    const isCorrect = options.inverseCount 
      ? number === currentNumber
      : number === currentNumber;

    if (isCorrect) {
      const newSelected = new Set(selectedNumbers);
      newSelected.add(number);
      setSelectedNumbers(newSelected);
      setLastClickedCell(index);

      if (options.showHitResult) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('hit-success');
        setTimeout(() => cell.classList.remove('hit-success'), 300);
      }

      if (options.inverseCount) {
        if (currentNumber === 1) {
          endGame();
        } else {
          setCurrentNumber(prev => prev - 1);
        }
      } else {
        if (currentNumber === gridSize * gridSize) {
          endGame();
        } else {
          setCurrentNumber(prev => prev + 1);
        }
      }
    } else if (options.showHitResult) {
      const cell = document.querySelector(`[data-index="${index}"]`);
      cell.classList.add('hit-error');
      setTimeout(() => cell.classList.remove('hit-error'), 300);
    }
  };

  const getCellClassName = (number, index) => {
    const classes = ['shulte-cell'];
    
    if (selectedNumbers.has(number)) {
      classes.push('selected');
    }
    
    if (options.showHover && hoveredCell === index) {
      classes.push('hover-highlight');
    }
    
    if (options.showTrace && selectedNumbers.has(number)) {
      classes.push('traced');
    }
    
    if (options.turnNumbers) {
      classes.push('turned');
    }
    
    if (options.spinNumbers) {
      classes.push('spinning');
    }
    
    return classes.join(' ');
  };

  const getCellStyle = (number) => {
    const style = {};
    
    if (options.turnNumbers) {
      const angle = ((number * 137) % 360) - 180; // Используем золотое сечение для разных углов
      style['--rotation-angle'] = `${angle}deg`;
    }
    
    return style;
  };

  const endGame = () => {
    setIsGameActive(false);
  };

  const formatTime = (ms) => {
    return (ms / 1000).toFixed(2);
  };

  const handleOptionsChange = (newOptions) => {
    setOptions(newOptions);
  };

  const toggleGame = () => {
    if (isGameActive) {
      endGame();
    } else {
      startGame();
    }
  };

  return (
    <div className="game-container">
      <div className="top-controls">
        <Link to="/" className="home-icon">
          <img 
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3e0.png" 
            alt="Home" 
            style={{ width: '32px', height: '32px' }} 
          />
        </Link>
        <h2>Shulte Table</h2>
        <button 
          className="options-icon-button"
          onClick={() => setShowOptionsModal(true)}
        >
          ⚙
        </button>
      </div>

      {isGameActive && (
        <div className="shulte-grid" style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '8px',
          padding: '20px'
        }}>
          {numbers.map((number, index) => (
            <div
              key={index}
              data-index={index}
              className={getCellClassName(number, index)}
              style={getCellStyle(number)}
              onClick={() => handleNumberClick(number, index)}
              onMouseEnter={() => setHoveredCell(index)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {number}
            </div>
          ))}
        </div>
      )}

      <div className="timer">
        Time: {formatTime(elapsedTime)} sec
      </div>

      <button 
        className="game-button"
        onClick={toggleGame}
        disabled={numbers.length === 0 && isGameActive}
      >
        {isGameActive ? 'End Game' : 'Start Game'}
      </button>

      {showOptionsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Options</h3>
              <button className="close-button" onClick={() => setShowOptionsModal(false)}>×</button>
            </div>
            <div className="options-grid">
              <div className="option-item">
                <span className="option-label">Grid Size:</span>
                <div className="option-control">
                  <select 
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    disabled={isGameActive}
                  >
                    {[3, 4, 5, 6, 7].map(size => (
                      <option key={size} value={size}>{size}x{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Groups:</span>
                <div className="option-control">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={options.groups}
                    onChange={(e) => handleOptionsChange({...options, groups: Number(e.target.value)})}
                    disabled={isGameActive}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Inverse Count</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.inverseCount}
                    onChange={(e) => handleOptionsChange({...options, inverseCount: e.target.checked})}
                    disabled={isGameActive}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Show Hover</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.showHover}
                    onChange={(e) => handleOptionsChange({...options, showHover: e.target.checked})}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Show Trace</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.showTrace}
                    onChange={(e) => handleOptionsChange({...options, showTrace: e.target.checked})}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Show Hit Result</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.showHitResult}
                    onChange={(e) => handleOptionsChange({...options, showHitResult: e.target.checked})}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Shuffle Numbers</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.shuffleNumbers}
                    onChange={(e) => handleOptionsChange({...options, shuffleNumbers: e.target.checked})}
                    disabled={isGameActive}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Turn Numbers</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.turnNumbers}
                    onChange={(e) => handleOptionsChange({...options, turnNumbers: e.target.checked})}
                    disabled={isGameActive}
                  />
                </div>
              </div>

              <div className="option-item">
                <span className="option-label">Spin Numbers</span>
                <div className="option-control">
                  <input
                    type="checkbox"
                    checked={options.spinNumbers}
                    onChange={(e) => handleOptionsChange({...options, spinNumbers: e.target.checked})}
                    disabled={isGameActive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShulteTables;
