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
        {/* Add more games here as you develop them */}
      </ul>
    </div>
  );
}

export default HomePage;
