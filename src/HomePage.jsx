import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Game List</h1>
      <ul>
        <li>
          <Link to="/math-game">Math Game</Link>
        </li>
        {/* Add more games here as you develop them */}
      </ul>
    </div>
  );
}

export default HomePage;
