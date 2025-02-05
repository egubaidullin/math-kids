import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Game List</h1>
      <ul>
        <li>
          <Link to="/math-game">Math Game</Link>
        </li>
        <li>
          <Link to="/magic-square">Magic Square</Link>
        </li>
        <li>
          <Link to="/number-trailblazers">Number Trailblazers</Link>
        </li>
        <li>
          <Link to="/pattern-pathfinder">Pattern Pathfinder</Link>
        </li>
        <li>
          <Link to="/fifteen-puzzle">Fifteen Puzzle</Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
