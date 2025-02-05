import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MathGame from './MathGame'; // Rename your original App to MathGame
import MagicSquare from './MagicSquare';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/math-game" element={<MathGame />} />
        <Route path="/magic-square" element={<MagicSquare />} />
      </Routes>
    </Router>
  );
}

export default App;
