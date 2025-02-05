import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Game List</h1>
      <ul>
        <li>
          <Link to="/math-game" className="game-link">Math Game</Link>
        </li>
        <li>
          <Link to="/magic-square" className="game-link">Magic Square</Link>
        </li>
        <li>
          <Link to="/number-trailblazers" className="game-link">Number Trailblazers</Link>
        </li>
        <li>
          <Link to="/pattern-pathfinder" className="game-link">Pattern Pathfinder</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
