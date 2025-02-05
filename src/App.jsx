import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MathGame from './MathGame';
import MagicSquare from './MagicSquare';
import NumberTrailblazers from './NumberTrailblazers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/math-game" element={<MathGame />} />
        <Route path="/magic-square" element={<MagicSquare />} />
        <Route path="/number-trailblazers" element={<NumberTrailblazers />} />
      </Routes>
    </Router>
  );
}

export default App;
