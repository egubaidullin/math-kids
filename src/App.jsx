import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import MathGame from './MathGame';
import MagicSquare from './MagicSquare';
import NumberTrailblazers from './NumberTrailblazers';
import PatternPathfinder from './PatternPathfinder';
import FifteenPuzzle from './FifteenPuzzle';
import ShulteTables from './ShulteTables';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/math-game" element={<MathGame />} />
        <Route path="/magic-square" element={<MagicSquare />} />
        <Route path="/number-trailblazers" element={<NumberTrailblazers />} />
        <Route path="/pattern-pathfinder" element={<PatternPathfinder />} />
        <Route path="/fifteen-puzzle" element={<FifteenPuzzle />} />
        <Route path="/shulte-tables" element={<ShulteTables />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
