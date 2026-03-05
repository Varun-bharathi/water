import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Visualization from './Visualization';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualization" element={<Visualization />} />
    </Routes>
  );
};

export default App;