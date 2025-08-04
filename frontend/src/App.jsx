import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

import Donate from './pages/Donate';
import Logs from './pages/Logs';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🌍 Ether Charity
        </motion.h2>
        <motion.div 
          className="links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <NavLink to="/">Donate</NavLink>
          <NavLink to="/logs">Transaction Logs</NavLink>
        </motion.div>
      </motion.nav>

      <Routes>
        <Route path="/" element={<Donate />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;