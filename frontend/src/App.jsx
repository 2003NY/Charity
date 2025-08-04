import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/etherCharity';
import axios from 'axios';
import './App.css';

import Donate from './pages/Donate';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h2>🌍 Ether Charity</h2>
        <div className="links">
          <Link to="/">Donate</Link>
          <Link to="/logs">Transaction Logs</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Donate />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;
